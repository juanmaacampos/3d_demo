import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'

// Floating Cube Component
const FloatingCube = () => {
  const meshRef = useRef()
  const geometryRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the cube on its axis
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.006
      meshRef.current.rotation.z += 0.002
      
      // Add floating motion with multiple waves
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.3 + Math.sin(time * 1.5) * 0.1
      meshRef.current.position.x = Math.cos(time * 0.5) * 0.1
      
      // Add scale breathing effect
      const scale = 1 + Math.sin(time * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry ref={geometryRef} args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color="#4a90e2"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.9}
          emissive="#1a365d"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Add wireframe overlay for more visual interest */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.85, 1.85, 1.85]} />
        <meshBasicMaterial
          color="#6db4f2"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Add glowing edges */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.8, 1.8, 1.8)]} />
        <lineBasicMaterial
          color="#8fb4f2"
          transparent
          opacity={0.6}
        />
      </mesh>
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
        
        {/* Optional: Add OrbitControls for debugging - remove in production */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  )
}

export default Scene3D
