# Skyphoria - Air Quality Forecasting Platform

**From EarthData to Action: Breathe Easy with AI-Powered Air Quality Forecasts**

## 🌤️ Overview

Skyphoria is an innovative air quality forecasting platform developed for the NASA Space Apps Challenge 2025. We integrate NASA TEMPO satellite data, ground-based measurements, and advanced machine learning to predict air quality up to 72 hours in advance.

## ✨ Features

- **Real-Time Air Quality Monitoring**: Current AQI and pollutant levels
- **72-Hour Forecasts**: AI-powered predictions with confidence scores
- **Interactive Maps**: Visualize air quality across North America
- **Smart Alerts**: Proactive notifications before air quality deteriorates
- **Multi-Location Tracking**: Monitor air quality for family and friends
- **AI-Powered Insights**: Natural language explanations of forecasts

## 🚀 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Leaflet (interactive maps)
- Recharts (data visualization)
- React Query (data fetching)
- Lucide React (icons)

### Backend
- FastAPI (Python)
- MongoDB (database)
- Machine Learning (forecast models)
- NASA TEMPO API integration
- OpenAQ, EPA AirNow, Pandora networks

## 📦 Installation

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn dev
```

## 🎯 NASA Space Apps Challenge 2025

This project addresses the challenge of making air quality data accessible and actionable for everyone. By combining cutting-edge satellite technology with ground-based measurements and AI, we're helping protect vulnerable populations from air pollution.

## 📊 Data Sources

- **NASA TEMPO**: Hourly satellite measurements of NO2, HCHO, O3
- **OpenAQ**: Global ground sensor network
- **EPA AirNow**: U.S. regulatory monitoring
- **Pandora Network**: Ground-based validation
- **NOAA Weather**: Meteorological forecasts

## 🤝 Contributing

We welcome contributions! This is an open-source project committed to democratizing air quality information.

## 📄 License

MIT License - See LICENSE file for details

## 🌍 Impact

**99% of people worldwide breathe polluted air.** Skyphoria is changing that by providing free, accurate, and actionable air quality forecasts to everyone.

---

**Built with ❤️ for clean air**