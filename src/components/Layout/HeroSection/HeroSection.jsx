import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Button from '../../UI/Button'
import './HeroSection.css'

const HeroSection = ({ onExploreClick }) => {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const descriptionRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.fromTo(titleRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.7'
    )
    .fromTo(descriptionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(buttonRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )

    return () => tl.kill()
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          UNLEASH YOUR POTENTIAL
        </h1>
        
        <p ref={subtitleRef} className="hero-subtitle">
          AND TRANSFORM THE WORLD WITH US
        </p>
        
       
        
        <div ref={buttonRef} className="hero-button">
          <Button 
            variant="primary" 
            size="large"
            onClick={onExploreClick}
          >
            EXPLORE
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
