import React, { useState, Suspense, useEffect } from 'react'; // Added useEffect here
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Island from '../models/Island';
import Ocean from '../models/Ocean';
import Fish from '../models/Fish';
import Diver from '../models/Diver';

const Home = () => {
  const [rotationPopUpVisible, setRotationPopUpVisible] = useState(false);
  const [rotationPopUpContent, setRotationPopUpContent] = useState("");
  const [positionPopUpVisible, setPositionPopUpVisible] = useState(false);
  const [positionPopUpContent, setPositionPopUpContent] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [scrollAccumulation, setScrollAccumulation] = useState(0);

  useEffect(() => {
    const handleWheel = (e) => {
      setIsRotating(true);
      setScrollAccumulation((prev) => {
        const delta = e.deltaY * 0.2; // Adjust based on sensitivity
        const newAccumulation = prev + delta;
        // Define the scrollAccumulation values that map to your desired Y positions
        const minAccumulationValue = 0; // Maps to Y position of -290
        const maxAccumulationValue = 2000; // Maps to Y position of -50
        // Clamp the newAccumulation to be within these bounds
        return Math.min(Math.max(newAccumulation, minAccumulationValue), maxAccumulationValue);
      });
    };

    const handleScrollEnd = () => {
      setIsRotating(false);
    };

    // Debounce scroll end detection
    let scrollEndTimer;
    const debounceScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(handleScrollEnd, 150); // Adjust timeout to suit your needs
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('wheel', debounceScrollEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', debounceScrollEnd);
    };
  }, []);

  // Dynamically adjust the island for screen size
  const adjustIslandForScreenSize = () => {
    let screenScale = window.innerWidth < 768 ? [0.9, 0.9, 0.9] : [1, 1, 1];
    let screenPosition = [0, -290, -100.5];
    let rotation = [0, -7.3, 0];
    return [screenScale, screenPosition, rotation];
  }

  // Dynamically adjust the diver for screen size
  const adjustDiverForScreenSize = () => {
    let screenScale = window.innerWidth < 768 ? [5, 5, 5] : [5, 5, 5];
    let screenPosition = window.innerWidth < 768 ? [1, 1, 1] : [0, -2, 0];
    return [screenScale, screenPosition];
  }

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
  const [diverScale, diverPosition] = adjustDiverForScreenSize();

  // Function to handle the pop-up based on the island's rotation stage
  const showRotationPopUp = (rotationStage) => {
    setRotationPopUpContent(`You've entered rotation stage: ${rotationStage}`);
    setRotationPopUpVisible(true);
    setTimeout(() => setRotationPopUpVisible(false), 3000); // Automatically hide the pop-up after 3 seconds
  };

  const showPositionPopUp = (positionStage) => {
    setPositionPopUpContent(`You've entered position stage: ${positionStage}`);
    setPositionPopUpVisible(true);
    setTimeout(() => setPositionPopUpVisible(false), 3000); // Automatically hide the pop-up after 3 seconds
  };

  return (
    <section className={`w-full h-screen relative ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}>
      {rotationPopUpVisible && (
        <div style={{ position: "fixed", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,.5)" }}>
          {rotationPopUpContent}
        </div>
      )}
      {positionPopUpVisible && (
        <div style={{ position: "fixed", top: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,.5)" }}>
          {positionPopUpContent}
        </div>
      )}
      <Canvas className='w-full h-screen bg-transparent' camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.25} />
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={2}/>
          <Fish />
          <Ocean />
          <Island 
            scale={islandScale}
            position={islandPosition}
            rotation={islandRotation}
            isRotating={isRotating}
            scrollAccumulation={scrollAccumulation}
            setIsRotating={setIsRotating}
            showRotationPopUp={showRotationPopUp}
            showPositionPopUp={showPositionPopUp}
          />
          <Diver
            isRotating={isRotating}
            scale={diverScale}
            position={diverPosition}
            rotation={[0, 20, 0]}
          />
        </Suspense>
      </Canvas>
    </section>
  );
}

export default Home;