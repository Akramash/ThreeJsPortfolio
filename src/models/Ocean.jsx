import { useGLTF } from '@react-three/drei'
import React from 'react'
import oceanScene from '../assets/3d/ocean.glb'
const Ocean = () => {
    const Ocean = useGLTF(oceanScene)
  return (
    <mesh>
        <primitive object={Ocean.scene} />
    </mesh>
  )
}

export default Ocean