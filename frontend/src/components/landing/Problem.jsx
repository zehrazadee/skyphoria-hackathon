import React from 'react'
import { AlertTriangle, Users, Factory, Wind } from 'lucide-react'
import Card from '../ui/Card'

const Problem = () => {
  const statistics = [
    { value: '7M', label: 'Deaths Annually', description: 'WHO statistic from air pollution' },
    { value: '99%', label: 'Breathe Polluted Air', description: 'Global population affected' },
    { value: 'Millions', label: 'Lack Awareness', description: 'No access to AQ data' },
  ]

  const problems = [
    {
      icon: Factory,
      title: 'Industrial Emissions',
      description: 'Vehicle pollution and industrial processes release harmful pollutants daily',
    },
    {
      icon: Wind,
      title: 'Natural Disasters',
      description: 'Wildfires and dust storms create sudden air quality emergencies',
    },
    {
      icon: Users,
      title: 'Vulnerable Communities',
      description: 'Children, elderly, and those with health conditions face greatest risk',
    },
    {
      icon: AlertTriangle,
      title: 'Limited Monitoring',
      description: 'Inadequate real-time systems and poor data integration',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-deep-space to-celestial/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Global Air Quality <span className="gradient-text">Crisis</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Air pollution is one of the greatest threats to public health, yet millions lack access to real-time, actionable information.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <Card 
              key={index} 
              variant="elevated" 
              className="text-center transform hover:scale-105 transition-transform"
            >
              <div className="text-5xl md:text-6xl font-black gradient-text mb-3">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-white/60">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <Card 
              key={index} 
              hover
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <problem.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-white/70">{problem.description}</p>
            </Card>
          ))}
        </div>

        {/* Call-out Box */}
        <div className="mt-12 glass-card border-2 border-red-400/30 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg text-white leading-relaxed">
            <span className="font-bold">Communities near industrial zones, children, elderly, and those with respiratory conditions</span>
            {' '}face the greatest risk from air pollution.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Problem