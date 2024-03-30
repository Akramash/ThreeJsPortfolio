import React from 'react'

import fishScene from '../assets/3d/fish.glb';
import { useGLTF } from '@react-three/drei';

const Fish = () => {
    const { scene, animations } = useGLTF(fishScene);
    return (
        <mesh position={[1, 1, 1]} scale={[0.07, 0.07, 0.07]}>
            <primitive object={scene} />
        </mesh>

    )
}

export default Fish;