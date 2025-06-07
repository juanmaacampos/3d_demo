import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Optimized triangle instances component
const TriangleInstances = ({ mouse }) => {
  const meshRef = useRef()
  const triangleCount = 25 // Reduced for better performance
  
  // Create triangle geometry once
  const triangleGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.1, 0.2, 3)
    return geometry
  }, [])

  // Generate triangle data once
  const triangleData = useMemo(() => {
    const data = []
    for (let i = 0; i < triangleCount; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.5 + Math.random() * 1.5,
        speed: 0.01 + Math.random() * 0.02
      })
    }
    return data
  }, [triangleCount])

  // Create instanced mesh
  const { instancedMesh, dummy } = useMemo(() => {
    const instancedMesh = new THREE.InstancedMesh(
      triangleGeometry,
      new THREE.MeshBasicMaterial({
        color: '#08892D',
        transparent: true,
        opacity: 0.15,
        wireframe: true
      }),
      triangleCount
    )
    const dummy = new THREE.Object3D()
    return { instancedMesh, dummy }
  }, [triangleGeometry, triangleCount])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    
    triangleData.forEach((triangle, i) => {
      // Mouse influence
      const mouseInfluence = 0.5
      const mouseX = mouse.x * mouseInfluence
      const mouseY = mouse.y * mouseInfluence

      // Update position with mouse influence
      dummy.position.set(
        triangle.position[0] + Math.sin(time * triangle.speed) * 0.5 + mouseX * 0.3,
        triangle.position[1] + Math.cos(time * triangle.speed * 0.8) * 0.3 + mouseY * 0.3,
        triangle.position[2] + Math.sin(time * triangle.speed * 0.6) * 0.2
      )

      // Update rotation with mouse influence
      dummy.rotation.set(
        triangle.rotation[0] + time * triangle.speed + mouseY * 0.1,
        triangle.rotation[1] + time * triangle.speed * 1.2 + mouseX * 0.1,
        triangle.rotation[2] + time * triangle.speed * 0.8
      )

      // Update scale
      dummy.scale.setScalar(triangle.scale + Math.sin(time * 2 + i) * 0.1)

      // Update instance matrix
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <primitive ref={meshRef} object={instancedMesh} />
}

const Triangle3DBackground = () => {
  const containerRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <TriangleInstances mouse={mouse.current} />
      </Canvas>
    </div>
  )
}

export default Triangle3DBackground
