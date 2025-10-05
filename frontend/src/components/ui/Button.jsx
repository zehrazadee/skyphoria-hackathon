import React from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-bright-cyan to-electric-blue text-white hover:shadow-lg hover:shadow-bright-cyan/50 hover:scale-105',
    secondary: 'border-2 border-bright-cyan text-bright-cyan hover:bg-bright-cyan hover:text-deep-space',
    tertiary: 'text-bright-cyan hover:underline',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button