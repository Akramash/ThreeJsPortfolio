import { Vector3, Euler } from 'three';

export const compareVectors = (v1, v2) => {
  return v1.distanceTo(v2) < 0.1; // Adjust threshold as needed
};

export const compareEulers = (e1, e2) => {
    // Manually subtract the components of Euler angles
    const delta = new Euler(
      e1.x - e2.x,
      e1.y - e2.y,
      e1.z - e2.z
    );
  
    // Adjust the threshold as needed
    return Math.abs(delta.x) + Math.abs(delta.y) + Math.abs(delta.z) < 0.1;
  };