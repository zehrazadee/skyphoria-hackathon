#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Skyphoria Air Quality Forecasting Application
Tests all backend endpoints with real data validation
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os

# Backend URL from environment
BACKEND_URL = "https://airsense-dash.preview.emergentagent.com"

# Test coordinates (New York City)
TEST_LAT = 40.7128
TEST_LON = -74.0060

class BackendTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        if response_data:
            result["response_sample"] = response_data
        self.results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/api/health")
            
            if response.status_code != 200:
                self.log_result("Health Check", False, f"Expected 200, got {response.status_code}")
                return False
                
            data = response.json()
            
            # Validate required fields
            required_fields = ["status", "ml_models", "timestamp"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                self.log_result("Health Check", False, f"Missing fields: {missing_fields}")
                return False
                
            # Validate field values
            if data["status"] != "healthy":
                self.log_result("Health Check", False, f"Status is '{data['status']}', expected 'healthy'")
                return False
                
            if not isinstance(data["ml_models"], bool):
                self.log_result("Health Check", False, f"ml_models should be boolean, got {type(data['ml_models'])}")
                return False
                
            # Validate timestamp format
            try:
                datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
            except ValueError:
                self.log_result("Health Check", False, f"Invalid timestamp format: {data['timestamp']}")
                return False
                
            self.log_result("Health Check", True, f"All validations passed. ML models loaded: {data['ml_models']}", 
                          {"status": data["status"], "ml_models": data["ml_models"]})
            return True
            
        except Exception as e:
            self.log_result("Health Check", False, f"Request failed: {str(e)}")
            return False
    
    def test_current_air_quality(self):
        """Test GET /api/current endpoint"""
        try:
            params = {"lat": TEST_LAT, "lon": TEST_LON}
            response = self.session.get(f"{BACKEND_URL}/api/current", params=params)
            
            if response.status_code != 200:
                self.log_result("Current Air Quality", False, f"Expected 200, got {response.status_code}")
                return False
                
            data = response.json()
            
            # Validate top-level structure
            required_top_level = ["location", "timestamp", "aqi", "category", "categoryColor", 
                                "dominantPollutant", "confidence", "weather", "pollutants", 
                                "dataSources", "ml_powered"]
            
            missing_fields = [field for field in required_top_level if field not in data]
            if missing_fields:
                self.log_result("Current Air Quality", False, f"Missing top-level fields: {missing_fields}")
                return False
            
            # Validate location
            location = data["location"]
            if location["lat"] != TEST_LAT or location["lon"] != TEST_LON:
                self.log_result("Current Air Quality", False, f"Location mismatch: expected ({TEST_LAT}, {TEST_LON}), got ({location['lat']}, {location['lon']})")
                return False
            
            # Validate AQI
            aqi = data["aqi"]
            if not isinstance(aqi, int) or aqi < 0 or aqi > 500:
                self.log_result("Current Air Quality", False, f"Invalid AQI value: {aqi}")
                return False
            
            # Validate confidence
            confidence = data["confidence"]
            if not isinstance(confidence, (int, float)) or confidence < 0 or confidence > 1:
                self.log_result("Current Air Quality", False, f"Invalid confidence value: {confidence}")
                return False
            
            # Validate weather data
            weather = data["weather"]
            required_weather = ["temperature", "windSpeed", "windDirection", "windDirectionText", "humidity", "visibility"]
            missing_weather = [field for field in required_weather if field not in weather]
            if missing_weather:
                self.log_result("Current Air Quality", False, f"Missing weather fields: {missing_weather}")
                return False
            
            # Validate pollutants
            pollutants = data["pollutants"]
            required_pollutants = ["pm25", "pm10", "o3", "no2", "so2", "co"]
            missing_pollutants = [field for field in required_pollutants if field not in pollutants]
            if missing_pollutants:
                self.log_result("Current Air Quality", False, f"Missing pollutants: {missing_pollutants}")
                return False
            
            # Validate PM2.5 structure
            pm25 = pollutants["pm25"]
            required_pm25 = ["value", "unit", "aqi", "description", "source"]
            missing_pm25 = [field for field in required_pm25 if field not in pm25]
            if missing_pm25:
                self.log_result("Current Air Quality", False, f"Missing PM2.5 fields: {missing_pm25}")
                return False
            
            # Validate ml_powered flag
            if not data["ml_powered"]:
                self.log_result("Current Air Quality", False, "ml_powered should be true")
                return False
            
            sample_data = {
                "aqi": data["aqi"],
                "category": data["category"],
                "dominant_pollutant": data["dominantPollutant"],
                "pm25_value": pollutants["pm25"]["value"],
                "temperature": weather["temperature"]
            }
            
            self.log_result("Current Air Quality", True, "All validations passed with real CAMS data", sample_data)
            return True
            
        except Exception as e:
            self.log_result("Current Air Quality", False, f"Request failed: {str(e)}")
            return False
    
    def test_ml_forecast(self):
        """Test GET /api/forecast endpoint"""
        try:
            params = {"lat": TEST_LAT, "lon": TEST_LON, "hours": 24}
            response = self.session.get(f"{BACKEND_URL}/api/forecast", params=params)
            
            if response.status_code != 200:
                self.log_result("ML Forecast", False, f"Expected 200, got {response.status_code}")
                return False
                
            data = response.json()
            
            # Validate top-level structure
            required_fields = ["location", "generated_at", "forecast", "model_info", "ml_powered"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_result("ML Forecast", False, f"Missing fields: {missing_fields}")
                return False
            
            # Validate forecast array
            forecast = data["forecast"]
            if not isinstance(forecast, list) or len(forecast) == 0:
                self.log_result("ML Forecast", False, f"Forecast should be non-empty list, got {type(forecast)} with length {len(forecast) if isinstance(forecast, list) else 'N/A'}")
                return False
            
            # Validate forecast items
            first_item = forecast[0]
            required_forecast_fields = ["timestamp", "aqi", "category", "categoryColor", "pm25", "o3_ppb", "no2_ppb", "dominantPollutant", "confidence"]
            missing_forecast_fields = [field for field in required_forecast_fields if field not in first_item]
            if missing_forecast_fields:
                self.log_result("ML Forecast", False, f"Missing forecast fields: {missing_forecast_fields}")
                return False
            
            # Validate confidence scores decrease over time
            confidences = [item["confidence"] for item in forecast[:5]]  # Check first 5 items
            if len(confidences) > 1:
                decreasing = all(confidences[i] >= confidences[i+1] for i in range(len(confidences)-1))
                if not decreasing:
                    self.log_result("ML Forecast", False, f"Confidence scores should decrease over time. Got: {confidences}")
                    return False
            
            # Validate model info
            model_info = data["model_info"]
            if "pm25_model" not in model_info or "o3_model" not in model_info:
                self.log_result("ML Forecast", False, "Missing model information")
                return False
            
            # Validate ml_powered flag
            if not data["ml_powered"]:
                self.log_result("ML Forecast", False, "ml_powered should be true")
                return False
            
            sample_data = {
                "forecast_length": len(forecast),
                "first_aqi": first_item["aqi"],
                "first_confidence": first_item["confidence"],
                "pm25_model": model_info["pm25_model"][:50] + "..."
            }
            
            self.log_result("ML Forecast", True, f"24-hour ML forecast validated with {len(forecast)} data points", sample_data)
            return True
            
        except Exception as e:
            self.log_result("ML Forecast", False, f"Request failed: {str(e)}")
            return False
    
    def test_historical_data(self):
        """Test GET /api/historical endpoint"""
        try:
            params = {"lat": TEST_LAT, "lon": TEST_LON, "hours": 48}
            response = self.session.get(f"{BACKEND_URL}/api/historical", params=params)
            
            if response.status_code != 200:
                self.log_result("Historical Data", False, f"Expected 200, got {response.status_code}")
                return False
                
            data = response.json()
            
            # Validate structure
            required_fields = ["location", "data"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_result("Historical Data", False, f"Missing fields: {missing_fields}")
                return False
            
            # Validate location
            location = data["location"]
            if location["lat"] != TEST_LAT or location["lon"] != TEST_LON:
                self.log_result("Historical Data", False, f"Location mismatch")
                return False
            
            # Validate data array
            historical_data = data["data"]
            if not isinstance(historical_data, list) or len(historical_data) != 48:
                self.log_result("Historical Data", False, f"Expected 48 data points, got {len(historical_data) if isinstance(historical_data, list) else 'N/A'}")
                return False
            
            # Validate data item structure
            first_item = historical_data[0]
            required_data_fields = ["timestamp", "aqi", "category", "categoryColor", "pm25", "o3", "no2"]
            missing_data_fields = [field for field in required_data_fields if field not in first_item]
            if missing_data_fields:
                self.log_result("Historical Data", False, f"Missing data fields: {missing_data_fields}")
                return False
            
            # Validate timestamps are in ISO format
            try:
                datetime.fromisoformat(first_item["timestamp"].replace('Z', '+00:00'))
            except ValueError:
                self.log_result("Historical Data", False, f"Invalid timestamp format: {first_item['timestamp']}")
                return False
            
            sample_data = {
                "data_points": len(historical_data),
                "first_timestamp": first_item["timestamp"],
                "first_aqi": first_item["aqi"]
            }
            
            self.log_result("Historical Data", True, f"48-hour historical data validated", sample_data)
            return True
            
        except Exception as e:
            self.log_result("Historical Data", False, f"Request failed: {str(e)}")
            return False
    
    def test_map_data(self):
        """Test GET /api/map/data endpoint"""
        try:
            params = {"north": 41, "south": 40, "east": -73, "west": -75}
            response = self.session.get(f"{BACKEND_URL}/api/map/data", params=params)
            
            if response.status_code != 200:
                self.log_result("Map Data", False, f"Expected 200, got {response.status_code}")
                return False
                
            data = response.json()
            
            # Validate structure
            if "data" not in data:
                self.log_result("Map Data", False, "Missing 'data' field")
                return False
            
            # Validate heatmap data
            heatmap_data = data["data"]
            if not isinstance(heatmap_data, list) or len(heatmap_data) == 0:
                self.log_result("Map Data", False, f"Heatmap data should be non-empty list")
                return False
            
            # Validate data point structure
            first_point = heatmap_data[0]
            required_point_fields = ["lat", "lon", "aqi", "intensity"]
            missing_point_fields = [field for field in required_point_fields if field not in first_point]
            if missing_point_fields:
                self.log_result("Map Data", False, f"Missing heatmap point fields: {missing_point_fields}")
                return False
            
            # Validate coordinate bounds
            for point in heatmap_data[:5]:  # Check first 5 points
                if not (40 <= point["lat"] <= 41):
                    self.log_result("Map Data", False, f"Latitude {point['lat']} outside bounds [40, 41]")
                    return False
                if not (-75 <= point["lon"] <= -73):
                    self.log_result("Map Data", False, f"Longitude {point['lon']} outside bounds [-75, -73]")
                    return False
            
            # Validate intensity calculation
            for point in heatmap_data[:5]:
                expected_intensity = point["aqi"] / 500
                if abs(point["intensity"] - expected_intensity) > 0.001:
                    self.log_result("Map Data", False, f"Intensity calculation error: expected {expected_intensity}, got {point['intensity']}")
                    return False
            
            sample_data = {
                "data_points": len(heatmap_data),
                "first_point": {
                    "lat": first_point["lat"],
                    "lon": first_point["lon"],
                    "aqi": first_point["aqi"],
                    "intensity": first_point["intensity"]
                }
            }
            
            self.log_result("Map Data", True, f"Heatmap data validated with {len(heatmap_data)} points", sample_data)
            return True
            
        except Exception as e:
            self.log_result("Map Data", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Testing for Skyphoria")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test Coordinates: ({TEST_LAT}, {TEST_LON})")
        print("=" * 60)
        
        tests = [
            self.test_health_check,
            self.test_current_air_quality,
            self.test_ml_forecast,
            self.test_historical_data,
            self.test_map_data
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error - {str(e)}")
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend API tests PASSED!")
        else:
            print(f"⚠️  {total - passed} test(s) FAILED")
        
        return passed == total, self.results

if __name__ == "__main__":
    tester = BackendTester()
    success, results = tester.run_all_tests()
    
    # Print detailed results
    print("\n" + "=" * 60)
    print("📋 DETAILED TEST RESULTS")
    print("=" * 60)
    
    for result in results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}: {result['message']}")
        if "response_sample" in result:
            print(f"   Sample: {json.dumps(result['response_sample'], indent=2)}")
    
    sys.exit(0 if success else 1)