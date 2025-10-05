import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

// Toast notification wrapper
export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(30, 58, 95, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#00E676',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#F44336',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}

// Toast helper functions
export const showToast = {
  success: (message) => {
    toast.custom((t) => (
      <div
        className={`glass-card p-4 flex items-center gap-3 border border-green-400/30 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-white font-medium">{message}</p>
      </div>
    ))
  },
  
  error: (message) => {
    toast.custom((t) => (
      <div
        className={`glass-card p-4 flex items-center gap-3 border border-red-400/30 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-white font-medium">{message}</p>
      </div>
    ))
  },
  
  warning: (message) => {
    toast.custom((t) => (
      <div
        className={`glass-card p-4 flex items-center gap-3 border border-orange-400/30 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
        <p className="text-white font-medium">{message}</p>
      </div>
    ))
  },
  
  info: (message) => {
    toast.custom((t) => (
      <div
        className={`glass-card p-4 flex items-center gap-3 border border-bright-cyan/30 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <Info className="w-5 h-5 text-bright-cyan flex-shrink-0" />
        <p className="text-white font-medium">{message}</p>
      </div>
    ))
  },
}

export default ToastContainer