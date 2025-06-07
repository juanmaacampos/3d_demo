import React from 'react'
import './Logo.css'

const Logo = ({ onLogoClick }) => {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick()
    }
  }

  return (
    <div className="logo-container" onClick={handleLogoClick}>
      <h1 className="logo-text">JMCDEV 3D TECHNICAL DEMO</h1>
    </div>
  )
}

export default Logo
