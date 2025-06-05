import React from 'react'
import Triangle3DBackground from './Triangle3DBackground'
import './BackgroundEffects.css'

const BackgroundEffects = () => {
  return (
    <div className="background-effects">
      {/* 3D Triangle Background */}
      <Triangle3DBackground />
      
      {/* Enhanced floating orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      
      {/* Animated particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      
      {/* Enhanced grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced gradient spots */}
      <div className="gradient-spot spot-1"></div>
      <div className="gradient-spot spot-2"></div>
      <div className="gradient-spot spot-3"></div>
      
      {/* Rotating rings */}
      <div className="rotating-ring ring-1"></div>
      <div className="rotating-ring ring-2"></div>
    </div>
  )
}

export default BackgroundEffects
