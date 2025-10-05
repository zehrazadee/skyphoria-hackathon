from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import random
import math

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Skyphoria API",
    description="Air Quality Forecasting Platform - NASA Space Apps Challenge 2025",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Cache to improve performance
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_cached_aqi(lat_lon_key, hour_offset):
    """Cached AQI calculation for better performance"""
    lat, lon = lat_lon_key
    return generate_mock_aqi(lat, lon, hour_offset)

# Pydantic Models
class Location(BaseModel):
    lat: float
    lon: float
    name: Optional[str] = None

class AlertConfig(BaseModel):
    location: Location
    threshold: int = 100
    pollutants: List[str] = ["all"]
    notification_methods: List[str] = ["email", "push"]
    advance_warning_hours: int = 12

# Helper Functions
def get_aqi_category(aqi: int) -> Dict[str, Any]:
    """Get AQI category information"""
    if aqi <= 50:
        return {"name": "Good", "color": "#00E676", "level": 1}
    elif aqi <= 100:
        return {"name": "Moderate", "color": "#FFEB3B", "level": 2}
    elif aqi <= 150:
        return {"name": "Unhealthy for Sensitive Groups", "color": "#FF9800", "level": 3}
    elif aqi <= 200:
        return {"name": "Unhealthy", "color": "#F44336", "level": 4}
    elif aqi <= 300:
        return {"name": "Very Unhealthy", "color": "#9C27B0", "level": 5}
    else:
        return {"name": "Hazardous", "color": "#880E4F", "level": 6}

def generate_mock_aqi(lat: float, lon: float, hour_offset: int = 0) -> int:
    """Generate realistic mock AQI based on location and time"""
    # Base AQI with some location-based variation
    base_aqi = 60 + (abs(lat) * 0.5) + (abs(lon) * 0.3)
    
    # Time-based variation (higher during afternoon)
    time_factor = math.sin((hour_offset + 14) * math.pi / 24) * 20
    
    # Random variation
    random_factor = random.uniform(-15, 15)
    
    aqi = int(base_aqi + time_factor + random_factor)
    return max(20, min(200, aqi))  # Clamp between 20-200

def generate_pollutant_data(aqi: int) -> Dict[str, Any]:
    """Generate pollutant data based on AQI"""
    base_factor = aqi / 100
    
    return {
        "pm25": {
            "value": round(12 + base_factor * 35, 1),
            "unit": "μg/m³",
            "aqi": aqi,
            "description": "Fine particulate matter from vehicle emissions and industrial sources",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        },
        "pm10": {
            "value": round(20 + base_factor * 45, 1),
            "unit": "μg/m³",
            "aqi": int(aqi * 0.7),
            "description": "Coarse particles from dust and construction",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        },
        "o3": {
            "value": round(25 + base_factor * 40, 1),
            "unit": "ppb",
            "aqi": int(aqi * 0.6),
            "description": "Ground-level ozone formed by sunlight and emissions",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        },
        "no2": {
            "value": round(15 + base_factor * 30, 1),
            "unit": "ppb",
            "aqi": int(aqi * 0.5),
            "description": "Nitrogen dioxide from vehicles and power plants",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        },
        "so2": {
            "value": round(3 + base_factor * 8, 1),
            "unit": "ppb",
            "aqi": int(aqi * 0.3),
            "description": "Sulfur dioxide from industrial processes",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        },
        "co": {
            "value": round(0.3 + base_factor * 0.5, 1),
            "unit": "ppm",
            "aqi": int(aqi * 0.2),
            "description": "Carbon monoxide from incomplete combustion",
            "trend": random.choice(["increasing", "decreasing", "stable"])
        }
    }

# API Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Skyphoria API - Air Quality Forecasting Platform",
        "version": "1.0.0",
        "nasa_challenge": "Space Apps Challenge 2025",
        "status": "operational"
    }

@app.get("/api/current")
async def get_current_air_quality(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    location: Optional[str] = Query(None, description="Location name")
):
    """Get current air quality data for a location"""
    
    aqi = generate_mock_aqi(lat, lon)
    category = get_aqi_category(aqi)
    
    return {
        "location": {
            "lat": lat,
            "lon": lon,
            "name": location or f"Location ({lat:.4f}, {lon:.4f})",
            "timezone": "America/Los_Angeles"
        },
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "aqi": aqi,
        "category": category["name"],
        "categoryColor": category["color"],
        "dominantPollutant": random.choice(["PM2.5", "O3", "NO2"]),
        "pollutants": generate_pollutant_data(aqi),
        "weather": {
            "temperature": round(15 + random.uniform(-5, 15), 1),
            "temperatureUnit": "°C",
            "feelsLike": round(15 + random.uniform(-5, 15), 1),
            "windSpeed": round(random.uniform(5, 25), 1),
            "windDirection": random.randint(0, 360),
            "windDirectionText": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
            "humidity": random.randint(40, 85),
            "pressure": round(1013 + random.uniform(-10, 10), 1),
            "visibility": random.randint(8, 15),
            "uvIndex": random.randint(3, 9),
            "conditions": random.choice(["Clear", "Partly Cloudy", "Cloudy", "Foggy"]),
            "icon": "partly-cloudy"
        },
        "healthRecommendation": {
            "general": "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.",
            "sensitiveGroups": "People with respiratory or heart conditions should reduce prolonged outdoor exertion.",
            "activities": {
                "outdoor": "Generally safe, but watch for symptoms if sensitive",
                "exercise": "Reduce intensity if you experience symptoms",
                "windows": "Safe to open windows for ventilation"
            }
        },
        "dataSources": [
            {"name": "TEMPO", "status": "active", "lastUpdate": "5 min ago"},
            {"name": "EPA AirNow", "status": "active", "lastUpdate": "12 min ago"},
            {"name": "OpenAQ", "status": "active", "lastUpdate": "8 min ago"}
        ],
        "confidence": round(random.uniform(0.85, 0.95), 2)
    }

@app.get("/api/forecast")
async def get_forecast(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    hours: int = Query(72, description="Forecast hours (max 168)")
):
    """Get air quality forecast"""
    
    forecast_data = []
    
    for i in range(min(hours, 168)):
        timestamp = datetime.utcnow() + timedelta(hours=i)
        aqi = generate_mock_aqi(lat, lon, i)
        category = get_aqi_category(aqi)
        
        forecast_data.append({
            "timestamp": timestamp.isoformat() + "Z",
            "hour": timestamp.hour,
            "aqi": aqi,
            "category": category["name"],
            "dominantPollutant": random.choice(["PM2.5", "O3", "NO2"]),
            "temperature": round(15 + random.uniform(-5, 15), 1),
            "windSpeed": round(random.uniform(5, 25), 1),
            "confidence": round(0.92 - (i * 0.003), 2),  # Decreases over time
            "weather": random.choice(["Clear", "Partly Cloudy", "Cloudy", "Foggy"])
        })
    
    return {
        "location": {
            "lat": lat,
            "lon": lon
        },
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "forecast": forecast_data,
        "accuracy_stats": {
            "historical_rmse_24h": 8.2,
            "historical_rmse_48h": 12.5,
            "historical_rmse_72h": 15.8
        }
    }

@app.get("/api/historical")
async def get_historical(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    hours: int = Query(48, description="Hours of historical data")
):
    """Get historical air quality data"""
    
    historical_data = []
    
    for i in range(hours):
        timestamp = datetime.utcnow() - timedelta(hours=hours - i)
        aqi = generate_mock_aqi(lat, lon, -i)
        
        historical_data.append({
            "timestamp": timestamp.isoformat() + "Z",
            "aqi": aqi,
            "pm25": round(12 + (aqi / 100) * 35, 1),
            "o3": round(25 + (aqi / 100) * 40, 1),
            "no2": round(15 + (aqi / 100) * 30, 1)
        })
    
    return {
        "location": {"lat": lat, "lon": lon},
        "time_range": {
            "start": (datetime.utcnow() - timedelta(hours=hours)).isoformat() + "Z",
            "end": datetime.utcnow().isoformat() + "Z"
        },
        "data": historical_data,
        "statistics": {
            "mean_aqi": sum(d["aqi"] for d in historical_data) / len(historical_data),
            "max_aqi": max(d["aqi"] for d in historical_data),
            "min_aqi": min(d["aqi"] for d in historical_data)
        }
    }

@app.post("/api/alerts")
async def create_alert(alert: AlertConfig):
    """Create a new alert"""
    
    alert_id = f"alrt_{random.randint(100000, 999999)}"
    
    return {
        "alert_id": alert_id,
        "status": "active",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "message": f"Alert created for {alert.location.name or 'location'} with threshold {alert.threshold}"
    }

@app.get("/api/map/data")
async def get_map_data(
    north: float = Query(...),
    south: float = Query(...),
    east: float = Query(...),
    west: float = Query(...)
):
    """Get map heat map data for given bounds"""
    
    grid_size = 30
    lat_step = (north - south) / grid_size
    lon_step = (east - west) / grid_size
    
    heatmap_data = []
    
    for i in range(grid_size):
        for j in range(grid_size):
            lat = south + i * lat_step
            lon = west + j * lon_step
            aqi = generate_mock_aqi(lat, lon)
            
            heatmap_data.append({
                "lat": lat,
                "lon": lon,
                "aqi": aqi,
                "intensity": aqi / 500  # Normalized 0-1
            })
    
    return {
        "bounds": {"north": north, "south": south, "east": east, "west": west},
        "data": heatmap_data
    }

@app.get("/api/sensors")
async def get_sensors(
    lat: float = Query(...),
    lon: float = Query(...),
    radius: float = Query(50, description="Radius in km")
):
    """Get nearby air quality sensors"""
    
    sensors = []
    
    # Generate 5-10 mock sensors around the location
    for i in range(random.randint(5, 10)):
        sensor_lat = lat + random.uniform(-0.5, 0.5)
        sensor_lon = lon + random.uniform(-0.5, 0.5)
        aqi = generate_mock_aqi(sensor_lat, sensor_lon)
        category = get_aqi_category(aqi)
        
        sensors.append({
            "id": f"sensor_{i+1}",
            "type": random.choice(["epa", "openaq", "pandora"]),
            "name": f"Sensor Station {i+1}",
            "lat": sensor_lat,
            "lon": sensor_lon,
            "aqi": aqi,
            "category": category["name"],
            "pollutants": generate_pollutant_data(aqi),
            "lastUpdate": f"{random.randint(1, 30)} min ago"
        })
    
    return {"sensors": sensors}

@app.get("/api/explain")
async def explain_forecast(
    aqi: int = Query(..., description="AQI value to explain"),
    pollutant: str = Query(..., description="Dominant pollutant"),
    weather: str = Query("clear", description="Weather conditions")
):
    """AI-powered explanation of air quality forecast (placeholder for LLM integration)"""
    
    # This will be enhanced with Emergent LLM integration
    category = get_aqi_category(aqi)
    
    explanations = {
        "Good": "Air quality is excellent today! Light winds are helping disperse any pollutants, and there are no major emission sources upwind. Perfect conditions for outdoor activities.",
        "Moderate": f"The AQI of {aqi} is driven primarily by {pollutant} emissions. Current weather conditions are {weather}, which affects how pollutants disperse in the atmosphere. Sensitive individuals should monitor symptoms.",
        "Unhealthy for Sensitive Groups": f"Elevated {pollutant} levels are causing the AQI to reach {aqi}. The {weather} weather is limiting pollutant dispersion. People with respiratory conditions should limit prolonged outdoor exertion.",
        "Unhealthy": f"Poor air quality today with AQI {aqi} due to high {pollutant} concentrations. Weather conditions ({weather}) are trapping pollutants near the surface. Everyone should reduce outdoor activities.",
        "Very Unhealthy": f"Very poor air quality (AQI {aqi}) caused by excessive {pollutant}. The {weather} conditions are preventing pollutant dispersion. Avoid all outdoor activities.",
        "Hazardous": f"Hazardous air quality (AQI {aqi}) with dangerous {pollutant} levels. Emergency conditions due to {weather} weather patterns. Stay indoors with windows closed."
    }
    
    return {
        "aqi": aqi,
        "category": category["name"],
        "explanation": explanations.get(category["name"], "Air quality information unavailable."),
        "factors": [
            f"Primary pollutant: {pollutant}",
            f"Weather conditions: {weather}",
            "Wind patterns affecting dispersion",
            "Nearby emission sources"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)