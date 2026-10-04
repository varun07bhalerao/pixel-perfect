# SMART BPI Forecasting Backend

This is the FastAPI ML backend for the SMART BPI application. It provides time-series forecasting using SARIMA, directly pulling user sales data from Supabase storage based on their Firestore configuration.

## 1. Backend architecture
- **FastAPI**: Provides the HTTP REST API.
- **Statsmodels**: Powers the SARIMA forecasting algorithm `(1,1,1)(1,1,1,7)`.
- **Pandas**: Used for data validation, cleaning, and preparation.

## 2. Installation
Requires Python 3.10+.

```bash
cd pixel-perfect/backend
python -m venv venv
```

Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

## 3. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase and Firebase credentials if you need to implement strict server-side validation. Currently, the endpoint expects a public Supabase URL passed from the authenticated frontend.

**SECURITY NOTE:** For local troubleshooting *only*, you can set `ALLOW_UNVERIFIED_DEV_MODE=True` in your `.env`. This bypasses Firebase Authentication. **NEVER enable this in production.**

## 4. Running FastAPI
```bash
uvicorn main:app --reload --port 8000
```

## 5. Frontend Environment Variable
Make sure your frontend React app (`pixel-perfect/.env`) contains:
```env
VITE_FORECAST_API_URL=http://localhost:8000
```

## 6. API Endpoints
- **GET `/health`**: Returns `{"status": "healthy"}`
- **POST `/forecast`**: Generates a forecast.
  - Body: `{"sales_csv_url": "https://...", "forecast_days": 30}`
  - Returns `summary` and `forecast` records.

## 7. Expected CSV Format
```csv
sale_date,daily_revenue
2023-01-01,25000
2023-01-02,27000
```
Must contain at least 60 consecutive days of non-negative revenue.
