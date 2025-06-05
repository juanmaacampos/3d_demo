import { useGLTF } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

const MultiModel = ({ currentSection = 0, totalSections = 4 }) => {
  const modelRef = useRef()
  const [currentModel, setCurrentModel] = useState(0)

  // Array de modelos para cada sección
  const modelPaths = [
    '/models/model1.glb', // Who we are
    '/models/model2.glb', // How we do it
    '/models/model3.glb', // Our work
    '/models/model4.glb'  // Contact
  ]

  // Color palette for each section
  const sectionColors = [
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b'  // Amber
  ]

  // Load current model
  const { scene } = useGLTF(modelPaths[currentSection] || modelPaths[0])

  useEffect(() => {
    if (modelRef.current && currentSection !== currentModel) {
      // Animate model change
      gsap.to(modelRef.current.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentModel(currentSection)
          
          // Scale back up
          gsap.to(modelRef.current.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.5,
            ease: "back.out(1.7)"
          })
        }
      })

      // Change material color
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const newColor = new THREE.Color(sectionColors[currentSection])
          gsap.to(child.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            duration: 0.8
          })
        }
      })
    }
  }, [currentSection, scene, currentModel, sectionColors])

  useFrame((state) => {
    if (modelRef.current) {
      // Base rotation
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.4
      
      // Float animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3
    }
  })

  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      scale={1.5}
      castShadow
      receiveShadow
    />
  )
}

// Preload all models
const modelPaths = [
  '/models/model1.glb',
  '/models/model2.glb', 
  '/models/model3.glb',
  '/models/model4.glb'
]

modelPaths.forEach(path => {
  useGLTF.preload(path)
})

export default MultiModel
