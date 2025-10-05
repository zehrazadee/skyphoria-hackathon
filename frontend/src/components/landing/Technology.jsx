import React from 'react'
import { Database, Cloud, Cpu, Globe, Satellite } from 'lucide-react'
import Card from '../ui/Card'

const Technology = () => {
  const dataSources = [
    {
      name: 'NASA TEMPO',
      type: 'Primary Satellite',
      description: 'First space-based instrument monitoring air pollutants hourly across North America',
      pollutants: 'NO2, HCHO, O3',
      coverage: 'North America',
      icon: Satellite,
    },
    {
      name: 'Pandora Network',
      type: 'Ground Spectrometers',
      description: 'Global ground-based validation data for satellite observations',
      pollutants: 'Column amounts',
      coverage: '150+ stations',
      icon: Database,
    },
    {
      name: 'OpenAQ',
      type: 'Global Sensors',
      description: 'Open-source platform aggregating real-time data from thousands of stations',
      pollutants: 'PM2.5, O3, NO2, SO2',
      coverage: '15,000+ sensors',
      icon: Globe,
    },
  ]

  const techStack = [
    { category: 'Data Processing', items: ['Cloud Computing', 'Real-time Pipelines', 'Stream Processing'] },
    { category: 'Machine Learning', items: ['LSTM Networks', 'Random Forest', 'Ensemble Methods'] },
    { category: 'Visualization', items: ['React', 'Leaflet Maps', 'Recharts'] },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-celestial/50 to-deep-space">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powered by <span className="gradient-text">Cutting-Edge Technology</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Built on NASA's open data infrastructure and modern cloud architecture
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Trusted Data Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} hover className="group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <source.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{source.name}</h4>
                    <p className="text-sm text-bright-cyan">{source.type}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-4">{source.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">Pollutants:</span>
                    <span className="text-white/80">{source.pollutants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Coverage:</span>
                    <span className="text-white/80">{source.coverage}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Technology Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((stack, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-bright-cyan" />
                  <h4 className="text-lg font-semibold text-white">{stack.category}</h4>
                </div>
                <ul className="space-y-2">
                  {stack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-bright-cyan mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Data Flow Diagram */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 flex-wrap justify-center">
            {['Satellite', 'Ground Sensors', 'Cloud Processing', 'ML Forecasting', 'Your Device'].map((step, index) => (
              <React.Fragment key={step}>
                <div className="glass-card px-6 py-3">
                  <p className="text-sm font-semibold text-white">{step}</p>
                </div>
                {index < 4 && (
                  <div className="text-bright-cyan text-2xl">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Technology