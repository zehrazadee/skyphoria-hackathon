import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import DashboardOverview from './DashboardOverview'
import DashboardMap from './DashboardMap'
import DashboardForecasts from './DashboardForecasts'
import DashboardLocations from './DashboardLocations'
import DashboardAlerts from './DashboardAlerts'
import DashboardSettings from './DashboardSettings'
import { DEFAULT_LOCATIONS } from '../utils/constants'
import clsx from 'clsx'

const Dashboard = ({ onNavigateToLanding }) => {
  const [currentPage, setCurrentPage] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATIONS[0])

  const renderPage = () => {
    const props = { currentLocation, onLocationChange: setCurrentLocation }
    
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview {...props} />
      case 'map':
        return <DashboardMap {...props} />
      case 'forecasts':
        return <DashboardForecasts {...props} />
      case 'locations':
        return <DashboardLocations {...props} />
      case 'alerts':
        return <DashboardAlerts {...props} />
      case 'settings':
        return <DashboardSettings {...props} />
      default:
        return <DashboardOverview {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-deep-space">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onNavigateToLanding={onNavigateToLanding}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        {/* Top Bar */}
        <TopBar
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="pt-24 px-6 pb-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard