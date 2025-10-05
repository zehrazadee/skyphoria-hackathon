import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const airQualityAPI = {
  // Get current air quality
  getCurrentAQ: async (lat, lon, location = null) => {
    const params = { lat, lon }
    if (location) params.location = location
    return apiClient.get('/api/current', { params })
  },

  // Get forecast
  getForecast: async (lat, lon, hours = 72) => {
    return apiClient.get('/api/forecast', { params: { lat, lon, hours } })
  },

  // Get historical data
  getHistorical: async (lat, lon, hours = 48) => {
    return apiClient.get('/api/historical', { params: { lat, lon, hours } })
  },

  // Get map data
  getMapData: async (bounds) => {
    return apiClient.get('/api/map/data', { params: bounds })
  },

  // Get nearby sensors
  getSensors: async (lat, lon, radius = 50) => {
    return apiClient.get('/api/sensors', { params: { lat, lon, radius } })
  },

  // Create alert
  createAlert: async (alertConfig) => {
    return apiClient.post('/api/alerts', alertConfig)
  },

  // Get AI explanation
  getExplanation: async (aqi, pollutant, weather) => {
    return apiClient.get('/api/explain', {
      params: { aqi, pollutant, weather }
    })
  },
}

export default apiClient