import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { getAQICategory } from './constants'

// Format timestamp
export const formatTime = (timestamp, formatStr = 'h:mm a') => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
    return format(date, formatStr)
  } catch (error) {
    return 'N/A'
  }
}

export const formatDate = (timestamp, formatStr = 'MMM dd, yyyy') => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
    return format(date, formatStr)
  } catch (error) {
    return 'N/A'
  }
}

export const formatRelativeTime = (timestamp) => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return 'N/A'
  }
}

// Get health recommendation based on AQI
export const getHealthRecommendation = (aqi) => {
  const category = getAQICategory(aqi)
  
  const recommendations = {
    'Good': {
      general: 'Air quality is ideal for outdoor activities.',
      sensitive: 'No precautions needed.',
      icon: 'smile'
    },
    'Moderate': {
      general: 'Air quality is acceptable for most people.',
      sensitive: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
      icon: 'meh'
    },
    'Unhealthy for Sensitive Groups': {
      general: 'General public can enjoy outdoor activities.',
      sensitive: 'Sensitive groups should reduce prolonged or heavy outdoor exertion.',
      icon: 'alert-circle'
    },
    'Unhealthy': {
      general: 'Everyone should reduce prolonged or heavy outdoor exertion.',
      sensitive: 'Sensitive groups should avoid prolonged outdoor exertion.',
      icon: 'alert-triangle'
    },
    'Very Unhealthy': {
      general: 'Everyone should avoid prolonged or heavy outdoor exertion.',
      sensitive: 'Sensitive groups should remain indoors.',
      icon: 'x-circle'
    },
    'Hazardous': {
      general: 'Everyone should avoid all outdoor exertion.',
      sensitive: 'Everyone should remain indoors.',
      icon: 'alert-octagon'
    }
  }
  
  return recommendations[category.name] || recommendations['Moderate']
}

// Get trend icon and text
export const getTrendInfo = (trend) => {
  const trends = {
    increasing: { icon: 'trending-up', color: 'text-red-400', text: 'Worsening' },
    decreasing: { icon: 'trending-down', color: 'text-green-400', text: 'Improving' },
    stable: { icon: 'minus', color: 'text-gray-400', text: 'Stable' }
  }
  return trends[trend] || trends.stable
}

// Get wind direction text from degrees
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Interpolate color for AQI value
export const interpolateAQIColor = (aqi) => {
  const category = getAQICategory(aqi)
  return category.color
}

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}