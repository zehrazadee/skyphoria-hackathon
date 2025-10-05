import React, { useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Moon, Sun, Globe, Thermometer, Bell, Check, Volume2, Info } from 'lucide-react'
import { useSettingsStore } from '../store/useStore'
import { showToast } from '../components/ui/Toast'
import { useTranslation } from '../utils/translations'

const DashboardSettings = () => {
  const { theme, units, language, notifications, setTheme, setUnits, setLanguage, setNotifications } = useSettingsStore()
  const { t } = useTranslation(language)

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
        <h1 className="text-3xl font-bold text-white mb-2">{t('Settings')}</h1>
        <p className="text-white/60">{t('Customize your Skyphoria experience')}</p>
      </div>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t('Appearance')}</h2>
            <p className="text-sm text-white/60">{t('Customize how Skyphoria looks')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">{t('Theme')}</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateSetting('theme', 'dark')}
                className={`relative p-6 rounded-xl border-2 transition-all group ${
                  theme === 'dark'
                    ? 'border-bright-cyan bg-bright-cyan/10 shadow-lg shadow-bright-cyan/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {theme === 'dark' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-bright-cyan" />
                  </div>
                )}
                <Moon className={`w-8 h-8 mx-auto mb-3 ${theme === 'dark' ? 'text-bright-cyan' : 'text-white/70'}`} />
                <p className="text-base font-bold text-white mb-1">{t('Dark')}</p>
                <p className="text-xs text-white/60">{t('Better for low light')}</p>
              </button>
              <button
                onClick={() => updateSetting('theme', 'light')}
                className={`relative p-6 rounded-xl border-2 transition-all group ${
                  theme === 'light'
                    ? 'border-bright-cyan bg-bright-cyan/10 shadow-lg shadow-bright-cyan/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {theme === 'light' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-bright-cyan" />
                  </div>
                )}
                <Sun className={`w-8 h-8 mx-auto mb-3 ${theme === 'light' ? 'text-bright-cyan' : 'text-white/70'}`} />
                <p className="text-base font-bold text-white mb-1">{t('Light')}</p>
                <p className="text-xs text-white/60">{t('Coming soon...')}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateSetting('units', 'metric')}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  units === 'metric'
                    ? 'border-bright-cyan bg-bright-cyan/10 shadow-lg shadow-bright-cyan/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {units === 'metric' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-bright-cyan" />
                  </div>
                )}
                <Thermometer className={`w-8 h-8 mx-auto mb-3 ${units === 'metric' ? 'text-bright-cyan' : 'text-white/70'}`} />
                <p className="text-base font-bold text-white mb-1">Metric</p>
                <p className="text-xs text-white/60">°C, km, kg</p>
              </button>
              <button
                onClick={() => updateSetting('units', 'imperial')}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  units === 'imperial'
                    ? 'border-bright-cyan bg-bright-cyan/10 shadow-lg shadow-bright-cyan/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {units === 'imperial' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-bright-cyan" />
                  </div>
                )}
                <Thermometer className={`w-8 h-8 mx-auto mb-3 ${units === 'imperial' ? 'text-bright-cyan' : 'text-white/70'}`} />
                <p className="text-base font-bold text-white mb-1">Imperial</p>
                <p className="text-xs text-white/60">°F, mi, lb</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">Language</label>
            <select 
              value={language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white focus:outline-none focus:border-bright-cyan transition-colors cursor-pointer hover:bg-white/10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
                appearance: 'none'
              }}
            >
              <option value="en" className="bg-celestial text-white">🇺🇸 English</option>
              <option value="es" className="bg-celestial text-white">🇪🇸 Español</option>
              <option value="fr" className="bg-celestial text-white">🇫🇷 Français</option>
              <option value="de" className="bg-celestial text-white">🇩🇪 Deutsch</option>
              <option value="zh" className="bg-celestial text-white">🇨🇳 中文</option>
              <option value="ja" className="bg-celestial text-white">🇯🇵 日本語</option>
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
            { key: 'push', label: 'Push Notifications', description: 'Receive alerts in your browser', icon: Bell },
            { key: 'email', label: 'Email Notifications', description: 'Get updates via email', icon: Bell },
            { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts', icon: Volume2 },
          ].map((notif) => {
            const Icon = notif.icon
            return (
              <div key={notif.key} className="flex items-center justify-between glass-card p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notifications[notif.key] ? 'bg-bright-cyan/20' : 'bg-white/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${notifications[notif.key] ? 'text-bright-cyan' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{notif.label}</p>
                    <p className="text-sm text-white/60">{notif.description}</p>
                  </div>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => toggleNotification(notif.key)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications[notif.key] ? 'bg-bright-cyan' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications[notif.key] ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Current Settings Summary */}
      <Card className="border-2 border-bright-cyan/30">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-bright-cyan" />
          <h2 className="text-xl font-bold text-white">Current Settings</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <p className="text-xs text-white/60 mb-1">Theme</p>
            <p className="text-lg font-bold text-bright-cyan capitalize">{theme}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-white/60 mb-1">Units</p>
            <p className="text-lg font-bold text-bright-cyan capitalize">{units}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-white/60 mb-1">Language</p>
            <p className="text-lg font-bold text-bright-cyan">{language.toUpperCase()}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-white/60 mb-1">Notifications</p>
            <p className="text-lg font-bold text-bright-cyan">
              {Object.values(notifications).filter(Boolean).length}/{Object.keys(notifications).length}
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">About Skyphoria</h2>
        <div className="space-y-2 text-sm text-white/70">
          <p><strong className="text-white">Version:</strong> 2.0.0 (ML-Powered)</p>
          <p><strong className="text-white">Built for:</strong> NASA Space Apps Challenge 2025</p>
          <p><strong className="text-white">ML Models:</strong> LightGBM (PM2.5 & O3 Forecasting)</p>
          <p><strong className="text-white">Data Sources:</strong> NASA CAMS, Open-Meteo, NASA DONKI</p>
          <p><strong className="text-white">Training Data:</strong> 4 Years (2021-2025)</p>
          <p className="pt-4 border-t border-white/10 text-xs">
            Made with ❤️ for clean air. Powered by AI and committed to democratizing air quality information.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default DashboardSettings