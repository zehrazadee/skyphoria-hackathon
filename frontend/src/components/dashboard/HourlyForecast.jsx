import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import Card from '../ui/Card'
import { formatTime } from '../../utils/helpers'
import { getAQICategory } from '../../utils/constants'
import Loading from '../ui/Loading'

const HourlyForecast = ({ data, isLoading }) => {
  if (isLoading) return <Loading message="Loading forecast..." />
  if (!data?.forecast) return null

  const next24Hours = data.forecast.slice(0, 24)

  const chartData = next24Hours.map(item => ({
    time: formatTime(item.timestamp, 'ha'),
    aqi: item.aqi,
    temp: item.temperature,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const category = getAQICategory(payload[0].value)
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="text-sm font-semibold text-white mb-1">
            {payload[0].payload.time}
          </p>
          <p className="text-xs mb-1" style={{ color: category.color }}>
            AQI: {payload[0].value}
          </p>
          <p className="text-xs text-white/70">
            {payload[1].value}°C
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Next 24 Hours</h2>
          <p className="text-sm text-white/60">Hourly AQI Forecast</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Confidence</p>
          <p className="text-lg font-bold text-bright-cyan">
            {(data.forecast[0]?.confidence * 100 || 90).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{ value: 'AQI', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke="#00D9FF" 
              strokeWidth={3}
              fill="url(#aqiGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-white/60 mb-1">Best Hour</p>
          <p className="text-lg font-bold text-green-400">
            {chartData.reduce((min, item) => item.aqi < min.aqi ? item : min).time}
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-white/60 mb-1">Peak AQI</p>
          <p className="text-lg font-bold text-orange-400">
            {Math.max(...chartData.map(d => d.aqi))}
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-white/60 mb-1">Avg AQI</p>
          <p className="text-lg font-bold text-bright-cyan">
            {Math.round(chartData.reduce((sum, d) => sum + d.aqi, 0) / chartData.length)}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default HourlyForecast