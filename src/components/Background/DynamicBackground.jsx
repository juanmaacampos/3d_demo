import { useEffect, useState, useRef } from 'react'
import './DynamicBackground.css'

const DynamicBackground = ({ currentSection, scrollProgress = 0 }) => {
  const [backgroundClass, setBackgroundClass] = useState('')
  const backgroundRef = useRef()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Define background colors based on section
  // Sections 0,2 (logo sections) - red title/model -> white background
  // Sections 1,3 (logo word sections) - white title/model -> red background
  const getBackgroundStyle = (section) => {
    switch (section) {
      case 0: // Logo section - red title/model
      case 2: // Logo section - red title/model
        return 'white-background'
      case 1: // Logo word section - white title/model
      case 3: // Logo word section - white title/model
        return 'red-background'
      default:
        return 'white-background'
    }
  }

  // Smooth color interpolation based on scroll progress
  const getInterpolatedColors = (progress) => {
    const section = Math.floor(progress * 4) // 4 sections
    const sectionProgress = (progress * 4) % 1 // Progress within current section
    
    // Define color stops for smooth transitions
    const colorStops = [
      { bg: 'rgba(255, 255, 255, 1)', accent: 'rgba(255, 44, 65, 0.1)' }, // White bg, red accent
      { bg: 'rgba(255, 44, 65, 1)', accent: 'rgba(255, 255, 255, 0.1)' }, // Red bg, white accent
      { bg: 'rgba(255, 255, 255, 1)', accent: 'rgba(255, 44, 65, 0.1)' }, // White bg, red accent
      { bg: 'rgba(255, 44, 65, 1)', accent: 'rgba(255, 255, 255, 0.1)' }  // Red bg, white accent
    ]
    
    const currentStop = colorStops[section] || colorStops[0]
    const nextStop = colorStops[(section + 1) % colorStops.length]
    
    // Interpolate between current and next color
    return {
      current: currentStop,
      next: nextStop,
      progress: sectionProgress
    }
  }

  useEffect(() => {
    const newBackgroundClass = getBackgroundStyle(currentSection)
    
    if (newBackgroundClass !== backgroundClass) {
      setIsTransitioning(true)
      
      // Smooth transition with a slight delay
      setTimeout(() => {
        setBackgroundClass(newBackgroundClass)
        
        setTimeout(() => {
          setIsTransitioning(false)
        }, 400)
      }, 100)
    }
  }, [currentSection, backgroundClass])

  // Apply smooth color transitions based on scroll progress
  useEffect(() => {
    if (backgroundRef.current) {
      const colors = getInterpolatedColors(scrollProgress)
      const element = backgroundRef.current
      
      // Apply CSS custom properties for smooth color interpolation
      element.style.setProperty('--bg-color', colors.current.bg)
      element.style.setProperty('--accent-color', colors.current.accent)
      element.style.setProperty('--transition-progress', colors.progress)
    }
  }, [scrollProgress])

  return (
    <div 
      ref={backgroundRef}
      className={`dynamic-background ${backgroundClass} ${isTransitioning ? 'transitioning' : ''}`}
    >
      {/* Modern 3D geometric patterns */}
      <div className="geometric-layer">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
        <div className="geometric-shape shape-5"></div>
        <div className="geometric-shape shape-6"></div>
      </div>
      
      {/* Smooth gradient overlay with color interpolation */}
      <div className="gradient-overlay"></div>
      
      {/* Optimized simple pattern */}
      <div className="simple-pattern">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="pattern-element" 
            style={{
              '--delay': `${i * 0.3}s`,
              '--x': `${20 + (i % 4) * 20}%`,
              '--y': `${20 + Math.floor(i / 4) * 40}%`,
            }}
          />
        ))}
      </div>
      
      {/* Animated particles */}
      <div className="particles-layer">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              '--delay': `${i * 0.2}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${Math.random() * 4 + 2}px`
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default DynamicBackground