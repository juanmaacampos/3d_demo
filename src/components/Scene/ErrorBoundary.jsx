import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Scene Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#ff2c41',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h3>Error loading 3D content</h3>
          <p>Please refresh the page</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
