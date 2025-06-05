import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './ExploreMenu.css'

const ExploreMenu = ({ isVisible, onClose, onSectionSelect }) => {
  const menuRef = useRef(null)
  const itemsRef = useRef([])
  const titleRef = useRef(null)
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    { id: 'home', label: 'WHO WE ARE', description: 'Get to know our team and vision' },
    { id: 'services', label: 'HOW WE DO IT', description: 'Our process and methodology' },
    { id: 'portfolio', label: 'OUR WORK', description: 'Amazing projects we have created' },
    { id: 'contact', label: 'CONTACT', description: 'Let us start your project' }
  ]

  const headerTexts = {
    home: '1/4 - GET TO KNOW',
    services: '2/4 - SEE',
    portfolio: '3/4 - TAKE A LOOK AT',
    contact: '4/4 - IM READY TO',
    default: '1/4 - GET TO KNOW'
  }

  useEffect(() => {
    if (isVisible) {
      // Add visible class for CSS transition
      menuRef.current?.classList.add('visible')
      
      // Check if refs are available before animating
      if (!titleRef.current || itemsRef.current.length === 0) return
      
      // Animate content in from right
      gsap.set(itemsRef.current.filter(Boolean), { x: 30, opacity: 0 })
      gsap.set(titleRef.current, { x: 30, opacity: 0 })

      const tl = gsap.timeline({ delay: 0.2 })
      
      tl.to(titleRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to(itemsRef.current.filter(Boolean), {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3')

      return () => tl.kill()
    } else {
      // Remove visible class
      menuRef.current?.classList.remove('visible')
      
      // Reset content position only if refs exist
      if (titleRef.current || itemsRef.current.some(Boolean)) {
        gsap.set([titleRef.current, ...itemsRef.current.filter(Boolean)], { x: 30, opacity: 0 })
      }
    }
  }, [isVisible])

  const handleItemClick = (itemId) => {
    onSectionSelect(itemId)
    onClose()
  }

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId)
  }

  const handleItemLeave = () => {
    setHoveredItem(null)
  }

  if (!isVisible) return null

  return (
    <div 
      ref={menuRef}
      className="explore-menu-overlay"
    >
      <div className="explore-menu">
        <div ref={titleRef} className="explore-menu-header">
          <span className="explore-menu-number">
            {hoveredItem ? headerTexts[hoveredItem] : headerTexts.default}
          </span>
        </div>
        <nav className="explore-menu-nav">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              ref={el => itemsRef.current[index] = el}
              className="explore-menu-item"
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => handleItemHover(item.id)}
              onMouseLeave={handleItemLeave}
            >
              <h3 className="explore-menu-item-label">{item.label}</h3>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default ExploreMenu
