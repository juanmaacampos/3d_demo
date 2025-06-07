import React, { useState } from 'react'
import Button from './Button'
import './InfoButton.css'

const InfoButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleCloseModal = (e) => {
    if (e.target.classList.contains('info-modal-overlay')) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button 
        className={`info-button ${isModalOpen ? 'info-button-hidden' : ''}`}
        onClick={handleToggleModal}
        variant="secondary"
        size="small"
        aria-label="Information about this website"
      >
        <span>INFO DEMO</span>
      </Button>

      {isModalOpen && (
        <div 
          className="info-modal-overlay"
          onClick={handleCloseModal}
        >
          <div className="info-modal">
            <button 
              className="info-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <div className="info-modal-content">
              <h3 className="info-modal-title">JMCDEV 3D TECHNICAL DEMO</h3>
              <p className="info-modal-description">
            Interactive 3D page to demonstrate how the use of modern web technologies serves to tell the story of your brand. 

              </p>
              <div className="info-modal-features">
                <span><strong>THIS DEMO SHOWS THE POSSIBLE MAIN PAGE DESIGN</strong></span>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Interactive 3D Custom 3D logo model</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Smooth animations and transitions</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💡</span>
                  <span>Based on <a href="https://ohzi.io" target="_blank" rel="noopener noreferrer">ohzi.io</a></span>
                </div>
                     <div className="feature-item">
                  <span className="feature-icon">⚙️</span>
                  <span>Optimized for mobile and desktop</span>
                </div>
              </div>
              <p className="info-modal-tech">
                Built with React, Three.js, GSAP & WebGL
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InfoButton
