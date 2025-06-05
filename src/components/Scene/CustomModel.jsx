import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const CustomModel = ({ modelPath, format = 'fbx', ...props }) => {
  const modelRef = useRef()

  // Choose loader based on format
  const getLoader = () => {
    switch (format.toLowerCase()) {
      case 'fbx':
        return FBXLoader
      case 'obj':
        return OBJLoader
      default:
        return FBXLoader
    }
  }

  const model = useLoader(getLoader(), modelPath)

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.3
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <primitive 
      ref={modelRef}
      object={model} 
      scale={0.01} // Ajusta según el tamaño de tu modelo
      {...props}
    />
  )
}

export default CustomModel
