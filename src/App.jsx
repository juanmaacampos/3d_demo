import React, { useState } from 'react'
import Scene3D from './components/Scene3D/Scene3D'
import Header from './components/Layout/Header/Header'
import HeroSection from './components/Layout/HeroSection/HeroSection'
import BackgroundEffects from './components/Layout/BackgroundEffects/BackgroundEffects'
import Footer from './components/Layout/Footer/Footer'
import ExploreMenu from './components/Layout/ExploreMenu/ExploreMenu.jsx'
import './styles/App.css'

function App() {
  const [isExploreMenuVisible, setIsExploreMenuVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')

  const handleExploreClick = () => {
    setIsExploreMenuVisible(true)
  }

  const handleMenuClose = () => {
    setIsExploreMenuVisible(false)
  }

  const handleSectionSelect = (sectionId) => {
    setCurrentSection(sectionId)
    setIsExploreMenuVisible(false)
    console.log('Selected section:', sectionId)
  }

  const handleLogoClick = () => {
    // Reset to initial state
    setIsExploreMenuVisible(false)
    setCurrentSection('home')
    console.log('Logo clicked - returning to initial state')
  }

  return (
    <div className={`app ${isExploreMenuVisible ? 'menu-open' : ''}`}>
      <BackgroundEffects />
      <Header onLogoClick={handleLogoClick} />
      <div className="main-content">
        <Scene3D />
        <HeroSection onExploreClick={handleExploreClick} />
      </div>
      <Footer />
      <ExploreMenu 
        isVisible={isExploreMenuVisible}
        onClose={handleMenuClose}
        onSectionSelect={handleSectionSelect}
      />
    </div>
  )
}

export default App
