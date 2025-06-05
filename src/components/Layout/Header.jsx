import { useState } from 'react'
import './Header.css'

const Header = () => {
  const [showAbout, setShowAbout] = useState(false)

  const handleAboutClick = () => {
    setShowAbout(true)
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setShowAbout(false)
    }, 4000)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Elevtober TECHNICAL DEMO Beta 3D</h1>
        </div>
        
        <nav className="nav">
          <button className="nav-button" onClick={handleAboutClick}>
            About
          </button>
          
          {/* About Message Modal */}
          {showAbout && (
            <div className="about-modal">
              <div className="about-content">
                <h3>🚀 Demo Técnica 3D</h3>
                <p>
                  Esta es una <strong>versión de prueba 3D</strong> diseñada para demostrar 
                  nuestra capacidad tecnica de crear páginas web interactivas con tecnología 3D y muchos mas efectos (Ademas de modelos 3d personalizados). No tomar como referencia final, ES UNA DEMO TECNICA!
                </p>
                <small>JMCDEV: Experiencias Digitales</small>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
