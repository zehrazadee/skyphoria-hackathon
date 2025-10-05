import React, { useState } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const navigateToDashboard = () => {
    setCurrentPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToLanding = () => {
    setCurrentPage('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-deep-space text-white">
      {currentPage === 'landing' ? (
        <Landing onNavigateToDashboard={navigateToDashboard} />
      ) : (
        <Dashboard onNavigateToLanding={navigateToLanding} />
      )}
    </div>
  )
}

export default App