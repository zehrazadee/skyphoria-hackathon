import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Bell, AlertTriangle, Check, X, Plus, TrendingUp } from 'lucide-react'
import { useSettingsStore } from '../store/useStore'
import { useCurrentAirQuality, useForecast } from '../hooks/useAirQuality'
import { showToast } from '../components/ui/Toast'
import AQIBadge from '../components/ui/AQIBadge'

const DashboardAlerts = ({ currentLocation }) => {
  const { alertThreshold, setAlertThreshold } = useSettingsStore()
  const [activeAlerts, setActiveAlerts] = useState([])
  
  const { data: currentData } = useCurrentAirQuality(
    currentLocation?.lat,
    currentLocation?.lon,
    currentLocation?.name
  )
  
  const { data: forecastData } = useForecast(
    currentLocation?.lat,
    currentLocation?.lon,
    72
  )

  // Generate alerts based on forecast
  useEffect(() => {
    if (!forecastData?.forecast || !alertThreshold) return
    
    const alerts = []
    const next24h = forecastData.forecast.slice(0, 24)
    
    // Check if any forecast exceeds threshold
    const exceedingForecasts = next24h.filter(f => f.aqi > alertThreshold)
    
    if (exceedingForecasts.length > 0) {
      const firstExceeding = exceedingForecasts[0]
      const timestamp = new Date(firstExceeding.timestamp)
      const hoursUntil = Math.round((timestamp - new Date()) / (1000 * 60 * 60))
      
      alerts.push({
        id: 'forecast_alert_1',
        type: 'forecast_warning',
        severity: firstExceeding.aqi > 150 ? 'high' : 'moderate',
        title: `Air Quality Alert: ${firstExceeding.category}`,
        message: `AQI is forecast to reach ${firstExceeding.aqi} in ${hoursUntil} hours. Dominant pollutant: ${firstExceeding.dominantPollutant}`,
        time: 'Just now',
        aqi: firstExceeding.aqi,
        timestamp: firstExceeding.timestamp,
        isRead: false,
      })
    }
    
    // Current alert
    if (currentData?.aqi > alertThreshold) {
      alerts.push({
        id: 'current_alert',
        type: 'threshold_exceeded',
        severity: 'high',
        title: 'Current Air Quality Threshold Exceeded',
        message: `Current AQI of ${currentData.aqi} exceeds your threshold of ${alertThreshold}. Consider limiting outdoor activities.`,
        time: 'Now',
        aqi: currentData.aqi,
        isRead: false,
      })
    }
    
    setActiveAlerts(alerts)
  }, [forecastData, currentData, alertThreshold])

  const handleThresholdChange = (value) => {
    setAlertThreshold(parseInt(value))
    showToast.success(`Alert threshold set to ${value} AQI`)
  }

  const dismissAlert = (id) => {
    setActiveAlerts(alerts => alerts.filter(a => a.id !== id))
    showToast.success('Alert dismissed')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Smart Alerts</h1>
        <p className="text-white/60">AI-powered air quality monitoring and notifications</p>
      </div>

      {/* Active Alerts */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Alerts</h2>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-bright-cyan" />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              activeAlerts.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {activeAlerts.length} Active
            </span>
          </div>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`glass-card p-4 border-l-4 ${
                  alert.severity === 'high' ? 'border-red-400' : 'border-orange-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-1 ${
                      alert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{alert.title}</h3>
                      <p className="text-sm text-white/70 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-white/50">{alert.time}</p>
                        <AQIBadge aqi={alert.aqi} size="sm" />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-white/60">No active air quality alerts at this time</p>
            <p className="text-sm text-white/50 mt-2">Current AQI: {currentData?.aqi || 'Loading...'}</p>
          </div>
        )}
      </Card>

      {/* Alert Configuration */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Alert Configuration</h2>
        
        <div className="space-y-6">
          {/* AQI Threshold */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-white">
                Alert Threshold
              </label>
              <span className="text-2xl font-bold text-bright-cyan">{alertThreshold}</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={alertThreshold}
              onChange={(e) => handleThresholdChange(e.target.value)}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00D9FF ${((alertThreshold - 50) / 150) * 100}%, rgba(255,255,255,0.1) ${((alertThreshold - 50) / 150) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>50 (Good)</span>
              <span>100 (Moderate)</span>
              <span>150 (Unhealthy)</span>
              <span>200 (Very Unhealthy)</span>
            </div>
            <p className="text-sm text-white/60 mt-3">
              You'll be alerted when AQI exceeds <span className="text-bright-cyan font-semibold">{alertThreshold}</span>
            </p>
          </div>

          {/* Forecast Preview */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">24-Hour Forecast Preview</label>
            <div className="glass-card p-4">
              {forecastData?.forecast ? (
                <div className="space-y-2">
                  {forecastData.forecast.slice(0, 8).map((item, idx) => {
                    const willAlert = item.aqi > alertThreshold
                    return (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-sm text-white/70">
                          {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">AQI {item.aqi}</span>
                          {willAlert && (
                            <Bell className="w-4 h-4 text-orange-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/60 text-center py-4">Loading forecast...</p>
              )}
            </div>
          </div>

          <Button className="w-full">Save Alert Settings</Button>
        </div>
      </Card>

      {/* ML-Powered Alert Info */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-bright-cyan" />
          <h2 className="text-xl font-bold text-white">AI-Powered Predictions</h2>
        </div>
        <div className="space-y-3 text-sm text-white/70">
          <p>
            • Our alerts use <strong className="text-white">LightGBM machine learning models</strong> trained on 4 years of NASA and CAMS data
          </p>
          <p>
            • Models predict PM2.5 and O₃ concentrations up to <strong className="text-white">72 hours in advance</strong>
          </p>
          <p>
            • Forecasts are updated hourly with the latest atmospheric and meteorological data
          </p>
          <p>
            • Alert confidence decreases slightly over time: <strong className="text-bright-cyan">90%</strong> at 1h, <strong className="text-bright-cyan">85%</strong> at 24h, <strong className="text-bright-cyan">78%</strong> at 72h
          </p>
        </div>
      </Card>
    </div>
  )
}

export default DashboardAlerts