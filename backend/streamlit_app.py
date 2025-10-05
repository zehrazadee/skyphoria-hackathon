"""
AQI Forecast (PM2.5, O3, NO2) — Real-time Streamlit App
Data sources:
- Open-Meteo (ERA5 archive + forecast) for meteorology
- Open-Meteo Air Quality (CAMS-based) for PM2.5, O3, NO2 (baseline + forecast)
- OpenAQ for ground sensors (fallback to CAMS if empty)
No API keys required.
"""

import io
import math
import time
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests as rq
import streamlit as st
from joblib import load

# -----------------------------
# Global config / constants
# -----------------------------

st.set_page_config(page_title="AirCast – Real-Time AI Air Quality Forecast", page_icon="🌤")

st.title("🌤 AirCast")
st.caption("AI-powered real-time air quality and health forecast — helping communities breathe safer.")
st.markdown("<h6 style='text-align:center; color:gray;'>by <b>Skyphoria Team</b></h6>", unsafe_allow_html=True)
st.divider()


# Default unit conversions
O3_UGM3_TO_PPB = 0.509
NO2_UGM3_TO_PPB = 1.88

# Open-Meteo endpoints
OPEN_METEO_HIST = "https://archive-api.open-meteo.com/v1/era5"
OPEN_METEO_FC = "https://api.open-meteo.com/v1/forecast"
AQ_API = "https://air-quality-api.open-meteo.com/v1/air-quality"
UA_HEADERS = {"User-Agent": "aqi-demo-streamlit/1.0"}

# -----------------------------
# Sidebar — user controls
# -----------------------------
with st.sidebar:
    st.header("Settings")

    # A small preset list for quick North America demo
    NA_CITIES = {
        "New York, USA": (40.7128, -74.0060),
        "Los Angeles, USA": (34.0522, -118.2437),
        "Chicago, USA": (41.8781, -87.6298),
        "Houston, USA": (29.7604, -95.3698),
        "Phoenix, USA": (33.4484, -112.0740),
        "San Francisco, USA": (37.7749, -122.4194),
        "Seattle, USA": (47.6062, -122.3321),
        "Miami, USA": (25.7617, -80.1918),
        "Boston, USA": (42.3601, -71.0589),
        "Toronto, Canada": (43.651070, -79.347015),
        "Vancouver, Canada": (49.2827, -123.1207),
        "Montreal, Canada": (45.5017, -73.5673),
        "Mexico City, Mexico": (19.4326, -99.1332),
    }

    mode = st.radio("Location input", ["Choose city (NA)", "Manual lat/lon"], index=0)
    if mode == "Choose city (NA)":
        city = st.selectbox("City", list(NA_CITIES.keys()), index=0)
        lat, lon = NA_CITIES[city]
        st.caption(f"Selected: {city} → lat={lat:.4f}, lon={lon:.4f}")
    else:
        lat = st.number_input("Latitude", value=40.7128, format="%.6f")
        lon = st.number_input("Longitude", value=-74.0060, format="%.6f")

    horizon = st.selectbox("Forecast horizon (hours)", [24, 48, 72], index=2)
    hist_hours = st.slider("History window for lags/rolling (hours)", 24, 168, 72)
    radius_km = st.slider("OpenAQ radius (km)", 5, 50, 25)

    pm25_joblib = open("model_pm25.joblib", "rb")
    o3_joblib = open("model_o3.joblib", "rb")
    use_ml = True

    st.markdown("---")
    go_button = st.button("🚀 Run forecast")

# -----------------------------
# HTTP helper
# -----------------------------
def get_json(url, params=None, timeout=60):
    """GET JSON with a friendly User-Agent and simple error propagation."""
    r = rq.get(url, params=params, timeout=timeout, headers=UA_HEADERS)
    r.raise_for_status()
    return r.json()

# -----------------------------
# Data fetchers
# -----------------------------
def fetch_openmeteo_history(start, end, lat, lon, hourly_vars):
    """ERA5 historical hourly meteo (UTC)."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start.date().isoformat(),
        "end_date": (end - timedelta(days=1)).date().isoformat(),  # archive endpoint is end-exclusive by date
        "hourly": ",".join(hourly_vars),
        "timezone": "UTC",
    }
    js = get_json(OPEN_METEO_HIST, params)
    if "hourly" not in js:
        return pd.DataFrame()
    df = pd.DataFrame(js["hourly"])
    df["time"] = pd.to_datetime(df["time"], utc=True)
    return df.set_index("time").sort_index()

def fetch_openmeteo_forecast(hours_ahead, lat, lon, hourly_vars):
    """Forecast meteo (UTC)."""
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
    """
    CAMS-based hourly air quality history.
    Returns dict: {"pm25": df, "o3": df, "no2": df}
    """
    rows_pm, rows_o3, rows_no2 = [], [], []
    cur = start
    while cur < end:
        nxt = min(end, cur + timedelta(days=chunk_days))
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "pm2_5,ozone,nitrogen_dioxide",
            "start_date": cur.date().isoformat(),
            "end_date": nxt.date().isoformat(),  # inclusive to not miss current day
            "timezone": "UTC",
        }
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
                rows_no2.append(
                    hh[["nitrogen_dioxide"]].rename(columns={"nitrogen_dioxide": "no2"})
                )
        cur = nxt
        time.sleep(0.12)

    out = {
        "pm25": pd.concat(rows_pm).sort_index() if rows_pm else pd.DataFrame(columns=["pm25"]),
        "o3": pd.concat(rows_o3).sort_index() if rows_o3 else pd.DataFrame(columns=["o3"]),
        "no2": pd.concat(rows_no2).sort_index() if rows_no2 else pd.DataFrame(columns=["no2"]),
    }
    return out

def fetch_openmeteo_aq_forecast(hours_ahead, lat, lon):
    """CAMS-based forecast: PM2.5, O3, NO2, PM10."""
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

def fetch_openaq(parameter, start, end, lat, lon, radius_km, max_pages=30):
    """OpenAQ ground observations (hourly). Falls back to CAMS if empty."""
    base = "https://api.openaq.org/v2/measurements"
    params = {
        "parameter": parameter,
        "date_from": start.isoformat(timespec="seconds") + "Z",
        "date_to": end.isoformat(timespec="seconds") + "Z",
        "coordinates": f"{lat},{lon}",
        "radius": int(radius_km * 1000),
        "limit": 10000,
        "page": 1,
        "sort": "desc",
        "order_by": "datetime",
        "temporal": "hour",
    }
    rows = []
    for p in range(1, max_pages + 1):
        params["page"] = p
        js = get_json(base, params)
        results = js.get("results", [])
        if not results:
            break
        for it in results:
            try:
                t = pd.to_datetime(it["date"]["utc"], utc=True)
                v = float(it["value"])
                rows.append({"time": t, parameter: v})
            except Exception:
                pass
        time.sleep(0.12)
    if not rows:
        return pd.DataFrame(columns=["time", parameter]).set_index("time")
    df = pd.DataFrame(rows).groupby("time", as_index=True).mean().sort_index()
    return df

# -----------------------------
# Feature engineering
# -----------------------------
def make_hourly_features(df_pollutant, met):
    """
    Merge pollutant with meteo and add lag/rolling/calendar features.
    df_pollutant: DataFrame with a single target column ("pm25" or "o3")
    met: hourly meteo index (UTC)
    """
    df = met.copy()
    df = df.join(df_pollutant, how="left")  # include target for lagging

    # wind vector components (if available)
    if {"wind_speed_10m", "wind_direction_10m"}.issubset(df.columns):
        rad = np.deg2rad(df["wind_direction_10m"])
        df["u10"] = df["wind_speed_10m"] * np.cos(rad)
        df["v10"] = df["wind_speed_10m"] * np.sin(rad)

    target_col = df_pollutant.columns[0]
    # lags
    for L in [1, 2, 3, 6, 12, 24]:
        df[f"{target_col}_lag{L}h"] = df[target_col].shift(L)
    # rolling windows
    for w in [6, 12, 24]:
        df[f"{target_col}_roll{w}_mean"] = df[target_col].rolling(f"{w}h", min_periods=3).mean()
        df[f"{target_col}_roll{w}_max"] = df[target_col].rolling(f"{w}h", min_periods=3).max()
    # calendar
    idx = df.index.tz_convert("UTC")
    df["hour"] = idx.hour
    df["dow"] = idx.dayofweek
    df["doy"] = idx.dayofyear
    df["sin_doy"] = np.sin(2 * np.pi * df["doy"] / 365.25)
    df["cos_doy"] = np.cos(2 * np.pi * df["doy"] / 365.25)
    return df

# -----------------------------
# AQI helpers
# -----------------------------
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
    if pd.isna(pm):
        return np.nan
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= pm <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (pm - c_low) + a_low
    return 500.0

def aqi_from_o3(o3_ppb):
    brks = [(0, 54, 0, 50), (55, 70, 51, 100), (71, 85, 101, 150), (86, 105, 151, 200), (106, 200, 201, 300)]
    if pd.isna(o3_ppb):
        return np.nan
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= o3_ppb <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (o3_ppb - c_low) + a_low
    return 300.0

def aqi_from_no2_ppb(no2_ppb):
    brks = [
        (0, 53, 0, 50),
        (54, 100, 51, 100),
        (101, 360, 101, 150),
        (361, 649, 151, 200),
        (650, 1249, 201, 300),
        (1250, 2049, 301, 400),
    ]
    if pd.isna(no2_ppb):
        return np.nan
    for c_low, c_high, a_low, a_high in brks:
        if c_low <= no2_ppb <= c_high:
            return (a_high - a_low) / (c_high - c_low) * (no2_ppb - c_low) + a_low
    return 500.0

# -----------------------------
# NOWCAST (0–2h)
# -----------------------------
def run_nowcast(aq_fc, pm25_rt, o3_rt, lat, lon):
    """
    Nowcast strategy:
    1) Prefer CAMS forecast for the next 2 hours (exact timestamps).
    2) If any column is missing, fill via EWMA from the last 24h CAMS history (or OpenAQ if available).
    3) Final fallback: zeros (MVP).
    """
    now = datetime.now(timezone.utc)
    next_hour = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
    idx = pd.date_range(next_hour, periods=2, freq="1h", tz="UTC")
    nowcast = pd.DataFrame(index=idx)

    # 1) Direct CAMS forecast for exact next two hours
    if isinstance(aq_fc, pd.DataFrame) and not aq_fc.empty:
        if "pm2_5" in aq_fc:
            nowcast["pm25_nowcast"] = aq_fc["pm2_5"].reindex(idx).astype(float)
        if "ozone" in aq_fc:
            nowcast["o3_nowcast_ugm3"] = aq_fc["ozone"].reindex(idx).astype(float)
            nowcast["o3_nowcast_ppb"] = nowcast["o3_nowcast_ugm3"] * O3_UGM3_TO_PPB
        if "nitrogen_dioxide" in aq_fc:
            nowcast["no2_nowcast_ppb"] = aq_fc["nitrogen_dioxide"].reindex(idx).astype(float) * NO2_UGM3_TO_PPB

    # 2) EWMA fallback from last 24h
    def ewma(series, alpha=0.5, steps=2, to_ppb=None):
        s = series.dropna()
        if s.empty:
            return pd.Series([0.0] * steps, index=idx)
        est = s.ewm(alpha=alpha, adjust=False).mean().iloc[-1]
        out = pd.Series([est] * steps, index=idx)
        if to_ppb is not None:
            out = out * to_ppb
        return out

    hist24 = fetch_openmeteo_aq_history(now - timedelta(hours=24), now, lat, lon, chunk_days=7)
    cams_pm = hist24["pm25"]
    cams_o3 = hist24["o3"]
    cams_no2 = hist24["no2"]

    # PM2.5 source preference: OpenAQ → CAMS history
    if ("pm25_nowcast" not in nowcast.columns) or nowcast["pm25_nowcast"].isna().all():
        if ("pm25" in pm25_rt.columns) and not pm25_rt["pm25"].dropna().empty:
            nowcast["pm25_nowcast"] = ewma(pm25_rt["pm25"], alpha=0.6, steps=2)
        elif not cams_pm.empty:
            nowcast["pm25_nowcast"] = ewma(cams_pm["pm25"], alpha=0.6, steps=2)
        else:
            nowcast["pm25_nowcast"] = 0.0

    # O3 source: OpenAQ → CAMS history
    if ("o3_nowcast_ppb" not in nowcast.columns) or nowcast["o3_nowcast_ppb"].isna().all():
        if ("o3" in o3_rt.columns) and not o3_rt["o3"].dropna().empty:
            nowcast["o3_nowcast_ppb"] = ewma(o3_rt["o3"], alpha=0.5, steps=2, to_ppb=O3_UGM3_TO_PPB)
        elif not cams_o3.empty:
            nowcast["o3_nowcast_ppb"] = ewma(cams_o3["o3"], alpha=0.5, steps=2, to_ppb=O3_UGM3_TO_PPB)
        else:
            nowcast["o3_nowcast_ppb"] = 0.0

    # NO2 source: CAMS history
    if ("no2_nowcast_ppb" not in nowcast.columns) or nowcast["no2_nowcast_ppb"].isna().all():
        if not cams_no2.empty:
            nowcast["no2_nowcast_ppb"] = ewma(cams_no2["no2"], alpha=0.5, steps=2, to_ppb=NO2_UGM3_TO_PPB)
        else:
            nowcast["no2_nowcast_ppb"] = 0.0

    # Compute per-component and overall AQI
    nowcast["AQI_PM25_now"] = nowcast["pm25_nowcast"].apply(aqi_from_pm25)
    nowcast["AQI_O3_now"] = nowcast["o3_nowcast_ppb"].apply(aqi_from_o3)
    nowcast["AQI_NO2_now"] = nowcast["no2_nowcast_ppb"].apply(aqi_from_no2_ppb)
    nowcast["AQI_now"] = nowcast[["AQI_PM25_now", "AQI_O3_now", "AQI_NO2_now"]].max(axis=1)

    return nowcast


# -----------------------------
# Main
# -----------------------------
if go_button:
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

    try:
        with st.spinner("Fetching data and computing forecast…"):
            now = datetime.now(timezone.utc)
            start_hist = now - timedelta(hours=hist_hours)

            # A) Last N hours — OpenAQ first, fallback to CAMS history
            # try:
            #     pm25_rt = fetch_openaq("pm25", start_hist, now, lat, lon, radius_km)
            #     o3_rt   = fetch_openaq("o3",   start_hist, now, lat, lon, radius_km)
            # except Exception as e:
            #     st.warning(f"OpenAQ real-time unavailable — falling back to CAMS. ({e})")
            #     pm25_rt, o3_rt = pd.DataFrame(), pd.DataFrame()

            # if pm25_rt.empty or o3_rt.empty:
            #     st.info("OpenAQ returned no data — falling back to CAMS history…")
            #     aq_hist_rt = fetch_openmeteo_aq_history(start_hist, now, lat, lon, chunk_days=7)
            #     if pm25_rt.empty:
            #         pm25_rt = aq_hist_rt["pm25"]
            #     if o3_rt.empty:
            #         o3_rt = aq_hist_rt["o3"]

            aq_hist_rt = fetch_openmeteo_aq_history(start_hist, now, lat, lon, chunk_days=7)
            pm25_rt = aq_hist_rt["pm25"]
            o3_rt   = aq_hist_rt["o3"]

            # B) Meteo — history + forecast
            met_hist = fetch_openmeteo_history(start_hist, now, lat, lon, HOURLY_VARS)
            met_fc = fetch_openmeteo_forecast(horizon, lat, lon, HOURLY_VARS)
            met_all = pd.concat([met_hist, met_fc]).sort_index()
            met_all = met_all[~met_all.index.duplicated(keep="last")]

            # C) Feature engineering for PM2.5 & O3
            pm_ds_rt = make_hourly_features(pm25_rt[["pm25"]], met_all)
            o3_ds_rt = make_hourly_features(o3_rt[["o3"]], met_all)

            # D) CAMS AQ forecast (NO2/PM10 + baseline)
            aq_fc = fetch_openmeteo_aq_forecast(horizon, lat, lon)

            # E) Forecast (ML if models provided, else CAMS baseline)
            future_idx = met_fc.index
            out = pd.DataFrame(index=future_idx)

            # PM2.5
            if use_ml:
                pm_bundle = load(io.BytesIO(pm25_joblib.read()))
                pm_model, pm_feats = pm_bundle["model"], pm_bundle["features"]
                pm_X = pm_ds_rt.reindex(future_idx)[pm_feats].copy()
                for c in pm_feats:
                    if c not in pm_X.columns:
                        pm_X[c] = 0.0
                pm_X = pm_X[pm_feats].ffill(limit=2)
                out["pm25_pred"] = pm_model.predict(pm_X)
            else:
                out["pm25_pred"] = aq_fc.loc[future_idx, "pm2_5"].values if "pm2_5" in aq_fc else np.nan

            # O3
            if use_ml:
                o3_bundle = load(io.BytesIO(o3_joblib.read()))
                o3_model, o3_feats = o3_bundle["model"], o3_bundle["features"]
                o3_X = o3_ds_rt.reindex(future_idx)[o3_feats].copy()
                for c in o3_feats:
                    if c not in o3_X.columns:
                        o3_X[c] = 0.0
                o3_X = o3_X[o3_feats].ffill(limit=2)
                out["o3_pred_ugm3"] = o3_model.predict(o3_X)
            else:
                out["o3_pred_ugm3"] = aq_fc.loc[future_idx, "ozone"].values if "ozone" in aq_fc else np.nan

            # Add CAMS columns (for comparison)
            if not aq_fc.empty:
                out = out.join(
                    aq_fc[["pm2_5", "ozone", "nitrogen_dioxide", "pm10"]].rename(
                        columns={
                            "pm2_5": "pm25_cams",
                            "ozone": "o3_cams_ugm3",
                            "nitrogen_dioxide": "no2_cams_ugm3",
                            "pm10": "pm10_cams_ugm3",
                        }
                    ),
                    how="left",
                )

            # F) AQI calculations (O3 in ppb, NO2 in ppb via conversion)
            out["o3_pred_ppb"] = (out["o3_pred_ugm3"] * O3_UGM3_TO_PPB).clip(lower=0)
            out["AQI_PM25"] = out["pm25_pred"].apply(aqi_from_pm25)
            out["AQI_O3"] = out["o3_pred_ppb"].apply(aqi_from_o3)
            if "no2_cams_ugm3" in out.columns:
                out["no2_pred_ppb"] = (out["no2_cams_ugm3"] * NO2_UGM3_TO_PPB).clip(lower=0)
                out["AQI_NO2"] = out["no2_pred_ppb"].apply(aqi_from_no2_ppb)

            aqi_cols = [c for c in ["AQI_PM25", "AQI_O3", "AQI_NO2"] if c in out.columns]
            out["AQI"] = np.nanmax(out[aqi_cols].values, axis=1).clip(0, 500)

        # -----------------------------
        # Visualization — forecast
        # -----------------------------
        st.subheader(f"Forecast (next {horizon} hours)")
        c1, c2 = st.columns(2)
        with c1:
            fig1 = go.Figure()
            fig1.add_trace(go.Scatter(x=out.index, y=out["AQI"], mode="lines+markers", name="AQI"))
            fig1.add_hline(y=100, line_dash="dash", annotation_text="AQI=100 (USG)", opacity=0.4)
            fig1.update_layout(title="AQI", xaxis_title="Time (UTC)", yaxis_title="AQI")
            st.plotly_chart(fig1, use_container_width=True)
        with c2:
            fig2 = go.Figure()
            fig2.add_trace(go.Scatter(x=out.index, y=out["pm25_pred"], mode="lines", name="PM2.5 (µg/m³)"))
            if "pm25_cams" in out:
                fig2.add_trace(go.Scatter(x=out.index, y=out["pm25_cams"], mode="lines", name="PM2.5 (CAMS)"))
            fig2.update_layout(title="PM2.5", xaxis_title="Time (UTC)", yaxis_title="µg/m³")
            st.plotly_chart(fig2, use_container_width=True)

        c3, c4 = st.columns(2)
        with c3:
            fig3 = go.Figure()
            fig3.add_trace(go.Scatter(x=out.index, y=out["o3_pred_ppb"], mode="lines", name="O₃ (ppb)"))
            if "o3_cams_ugm3" in out:
                fig3.add_trace(
                    go.Scatter(
                        x=out.index,
                        y=out["o3_cams_ugm3"] * O3_UGM3_TO_PPB,
                        mode="lines",
                        name="O₃ (CAMS ≈ ppb)",
                    )
                )
            fig3.update_layout(title="O₃", xaxis_title="Time (UTC)", yaxis_title="ppb")
            st.plotly_chart(fig3, use_container_width=True)
        with c4:
            if "no2_pred_ppb" in out.columns:
                fig4 = go.Figure()
                fig4.add_trace(go.Scatter(x=out.index, y=out["no2_pred_ppb"], mode="lines", name="NO₂ (ppb, CAMS)"))
                fig4.update_layout(title="NO₂ (ppb)", xaxis_title="Time (UTC)", yaxis_title="ppb")
                st.plotly_chart(fig4, use_container_width=True)

        st.dataframe(out.reset_index().rename(columns={"index": "time"}))
        csv = out.reset_index().to_csv(index=False).encode("utf-8")
        st.download_button(
            "⬇️ Download forecast CSV",
            csv,
            file_name=f"forecast_{horizon}h_{lat:.3f}_{lon:.3f}.csv",
            mime="text/csv",
        )

        # -----------------------------
        # NOWCAST (0–2h)
        # -----------------------------
        st.subheader("Nowcast (0–2 hours)")
        nowcast = run_nowcast(aq_fc, pm25_rt, o3_rt, lat, lon)
        st.dataframe(nowcast)

        fig_now = px.bar(
            nowcast.reset_index().rename(columns={"index": "time"}),
            x="time",
            y=["AQI_PM25_now", "AQI_O3_now", "AQI_NO2_now"],
            barmode="group",
            title="Nowcast — component AQI",
        )
        st.plotly_chart(fig_now, use_container_width=True)

        # ==========================
        # Human-friendly guidance block 
        # ==========================
        
        # --- Safety helpers: robust value getters ---
        def _safe(series_or_df, col=None, idx=-1, default=np.nan):
            """Safely get a scalar from a Series/DataFrame; return default if missing."""
            try:
                if isinstance(series_or_df, pd.Series):
                    if len(series_or_df) == 0:
                        return default
                    return float(series_or_df.iloc[idx])
                elif isinstance(series_or_df, pd.DataFrame) and col in series_or_df.columns:
                    if len(series_or_df) == 0:
                        return default
                    return float(series_or_df[col].iloc[idx])
            except Exception:
                pass
            return default
        
        # --- AQI interpretation (US EPA-style categories) ---
        def interpret_aqi(aqi):
            if pd.isna(aqi): return "Air quality data not available right now."
            if aqi <= 50:   return "Air quality is GOOD — outdoor activities are safe."
            if aqi <= 100:  return "Air quality is MODERATE — sensitive groups should limit prolonged outdoor exertion."
            if aqi <= 150:  return "UNHEALTHY for sensitive groups — consider reducing outdoor time, especially near traffic."
            if aqi <= 200:  return "UNHEALTHY — everyone may experience effects; stay indoors if possible."
            if aqi <= 300:  return "VERY UNHEALTHY — avoid outdoor activity; consider air purification indoors."
            return "HAZARDOUS — emergency conditions; stay indoors and minimize exposure."
        
        def action_tips(aqi):
            """Short actionable tips for the current AQI."""
            if pd.isna(aqi): return []
            if aqi <= 50:
                return ["Open windows to ventilate if comfortable.", "Great time for outdoor exercise."]
            if aqi <= 100:
                return ["Sensitive groups (children, elderly, asthma) limit long outdoor exercise.", "Prefer routes away from heavy traffic."]
            if aqi <= 150:
                return ["Reduce outdoor time; take breaks indoors.", "If you have a mask (P2/N95), consider using it outside."]
            if aqi <= 200:
                return ["Avoid outdoor exercise; keep windows closed.", "Use air purifier if available."]
            if aqi <= 300:
                return ["Stay indoors; avoid strenuous activity.", "Use purifier and well-fitting mask outdoors."]
            return ["Stay indoors; follow local health advisories.", "Seek clean-air shelters if available."]
        
        # Pollutant-specific, friendly messages
        def pm25_msg(pm):
            if pd.isna(pm): return "PM2.5: data not available."
            if pm <= 12:    return "PM2.5 is low — fine particle levels are safe."
            if pm <= 35:    return "PM2.5 is moderate — ventilate carefully; sensitive groups take it easy outdoors."
            return "PM2.5 is elevated — consider limiting outdoor exposure, especially for sensitive groups."
        
        def o3_msg(o3_ugm3, o3_ppb):
            if pd.isna(o3_ppb): return "O₃: data not available."
            if o3_ppb <= 60:    return f"O₃ is comfortable (~{o3_ppb:.0f} ppb)."
            if o3_ppb <= 120:   return f"O₃ slightly elevated (~{o3_ppb:.0f} ppb) — avoid long outdoor exercise at midday."
            return f"O₃ high (~{o3_ppb:.0f} ppb) — limit afternoon outdoor activity."
        
        def no2_msg(no2_ppb):
            if pd.isna(no2_ppb): return "NO₂: data not available."
            if no2_ppb <= 50:    return f"NO₂ is low (~{no2_ppb:.0f} ppb) — typical urban background."
            if no2_ppb <= 100:   return f"NO₂ moderate (~{no2_ppb:.0f} ppb) — avoid busy roads if possible."
            return f"NO₂ high (~{no2_ppb:.0f} ppb) — try to avoid traffic corridors and peak hours."
        
        # --- Determine “current” conditions (prefer NOWCAST ; fallback to forecast) ---
        aqi_now = _safe(nowcast, "AQI_now", idx=0, default=np.nan) if "AQI_now" in nowcast.columns else np.nan
        if pd.isna(aqi_now):
            aqi_now = _safe(out, "AQI", idx=0, default=np.nan)
        
        pm_now   = _safe(nowcast, "pm25_nowcast", idx=0, default=np.nan)
        if pd.isna(pm_now):
            pm_now = _safe(out, "pm25_pred", idx=0, default=np.nan)
        
        o3_now_ppb = _safe(nowcast, "o3_nowcast_ppb", idx=0, default=np.nan)
        o3_now_ug  = _safe(nowcast, "o3_nowcast_ugm3", idx=0, default=np.nan)
        if pd.isna(o3_now_ppb):
            # Convert forecast O3 µg/m³ → ppb if needed
            o3_f_ug = _safe(out, "o3_pred_ugm3", idx=0, default=np.nan)
            o3_now_ppb = o3_f_ug * O3_UGM3_TO_PPB if not pd.isna(o3_f_ug) else np.nan
            o3_now_ug = o3_f_ug
        
        no2_now_ppb = _safe(nowcast, "no2_nowcast_ppb", idx=0, default=np.nan)
        if pd.isna(no2_now_ppb) and "no2_pred_ppb" in out.columns:
            no2_now_ppb = _safe(out, "no2_pred_ppb", idx=0, default=np.nan)
        
        # --- Colored AQI card ---
        aqi_val_int = int(aqi_now) if not pd.isna(aqi_now) else None

        color = (
            "#b6f3b0"  if aqi_val_int is not None and aqi_val_int <= 50 else   # light green
            "#f5f5b3"  if aqi_val_int is not None and aqi_val_int <= 100 else  # light yellow
            "#ffd9b3"  if aqi_val_int is not None and aqi_val_int <= 150 else  # peach / soft orange
            "#ffb3b3"  if aqi_val_int is not None and aqi_val_int <= 200 else  # soft red
            "#d8b3ff"  if aqi_val_int is not None and aqi_val_int <= 300 else  # lavender
            "#b38b8b"                                                          # muted maroon
        )

        
        st.markdown("### 🧭 Current conditions")
        st.markdown(f"""
        <div style="padding:14px;border-radius:12px;background-color:{color};color:black;">
          <h3 style="text-align:center;margin:0;">AQI: {aqi_val_int if aqi_val_int is not None else 'N/A'}</h3>
          <p style="text-align:center;margin:6px 0 0 0;">{interpret_aqi(aqi_now)}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # --- Compact pollutant summary tiles ---
        cA, cB, cC = st.columns(3)
        with cA:
            st.metric("PM2.5 (µg/m³)", value="N/A" if pd.isna(pm_now) else f"{pm_now:.1f}")
        with cB:
            st.metric("O₃ (ppb)", value="N/A" if pd.isna(o3_now_ppb) else f"{o3_now_ppb:.0f}")
        with cC:
            st.metric("NO₂ (ppb)", value="N/A" if pd.isna(no2_now_ppb) else f"{no2_now_ppb:.0f}")
        
        # --- Friendly health notes ---
        st.subheader("🩺 Health guidance")
        st.write(pm25_msg(pm_now))
        st.write(o3_msg(o3_now_ug, o3_now_ppb))
        st.write(no2_msg(no2_now_ppb))
        
        # --- Actionable tips list ---
        tips = action_tips(aqi_now)
        if tips:
            st.subheader("✅ What you can do now")
            for t in tips:
                st.write(f"- {t}")
        
        # --- Quick 24h outlook: peak AQI and timing (uses forecast `out`) ---
        if isinstance(out, pd.DataFrame) and len(out) > 0 and "AQI" in out.columns:
            next24 = out.iloc[:min(24, len(out))]  # first 24 forecasted hours
            if len(next24) > 0:
                peak_val = float(next24["AQI"].max())
                peak_time = next24["AQI"].idxmax()
                st.subheader("⏱ Next 24h outlook")
                st.write(f"Expected peak AQI in the next 24h: **{peak_val:.0f}** at **{peak_time.strftime('%Y-%m-%d %H:%M UTC')}**.")
                if peak_val >= 100:
                    st.warning("Air quality may reach unhealthy levels — plan outdoor activities accordingly.")


        csv2 = nowcast.reset_index().to_csv(index=False).encode("utf-8")
        st.download_button("⬇️ Download nowcast CSV", csv2, file_name="nowcast_0_2h.csv", mime="text/csv")

    except Exception as e:
        st.error(f"Error: {e}")
        st.exception(e)










