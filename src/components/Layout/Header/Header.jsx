import React from 'react'
import Logo from '../Logo/Logo'
import './Header.css'

const Header = ({ onLogoClick }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Logo onLogoClick={onLogoClick} />
      </div>
    </header>
  )
}

export default Header
