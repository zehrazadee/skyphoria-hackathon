import React from 'react'
import { getAQICategory } from '../../utils/constants'
import clsx from 'clsx'

const AQIBadge = ({ aqi, showLabel = true, size = 'md', className = '' }) => {
  const category = getAQICategory(aqi)
  
  const sizes = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-3',
    xl: 'text-2xl px-6 py-4',
  }
  
  return (
    <div
      className={clsx(
        'rounded-full font-bold inline-flex items-center justify-center',
        sizes[size],
        className
      )}
      style={{ backgroundColor: category.color, color: '#000' }}
    >
      {showLabel ? category.name : aqi}
    </div>
  )
}

export default AQIBadge