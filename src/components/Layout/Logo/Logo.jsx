import React from 'react'
import './Logo.css'

const Logo = ({ onLogoClick }) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const logoUrl = `${baseUrl}models/logo_elevtober.png`
  const logoWordUrl = `${baseUrl}models/logo_word.png`

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick()
    }
  }

  return (
    <div className="logo-container" onClick={handleLogoClick}>
      <img 
        src={logoUrl} 
        alt="Elevtober Interactive Studio" 
        className="logo-image logo-image-main"
        onError={(e) => {
          console.error('Logo failed to load:', logoUrl)
          e.target.style.display = 'none'
        }}
      />
      <img 
        src={logoWordUrl} 
        alt="Elevtober Word Logo" 
        className="logo-image"
        onError={(e) => {
          console.error('Logo word failed to load:', logoWordUrl)
          e.target.style.display = 'none'
        }}
      />
 
    </div>
  )
}

export default Logo
