import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-deep-space flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        
        <p className="text-white/70 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-left text-xs text-red-400 bg-red-500/10 p-4 rounded-lg mb-6 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button onClick={resetErrorBoundary}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log to error tracking service (e.g., Sentry)
        console.error('Error caught by boundary:', error, errorInfo)
      }}
      onReset={() => {
        // Reset app state if needed
        window.location.href = '/'
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary