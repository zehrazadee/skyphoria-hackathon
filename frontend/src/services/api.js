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
    // Add timestamp to prevent caching issues
    config.params = {
      ...config.params,
      _t: Date.now()
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    
    // Retry logic for network errors
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Wait 1 second before retry
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        return await apiClient(originalRequest)
      } catch (retryError) {
        console.error('Retry failed:', retryError)
        return Promise.reject(retryError)
      }
    }
    
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 429:
          console.error('Rate limit exceeded')
          break
        case 500:
          console.error('Server error')
          break
        case 503:
          console.error('Service unavailable')
          break
        default:
          console.error('API Error:', error.response?.data || error.message)
      }
    }
    
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