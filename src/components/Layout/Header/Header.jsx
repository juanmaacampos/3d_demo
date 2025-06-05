import React from 'react'
import Logo from '../Logo/Logo'
import InfoButton from '../../UI/InfoButton'
import './Header.css'

const Header = ({ onLogoClick }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Logo onLogoClick={onLogoClick} />
        <InfoButton />
      </div>
    </header>
  )
}

export default Header
