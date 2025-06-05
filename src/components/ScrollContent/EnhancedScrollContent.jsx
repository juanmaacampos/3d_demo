import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import SimpleScrollIndicator from '../UI/SimpleScrollIndicator'
import './EnhancedScrollContent.css'

const EnhancedScrollContent = ({ onSectionChange }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef()
  const contentRef = useRef()
  const scrollPosition = useRef(0)
  const targetPosition = useRef(0)

  const sections = [
    { title: "Who we are", subtitle: "Get to know us", color: "#ff2c41" }, // Red - matches logo model
    { title: "How we do it", subtitle: "See how we work", color: "#ffffff" }, // White - matches logo word model
    { title: "Our work", subtitle: "Take a look at it", color: "#ff2c41" }, // Red - matches logo model
    { title: "Contact", subtitle: "We are ready to help you", color: "#ffffff" }, // White - matches logo word model
  ]

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smooth scroll animation
  useEffect(() => {
    let animationId

    const animate = () => {
      if (!contentRef.current) return

      const ease = 0.08
      const distance = targetPosition.current - scrollPosition.current

      if (Math.abs(distance) > 0.01) {
        scrollPosition.current += distance * ease
        
        gsap.set(contentRef.current, {
          x: scrollPosition.current
        })

        // Calculate current section
        const sectionWidth = window.innerWidth
        const newSection = Math.max(0, Math.min(
          sections.length - 1,
          Math.round(Math.abs(scrollPosition.current) / sectionWidth)
        ))
        
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
          onSectionChange?.(newSection)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [currentSection, onSectionChange])

  // Handle wheel events for horizontal scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      
      const sectionWidth = window.innerWidth
      
      // Determine scroll direction and amount
      const scrollAmount = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const direction = scrollAmount > 0 ? -1 : 1
      
      // Move to next/previous section
      const newTargetSection = Math.max(0, Math.min(sections.length - 1, 
        currentSection - direction
      ))
      
      targetPosition.current = -newTargetSection * sectionWidth
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      
      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [currentSection, sections.length])

  return (
    <div 
      ref={containerRef}
      className="enhanced-scroll-container"
    >
      <div 
        ref={contentRef}
        className="enhanced-scroll-content"
      >
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="enhanced-scroll-section"
            style={{
              background: `radial-gradient(circle at center, ${section.color}15 0%, transparent 70%)`
            }}
          >
            <div 
              className="enhanced-section-content"
              style={{
                transform: `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 10}px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
              }}
            >
              <h1 
                className={`enhanced-section-title ${index === currentSection ? 'active' : ''}`}
                style={{ 
                  color: section.color,
                  transform: `translateZ(${index === currentSection ? 50 : 0}px) scale(${index === currentSection ? 1 : 0.8})`
                }}
              >
                {section.title}
              </h1>
              <p 
                className="enhanced-section-subtitle"
                style={{
                  transform: `translateX(${mousePosition.x * 15}px) translateY(${mousePosition.y * 8}px)`
                }}
              >
                {section.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Simple Navigation indicators */}
      <SimpleScrollIndicator
        currentSection={currentSection}
        totalSections={sections.length}
        sections={sections}
        onSectionClick={(sectionIndex) => {
          targetPosition.current = -sectionIndex * window.innerWidth
        }}
      />
    </div>
  )
}

export default EnhancedScrollContent
