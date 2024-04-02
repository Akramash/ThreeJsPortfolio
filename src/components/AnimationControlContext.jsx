import React, { createContext, useContext, useState } from 'react';

const AnimationControlContext = createContext();

export const useAnimationControl = () => useContext(AnimationControlContext);

export const AnimationControlProvider = ({ children }) => {
  const [isHalfway, setIsHalfway] = useState(false);
  const [pendingScrollAccumulation, setPendingScrollAccumulation] = useState(0); // New state for pending scroll

  const value = {
    isHalfway,
    setIsHalfway,
    pendingScrollAccumulation, // Expose pending scroll accumulation state
    setPendingScrollAccumulation, // Expose function to set pending scroll accumulation
  };

  return (
    <AnimationControlContext.Provider value={value}>
      {children}
    </AnimationControlContext.Provider>
  );
};