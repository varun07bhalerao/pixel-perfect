import os
import json
import logging
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth

from forecasting import (
    download_and_parse_csv,
    validate_and_prepare_sales_data,
    train_sarima_model,
    generate_forecast_payload
)

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        # Check if we have credentials in environment
        # Either via a path to JSON or individual env vars
        firebase_creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
        if firebase_creds_path and os.path.exists(firebase_creds_path):
            cred = credentials.Certificate(firebase_creds_path)
        else:
            # Fallback to dict if environment variables exist
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n')
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
            
            if project_id and private_key and client_email:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": project_id,
                    "private_key": private_key,
                    "client_email": client_email,
                    "token_uri": "https://oauth2.googleapis.com/token",
                })
            else:
                logger.warning("No Firebase credentials found. Running in mock/unverified mode.")
                cred = None
                
        if cred:
            firebase_admin.initialize_app(cred)
        else:
            # For development without credentials, initialize an empty app or skip
            pass
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin: {e}")

db = firestore.client() if firebase_admin._apps else None

app = FastAPI(title="SMART BPI Sales Forecasting API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    sales_csv_url: HttpUrl
    forecast_days: int = 30

async def verify_user(authorization: Optional[str] = Header(None)) -> str:
    # If Firebase Admin is not configured properly, fallback to unsafe mode (only for local dev if requested, but we should enforce it).
    # Since prompt requires security, let's enforce it, but if DB is None, we return a warning.
    if authorization is None or not authorization.startswith("Bearer "):
        # In strict mode we'd raise 401. 
        # But if the user hasn't set up Firebase Admin yet, we can bypass strictly for development ease, 
        # but the prompt said: "Implement ownership validation. The backend must verify authenticated Firebase user"
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split("Bearer ")[1]
    
    if not firebase_admin._apps:
        if os.getenv("ALLOW_UNVERIFIED_DEV_MODE", "false").lower() == "true":
            # WARNING: This bypasses authentication! For development/testing only!
            logger.warning("ALLOW_UNVERIFIED_DEV_MODE is enabled. Bypassing Firebase auth.")
            # We don't have a reliable way to get the uid without decoding the token,
            # but if it's dev mode, let's just return a generic UID or try to decode the token unsafely.
            try:
                import jwt
                decoded = jwt.decode(token, options={"verify_signature": False})
                return decoded.get("user_id", "demo-user")
            except Exception:
                return "demo-user"
        raise HTTPException(status_code=500, detail="Firebase Admin SDK is not configured on the backend.")

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid authentication token: {e}")

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/forecast")
def generate_forecast(req: ForecastRequest, uid: str = Depends(verify_user)):
    if req.forecast_days not in [30, 180, 365]:
        raise HTTPException(status_code=400, detail="forecast_days must be 30, 180, or 365")
    
    url = str(req.sales_csv_url)
    
    # User Ownership & Security Validation
    if db is not None:
        try:
            doc_ref = db.collection("businesses").document(uid)
            doc_snap = doc_ref.get()
            if not doc_snap.exists:
                raise HTTPException(status_code=404, detail="Business profile not found for this user.")
            
            business_data = doc_snap.to_dict()
            services_data = business_data.get("servicesData", {})
            stored_url = services_data.get("salesCsvUrl")
            
            if not stored_url:
                raise HTTPException(status_code=404, detail="No sales CSV found in user's business profile.")
            
            if stored_url != url:
                raise HTTPException(status_code=403, detail="Unauthorized: The provided sales_csv_url does not match the user's stored data.")
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to verify ownership via Firestore: {e}")
    else:
        if os.getenv("ALLOW_UNVERIFIED_DEV_MODE", "false").lower() != "true":
            raise HTTPException(status_code=500, detail="Database not configured")

    # 1. Download and parse CSV
    try:
        df = download_and_parse_csv(url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch or parse CSV: {e}")

    # 2. Validate and prepare data
    try:
        series = validate_and_prepare_sales_data(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Train SARIMA
    try:
        model_results = train_sarima_model(series)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected error during model training.")

    # 4. Generate forecast
    try:
        response_payload = generate_forecast_payload(model_results, series, req.forecast_days)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return response_payload
