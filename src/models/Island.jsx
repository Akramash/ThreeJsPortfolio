import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, MathUtils } from 'three';
import islandScene from '../assets/3d/island.glb';

const Island = ({ isRotating, scrollAccumulation, showRotationPopUp, ...props }) => {
    const islandRef = useRef();
    const { nodes, materials } = useGLTF(islandScene);
    const [smoothedScrollAccumulation, setSmoothedScrollAccumulation] = useState(scrollAccumulation);
    const [targetAccumulation, setTargetAccumulation] = useState(scrollAccumulation);
    const easing = 0.05;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const [atBoundary, setAtBoundary] = useState(false);

// Clamp function for Vector3
    const clampVector3 = (vector, min, max) => {
        vector.x = clamp(vector.x, min.x, max.x);
        vector.y = clamp(vector.y, min.y, max.y);
        vector.z = clamp(vector.z, min.z, max.z);
        return vector;
    };

    // Clamp function for Euler rotations
    const clampEuler = (euler, min, max) => {
        euler.x = clamp(euler.x, min.x, max.x);
        euler.y = clamp(euler.y, min.y, max.y);
        euler.z = clamp(euler.z, min.z, max.z);
        return euler;
    };

    const path = [
        { position: new Vector3(0, -290, -100.5), rotation: new Euler(0, 0, 0) },
        { position: new Vector3(0, -275, -100.5), rotation: new Euler(0, -Math.PI / 1.35, 0) }, // Rotate in opposite direction
        { position: new Vector3(0, -225, -100.5), rotation: new Euler(0, -Math.PI / 0.75, 0) },
        { position: new Vector3(0, -150, -100.5), rotation: new Euler(0, -Math.PI / 0.52, 0) },
        { position: new Vector3(0, -50, -100.5), rotation: new Euler(0, -Math.PI / 0.38, 0) } // Rotate in opposite direction
        // Add more points with opposite rotation as needed...
    ];




    useEffect(() => {
        const minAccumulation = 0; // Adjust based on your application logic
        const maxAccumulation = 2000; // Adjust based on your application logic
    
        // Adjust this factor to control the amount of inertia
        const inertiaFactor = 0.1; // This controls how far the island "slides"
        let newTarget = scrollAccumulation + (isRotating ? 0 : (scrollAccumulation - smoothedScrollAccumulation) * inertiaFactor);
        
        // Previously, this clamped newTarget within the bounds. Now, also reset if scrolling at boundary.
        if (newTarget <= minAccumulation || newTarget >= maxAccumulation) {
            if (atBoundary) {
                // User is attempting to scroll further at a boundary; cap the target accumulation.
                newTarget = clamp(scrollAccumulation, minAccumulation, maxAccumulation);
            } else {
                setAtBoundary(true);
            }
        } else {
            setAtBoundary(false); // Reset the boundary state if not at a boundary.
        }
    
        setTargetAccumulation(newTarget);
    }, [scrollAccumulation, isRotating, atBoundary]);

    useFrame(() => {
        if (!islandRef.current) return;
        setSmoothedScrollAccumulation(prev => MathUtils.lerp(prev, targetAccumulation, easing));
    
        // Map smoothedScrollAccumulation directly to the interpolation factor over the path length
        let t = MathUtils.clamp(smoothedScrollAccumulation / 2000, 0, 1) * (path.length - 1);
        const index = Math.floor(t);
        let nextIndex = Math.ceil(t);
        nextIndex = nextIndex >= path.length ? path.length - 1 : nextIndex; // Ensure nextIndex is within bounds
    
        const alpha = t - index;
    
        // Interpolate position and rotation
        const currentPosition = path[index].position.clone().lerp(path[nextIndex].position, alpha);
        const currentRotation = new Euler(
            MathUtils.lerp(path[index].rotation.x, path[nextIndex].rotation.x, alpha),
            MathUtils.lerp(path[index].rotation.y, path[nextIndex].rotation.y, alpha),
            MathUtils.lerp(path[index].rotation.z, path[nextIndex].rotation.z, alpha)
        );
    
        islandRef.current.position.copy(currentPosition);
        islandRef.current.rotation.copy(currentRotation);
    });

    return (
        <group ref={islandRef} {...props}>
            {Object.keys(nodes).map(key => (
                nodes[key].geometry && (
                    <mesh
                        key={key}
                        castShadow
                        receiveShadow
                        geometry={nodes[key].geometry}
                        material={materials[nodes[key].material.name]}
                    />
                )
            ))}
        </group>
    );
};

export default Island;