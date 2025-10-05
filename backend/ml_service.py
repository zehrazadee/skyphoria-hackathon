import io
import math
import pandas as pd
import requests as rq
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional
import os

# Optional ML dependencies (only needed when models are enabled)
try:
    import numpy as np
    from joblib import load
    ML_LIBS_AVAILABLE = True
except ImportError:
    ML_LIBS_AVAILABLE = False
    np = None
    load = None

# Constants
O3_UGM3_TO_PPB = 0.509
NO2_UGM3_TO_PPB = 1.88

OPEN_METEO_HIST = "https://archive-api.open-meteo.com/v1/era5"
OPEN_METEO_FC = "https://api.open-meteo.com/v1/forecast"
AQ_API = "https://air-quality-api.open-meteo.com/v1/air-quality"
UA_HEADERS = {"User-Agent": "skyphoria-aircast/1.0"}

# Check if running in production/deployment mode
IS_DEPLOYMENT = os.getenv("EMERGENT_DEPLOYMENT", "false").lower() == "true"

# Load ML models (optional for deployment)
if IS_DEPLOYMENT or not ML_LIBS_AVAILABLE:
    print("Running in deployment mode or ML libs not available - using CAMS forecast only")
    MODELS_LOADED = False
    pm_model, o3_model = None, None
    pm_feats, o3_feats = [], []
else:
    try:
        with open("model_pm25.joblib", "rb") as f:
            pm_bundle = load(io.BytesIO(f.read()))
            pm_model = pm_bundle["model"]
            pm_feats = pm_bundle["features"]
        
        with open("model_o3.joblib", "rb") as f:
            o3_bundle = load(io.BytesIO(f.read()))
            o3_model = o3_bundle["model"]
            o3_feats = o3_bundle["features"]
        
        MODELS_LOADED = True
        print("ML models loaded successfully")
    except Exception as e:
        print(f"Warning: Could not load ML models: {e}")
        MODELS_LOADED = False
        pm_model, o3_model = None, None
        pm_feats, o3_feats = [], []

# HTTP helper
def get_json(url, params=None, timeout=60):
    r = rq.get(url, params=params, timeout=timeout, headers=UA_HEADERS)
    r.raise_for_status()
    return r.json()

# Data fetchers
def fetch_openmeteo_forecast(hours_ahead, lat, lon, hourly_vars):
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ",".join(hourly_vars),
        "forecast_days": math.ceil(hours_ahead / 24),
        "timezone": "UTC",
    }
    js = get_json(OPEN_METEO_FC, params)
    if "hourly" not in js:
        return pd.DataFrame()
    df = pd.DataFrame(js["hourly"])
    df["time"] = pd.to_datetime(df["time"], utc=True)
    return df.set_index("time").sort_index()

def fetch_openmeteo_aq_history(start, end, lat, lon, chunk_days=90):
    rows_pm, rows_o3, rows_no2 = [], [], []
    cur = start
    while cur < end:
        nxt = min(end, cur + timedelta(days=chunk_days))
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "pm2_5,ozone,nitrogen_dioxide",
            "start_date": cur.date().isoformat(),
            "end_date": nxt.date().isoformat(),
            "timezone": "UTC",
        }
        try:
            js = get_json(AQ_API, params)
            if "hourly" in js and "time" in js["hourly"]:
                hh = pd.DataFrame(js["hourly"])
                hh["time"] = pd.to_datetime(hh["time"], utc=True)
                hh = hh.set_index("time").sort_index()
                if "pm2_5" in hh:
                    rows_pm.append(hh[["pm2_5"]].rename(columns={"pm2_5": "pm25"}))
                if "ozone" in hh:
                    rows_o3.append(hh[["ozone"]].rename(columns={"ozone": "o3"}))
                if "nitrogen_dioxide" in hh:
                    rows_no2.append(hh[["nitrogen_dioxide"]].rename(columns={"nitrogen_dioxide": "no2"}))
        except:
            pass
        cur = nxt
    
    return {
        "pm25": pd.concat(rows_pm).sort_index() if rows_pm else pd.DataFrame(columns=["pm25"]),
        "o3": pd.concat(rows_o3).sort_index() if rows_o3 else pd.DataFrame(columns=["o3"]),
        "no2": pd.concat(rows_no2).sort_index() if rows_no2 else pd.DataFrame(columns=["no2"]),
    }

def fetch_openmeteo_aq_forecast(hours_ahead, lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "pm2_5,ozone,nitrogen_dioxide,pm10",
        "forecast_days": math.ceil(hours_ahead / 24),
        "timezone": "UTC",
    }
    js = get_json(AQ_API, params)
    if "hourly" not in js:
        return pd.DataFrame()
    h = pd.DataFrame(js["hourly"])
    h["time"] = pd.to_datetime(h["time"], utc=True)
    return h.set_index("time").sort_index()

# Feature engineering (only used when ML models are loaded)
def make_hourly_features(df_pollutant, met):
    if not ML_LIBS_AVAILABLE or not MODELS_LOADED:
        return None
    
    df = met.copy()
    df = df.join(df_pollutant, how="left")
    
    if {"wind_speed_10m", "wind_direction_10m"}.issubset(df.columns):
        rad = np.deg2rad(df["wind_direction_10m"])
        df["u10"] = df["wind_speed_10m"] * np.cos(rad)
        df["v10"] = df["wind_speed_10m"] * np.sin(rad)
    
    target_col = df_pollutant.columns[0]
    for L in [1, 2, 3, 6, 12, 24]:
        df[f"{target_col}_lag{L}h"] = df[target_col].shift(L)
    
    for w in [6, 12, 24]:
        df[f"{target_col}_roll{w}_mean"] = df[target_col].rolling(f"{w}h", min_periods=3).mean()
        df[f"{target_col}_roll{w}_max"] = df[target_col].rolling(f"{w}h", min_periods=3).max()
    
    idx = df.index.tz_convert("UTC")
    df["hour"] = idx.hour
    df["dow"] = idx.dayofweek
    df["doy"] = idx.dayofyear
    df["sin_doy"] = np.sin(2 * np.pi * df["doy"] / 365.25)
    df["cos_doy"] = np.cos(2 * np.pi * df["doy"] / 365.25)
    return df

# AQI conversion functions
def aqi_from_pm25(pm):
    brks = [
        (0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 350.4, 301, 400),
        (350.5, 500.4, 401, 500),
    ]
    if pd.isna(pm) or pm is None:
        return float('nan')
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= pm <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (pm - c_low) + a_low
    return 500.0

def aqi_from_o3(o3_ppb):
    brks = [(0, 54, 0, 50), (55, 70, 51, 100), (71, 85, 101, 150), (86, 105, 151, 200), (106, 200, 201, 300)]
    if pd.isna(o3_ppb) or o3_ppb is None:
        return float('nan')
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= o3_ppb <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (o3_ppb - c_low) + a_low
    return 300.0

def aqi_from_no2_ppb(no2_ppb):
    brks = [(0, 53, 0, 50), (54, 100, 51, 100), (101, 360, 101, 150), (361, 649, 151, 200), (650, 1249, 201, 300), (1250, 2049, 301, 400)]
    if pd.isna(no2_ppb) or no2_ppb is None:
        return float('nan')
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= no2_ppb <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (no2_ppb - c_low) + a_low
    return 500.0

# Main prediction function
def get_air_quality_prediction(lat: float, lon: float, hours: int = 72, hist_hours: int = 72):
    """Main function to get air quality predictions (ML-based when available, CAMS fallback)"""
    
    # If ML models not available, use CAMS forecast directly
    if not MODELS_LOADED:
        print("Using CAMS forecast (ML models not available)")
        return get_cams_forecast_fallback(lat, lon, hours)
    
    try:
        HOURLY_VARS = [
            "temperature_2m",
            "relative_humidity_2m",
            "dew_point_2m",
            "wind_speed_10m",
            "wind_direction_10m",
            "surface_pressure",
            "precipitation",
            "shortwave_radiation",
        ]
        
        now = datetime.now(timezone.utc)
        start_hist = now - timedelta(hours=hist_hours)
        
        # Fetch CAMS air quality history
        hist_aq = fetch_openmeteo_aq_history(start_hist, now, lat, lon, chunk_days=90)
        pm25_hist = hist_aq["pm25"]
        o3_hist = hist_aq["o3"]
        
        # Fetch meteorology forecast
        met_fc = fetch_openmeteo_forecast(hours, lat, lon, HOURLY_VARS)
        
        # Fetch CAMS air quality forecast
        aq_fc = fetch_openmeteo_aq_forecast(hours, lat, lon)
        
        # Build features for ML models
        pm_ds_rt = make_hourly_features(pm25_hist, met_fc)
        o3_ds_rt = make_hourly_features(o3_hist, met_fc)
        
        # Prepare feature matrices
        pm_X = pm_ds_rt[pm_feats].ffill(limit=2)
        o3_X = o3_ds_rt[o3_feats].ffill(limit=2)
        
        # ML Predictions
        pm25_pred = pm_model.predict(pm_X)
        o3_pred_ugm3 = o3_model.predict(o3_X)
        o3_pred_ppb = o3_pred_ugm3 * O3_UGM3_TO_PPB
        
        # NO2 from CAMS
        no2_ppb = aq_fc["nitrogen_dioxide"].reindex(pm_X.index) * NO2_UGM3_TO_PPB
        
        # Calculate AQI
        aqi_pm = pd.Series([aqi_from_pm25(v) for v in pm25_pred], index=pm_X.index)
        aqi_o3 = pd.Series([aqi_from_o3(v) for v in o3_pred_ppb], index=pm_X.index)
        aqi_no2 = pd.Series([aqi_from_no2_ppb(v) for v in no2_ppb], index=pm_X.index)
        
        overall_aqi = pd.concat([aqi_pm, aqi_o3, aqi_no2], axis=1).max(axis=1)
        
        # Build response
        forecast = []
        for idx, aqi_val in overall_aqi.items():
            forecast.append({
                "timestamp": idx.isoformat(),
                "aqi": int(aqi_val) if not pd.isna(aqi_val) else 50,
                "pm25": float(pm25_pred[pm_X.index.get_loc(idx)]) if idx in pm_X.index else 0,
                "o3_ppb": float(o3_pred_ppb[o3_X.index.get_loc(idx)]) if idx in o3_X.index else 0,
                "no2_ppb": float(no2_ppb[idx]) if idx in no2_ppb.index and not pd.isna(no2_ppb[idx]) else 0,
                "aqi_pm25": int(aqi_pm[idx]) if idx in aqi_pm.index and not pd.isna(aqi_pm[idx]) else 0,
                "aqi_o3": int(aqi_o3[idx]) if idx in aqi_o3.index and not pd.isna(aqi_o3[idx]) else 0,
                "aqi_no2": int(aqi_no2[idx]) if idx in aqi_no2.index and not pd.isna(aqi_no2[idx]) else 0,
            })
        
        # Get current conditions (first forecast point)
        current = forecast[0] if forecast else None
        
        return {
            "success": True,
            "location": {"lat": lat, "lon": lon},
            "generated_at": now.isoformat(),
            "current": current,
            "forecast": forecast[:hours],
            "model_info": {
                "pm25_model": "LightGBM trained on 4 years NASA + CAMS data",
                "o3_model": "LightGBM trained on 4 years NASA + CAMS data",
                "no2_source": "CAMS forecast (Open-Meteo)"
            }
        }
    
    except Exception as e:
        return {"error": str(e), "success": False}

def get_cams_forecast_fallback(lat: float, lon: float, hours: int = 72):
    """Fallback function using CAMS forecast when ML models are not available"""
    try:
        now = datetime.now(timezone.utc)
        
        # Fetch CAMS air quality forecast
        aq_fc = fetch_openmeteo_aq_forecast(hours, lat, lon)
        
        if aq_fc.empty:
            return {"error": "No forecast data available", "success": False}
        
        # Build forecast from CAMS data
        forecast = []
        for idx, row in aq_fc.iterrows():
            pm25 = row.get("pm2_5", 0)
            o3_ugm3 = row.get("ozone", 0)
            o3_ppb = o3_ugm3 * O3_UGM3_TO_PPB
            no2_ppb = row.get("nitrogen_dioxide", 0) * NO2_UGM3_TO_PPB
            
            # Calculate AQI
            aqi_pm = aqi_from_pm25(pm25)
            aqi_o3 = aqi_from_o3(o3_ppb)
            aqi_no2 = aqi_from_no2_ppb(no2_ppb)
            
            overall_aqi = max(aqi_pm, aqi_o3, aqi_no2)
            
            # Determine dominant pollutant
            dominant = "PM2.5"
            if aqi_o3 > aqi_pm and aqi_o3 >= aqi_no2:
                dominant = "O3"
            elif aqi_no2 > aqi_pm and aqi_no2 > aqi_o3:
                dominant = "NO2"
            
            forecast.append({
                "timestamp": idx.isoformat(),
                "aqi": int(overall_aqi) if not pd.isna(overall_aqi) else 50,
                "pm25": float(pm25),
                "o3_ppb": float(o3_ppb),
                "no2_ppb": float(no2_ppb),
                "aqi_pm25": int(aqi_pm) if not pd.isna(aqi_pm) else 0,
                "aqi_o3": int(aqi_o3) if not pd.isna(aqi_o3) else 0,
                "aqi_no2": int(aqi_no2) if not pd.isna(aqi_no2) else 0,
            })
        
        return {
            "success": True,
            "location": {"lat": lat, "lon": lon},
            "generated_at": now.isoformat(),
            "current": forecast[0] if forecast else None,
            "forecast": forecast[:hours],
            "model_info": {
                "data_source": "CAMS (Copernicus Atmosphere Monitoring Service)",
                "note": "Using CAMS forecast data (ML models disabled for deployment)"
            }
        }
    except Exception as e:
        return {"error": str(e), "success": False}

def get_current_conditions(lat: float, lon: float):
    """Get current air quality and weather using CAMS and Open-Meteo data"""
    try:
        # Fetch air quality data
        aq_params = {
            "latitude": lat,
            "longitude": lon,
            "current": "pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide",
            "timezone": "UTC"
        }
        aq_js = get_json(AQ_API, aq_params)
        
        # Fetch weather data
        weather_params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,visibility",
            "timezone": "UTC"
        }
        weather_js = get_json(OPEN_METEO_FC, weather_params)
        
        if "current" not in aq_js:
            return None
        
        current = aq_js["current"]
        weather = weather_js.get("current", {})
        
        # Calculate AQI from each pollutant
        pm25_aqi = aqi_from_pm25(current.get("pm2_5", 0))
        o3_ppb = current.get("ozone", 0) * O3_UGM3_TO_PPB
        o3_aqi = aqi_from_o3(o3_ppb)
        no2_ppb = current.get("nitrogen_dioxide", 0) * NO2_UGM3_TO_PPB
        no2_aqi = aqi_from_no2_ppb(no2_ppb)
        
        overall_aqi = max(pm25_aqi, o3_aqi, no2_aqi)
        
        # Determine dominant pollutant
        dominant = "PM2.5"
        if o3_aqi > pm25_aqi and o3_aqi >= no2_aqi:
            dominant = "O3"
        elif no2_aqi > pm25_aqi and no2_aqi > o3_aqi:
            dominant = "NO2"
        
        # Get wind direction text
        wind_deg = weather.get("wind_direction_10m", 0)
        directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
        wind_dir_text = directions[int((wind_deg % 360) / 22.5)]
        
        return {
            "aqi": int(overall_aqi),
            "dominant_pollutant": dominant,
            "pm25": current.get("pm2_5", 0),
            "pm10": current.get("pm10", 0),
            "o3": o3_ppb,
            "no2": no2_ppb,
            "so2": current.get("sulphur_dioxide", 0),
            "co": current.get("carbon_monoxide", 0),
            "timestamp": current.get("time", datetime.now(timezone.utc).isoformat()),
            "weather": {
                "temperature": round(weather.get("temperature_2m", 20), 1),
                "windSpeed": round(weather.get("wind_speed_10m", 0), 1),
                "windDirection": round(weather.get("wind_direction_10m", 0), 0),
                "windDirectionText": wind_dir_text,
                "humidity": round(weather.get("relative_humidity_2m", 50), 0),
                "visibility": round(weather.get("visibility", 10000) / 1000, 1)
            }
        }
    except Exception as e:
        print(f"Error fetching current conditions: {e}")
        return None