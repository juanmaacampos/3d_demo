import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import DynamicBackground from './components/Background/DynamicBackground'
import Header from './components/Layout/Header'
import Scene from './components/Scene/Scene'
import Loader from './components/UI/Loader'
import EnhancedScrollContent from './components/ScrollContent/EnhancedScrollContent'
import './App.css'

function App() {
  const [currentSection, setCurrentSection] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const totalSections = 4

  const handleSectionChange = (newSection, progress = 0) => {
    setCurrentSection(newSection)
    setScrollProgress(progress)
  }

  return (
    <div className="app">
      <DynamicBackground 
        currentSection={currentSection} 
        scrollProgress={scrollProgress}
      />
      <Header />
      
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<Loader />}>
            <Scene 
              currentSection={currentSection} 
              totalSections={totalSections}
            />
          </Suspense>
        </Canvas>
      </div>

      <EnhancedScrollContent onSectionChange={handleSectionChange} />
    </div>
  )
}

export default App
