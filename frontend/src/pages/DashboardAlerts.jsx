import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Bell, AlertTriangle, Check, X } from 'lucide-react'
import { useSettingsStore, settingsStore } from '../store/locationStore'

const DashboardAlerts = () => {
  const [activeAlerts] = useState([
    {
      id: 1,
      type: 'forecast_warning',
      severity: 'moderate',
      title: 'Unhealthy Air Quality Expected Tomorrow',
      message: 'AQI forecast to reach 125 tomorrow between 2-6 PM.',
      time: '2 hours ago',
      isRead: false,
    },
  ])

  const alertThreshold = useSettingsStore(state => state.alertThreshold)

  const handleThresholdChange = (value) => {
    settingsStore.setState({ alertThreshold: parseInt(value) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Alerts & Notifications</h1>
        <p className="text-white/60">Manage your air quality alerts</p>
      </div>

      {/* Active Alerts */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Alerts</h2>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            {activeAlerts.length} Active
          </span>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-card p-4 border-l-4 border-orange-400"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">{alert.title}</h3>
                      <p className="text-sm text-white/70 mb-2">{alert.message}</p>
                      <p className="text-xs text-white/50">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-green-500/20 rounded-lg transition-colors">
                      <Check className="w-4 h-4 text-green-400" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No active alerts</p>
          </div>
        )}
      </Card>

      {/* Alert Configuration */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Alert Configuration</h2>
        
        <div className="space-y-6">
          {/* AQI Threshold */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Alert Threshold: <span className="text-bright-cyan">{alertThreshold} AQI</span>
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={alertThreshold}
              onChange={(e) => handleThresholdChange(e.target.value)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00D9FF ${((alertThreshold - 50) / 150) * 100}%, rgba(255,255,255,0.1) ${((alertThreshold - 50) / 150) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
            </div>
          </div>

          {/* Notification Methods */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Notification Methods</label>
            <div className="space-y-2">
              {[
                { id: 'push', label: 'Push Notifications', enabled: true },
                { id: 'email', label: 'Email Notifications', enabled: false },
                { id: 'sms', label: 'SMS Notifications', enabled: false },
              ].map((method) => (
                <label key={method.id} className="flex items-center gap-3 glass-card p-3 cursor-pointer hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-bright-cyan"
                  />
                  <span className="text-white">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Advance Warning */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Advance Warning</label>
            <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-bright-cyan">
              <option value="6">6 hours before</option>
              <option value="12" selected>12 hours before</option>
              <option value="24">24 hours before</option>
            </select>
          </div>

          <Button>Save Alert Settings</Button>
        </div>
      </Card>

      {/* Alert History */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Alert History</h2>
        <div className="text-center py-8 text-white/50">
          <p>No alert history yet</p>
        </div>
      </Card>
    </div>
  )
}

export default DashboardAlerts