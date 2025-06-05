import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import InteractiveCube from './InteractiveCube'

const Scene = ({ currentSection = 0, totalSections = 4 }) => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 // Slower base rotation
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.5} 
        angle={0.3} 
        penumbra={1} 
        castShadow 
      />
      
      <group ref={groupRef}>
        <InteractiveCube 
          currentSection={currentSection} 
          totalSections={totalSections} 
        />
      </group>

      <Environment preset="sunset" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </>
  )
}

export default Scene
