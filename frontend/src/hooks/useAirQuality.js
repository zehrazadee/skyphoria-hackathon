import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { airQualityAPI } from '../services/api'
import { showToast } from '../components/ui/Toast'

// Enhanced hooks with better error handling and retry logic

export const useCurrentAirQuality = (lat, lon, location = null, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'current', lat, lon],
    queryFn: () => airQualityAPI.getCurrentAQ(lat, lon, location),
    enabled: !!(lat && lon),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Failed to fetch current air quality:', error)
      showToast.error('Failed to load current air quality data')
    },
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
    ...options,
  })
}

export const useForecast = (lat, lon, hours = 72, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'forecast', lat, lon, hours],
    queryFn: () => airQualityAPI.getForecast(lat, lon, hours),
    enabled: !!(lat && lon),
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch forecast:', error)
      showToast.error('Failed to load forecast data')
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

export const useHistoricalData = (lat, lon, hours = 48, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'historical', lat, lon, hours],
    queryFn: () => airQualityAPI.getHistorical(lat, lon, hours),
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch historical data:', error)
      showToast.error('Failed to load historical data')
    },
    ...options,
  })
}

export const useMapData = (bounds, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'map', bounds],
    queryFn: () => airQualityAPI.getMapData(bounds),
    enabled: !!bounds,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch map data:', error)
    },
    ...options,
  })
}

export const useSensors = (lat, lon, radius = 50, options = {}) => {
  return useQuery({
    queryKey: ['sensors', lat, lon, radius],
    queryFn: () => airQualityAPI.getSensors(lat, lon, radius),
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch sensors:', error)
    },
    ...options,
  })
}

export const useExplanation = (aqi, pollutant, weather, options = {}) => {
  return useQuery({
    queryKey: ['explanation', aqi, pollutant, weather],
    queryFn: () => airQualityAPI.getExplanation(aqi, pollutant, weather),
    enabled: !!(aqi && pollutant),
    staleTime: 30 * 60 * 1000,
    retry: 1,
    ...options,
  })
}

// Mutation hook for creating alerts
export const useCreateAlert = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (alertConfig) => airQualityAPI.createAlert(alertConfig),
    onSuccess: () => {
      showToast.success('Alert created successfully!')
      queryClient.invalidateQueries(['alerts'])
    },
    onError: (error) => {
      console.error('Failed to create alert:', error)
      showToast.error('Failed to create alert. Please try again.')
    },
  })
}

// Prefetch hook for better UX
export const usePrefetchForecast = (lat, lon) => {
  const queryClient = useQueryClient()
  
  return () => {
    if (lat && lon) {
      queryClient.prefetchQuery({
        queryKey: ['airQuality', 'forecast', lat, lon, 72],
        queryFn: () => airQualityAPI.getForecast(lat, lon, 72),
      })
    }
  }
}