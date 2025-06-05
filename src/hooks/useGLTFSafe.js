import { useGLTF } from '@react-three/drei'
import { useState, useEffect } from 'react'

export const useGLTFSafe = (url) => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Always call useGLTF at the top level
  let gltf = null
  let hookError = null
  
  try {
    gltf = useGLTF(url)
  } catch (err) {
    console.error(`Failed to load GLTF model: ${url}`, err)
    hookError = err
  }
  
  useEffect(() => {
    console.log(`GLTF loading status for ${url}:`, { gltf: !!gltf, scene: !!gltf?.scene, hookError })
    
    if (hookError) {
      setError(hookError)
      setIsLoading(false)
    } else if (gltf && gltf.scene) {
      console.log(`Successfully loaded GLTF: ${url}`)
      setIsLoading(false)
      setError(null)
    } else if (gltf && !gltf.scene) {
      console.warn(`GLTF loaded but no scene found: ${url}`)
      setError(new Error('No scene in GLTF'))
      setIsLoading(false)
    }
  }, [url, gltf, hookError])
  
  return { 
    scene: gltf?.scene || null, 
    error: error || hookError, 
    isLoading 
  }
}

// Preload with error handling
export const preloadGLTFSafe = (url) => {
  try {
    useGLTF.preload(url)
  } catch (error) {
    console.warn(`Failed to preload GLTF model: ${url}`, error)
  }
}
