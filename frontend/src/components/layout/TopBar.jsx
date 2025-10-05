import React, { useState } from 'react'
import { Search, MapPin, Calendar, Sun, Moon } from 'lucide-react'
import { DEFAULT_LOCATIONS } from '../../utils/constants'

const TopBar = ({ currentLocation, onLocationChange, sidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [theme, setTheme] = useState('dark')

  const filteredLocations = DEFAULT_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    // Theme toggle logic would go here
  }

  return (
    <header 
      className="fixed top-0 right-0 h-16 bg-celestial/95 backdrop-blur-lg border-b border-white/10 z-30 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '5rem' : '16rem' }}
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Location Selector */}
        <div className="relative flex-1 max-w-md">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <MapPin className="w-5 h-5 text-bright-cyan" />
            <span className="text-sm font-medium truncate">
              {currentLocation?.name || 'Select Location'}
            </span>
            <Search className="w-4 h-4 text-white/40 ml-auto" />
          </button>

          {/* Search Dropdown */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-celestial border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-2 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-bright-cyan"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      onLocationChange(location)
                      setShowSearch(false)
                      setSearchQuery('')
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-bright-cyan" />
                    <span className="text-sm">{location.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Date/Time */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
            <Calendar className="w-4 h-4 text-bright-cyan" />
            <span className="text-sm">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-bright-cyan" />
            ) : (
              <Moon className="w-5 h-5 text-bright-cyan" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar