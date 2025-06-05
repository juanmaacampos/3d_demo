import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

const InteractiveCube = ({ currentSection = 0, totalSections = 4 }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  const geometryRef = useRef()
  const groupRef = useRef()
  const [targetColor, setTargetColor] = useState('#ff2c41') // Start with red
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0, z: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentGeometry, setCurrentGeometry] = useState(0)
  const [isCustomModel, setIsCustomModel] = useState(true) // Always true now
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(null)

  // Get base URL for assets
  const baseUrl = import.meta.env.BASE_URL || '/'
  console.log('Base URL:', baseUrl)
  
  // Load custom GLTF models - these hooks must be called unconditionally
  const logoModelUrl = `${baseUrl}models/elevtober_logo.gltf`
  const logoWordModelUrl = `${baseUrl}models/Elevtober_Logo_Word_0605034416_generate.gltf`
  
  console.log('Loading models from:', { logoModelUrl, logoWordModelUrl })
  
  let logoGLTF, logoWordGLTF, logoModel, logoWordModel
  let hasLoadingErrors = false
  
  try {
    logoGLTF = useGLTF(logoModelUrl)
    logoModel = logoGLTF?.scene
  } catch (error) {
    console.error('Failed to load logo model:', error)
    hasLoadingErrors = true
  }
  
  try {
    logoWordGLTF = useGLTF(logoWordModelUrl)
    logoWordModel = logoWordGLTF?.scene
  } catch (error) {
    console.error('Failed to load logo word model:', error)
    hasLoadingErrors = true
  }

  // Check if models are loaded
  useEffect(() => {
    console.log('Model loading status:', {
      logoModel: !!logoModel,
      logoWordModel: !!logoWordModel,
      hasLoadingErrors,
      baseUrl,
      logoModelUrl,
      logoWordModelUrl
    })
    
    if (hasLoadingErrors) {
      console.warn('Some models failed to load, using fallback')
      setLoadingError('Model loading failed')
      setModelsLoaded(false)
    } else if (logoModel && logoWordModel) {
      console.log('All models loaded successfully')
      setModelsLoaded(true)
      setLoadingError(null)
    } else {
      console.warn('Models not yet loaded or missing')
      setModelsLoaded(false)
    }
  }, [logoModel, logoWordModel, hasLoadingErrors, baseUrl, logoModelUrl, logoWordModelUrl])

  // Function to apply color to GLTF model materials
  const applyColorToModel = (model, color, isWhiteSection = false) => {
    if (!model) return
    
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        // Handle both single materials and material arrays
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        
        materials.forEach((material) => {
          if (material.isMeshStandardMaterial || material.isMeshBasicMaterial) {
            material.color.set(color)
            
            if (isWhiteSection) {
              // White sections with red accents
              material.emissive.set(redAccent)
              material.emissiveIntensity = 0.15
              material.roughness = 0.1
              material.metalness = 0.9
            } else {
              // Red sections
              material.emissive.set(color)
              material.emissiveIntensity = 0.1
              material.roughness = 0.2
              material.metalness = 0.7
            }
            material.needsUpdate = true
          }
        })
      }
    })
  }

  // Color palette for each section (4 sections)
  // Sections 1&3: Red, Sections 2&4: White with red accents
  const sectionColors = [
    '#ff2c41', // Red - Section 1 (Logo)
    '#ffffff', // White - Section 2 (Logo Word)  
    '#ff2c41', // Red - Section 3 (Logo)
    '#ffffff'  // White - Section 4 (Logo Word)
  ]

  // Accent color for white sections
  const redAccent = '#ff2c41'

  // Geometry configurations for each section (4 sections alternating between logos)
  const geometryConfigs = [
    { type: 'customModel', model: logoModel, name: 'logo' }, // Section 1 - Logo
    { type: 'customModel', model: logoWordModel, name: 'logoWord' }, // Section 2 - Logo Word
    { type: 'customModel', model: logoModel, name: 'logo' }, // Section 3 - Logo
    { type: 'customModel', model: logoWordModel, name: 'logoWord' } // Section 4 - Logo Word
  ]

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Update color and geometry when section changes
  useEffect(() => {
    const newColor = sectionColors[currentSection % sectionColors.length]
    const isWhiteSection = newColor === '#ffffff'
    setTargetColor(newColor)
    
    const currentConfig = geometryConfigs[currentSection % geometryConfigs.length]
    const shouldUseCustomModel = currentConfig.type === 'customModel'

    // Animate color transition
    if (shouldUseCustomModel && currentConfig.model) {
      // Apply color to custom model (always custom now)
      applyColorToModel(currentConfig.model, newColor, isWhiteSection)
    }

    // Geometry/Model transformation with smooth transition
    if (currentSection !== currentGeometry) {
      // Scale down current object
      const targetRef = groupRef // Always using groupRef now since all are custom models
      if (targetRef.current) {
        gsap.to(targetRef.current.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            // Always using custom models now
            setIsCustomModel(true)
            setCurrentGeometry(currentSection)
            
            // Scale back up with bounce effect
            if (targetRef.current) {
              gsap.to(targetRef.current.scale, {
                x: 2.0,
                y: 2.0,
                z: 2.0,
                duration: 0.6,
                ease: "back.out(1.7)"
              })
            }
          }
        })
      }
    }

    // Add rotation animation when section changes
    if (groupRef.current) {
      const rotationAmount = Math.PI * 2 // Full rotation
      
      gsap.to(currentRotation, {
        x: currentRotation.x + rotationAmount,
        y: currentRotation.y + rotationAmount * 0.5,
        z: currentRotation.z + rotationAmount * 0.3,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => setCurrentRotation({...currentRotation})
      })
    }
  }, [currentSection])

  // Apply color to models when they load
  useEffect(() => {
    const currentConfig = geometryConfigs[currentSection % geometryConfigs.length]
    const currentColor = sectionColors[currentSection % sectionColors.length]
    const isWhiteSection = currentColor === '#ffffff'
    
    if (currentConfig.model) {
      applyColorToModel(currentConfig.model, currentColor, isWhiteSection)
    }
  }, [logoModel, logoWordModel, currentSection])

  useFrame((state) => {
    const targetRef = groupRef // Always using groupRef now since all are custom models
    if (!targetRef.current) return

    // Base floating animation
    const time = state.clock.elapsedTime
    targetRef.current.position.y = Math.sin(time * 0.8) * 0.3
    
    // Mouse parallax effect on rotation
    const targetRotationX = currentRotation.x + mousePosition.y * 0.8 + Math.sin(time * 0.5) * 0.1
    const targetRotationY = currentRotation.y + mousePosition.x * 0.8 + time * 0.2
    const targetRotationZ = currentRotation.z + Math.cos(time * 0.3) * 0.1
    
    // Smooth interpolation for mouse effects
    targetRef.current.rotation.x = THREE.MathUtils.lerp(targetRef.current.rotation.x, targetRotationX, 0.1)
    targetRef.current.rotation.y = THREE.MathUtils.lerp(targetRef.current.rotation.y, targetRotationY, 0.1)
    targetRef.current.rotation.z = THREE.MathUtils.lerp(targetRef.current.rotation.z, targetRotationZ, 0.1)

    // Mouse parallax effect on position
    targetRef.current.position.x = mousePosition.x * 0.5
    targetRef.current.position.z = mousePosition.y * 0.3
  })

  return (
    <>
      {/* Loading fallback or error state */}
      {!modelsLoaded && (
        <group ref={groupRef} scale={[2.0, 2.0, 2.0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={targetColor} 
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        </group>
      )}

      {/* Custom 3D models - alternating between logo and logo word */}
      {modelsLoaded && (() => {
        const currentConfig = geometryConfigs[currentSection % geometryConfigs.length]
        const currentModel = currentConfig.model
        const currentColor = sectionColors[currentSection % sectionColors.length]
        const isWhiteSection = currentColor === '#ffffff'
        
        return currentModel ? (
          <group ref={groupRef} scale={[2.0, 2.0, 2.0]} castShadow receiveShadow>
            <primitive 
              object={currentModel.clone()} 
              onUpdate={(self) => {
                // Ensure color is applied after model loads
                applyColorToModel(self, currentColor, isWhiteSection)
              }}
            />
          </group>
        ) : (
          // Fallback cube if model fails to load
          <group ref={groupRef} scale={[2.0, 2.0, 2.0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={currentColor} 
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>
          </group>
        )
      })()}
    </>
  )
}

export default InteractiveCube
