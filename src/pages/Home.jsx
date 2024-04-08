import React, { useState, Suspense, useEffect } from 'react'; // Added useEffect here
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import { AnimationControlProvider } from '../components/AnimationControlContext';
import Island from '../models/Island';
import Ocean from '../models/Ocean';
import Fish from '../models/Fish';
import Diver from '../models/Diver';

const Home = () => {
  const [positionPopUpVisible, setPositionPopUpVisible] = useState(false);
  const [positionPopUpContent, setPositionPopUpContent] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [startDiverAnimation, setStartDiverAnimation] = useState(false); // Added state to control diver animation
  const [scrollAccumulation, setScrollAccumulation] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down'); // Default to 'down'


  useEffect(() => {
    const handleDiverHalfway = () => {
      setIsRotating(true); // Enable island spinning when diver animation is halfway
    };

    document.addEventListener('diverAnimationHalfway', handleDiverHalfway);

    return () => {
      document.removeEventListener('diverAnimationHalfway', handleDiverHalfway);
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      setStartDiverAnimation(true); // Start diver animation on scroll
      // Removed setIsRotating(true) here to delay island rotation
      const newDirection = e.deltaY > 0 ? 'down' : 'up';
      if (scrollDirection !== newDirection) {
        setScrollDirection(newDirection);
      }
      setScrollAccumulation((prev) => {
        const delta = e.deltaY * 0.2;
        const newAccumulation = prev + delta;
        const minAccumulationValue = 0;
        const maxAccumulationValue = 2000;
        return Math.min(Math.max(newAccumulation, minAccumulationValue), maxAccumulationValue);
      });
    };

    const handleScrollEnd = () => {
      setIsRotating(false);
      setStartDiverAnimation(false); // Reset diver animation trigger
    };

    let scrollEndTimer;
    const debounceScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('wheel', debounceScrollEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', debounceScrollEnd);
    };
  }, [scrollDirection]);

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


  const showPositionPopUp = (positionStage) => {
    setPositionPopUpContent(`You've entered position stage: ${positionStage}`);
    setPositionPopUpVisible(true);
    setTimeout(() => setPositionPopUpVisible(false), 3000); // Automatically hide the pop-up after 3 seconds
  };

  return (
    <section className={`w-full h-screen relative ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}>
      {positionPopUpVisible && (
        <div style={{ position: "fixed", top: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,.5)" }}>
          {positionPopUpContent}
        </div>
      )}
      <AnimationControlProvider> {/* Wrap Canvas with AnimationControlProvider */}
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
              showPositionPopUp={showPositionPopUp}
            />
            <Diver
              isRotating={isRotating}
              startAnimation={startDiverAnimation}
              scale={diverScale}
              position={diverPosition}
              rotation={[0, scrollDirection === 'down' ? 20 : -114.5, 0]}
            />
          </Suspense>
        </Canvas>
      </AnimationControlProvider>
    </section>
  );
}

export default Home;
