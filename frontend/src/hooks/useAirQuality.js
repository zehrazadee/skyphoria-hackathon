import { useQuery } from '@tanstack/react-query'
import { airQualityAPI } from '../services/api'

export const useCurrentAirQuality = (lat, lon, location = null, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'current', lat, lon],
    queryFn: () => airQualityAPI.getCurrentAQ(lat, lon, location),
    enabled: !!(lat && lon),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  })
}

export const useForecast = (lat, lon, hours = 72, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'forecast', lat, lon, hours],
    queryFn: () => airQualityAPI.getForecast(lat, lon, hours),
    enabled: !!(lat && lon),
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    ...options,
  })
}

export const useHistoricalData = (lat, lon, hours = 48, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'historical', lat, lon, hours],
    queryFn: () => airQualityAPI.getHistorical(lat, lon, hours),
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

export const useMapData = (bounds, options = {}) => {
  return useQuery({
    queryKey: ['airQuality', 'map', bounds],
    queryFn: () => airQualityAPI.getMapData(bounds),
    enabled: !!bounds,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useSensors = (lat, lon, radius = 50, options = {}) => {
  return useQuery({
    queryKey: ['sensors', lat, lon, radius],
    queryFn: () => airQualityAPI.getSensors(lat, lon, radius),
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000,
    ...options,
  })
}

export const useExplanation = (aqi, pollutant, weather, options = {}) => {
  return useQuery({
    queryKey: ['explanation', aqi, pollutant, weather],
    queryFn: () => airQualityAPI.getExplanation(aqi, pollutant, weather),
    enabled: !!(aqi && pollutant),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}