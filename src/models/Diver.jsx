import { useRef, useEffect, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import diverScene from '../assets/3d/diver.glb';

const Diver = ({ isRotating, ...props }) => {
    const ref = useRef();
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const { scene, animations } = useGLTF(diverScene);
    const { actions } = useAnimations(animations, ref);

    useEffect(() => {
        // Ensure the 'Action' animation exists
        const action = actions['Action'];
        if (action) {
            // Set the animation to only play once and clamp when finished
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

            // Play the animation once upon grabbing
            if (isRotating && !animationPlayed) {
                action.reset().play();
                setAnimationPlayed(true);
            }
        }
    }, [isRotating, animationPlayed, actions]);

    useEffect(() => {
        // Reset the animation state if not rotating, allowing it to be played again
        if (!isRotating) {
            setAnimationPlayed(false);
        }
    }, [isRotating]);

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Diver;