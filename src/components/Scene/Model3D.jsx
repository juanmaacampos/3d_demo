import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Model3D = ({ modelPath, currentSection = 0, ...props }) => {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()

  // Color palette for each section
  const sectionColors = [
    '#8b5cf6', // Purple - Who we are
    '#06b6d4', // Cyan - How we do it  
    '#10b981', // Emerald - Our work
    '#f59e0b'  // Amber - Contact
  ]

  useFrame((state) => {
    if (modelRef.current) {
      // Rotate the model
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.5
      
      // Float animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  // Clone the scene to avoid sharing materials between instances
  const clonedScene = scene.clone()

  return (
    <primitive 
      ref={modelRef}
      object={clonedScene} 
      scale={1.5}
      {...props}
    />
  )
}

// Preload the model for better performance
useGLTF.preload('/models/your-model.glb')

export default Model3D
