import React, { useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Moon, Sun, Globe, Thermometer, Bell, Check, Volume2, Info } from 'lucide-react'
import { useSettingsStore } from '../store/useStore'
import { showToast } from '../components/ui/Toast'

const DashboardSettings = () => {
  const { theme, units, language, notifications, setTheme, setUnits, setLanguage, setNotifications } = useSettingsStore()

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme')
      document.documentElement.classList.remove('dark-theme')
    } else {
      document.documentElement.classList.add('dark-theme')
      document.documentElement.classList.remove('light-theme')
    }
  }, [theme])

  const updateSetting = (key, value) => {
    if (key === 'theme') {
      setTheme(value)
      showToast.success(`Theme changed to ${value}`)
    }
    else if (key === 'units') {
      setUnits(value)
      showToast.success(`Units changed to ${value}`)
    }
    else if (key === 'language') {
      setLanguage(value)
      showToast.success(`Language changed to ${value}`)
    }
    else if (key === 'notifications') {
      setNotifications(value)
      showToast.success('Notification preferences updated')
    }
  }

  const toggleNotification = (key) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    }
    updateSetting('notifications', newNotifications)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Customize your Skyphoria experience</p>
      </div>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center">
            {settings.theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Appearance</h2>
            <p className="text-sm text-white/60">Customize how Skyphoria looks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSetting('theme', 'dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-bright-cyan bg-bright-cyan/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Moon className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Dark</p>
              </button>
              <button
                onClick={() => updateSetting('theme', 'light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.theme === 'light'
                    ? 'border-bright-cyan bg-bright-cyan/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Sun className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Light</p>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Units & Language */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Units & Language</h2>
            <p className="text-sm text-white/60">Set your preferred units and language</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Units</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSetting('units', 'metric')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.units === 'metric'
                    ? 'border-bright-cyan bg-bright-cyan/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Thermometer className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Metric</p>
                <p className="text-xs text-white/50">°C, km, kg</p>
              </button>
              <button
                onClick={() => updateSetting('units', 'imperial')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.units === 'imperial'
                    ? 'border-bright-cyan bg-bright-cyan/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Thermometer className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Imperial</p>
                <p className="text-xs text-white/50">°F, mi, lb</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Language</label>
            <select 
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-bright-cyan"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-sm text-white/60">Control how you receive updates</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'push', label: 'Push Notifications', description: 'Receive alerts in your browser' },
            { key: 'email', label: 'Email Notifications', description: 'Get updates via email' },
            { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' },
          ].map((notif) => (
            <label key={notif.key} className="flex items-center justify-between glass-card p-4 cursor-pointer hover:bg-white/5">
              <div>
                <p className="font-semibold text-white">{notif.label}</p>
                <p className="text-sm text-white/60">{notif.description}</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[notif.key]}
                onChange={(e) => updateSetting('notifications', {
                  ...settings.notifications,
                  [notif.key]: e.target.checked
                })}
                className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-bright-cyan"
              />
            </label>
          ))}
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">About Skyphoria</h2>
        <div className="space-y-2 text-sm text-white/70">
          <p><strong className="text-white">Version:</strong> 1.0.0</p>
          <p><strong className="text-white">Built for:</strong> NASA Space Apps Challenge 2025</p>
          <p><strong className="text-white">Data Sources:</strong> NASA TEMPO, OpenAQ, EPA AirNow, Pandora Network</p>
          <p className="pt-4 border-t border-white/10 text-xs">
            Made with ❤️ for clean air. Open source and committed to democratizing air quality information.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default DashboardSettings