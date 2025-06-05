import { useEffect, useState } from 'react'
import './SimpleScrollIndicator.css'

const SimpleScrollIndicator = ({ currentSection, totalSections, sections, onSectionClick }) => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Calculate progress for the connecting line
    const progressPercentage = (currentSection / (totalSections - 1)) * 100
    setProgress(progressPercentage)
  }, [currentSection, totalSections])

  const currentColor = sections[currentSection]?.color || '#8b5cf6'

  return (
    <div className="simple-scroll-indicator">
      <div className="progress-line">
        {/* Background line */}
        <div className="line-background" />
        
        {/* Progress line that fills based on scroll */}
        <div 
          className="line-progress"
          style={{
            height: `${progress}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 8px ${currentColor}60`
          }}
        />
      </div>
    </div>
  )
}

export default SimpleScrollIndicator
