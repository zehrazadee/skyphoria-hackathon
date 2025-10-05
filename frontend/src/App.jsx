import React, { Suspense, lazy, useState, useEffect } from 'react'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Loading from './components/ui/Loading'
import ToastContainer from './components/ui/Toast'

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isLoading, setIsLoading] = useState(false)

  const navigateToDashboard = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage('dashboard')
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const navigateToLanding = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage('landing')
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  // Preload dashboard when user is on landing page
  useEffect(() => {
    if (currentPage === 'landing') {
      const timer = setTimeout(() => {
        import('./pages/Dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-deep-space text-white">
        <ToastContainer />
        
        <Suspense fallback={<Loading fullScreen message="Loading Skyphoria..." />}>
          {isLoading ? (
            <Loading fullScreen message="Navigating..." />
          ) : currentPage === 'landing' ? (
            <Landing onNavigateToDashboard={navigateToDashboard} />
          ) : (
            <Dashboard onNavigateToLanding={navigateToLanding} />
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App