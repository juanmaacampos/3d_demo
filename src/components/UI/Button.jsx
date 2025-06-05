import React from 'react'
import './Button.css'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${className}`.trim()

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="btn__text">{children}</span>
      <div className="btn__glow"></div>
    </button>
  )
}

export default Button
