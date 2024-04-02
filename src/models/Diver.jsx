import { useRef, useEffect, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationControl } from '../components/AnimationControlContext';

import diverScene from '../assets/3d/diver.glb';

const Diver = ({ startAnimation, ...props }) => {
    const ref = useRef();
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const { scene, animations } = useGLTF(diverScene);
    const { actions, mixer } = useAnimations(animations, ref);
    const [halfwayDispatched, setHalfwayDispatched] = useState(false);
    const { setIsHalfway, setPendingScrollAccumulation } = useAnimationControl(); // Assuming useAnimationControl also provides a method to reset pending scroll accumulation

    useEffect(() => {
        const action = actions['Action'];
        if (action && startAnimation && !animationPlayed) {
            action.reset();
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();
            setAnimationPlayed(true);
        }
    }, [startAnimation, animationPlayed, actions]);

    useFrame((state, delta) => {
        if (!mixer || !actions['Action']) return;
        
        mixer.update(delta);
        
        const action = actions['Action'];
        if (animationPlayed && action.time >= action.getClip().duration / 2 && !halfwayDispatched) {
            setIsHalfway(true);
            setHalfwayDispatched(true);
        }
        
        if (animationPlayed && !action.isRunning() && action.time >= action.getClip().duration) {
            // Make sure this block is executed after the animation is confirmed to have finished
            setAnimationPlayed(false);
            setHalfwayDispatched(false);
            setIsHalfway(false); // This should trigger the Island component to reset isHalfwayReached
            setPendingScrollAccumulation(0); // Adjust based on your logic
        }
    });

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Diver;