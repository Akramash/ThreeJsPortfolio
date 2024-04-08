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
    const TARGET_ROTATION_DOWN = THREE.MathUtils.degToRad(20); // Target rotation when scrolling down
    const TARGET_ROTATION_UP = THREE.MathUtils.degToRad(-114.5); // Target rotation when scrolling up
    const [targetRotation, setTargetRotation] = useState(TARGET_ROTATION_DOWN); // Initial state
    const [rotationLerpSpeed, setRotationLerpSpeed] = useState(5); // Start with an arbitrary speed value

    const {
        setIsHalfway,
        setPendingScrollAccumulation,
        isDiverRotating,
        setIsDiverRotating,
        lastScrollDirection,
        setLastScrollDirection,
        pendingScrollAccumulation,
      } = useAnimationControl(); // Assuming useAnimationControl also provides a method to reset pending scroll accumulation

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

    useEffect(() => {
        const currentDirection = pendingScrollAccumulation > 0 ? 'down' : 'up';
        if (lastScrollDirection !== 'initial' && lastScrollDirection !== currentDirection) {
            setIsDiverRotating(true);
            // Adjust the target rotation based on direction
            const newTargetRotation = currentDirection === 'down' ? TARGET_ROTATION_DOWN : TARGET_ROTATION_UP;
            if (targetRotation !== newTargetRotation) {
                setTargetRotation(newTargetRotation);
                // Optionally, adjust the speed based on how quick or slow the transition should be
                setRotationLerpSpeed(currentDirection === 'down' ? 5 : 5); // Example speed adjustment
            }
        }
        setLastScrollDirection(currentDirection);
    }, [pendingScrollAccumulation, lastScrollDirection, targetRotation]);

    useFrame((state, delta) => {
        if (isDiverRotating && ref.current) {
            // Smoothly interpolate the diver's rotation towards the target rotation
            // Adjusted to use a smaller factor for a smoother transition
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation, delta * 0.01); // Using a slower lerp speed for smoother transition
    
            // Check if the rotation is close enough to the target to stop the rotation
            // Adjusted threshold for a smoother stopping condition
            if (Math.abs(ref.current.rotation.y - targetRotation) < 0.05) { // Slightly larger threshold for smoother stopping
                setIsDiverRotating(false); // Stop rotating when target is reached
            }
        } else {
            // This branch handles non-rotation related updates
            if (!mixer || !actions['Action']) return;
        
            mixer.update(delta);
        
            const action = actions['Action'];
            if (animationPlayed && action.time >= action.getClip().duration / 2.5 && !halfwayDispatched) {
                setIsHalfway(true);
                setHalfwayDispatched(true);
            }
        
            if (animationPlayed && !action.isRunning() && action.time >= action.getClip(). duration) {
                // Reset states once the animation has finished
                setAnimationPlayed(false);
                setHalfwayDispatched(false);
                setIsHalfway(false); // Reset halfway state
                setPendingScrollAccumulation(0); // Reset scroll accumulation
            }
        }
    });

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Diver;