import React, { useRef, useEffect, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame  } from "@react-three/fiber";
import { Vector3, Euler, MathUtils } from 'three';
import { useAnimationControl } from '../components/AnimationControlContext';
import stages from "../components/IslandStages";
import { compareVectors, compareEulers } from "../components/utils";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate
import islandScene from '../assets/3d/island.glb';
import StageIndicator from "../components/StageIndicator";


const Island = ({ showPositionPopUp, ...props }) => {
    const islandRef = useRef();
    const { nodes, materials } = useGLTF(islandScene);
    const [smoothedScrollAccumulation, setSmoothedScrollAccumulation] = useState(0);
    const [pendingScrollAccumulation, setPendingScrollAccumulation] = useState(0);
    const [isHalfwayReached, setIsHalfwayReached] = useState(false);
    const easing = 0.05;
    const { isHalfway, setIsHalfway } = useAnimationControl();
    const navigate = useNavigate(); // Use useNavigate for navigation
    const [currentStage, setCurrentStage] = useState(null); // State for managing current stage
    const [showStageIndicator, setShowStageIndicator] = useState(false);

    
// Clamp function for Vector3


    useEffect(() => {
        if (isHalfway) {
            setIsHalfwayReached(true); // Begin smoothing when halfway is reached
            // No need to reset setIsHalfway here; it should be reset by the Diver component
        } else {
            setIsHalfwayReached(false); // Reset so island movement waits for halfway point on subsequent scrolls
        }
    }, [isHalfway]); // Depend on isHalfway to reset the island's movement trigger

    useFrame(() => {
        if (!islandRef.current) return;
    
        // Check if halfway has been reached to start updating the smoothed accumulation
        if (isHalfwayReached) {
            const newAccumulation = MathUtils.lerp(smoothedScrollAccumulation, pendingScrollAccumulation, easing);
            setSmoothedScrollAccumulation(newAccumulation);
        }
    
        // This part now runs regardless of isHalfwayReached after it's been set once
        let t = MathUtils.clamp(smoothedScrollAccumulation / 2000, 0, 1) * (path.length - 1);
        const index = Math.floor(t);
        let nextIndex = Math.ceil(t);
        nextIndex = nextIndex >= path.length ? path.length - 1 : nextIndex;
    
        const alpha = t - index;
        const currentPosition = path[index].position.clone().lerp(path[nextIndex].position, alpha);
        const currentRotation = new Euler(
            MathUtils.lerp(path[index].rotation.x, path[nextIndex].rotation.x, alpha),
            MathUtils.lerp(path[index].rotation.y, path[nextIndex].rotation.y, alpha),
            MathUtils.lerp(path[index].rotation.z, path[nextIndex].rotation.z, alpha)
        );
    
        islandRef.current.position.copy(currentPosition);
        islandRef.current.rotation.copy(currentRotation);
    
        // Check for matching stage based on the current position and rotation
        stages.forEach((stage, index) => {
            if (islandRef.current.position.distanceTo(stage.position) < 5) { // Consider a small threshold for matching
                if (currentStage !== index) { // Check if we've entered a new stage
                    setCurrentStage(index);
                    showPositionPopUp(`${stage.popupContent}`); // Trigger popup
                    // Optional: Trigger navigation directly or use a key press event as shown below
                }
            }
        });
    });
    // Continue to accumulate scroll delta
    useEffect(() => {
        const handleScroll = (e) => {
            const scrollDelta = e.deltaY * 0.2;
            setPendingScrollAccumulation(prev => prev + scrollDelta);
        };

        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === "Space" && currentStage !== null) {
                navigate(stages[currentStage].route); // Navigate based on the current stage
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentStage, navigate]);



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