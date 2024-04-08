import { Vector3, Euler } from 'three';

const stages = [
  {
    position: new Vector3(0, -275, -100.5),
    rotation: new Euler(0, -Math.PI / 1.35, 0),
    popupContent: "Welcome to the Island",
    route: "/about"
  },
  {
    position: new Vector3(0, -225, -100.5),
    rotation: new Euler(0, -Math.PI / 0.75, 0),
    popupContent: "Discover the Forest",
    route: "/Projects"
  },
  {
    position: new Vector3(0, -150, -100.5),
    rotation: new Euler(0, -Math.PI / 0.52, 0),
    popupContent: "Discover the Forest",
    route: "/contact"
  },
  {
    position: new Vector3(0, -50, -100.5),
    rotation: new Euler(0, -Math.PI / 0.38, 0),
    popupContent: "Discover the Forest",
    route: "/credit"
  },
  // Add other stages similarly...
];

export default stages;