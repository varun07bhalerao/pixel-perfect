import io
import pandas as pd
import requests
from statsmodels.tsa.statespace.sarimax import SARIMAX

def download_and_parse_csv(url: str) -> pd.DataFrame:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Failed to download CSV from Supabase URL: {e}")

    try:
        csv_data = io.StringIO(response.text)
        df = pd.read_csv(csv_data)
    except Exception as e:
        raise ValueError(f"Invalid CSV format: {e}")
    
    return df

def validate_and_prepare_sales_data(df: pd.DataFrame) -> pd.Series:
    # 1. Require columns
    if "sale_date" not in df.columns or "daily_revenue" not in df.columns:
        raise ValueError("CSV must contain 'sale_date' and 'daily_revenue' columns")

    # 2. Validate dates
    try:
        df['sale_date'] = pd.to_datetime(df['sale_date'])
    except Exception:
        raise ValueError("Invalid date format in 'sale_date' column")
    
    if df['sale_date'].isnull().any():
        raise ValueError("Missing dates detected in CSV")

    # 3. Validate duplicates
    if df['sale_date'].duplicated().any():
        raise ValueError("Duplicate dates detected in CSV")

    # 4. Validate numeric sales
    try:
        df['daily_revenue'] = pd.to_numeric(df['daily_revenue'])
    except Exception:
        raise ValueError("Non-numeric values found in 'daily_revenue'")

    # 5. Validate negative sales
    if (df['daily_revenue'] < 0).any():
        raise ValueError("Negative sales values are not permitted")

    # 6. Prepare Time Series (sort and set index)
    df = df.sort_values('sale_date').set_index('sale_date')
    
    # 7. Check historical data volume
    if len(df) < 60:
        raise ValueError("Insufficient historical data: minimum 60 days required")

    # 8. Check for missing calendar dates implicitly
    # If we reindex to 'D' and missing values appear, reject.
    full_idx = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D')
    if len(full_idx) != len(df):
        raise ValueError("Missing calendar dates detected in your sales CSV. Continuous daily data is required.")

    return df['daily_revenue']

def train_sarima_model(series: pd.Series):
    try:
        model = SARIMAX(
            series,
            order=(1, 1, 1),
            seasonal_order=(1, 1, 1, 7),
            enforce_stationarity=False,
            enforce_invertibility=False
        )
        results = model.fit(disp=False)
        return results
    except Exception as e:
        raise ValueError(f"Model training failed: {str(e)}")

def generate_forecast_payload(results, series, forecast_days: int):
    try:
        # Internally generate 365 days always
        forecast_result = results.get_forecast(steps=365)
        predictions = forecast_result.predicted_mean
        conf_int = forecast_result.conf_int(alpha=0.05)
    except Exception as e:
        raise ValueError(f"Prediction generation failed: {str(e)}")
        
    # Prevent negative values in predictions and bounds
    predictions = predictions.clip(lower=0)
    conf_int.iloc[:, 0] = conf_int.iloc[:, 0].clip(lower=0)
    conf_int.iloc[:, 1] = conf_int.iloc[:, 1].clip(lower=0)

    historical_average = float(series.mean())
    historical_total = float(series.sum())

    sum_30 = float(predictions.iloc[:30].sum())
    sum_180 = float(predictions.iloc[:180].sum())
    sum_365 = float(predictions.sum())

    avg_30 = float(predictions.iloc[:30].mean())
    avg_180 = float(predictions.iloc[:180].mean())
    avg_365 = float(predictions.mean())

    if historical_average > 0:
        growth_pct = ((avg_30 - historical_average) / historical_average) * 100
    else:
        growth_pct = 0.0
        
    start_date = predictions.index[0].strftime("%Y-%m-%d")
    end_date = predictions.index[-1].strftime("%Y-%m-%d")

    summary = {
        "historical_total_sales": round(historical_total, 2),
        "historical_average_daily_sales": round(historical_average, 2),
        "forecast_30_days_total": round(sum_30, 2),
        "forecast_30_days_average": round(avg_30, 2),
        "forecast_6_months_total": round(sum_180, 2),
        "forecast_6_months_average": round(avg_180, 2),
        "forecast_1_year_total": round(sum_365, 2),
        "forecast_1_year_average": round(avg_365, 2),
        "expected_growth_percentage": round(growth_pct, 2),
        "forecast_start_date": start_date,
        "forecast_end_date": end_date
    }

    records = []
    # Only return requested number of days
    for i in range(forecast_days):
        pred = float(predictions.iloc[i])
        lb = float(conf_int.iloc[i, 0])
        ub = float(conf_int.iloc[i, 1])
        
        # Ensure logical bounds
        if lb > pred: lb = pred
        if ub < pred: ub = pred

        records.append({
            "date": predictions.index[i].strftime("%Y-%m-%d"),
            "predicted_sales": round(pred, 2),
            "lower_bound": round(lb, 2),
            "upper_bound": round(ub, 2)
        })

    return {
        "summary": summary,
        "forecast": records
    }
