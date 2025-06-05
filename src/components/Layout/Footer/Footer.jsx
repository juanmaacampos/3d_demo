import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          This website is a TECHNICAL DEMO {' '}
          <a href="https://jmcdev.site/" className="footer-link" target='blank'>
            Crafted by JMCDEV
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
