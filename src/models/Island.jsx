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
        // Adjust this factor to control the amount of inertia
        const inertiaFactor = 0.1; // This controls how far the island "slides"
        if (isRotating) {
            setTargetAccumulation(scrollAccumulation);
        } else {
            // Calculate a target accumulation that includes inertia
            const inertia = (scrollAccumulation - smoothedScrollAccumulation) * inertiaFactor;
            setTargetAccumulation(scrollAccumulation + inertia);
        }
    }, [scrollAccumulation, isRotating]);

    useFrame(() => {
        if (!islandRef.current) return;
    
        // Smoothly update smoothedScrollAccumulation towards the target
        setSmoothedScrollAccumulation(prev => MathUtils.lerp(prev, targetAccumulation, easing));
    
        // Ensure we don't exceed the bounds of the path array
        // This change prevents wrapping from the last stage to the first
        let t = (smoothedScrollAccumulation * 3.35 / 2000) % path.length;
        const index = Math.floor(t);
        let nextIndex = index + 1;
        if (nextIndex >= path.length) {
            nextIndex = path.length - 1; // Clamp to the last index instead of wrapping
        }
        const alpha = t - index;
    
        // Interpolate position and rotation between current and next index
        // Your existing logic here is good; just ensure you're using the adjusted nextIndex
        const currentPosition = path[index].position.clone().lerp(path[nextIndex].position, alpha);
        const currentRotation = new Euler(
            MathUtils.lerp(path[index].rotation.x, path[nextIndex].rotation.x, alpha),
            MathUtils.lerp(path[index].rotation.y, path[nextIndex].rotation.y, alpha),
            MathUtils.lerp(path[index].rotation.z, path[nextIndex].rotation.z, alpha)
        );
    
        // Apply the interpolated position and rotation to the island
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