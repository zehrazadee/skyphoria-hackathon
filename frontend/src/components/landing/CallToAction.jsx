import React from 'react'
import { ArrowRight, Download, Github, FileText } from 'lucide-react'
import Button from '../ui/Button'

const CallToAction = ({ onGetStarted }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-bright-cyan/10 via-transparent to-electric-blue/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-bright-cyan/20 to-electric-blue/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Header */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to <span className="gradient-text">Breathe Easy?</span>
        </h2>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Join thousands taking control of their air quality
        </p>

        {/* Primary CTA */}
        <div className="mb-12">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="text-xl px-12 py-6 group shadow-2xl shadow-bright-cyan/30"
          >
            Launch Dashboard Now
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
          <p className="text-sm text-white/50 mt-4">
            Free to use • No signup required • Instant access
          </p>
        </div>

        {/* Secondary Options */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="ghost" size="sm">
            <FileText className="mr-2 w-4 h-4" />
            API Documentation
          </Button>
          <Button variant="ghost" size="sm">
            <Github className="mr-2 w-4 h-4" />
            View on GitHub
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 w-4 h-4" />
            Download Press Kit
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold gradient-text">24/7</p>
              <p className="text-sm text-white/60">Real-time coverage</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">72h</p>
              <p className="text-sm text-white/60">Forecast horizon</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">95%+</p>
              <p className="text-sm text-white/60">Accuracy rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">Free</p>
              <p className="text-sm text-white/60">Always accessible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction