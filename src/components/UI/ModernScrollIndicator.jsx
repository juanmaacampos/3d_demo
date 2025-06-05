import { useEffect, useState } from 'react'
import './ModernScrollIndicator.css'

const ModernScrollIndicator = ({ currentSection, totalSections, sections, onSectionClick }) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    
    // Calculate smooth progress within current section
    const baseProgress = (currentSection / (totalSections - 1)) * 100
    setScrollProgress(baseProgress)
    
    return () => clearTimeout(timer)
  }, [currentSection, totalSections])

  const currentColor = sections[currentSection]?.color || '#8b5cf6'
  const nextColor = sections[currentSection + 1]?.color || currentColor

  return (
    <div className="modern-scroll-indicator">
      {/* Main progress line */}
      <div className="progress-line-container">
        <div className="progress-line-background" />
        
        {/* Animated progress fill */}
        <div 
          className={`progress-line-fill ${isAnimating ? 'animating' : ''}`}
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${currentColor} 0%, ${nextColor} 100%)`,
            boxShadow: `
              0 0 20px ${currentColor}60,
              0 0 40px ${currentColor}30,
              0 2px 10px ${currentColor}40
            `
          }}
        >
          {/* Glowing tip */}
          <div 
            className="progress-tip"
            style={{
              backgroundColor: currentColor,
              boxShadow: `
                0 0 15px ${currentColor}80,
                0 0 30px ${currentColor}50,
                0 0 45px ${currentColor}30
              `
            }}
          />
        </div>

        {/* Section dots */}
        <div className="section-dots">
          {sections.map((section, index) => {
            const isActive = index === currentSection
            const isPassed = index < currentSection
            
            return (
              <button
                key={index}
                className={`section-dot ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                style={{
                  left: `${(index / (totalSections - 1)) * 100}%`,
                  backgroundColor: isPassed || isActive ? section.color : 'rgba(255, 255, 255, 0.2)',
                  borderColor: section.color,
                  boxShadow: isActive ? `0 0 15px ${section.color}60, 0 0 30px ${section.color}30` : 'none'
                }}
                onClick={() => onSectionClick(index)}
                aria-label={`Navigate to ${section.title}`}
              >
                {isActive && (
                  <div 
                    className="dot-pulse"
                    style={{ backgroundColor: section.color }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Modern section info */}
      <div className="section-info-modern">
        <div className="section-counter-modern">
          <span 
            className="current-number"
            style={{ color: currentColor }}
          >
            {String(currentSection + 1).padStart(2, '0')}
          </span>
          <span className="separator">/</span>
          <span className="total-number">
            {String(totalSections).padStart(2, '0')}
          </span>
        </div>
        
        <div className="section-title-modern">
          <h3 
            className="title-text"
            style={{ 
              color: currentColor,
              textShadow: `0 0 20px ${currentColor}40`
            }}
          >
            {sections[currentSection]?.title}
          </h3>
          <div 
            className="title-underline"
            style={{ 
              backgroundColor: currentColor,
              boxShadow: `0 0 10px ${currentColor}60`
            }}
          />
        </div>
      </div>

      {/* Floating progress percentage */}
      <div className="progress-percentage">
        <span 
          style={{ 
            color: currentColor,
            textShadow: `0 0 10px ${currentColor}60`
          }}
        >
          {Math.round(scrollProgress)}%
        </span>
      </div>
    </div>
  )
}

export default ModernScrollIndicator
