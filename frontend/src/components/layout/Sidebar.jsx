import React from 'react'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  CloudRain, 
  MapPin, 
  Bell, 
  Settings,
  ChevronLeft,
  LogOut
} from 'lucide-react'
import clsx from 'clsx'

const Sidebar = ({ currentPage, onPageChange, onNavigateToLanding, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: MapIcon },
    { id: 'forecasts', label: 'Forecasts', icon: CloudRain },
    { id: 'locations', label: 'My Locations', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside 
      className={clsx(
        'fixed left-0 top-0 h-full bg-celestial/95 backdrop-blur-lg border-r border-white/10 transition-all duration-300 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h1 className="text-2xl font-black gradient-text">SKYPHORIA</h1>
            )}
            {isCollapsed && (
              <h1 className="text-2xl font-black gradient-text">S</h1>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft 
                className={clsx(
                  'w-5 h-5 text-white/60 transition-transform',
                  isCollapsed && 'rotate-180'
                )} 
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-bright-cyan to-electric-blue text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateToLanding}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Back to Home</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar