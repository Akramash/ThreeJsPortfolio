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
        if (lastScrollDirection && currentDirection !== lastScrollDirection) {
          setIsDiverRotating(true);
          // Logic to handle direction change and initiate rotation
        }
        setLastScrollDirection(currentDirection);
    }, [pendingScrollAccumulation, lastScrollDirection, setIsDiverRotating, setLastScrollDirection]);

    useFrame((state, delta) => {
        if (isDiverRotating && ref.current) {
            const targetYDown = THREE.MathUtils.degToRad(20); // Original target rotation for 'down'
            const targetYUp = THREE.MathUtils.degToRad(-114.5); // Updated target rotation for 'up'
            
            // Determine the target rotation based on scroll direction
            const targetRotationY = props.scrollDirection === 'down' ? targetYDown : targetYUp;
            
            // Smoothly interpolate the diver's rotation to the target rotation
            // Increase '0.05' to make the transition faster, or decrease it to slow it down
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotationY, delta * 0.01); // Adjust the factor based on your animation speed preference
    
            // Optionally, you can set 'isDiverRotating' to false when the rotation is close to the target
            // This is useful if other actions depend on the completion of the rotation
            const rotationDifference = Math.abs(ref.current.rotation.y - targetRotationY);
            if (rotationDifference < THREE.MathUtils.degToRad(1)) { // Checks if the rotation is within 1 degree of the target
                setIsDiverRotating(false);
            }
        }

        if (isDiverRotating) return;

        if (!mixer || !actions['Action']) return;
        
        mixer.update(delta);
        
        const action = actions['Action'];
        if (animationPlayed && action.time >= action.getClip().duration / 2.5 && !halfwayDispatched) {
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