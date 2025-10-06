import React, { useEffect, useState } from 'react'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'

const Hero = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0)
  const [livesProtected, setLivesProtected] = useState(125847)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Animate counter
    const interval = setInterval(() => {
      setLivesProtected(prev => prev + Math.floor(Math.random() * 5) + 1)
    }, 3000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  const parallaxOffset = scrollY * 0.5

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-bright-cyan/20 via-deep-space to-electric-blue/20 animate-gradient" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-bright-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-bright-cyan/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-6xl md:text-8xl font-black gradient-text mb-4">
            SKYPHORIA
          </h1>
          <p className="text-xl md:text-2xl text-bright-cyan/80 font-light tracking-wide">
            From EarthData to Action
          </p>
        </div>

        {/* Tagline */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Breathe Easy with AI-Powered
          <br />
          <span className="gradient-text">Air Quality Forecasts</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
          Integrating NASA TEMPO satellite data, ground sensors, and advanced ML to predict cleaner, safer skies for everyone
        </p>

        {/* Hero Statement */}
        <div className="glass-card inline-block px-8 py-4 mb-12 border-2 border-bright-cyan/30">
          <p className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-red-400">99%</span> of people worldwide breathe polluted air.
            <br className="hidden md:block" />
            <span className="gradient-text"> We're changing that.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="group"
          >
            Launch Dashboard
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.open('https://youtu.be/Y6A7qXDeTng?si=d89YufT00IMoC-Ka', '_blank')}
          >
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="glass-card p-4">
            <p className="text-bright-cyan text-3xl font-bold mb-1">
              {livesProtected.toLocaleString()}
            </p>
            <p className="text-white/60 text-sm">Lives Protected</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-bright-cyan text-3xl font-bold mb-1">72hrs</p>
            <p className="text-white/60 text-sm">Forecast Accuracy</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-bright-cyan text-3xl font-bold mb-1">24/7</p>
            <p className="text-white/60 text-sm">Real-time Monitoring</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <ChevronDown className="w-8 h-8 text-bright-cyan/60 mx-auto" />
        </div>
      </div>
    </div>
  )
}

export default Hero