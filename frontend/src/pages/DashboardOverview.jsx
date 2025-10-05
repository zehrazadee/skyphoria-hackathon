import React from 'react'
import { useCurrentAirQuality, useForecast, useHistoricalData } from '../hooks/useAirQuality'
import CurrentConditions from '../components/dashboard/CurrentConditions'
import PollutantLevels from '../components/dashboard/PollutantLevels'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import Card from '../components/ui/Card'
import { AlertTriangle, Cloud, Wind } from 'lucide-react'
import { useSettingsStore } from '../store/useStore'
import { useTranslation } from '../utils/translations'

const DashboardOverview = ({ currentLocation }) => {
  const { language } = useSettingsStore()
  const { t } = useTranslation(language)
  const { data: currentData, isLoading: currentLoading } = useCurrentAirQuality(
    currentLocation?.lat,
    currentLocation?.lon,
    currentLocation?.name
  )

  const { data: forecastData, isLoading: forecastLoading } = useForecast(
    currentLocation?.lat,
    currentLocation?.lon,
    72
  )

  const { data: historicalData, isLoading: historicalLoading } = useHistoricalData(
    currentLocation?.lat,
    currentLocation?.lon,
    48
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Air Quality Overview</h1>
        <p className="text-white/60">Real-time conditions and forecasts for your location</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Conditions - Spans 2 columns */}
        <CurrentConditions data={currentData} isLoading={currentLoading} />

        {/* Pollutant Levels */}
        <PollutantLevels data={currentData} isLoading={currentLoading} />
      </div>

      {/* Hourly Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HourlyForecast data={forecastData} isLoading={forecastLoading} />

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full glass-card p-4 text-left hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bright-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-bright-cyan" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">Set Alert</p>
                  <p className="text-xs text-white/60">Get notified when AQI changes</p>
                </div>
              </div>
            </button>

            <button className="w-full glass-card p-4 text-left hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bright-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cloud className="w-5 h-5 text-bright-cyan" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">View Forecast</p>
                  <p className="text-xs text-white/60">See 7-day outlook</p>
                </div>
              </div>
            </button>

            <button className="w-full glass-card p-4 text-left hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bright-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wind className="w-5 h-5 text-bright-cyan" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">AI Explanation</p>
                  <p className="text-xs text-white/60">Understand today's conditions</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Data Sources */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Active Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentData?.dataSources?.map((source, index) => (
            <div key={index} className="flex items-center gap-3 glass-card p-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-white">{source.name}</p>
                <p className="text-xs text-white/50">Updated {source.lastUpdate}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DashboardOverview