import { useEffect, useState } from 'react'
import './ScrollProgressBar.css'

const ScrollProgressBar = ({ currentSection, totalSections, sections, onSectionClick }) => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Calculate progress percentage based on current section
    const progressPercentage = (currentSection / (totalSections - 1)) * 100
    setProgress(progressPercentage)
  }, [currentSection, totalSections])

  const currentColor = sections[currentSection]?.color || '#8b5cf6'

  return (
    <div className="scroll-progress-container">
      <div className="scroll-progress-track">
        <div 
          className="scroll-progress-fill"
          style={{
            height: `${progress}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 10px ${currentColor}40`
          }}
        />
      </div>
    </div>
  )
}

export default ScrollProgressBar
