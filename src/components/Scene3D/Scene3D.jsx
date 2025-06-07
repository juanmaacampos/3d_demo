import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'

// Floating Logo Component with energy cube
const FloatingLogo = () => {
  const meshRef = useRef()
  const innerEnergyRef = useRef()
  const coreRef = useRef()
  const edgesRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [baseRotation, setBaseRotation] = useState({ x: 0, y: 0, z: 0 })
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  const { gl } = useThree()

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (meshRef.current) {
      // Calculate final rotation
      let finalRotationX, finalRotationY, finalRotationZ
      
      if (isDragging) {
        finalRotationX = baseRotation.x + dragRotation.x
        finalRotationY = baseRotation.y + dragRotation.y
        finalRotationZ = baseRotation.z
      } else {
        finalRotationX = baseRotation.x + time * 0.1
        finalRotationY = baseRotation.y + time * 0.15
        finalRotationZ = baseRotation.z + time * 0.05
      }
      
      // Apply rotation to cube
      meshRef.current.rotation.set(finalRotationX, finalRotationY, finalRotationZ)
      if (edgesRef.current) {
        edgesRef.current.rotation.set(finalRotationX, finalRotationY, finalRotationZ)
      }
      
      // Animate inner energy core
      if (innerEnergyRef.current) {
        const energyIntensity = 0.3 + Math.sin(time * 3) * 0.2
        innerEnergyRef.current.material.emissiveIntensity = energyIntensity
        innerEnergyRef.current.rotation.set(
          time * 0.8,
          time * 1.2,
          time * 0.6
        )
      }
      
      // Animate bright core
      if (coreRef.current) {
        const coreIntensity = 1.5 + Math.sin(time * 4) * 0.5
        coreRef.current.material.emissiveIntensity = coreIntensity
        const coreScale = 1 + Math.sin(time * 2) * 0.1
        coreRef.current.scale.setScalar(coreScale)
      }
      
      // Floating animation when not dragging
      if (!isDragging) {
        const floatY = Math.sin(time * 0.8) * 0.1
        const floatX = Math.cos(time * 0.5) * 0.05
        meshRef.current.position.set(floatX, floatY, 0)
        if (edgesRef.current) {
          edgesRef.current.position.set(floatX, floatY, 0)
        }
        if (innerEnergyRef.current) {
          innerEnergyRef.current.position.set(floatX, floatY, 0)
        }
        if (coreRef.current) {
          coreRef.current.position.set(floatX, floatY, 0)
        }
      } else {
        meshRef.current.position.set(0, 0, 0)
        if (edgesRef.current) {
          edgesRef.current.position.set(0, 0, 0)
        }
        if (innerEnergyRef.current) {
          innerEnergyRef.current.position.set(0, 0, 0)
        }
        if (coreRef.current) {
          coreRef.current.position.set(0, 0, 0)
        }
      }
    }
  })

  const handlePointerDown = (event) => {
    event.stopPropagation()
    setIsDragging(true)
    
    // Handle both mouse and touch events
    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const clientY = event.touches ? event.touches[0].clientY : event.clientY
    
    setDragStart({ x: clientX, y: clientY })
    gl.domElement.style.cursor = 'grabbing'
    
    // Prevent default touch behavior on mobile
    if (event.touches) {
      event.preventDefault()
    }
    
    // Guardar rotación base
    if (meshRef.current) {
      setBaseRotation({
        x: meshRef.current.rotation.x,
        y: meshRef.current.rotation.y,
        z: meshRef.current.rotation.z
      })
      setDragRotation({ x: 0, y: 0 })
    }
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return
    
    // Handle both mouse and touch events
    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const clientY = event.touches ? event.touches[0].clientY : event.clientY
    
    // Adjust sensitivity for mobile
    const sensitivity = isMobile ? 0.008 : 0.01
    const deltaX = (clientX - dragStart.x) * sensitivity
    const deltaY = (clientY - dragStart.y) * sensitivity
    
    setDragRotation({
      x: -deltaY,
      y: deltaX
    })
    
    // Prevent default touch behavior on mobile
    if (event.touches) {
      event.preventDefault()
    }
  }

  const handlePointerUp = () => {
    if (isDragging) {
      setBaseRotation(prev => ({
        x: prev.x + dragRotation.x,
        y: prev.y + dragRotation.y,
        z: prev.z
      }))
      setDragRotation({ x: 0, y: 0 })
    }
    setIsDragging(false)
    gl.domElement.style.cursor = 'grab'
  }

  React.useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handlePointerMove(e)
      const handleMouseUp = () => handlePointerUp()
      const handleTouchMove = (e) => handlePointerMove(e)
      const handleTouchEnd = () => handlePointerUp()
      
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragStart, baseRotation, isMobile])

  // Renderizar cubo simplificado
  return (
    <group>
      {/* Outer glass cube */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onPointerEnter={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
        onPointerLeave={() => !isDragging && (gl.domElement.style.cursor = 'default')}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color="#001122"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.15}
          transmission={0.95}
          thickness={0.8}
          ior={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Inner energy mass */}
      <mesh ref={innerEnergyRef}>
        <octahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#00ff44"
          emissive="#00ff44"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Bright energy core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#44ff88"
          emissive="#44ff88"
          emissiveIntensity={2.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glowing cube edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
        <lineBasicMaterial
          color="#00ddff"
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>
    </group>
  )
}

// Environment Lights
const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-8, -8, -5]}
        intensity={0.8}
        color="#4a90e2"
        distance={20}
      />
      <pointLight
        position={[8, 8, 5]}
        intensity={0.6}
        color="#8b45ff"
        distance={15}
      />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.7}
        color="#6db4f2"
        castShadow
        target-position={[0, 0, 0]}
      />
    </>
  )
}

// Floating Particles
const Particles = () => {
  const particlesRef = useRef()
  const particleCount = 100
  
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6db4f2"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

const Scene3D = () => {
  return (
    <div className="scene3d-container">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 60 }} // Cambiado de 8 a 5
        className="canvas"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} /> {/* Cambiado de 8 a 5 */}
        
        <Lighting />
        <FloatingLogo />
        <Particles />
      </Canvas>
    </div>
  )
}

export default Scene3D