import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'

// Floating Cube Component with drag functionality
const FloatingCube = () => {
  const meshRef = useRef()
  const wireframeRef = useRef()
  const edgesRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cubePosition, setCubePosition] = useState({ x: 0, y: 0, z: 0 })
  
  const { camera, gl } = useThree()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (meshRef.current && wireframeRef.current && edgesRef.current) {
      if (!isDragging) {
        // Rotate the cube on its axis only when not dragging
        meshRef.current.rotation.x += 0.003
        meshRef.current.rotation.y += 0.006
        meshRef.current.rotation.z += 0.002
        
        wireframeRef.current.rotation.x += 0.003
        wireframeRef.current.rotation.y += 0.006
        wireframeRef.current.rotation.z += 0.002
        
        edgesRef.current.rotation.x += 0.003
        edgesRef.current.rotation.y += 0.006
        edgesRef.current.rotation.z += 0.002
        
        // Add floating motion only when not dragging
        const floatingY = Math.sin(time * 0.8) * 0.3 + Math.sin(time * 1.5) * 0.1
        const floatingX = Math.cos(time * 0.5) * 0.1
        const scale = 1 + Math.sin(time * 2) * 0.05
        
        meshRef.current.position.set(cubePosition.x + floatingX, cubePosition.y + floatingY, cubePosition.z)
        wireframeRef.current.position.set(cubePosition.x + floatingX, cubePosition.y + floatingY, cubePosition.z)
        edgesRef.current.position.set(cubePosition.x + floatingX, cubePosition.y + floatingY, cubePosition.z)
        
        meshRef.current.scale.setScalar(scale)
        wireframeRef.current.scale.setScalar(scale)
        edgesRef.current.scale.setScalar(scale)
      } else {
        // Keep position static while dragging
        meshRef.current.position.set(cubePosition.x, cubePosition.y, cubePosition.z)
        wireframeRef.current.position.set(cubePosition.x, cubePosition.y, cubePosition.z)
        edgesRef.current.position.set(cubePosition.x, cubePosition.y, cubePosition.z)
      }
    }
  })

  const handlePointerDown = (event) => {
    event.stopPropagation()
    setIsDragging(true)
    setDragStart({ x: event.clientX, y: event.clientY })
    gl.domElement.style.cursor = 'grabbing'
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return
    
    const deltaX = (event.clientX - dragStart.x) * 0.01
    const deltaY = -(event.clientY - dragStart.y) * 0.01
    
    setCubePosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
      z: prev.z
    }))
    
    setDragStart({ x: event.clientX, y: event.clientY })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = 'grab'
  }

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (event) => handlePointerMove(event)
      const handleGlobalUp = () => handlePointerUp()
      
      window.addEventListener('mousemove', handleGlobalMove)
      window.addEventListener('mouseup', handleGlobalUp)
      window.addEventListener('touchmove', handleGlobalMove)
      window.addEventListener('touchend', handleGlobalUp)
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMove)
        window.removeEventListener('mouseup', handleGlobalUp)
        window.removeEventListener('touchmove', handleGlobalMove)
        window.removeEventListener('touchend', handleGlobalUp)
      }
    }
  }, [isDragging])

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={[cubePosition.x, cubePosition.y, cubePosition.z]} 
        castShadow 
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerEnter={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
        onPointerLeave={() => !isDragging && (gl.domElement.style.cursor = 'default')}
      >
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color={isDragging ? "#6db4f2" : "#4a90e2"}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={isDragging ? 1 : 0.9}
          emissive={isDragging ? "#2563eb" : "#1a365d"}
          emissiveIntensity={isDragging ? 0.5 : 0.3}
        />
      </mesh>
      
      {/* Add wireframe overlay for more visual interest */}
      <mesh ref={wireframeRef} position={[cubePosition.x, cubePosition.y, cubePosition.z]}>
        <boxGeometry args={[1.85, 1.85, 1.85]} />
        <meshBasicMaterial
          color={isDragging ? "#93c5fd" : "#6db4f2"}
          wireframe
          transparent
          opacity={isDragging ? 0.6 : 0.4}
        />
      </mesh>
      
      {/* Add glowing edges */}
      <lineSegments ref={edgesRef} position={[cubePosition.x, cubePosition.y, cubePosition.z]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.8, 1.8, 1.8)]} />
        <lineBasicMaterial
          color={isDragging ? "#bfdbfe" : "#8fb4f2"}
          transparent
          opacity={isDragging ? 0.8 : 0.6}
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
        camera={{ position: [0, 0, 8], fov: 60 }}
        className="canvas"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        <Lighting />
        <FloatingCube />
        <Particles />
      </Canvas>
    </div>
  )
}

export default Scene3D
