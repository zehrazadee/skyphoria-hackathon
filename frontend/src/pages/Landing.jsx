import React from 'react'
import Hero from '../components/landing/Hero'
import Problem from '../components/landing/Problem'
import Solution from '../components/landing/Solution'
import Technology from '../components/landing/Technology'
import CallToAction from '../components/landing/CallToAction'
import Footer from '../components/landing/Footer'

const Landing = ({ onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen bg-deep-space">
      <Hero onGetStarted={onNavigateToDashboard} />
      <Problem />
      <Solution />
      <Technology />
      <CallToAction onGetStarted={onNavigateToDashboard} />
      <Footer />
    </div>
  )
}

export default Landing