import React from 'react'
import clsx from 'clsx'

const Card = ({ 
  children, 
  variant = 'glass', 
  className = '',
  hover = false,
  ...props 
}) => {
  const variants = {
    glass: 'glass-card',
    solid: 'bg-celestial border border-white/10 rounded-xl',
    elevated: 'bg-celestial/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl',
  }
  
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''
  
  return (
    <div
      className={clsx(
        'p-6',
        variants[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card