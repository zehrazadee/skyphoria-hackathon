import React from 'react'
import Card from '../ui/Card'
import { POLLUTANTS } from '../../utils/constants'
import { getTrendInfo } from '../../utils/helpers'
import * as Icons from 'lucide-react'
import Loading from '../ui/Loading'

const PollutantLevels = ({ data, isLoading }) => {
  if (isLoading) return <Loading message="Loading pollutant data..." />
  if (!data?.pollutants) return null

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">Pollutant Levels</h2>
      <div className="space-y-4">
        {Object.entries(data.pollutants).map(([key, pollutant]) => {
          const info = POLLUTANTS[key]
          const trend = getTrendInfo(pollutant.trend)
          const TrendIcon = trend?.icon ? Icons[trend.icon] : null
          const percentage = (pollutant.aqi / 500) * 100

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">{info?.name || key}</span>
                  <p className="text-xs text-white/50">{info?.fullName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {pollutant.value} {pollutant.unit}
                  </span>
                  {TrendIcon && (
                    <div className={`flex items-center gap-1 ${trend.color}`}>
                      <TrendIcon className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-bright-cyan to-electric-blue rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              
              <p className="text-xs text-white/50">{pollutant.description}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default PollutantLevels