import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-deep-space z-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-bright-cyan mx-auto mb-4" />
          <p className="text-lg text-white/70">{message}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-bright-cyan mx-auto mb-2" />
        <p className="text-sm text-white/70">{message}</p>
      </div>
    </div>
  )
}

export default Loading