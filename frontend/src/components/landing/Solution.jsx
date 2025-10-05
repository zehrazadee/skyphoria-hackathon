import React from 'react'
import { Satellite, Brain, Bell, Zap, Map, TrendingUp } from 'lucide-react'
import Card from '../ui/Card'

const Solution = () => {
  const pillars = [
    {
      icon: Satellite,
      title: 'Real-Time Integration',
      subtitle: 'Multi-Source Data Fusion',
      description: 'Seamlessly integrating NASA TEMPO satellite observations, Pandora ground networks, OpenAQ sensors, and meteorological data into a unified prediction engine',
      features: ['Hourly satellite scans', 'Ground truth validation', 'Weather correlation', 'Multi-pollutant tracking'],
    },
    {
      icon: Brain,
      title: 'AI-Powered Forecasting',
      subtitle: 'Advanced ML Predictions',
      description: 'Our proprietary machine learning models analyze historical patterns, weather conditions, and emission sources to forecast air quality with unprecedented accuracy',
      features: ['72-hour forecasts', 'Confidence scoring', 'Pattern recognition', 'Adaptive learning'],
    },
    {
      icon: Bell,
      title: 'Proactive Alerts',
      subtitle: 'Smart Health Protection',
      description: 'Receive personalized notifications before air quality deteriorates, giving you time to adjust activities and protect your health',
      features: ['Custom thresholds', 'Multi-channel alerts', 'Location-based', 'Family protection'],
    },
  ]

  const features = [
    { icon: TrendingUp, text: '72-hour forecast accuracy' },
    { icon: Map, text: 'Hyperlocal predictions (street-level)' },
    { icon: Zap, text: 'Real-time satellite validation' },
    { icon: Satellite, text: 'Multi-pollutant tracking' },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet <span className="gradient-text">Skyphoria</span>
          </h2>
          <p className="text-2xl text-white/80 mb-4">
            Your Air Quality Guardian
          </p>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            We combine cutting-edge NASA satellite technology with ground sensors and machine learning to deliver hyper-accurate air quality forecasts up to 72 hours in advance.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <Card 
              key={index}
              variant="elevated"
              hover
              className="group relative overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-bright-cyan/0 to-electric-blue/0 group-hover:from-bright-cyan/10 group-hover:to-electric-blue/10 transition-all duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-bright-cyan text-sm font-semibold mb-4">
                  {pillar.subtitle}
                </p>

                {/* Description */}
                <p className="text-white/70 mb-6 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {pillar.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-bright-cyan mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Unique Features Grid */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            What Makes Us <span className="gradient-text">Different</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-bright-cyan/10 flex items-center justify-center group-hover:bg-bright-cyan/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-bright-cyan" />
                </div>
                <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution