import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'

// Floating Logo Component with your GLTF model
const FloatingLogo = () => {
  const meshRef = useRef()
  const wireframeRef = useRef()
  const edgesRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [baseRotation, setBaseRotation] = useState({ x: 0, y: 0, z: 0 })
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 })
  
  const { gl } = useThree()

  // Get base URL for assets
  const baseUrl = import.meta.env.BASE_URL || '/'
  const logoModelUrl = `${baseUrl}models/elevtober_logo.gltf`
  
  // Load your GLTF model
  const { scene, error } = useGLTF(logoModelUrl)

  // Forzar color del modelo GLTF a #D12C45
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Si el material es un array (multi-material)
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.color) mat.color.set('#D12C45')
            })
          } else {
            if (child.material.color) child.material.color.set('#D12C45')
          }
        }
      })
    }
  }, [scene])

  // Log for debugging
  React.useEffect(() => {
    console.log('Loading model from:', logoModelUrl)
    if (error) {
      console.error('Error loading GLTF model:', error)
    }
    if (scene) {
      console.log('GLTF model loaded successfully:', scene)
    }
  }, [scene, error, logoModelUrl])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (meshRef.current) {
      // Calcular rotación final
      let finalRotationX, finalRotationY, finalRotationZ
      
      if (isDragging) {
        // Solo rotación, no posición ni escala animada durante drag
        finalRotationX = baseRotation.x + dragRotation.x
        finalRotationY = baseRotation.y + dragRotation.y
        finalRotationZ = baseRotation.z
      } else {
        // Animación automática de rotación y flotación
        finalRotationX = baseRotation.x + time * 0.3
        finalRotationY = baseRotation.y + time * 0.5
        finalRotationZ = baseRotation.z + time * 0.2
      }
      
      // Aplicar rotación
      meshRef.current.rotation.set(finalRotationX, finalRotationY, finalRotationZ)
      if (wireframeRef.current) {
        wireframeRef.current.rotation.set(finalRotationX, finalRotationY, finalRotationZ)
      }
      if (edgesRef.current) {
        edgesRef.current.rotation.set(finalRotationX, finalRotationY, finalRotationZ)
      }
      
      // Solo animar posición y escala si NO se está arrastrando
      if (!isDragging) {
        // Flotación
        const floatY = Math.sin(time * 0.8) * 0.3 + Math.sin(time * 1.5) * 0.1
        const floatX = Math.cos(time * 0.5) * 0.1
        meshRef.current.position.set(floatX, floatY, 0)
        if (wireframeRef.current) {
          wireframeRef.current.position.set(floatX, floatY, 0)
        }
        if (edgesRef.current) {
          edgesRef.current.position.set(floatX, floatY, 0)
        }
        // Escalado "breathing"
        const scale = 1 + Math.sin(time * 2) * 0.05
        meshRef.current.scale.setScalar(scale)
        if (wireframeRef.current) {
          wireframeRef.current.scale.setScalar(scale)
        }
        if (edgesRef.current) {
          edgesRef.current.scale.setScalar(scale)
        }
      } else {
        // Durante drag: posición y escala fijas
        meshRef.current.position.set(0, 0, 0)
        meshRef.current.scale.setScalar(1)
        if (wireframeRef.current) {
          wireframeRef.current.position.set(0, 0, 0)
          wireframeRef.current.scale.setScalar(1)
        }
        if (edgesRef.current) {
          edgesRef.current.position.set(0, 0, 0)
          edgesRef.current.scale.setScalar(1)
        }
      }
    }
  })

  const handlePointerDown = (event) => {
    event.stopPropagation()
    setIsDragging(true)
    setDragStart({ x: event.clientX, y: event.clientY })
    gl.domElement.style.cursor = 'grabbing'
    
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
    // Solo rotación, no traslación
    const deltaX = (event.clientX - dragStart.x) * 0.01
    const deltaY = (event.clientY - dragStart.y) * 0.01
    setDragRotation({
      x: -deltaY,
      y: deltaX
    })
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
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, baseRotation])

  // Fallback cube si falla el modelo
  if (error || !scene) {
    console.warn('Falling back to cube due to model loading error')
    return (
      <group>
        <mesh 
          ref={meshRef} 
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerEnter={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
          onPointerLeave={() => !isDragging && (gl.domElement.style.cursor = 'default')}
        >
          <boxGeometry args={[10, 10, 10]} /> {/* Cambia estos valores para el tamaño del cubo */}
          <meshStandardMaterial
            color={isDragging ? "#F44C6A" : "#D22C46"}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={isDragging ? 1 : 0.9}
            emissive={isDragging ? "#A01E35" : "#8B1E2B"}
            emissiveIntensity={isDragging ? 0.5 : 0.3}
          />
        </mesh>
        
        <mesh ref={wireframeRef}>
          <boxGeometry args={[10.2, 10.2, 10.2]} /> {/* Wireframe ligeramente más grande */}
          <meshBasicMaterial
            color={isDragging ? "#F87A8E" : "#E85A70"}
            wireframe
            transparent
            opacity={isDragging ? 0.6 : 0.4}
          />
        </mesh>
        
        <lineSegments ref={edgesRef}>
          <edgesGeometry args={[new THREE.BoxGeometry(10, 10, 10)]} /> {/* Edges igual al cubo principal */}
          <lineBasicMaterial
            color={isDragging ? "#FFABC1" : "#F0849A"}
            transparent
            opacity={isDragging ? 0.8 : 0.6}
          />
        </lineSegments>
      </group>
    )
  }

  // Renderizar el modelo GLTF con color forzado y solo rotación sobre su eje
  return (
    <group
      ref={meshRef}
      scale={[20, 20, 20]} // Cambia estos valores para el tamaño del modelo GLTF
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerEnter={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
      onPointerLeave={() => !isDragging && (gl.domElement.style.cursor = 'default')}
    >
      <primitive object={scene.clone()} />
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