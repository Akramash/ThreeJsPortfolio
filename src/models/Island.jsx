import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, MathUtils } from 'three'; // Import MathUtils for the lerp function
import islandScene from '../assets/3d/island.glb';

const Island = ({ isRotating, scrollAccumulation, showRotationPopUp, position = [0, -290, -100.5], ...props }) => {
    const islandRef = useRef();
    const { nodes, materials } = useGLTF(islandScene);
    const [smoothedScrollAccumulation, setSmoothedScrollAccumulation] = useState(scrollAccumulation);

    // Path definition remains the same
    const path = [
        { position: new Vector3(0, -290, -100.5), rotation: new Euler(0, 0, 0) },
        { position: new Vector3(0, -275, -100.5), rotation: new Euler(0, -Math.PI / 1.35, 0) }, // Rotate in opposite direction
        { position: new Vector3(0, -225, -100.5), rotation: new Euler(0, -Math.PI / 0.75, 0) },
        { position: new Vector3(0, -150, -100.5), rotation: new Euler(0, -Math.PI / 0.52, 0) },
        { position: new Vector3(0, -50, -100.5), rotation: new Euler(0, -Math.PI / 0.38, 0) }, // Rotate in opposite direction
        // Add more points with opposite rotation as needed...
    ];




    useEffect(() => {
        // Directly sync when scrolling starts to ensure responsiveness
        if (isRotating) {
            setSmoothedScrollAccumulation(scrollAccumulation);
        }
    }, [scrollAccumulation, isRotating]);

    useFrame(() => {
        if (!islandRef.current) return;

        // Smoothly update the smoothed accumulation towards the actual accumulation when not rotating
        if (!isRotating) {
            setSmoothedScrollAccumulation((prev) => 
                MathUtils.lerp(prev, scrollAccumulation, 0.9) // Adjust the 0.1 value to control the glide speed
            );
        }

        // Use smoothedScrollAccumulation for calculations
        let t = (smoothedScrollAccumulation / 2000) % path.length;
        t = Math.max(0, t); // Ensure t is not negative

        const index = Math.floor(t);
        const nextIndex = (index + 1) % path.length;
        const alpha = t - index;

        let currentPosition = path[index].position.clone().lerp(path[nextIndex].position, alpha);
        let currentRotation = new Euler(
            path[index].rotation.x + (path[nextIndex].rotation.x - path[index].rotation.x) * alpha,
            path[index].rotation.y + (path[nextIndex].rotation.y - path[index].rotation.y) * alpha,
            path[index].rotation.z + (path[nextIndex].rotation.z - path[index].rotation.z) * alpha,
        );

        // Apply clamping
        currentPosition.y = Math.max(Math.min(currentPosition.y, -50), -290);

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