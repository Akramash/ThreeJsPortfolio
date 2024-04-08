import React, { createContext, useContext, useState } from 'react';

const AnimationControlContext = createContext();

export const useAnimationControl = () => useContext(AnimationControlContext);

export const AnimationControlProvider = ({ children }) => {
  const [isHalfway, setIsHalfway] = useState(false);
  const [pendingScrollAccumulation, setPendingScrollAccumulation] = useState(0);
  // Initialize the new state for diver's rotation
  const [isDiverRotating, setIsDiverRotating] = useState(false);
  // Initialize the new state for last scroll direction ('up', 'down', or null to start)
  const [lastScrollDirection, setLastScrollDirection] = useState('initial');

  // Expand the value object to expose these new states and setters
  const value = {
    isHalfway,
    setIsHalfway,
    pendingScrollAccumulation,
    setPendingScrollAccumulation,
    isDiverRotating, // Expose isDiverRotating state
    setIsDiverRotating, // Expose setIsDiverRotating function
    lastScrollDirection, // Expose lastScrollDirection state
    setLastScrollDirection, // Expose setLastScrollDirection function
  };

  return (
    <AnimationControlContext.Provider value={value}>
      {children}
    </AnimationControlContext.Provider>
  );
};