import React from 'react'
import Card from './Card'
import * as Icons from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'bright-cyan',
  className = '' 
}) => {
  const Icon = icon ? Icons[icon] : null
  const TrendIcon = trend?.icon ? Icons[trend.icon] : null
  
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-white/70">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 ${trend.color}`}>
              {TrendIcon && <TrendIcon className="w-4 h-4" />}
              <span className="text-sm">{trend.text}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard