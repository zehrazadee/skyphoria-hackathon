import React from 'react'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import Card from '../ui/Card'
import AQIBadge from '../ui/AQIBadge'
import { getAQICategory } from '../../utils/constants'
import { getHealthRecommendation, convertTemperature, convertSpeed, convertDistance, getTemperatureUnit, getSpeedUnit, getDistanceUnit } from '../../utils/helpers'
import { useSettingsStore } from '../../store/useStore'
import Loading from '../ui/Loading'

const CurrentConditions = ({ data, isLoading }) => {
  const { units } = useSettingsStore()
  
  if (isLoading) return <Loading message="Loading current conditions..." />
  if (!data) return null

  const category = getAQICategory(data.aqi)
  const health = getHealthRecommendation(data.aqi)
  
  // Convert units
  const temperature = convertTemperature(data.weather.temperature, units)
  const windSpeed = convertSpeed(data.weather.windSpeed, units)
  const visibility = convertDistance(data.weather.visibility, units)

  return (
    <Card className="lg:col-span-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Current Conditions</h2>
          <p className="text-sm text-white/60">
            {data.location.name} • Updated {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60 mb-1">Confidence</p>
          <p className="text-lg font-bold text-bright-cyan">{(data.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Large AQI Display */}
      <div className="text-center mb-8">
        <div className="inline-flex flex-col items-center">
          <div 
            className="w-48 h-48 rounded-full flex items-center justify-center mb-4 relative"
            style={{ backgroundColor: category.color + '20', border: `4px solid ${category.color}` }}
          >
            <div className="text-center">
              <div className="text-6xl font-black" style={{ color: category.color }}>
                {data.aqi}
              </div>
              <div className="text-sm font-bold text-white mt-2">AQI</div>
            </div>
          </div>
          <AQIBadge aqi={data.aqi} size="lg" />
          <p className="text-sm text-white/60 mt-2">Dominant: {data.dominantPollutant}</p>
        </div>
      </div>

      {/* Weather Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-bright-cyan" />
            <span className="text-xs text-white/60">Temperature</span>
          </div>
          <p className="text-lg font-bold">{data.weather.temperature}°C</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-bright-cyan" />
            <span className="text-xs text-white/60">Wind</span>
          </div>
          <p className="text-lg font-bold">{data.weather.windSpeed} km/h</p>
          <p className="text-xs text-white/50">{data.weather.windDirectionText}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-bright-cyan" />
            <span className="text-xs text-white/60">Humidity</span>
          </div>
          <p className="text-lg font-bold">{data.weather.humidity}%</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-bright-cyan" />
            <span className="text-xs text-white/60">Visibility</span>
          </div>
          <p className="text-lg font-bold">{data.weather.visibility} km</p>
        </div>
      </div>

      {/* Health Recommendation */}
      <div className="glass-card p-4 border-l-4" style={{ borderLeftColor: category.color }}>
        <h3 className="font-semibold text-white mb-2">Health Recommendation</h3>
        <p className="text-sm text-white/80 mb-2">{health.general}</p>
        <p className="text-xs text-white/60">
          <strong>Sensitive groups:</strong> {health.sensitive}
        </p>
      </div>
    </Card>
  )
}

export default CurrentConditions