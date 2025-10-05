// AQI Category Constants
export const AQI_CATEGORIES = {
  GOOD: { min: 0, max: 50, name: 'Good', color: '#00E676', bgColor: 'bg-aqi-good' },
  MODERATE: { min: 51, max: 100, name: 'Moderate', color: '#FFEB3B', bgColor: 'bg-aqi-moderate' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, name: 'Unhealthy for Sensitive Groups', color: '#FF9800', bgColor: 'bg-aqi-sensitive' },
  UNHEALTHY: { min: 151, max: 200, name: 'Unhealthy', color: '#F44336', bgColor: 'bg-aqi-unhealthy' },
  VERY_UNHEALTHY: { min: 201, max: 300, name: 'Very Unhealthy', color: '#9C27B0', bgColor: 'bg-aqi-very-unhealthy' },
  HAZARDOUS: { min: 301, max: 500, name: 'Hazardous', color: '#880E4F', bgColor: 'bg-aqi-hazardous' }
}

// Get AQI category from value
export const getAQICategory = (aqi) => {
  if (aqi <= 50) return AQI_CATEGORIES.GOOD
  if (aqi <= 100) return AQI_CATEGORIES.MODERATE
  if (aqi <= 150) return AQI_CATEGORIES.UNHEALTHY_SENSITIVE
  if (aqi <= 200) return AQI_CATEGORIES.UNHEALTHY
  if (aqi <= 300) return AQI_CATEGORIES.VERY_UNHEALTHY
  return AQI_CATEGORIES.HAZARDOUS
}

// Default locations for demo
export const DEFAULT_LOCATIONS = [
  { id: 1, name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { id: 2, name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { id: 3, name: 'New York', lat: 40.7128, lon: -74.0060 },
  { id: 4, name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { id: 5, name: 'Seattle', lat: 47.6062, lon: -122.3321 },
]

// Pollutant information
export const POLLUTANTS = {
  pm25: {
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    description: 'Tiny particles smaller than 2.5 micrometers that can penetrate deep into lungs',
    unit: 'μg/m³',
    sources: 'Vehicle emissions, industrial processes, wildfires'
  },
  pm10: {
    name: 'PM10',
    fullName: 'Coarse Particulate Matter',
    description: 'Particles smaller than 10 micrometers from dust and construction',
    unit: 'μg/m³',
    sources: 'Dust, construction, road debris'
  },
  o3: {
    name: 'O3',
    fullName: 'Ground-level Ozone',
    description: 'Harmful gas formed when sunlight reacts with pollutants',
    unit: 'ppb',
    sources: 'Photochemical reactions from vehicle and industrial emissions'
  },
  no2: {
    name: 'NO2',
    fullName: 'Nitrogen Dioxide',
    description: 'Gas produced by vehicle engines and power plants',
    unit: 'ppb',
    sources: 'Vehicle emissions, power plants'
  },
  so2: {
    name: 'SO2',
    fullName: 'Sulfur Dioxide',
    description: 'Gas from industrial processes and fossil fuel combustion',
    unit: 'ppb',
    sources: 'Coal power plants, industrial facilities'
  },
  co: {
    name: 'CO',
    fullName: 'Carbon Monoxide',
    description: 'Colorless, odorless gas from incomplete combustion',
    unit: 'ppm',
    sources: 'Vehicle exhaust, heating systems'
  }
}