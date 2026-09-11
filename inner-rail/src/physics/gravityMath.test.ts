import { cameraRelativeGravityToWorld } from './gravityMath.js';

const EPS = 1e-9;
const near = (actual: number, expected: number): void => {
  if (Math.abs(actual - expected) > EPS) {
    throw new Error(`Expected ${actual} to be within ${EPS} of ${expected}`);
  }
};

{
  const result = cameraRelativeGravityToWorld({ x: 0, y: -1, z: 0 }, 1.7);
  near(result.x, 0);
  near(result.y, -1);
  near(result.z, 0);
}

{
  const result = cameraRelativeGravityToWorld({ x: 0, y: -0.8, z: 0.6 }, 0);
  near(result.x, 0);
  near(result.y, -0.8);
  near(result.z, 0.6);
}

{
  const result = cameraRelativeGravityToWorld({ x: 0, y: -0.8, z: 0.6 }, Math.PI / 2);
  near(result.x, 0.6);
  near(result.y, -0.8);
  near(result.z, 0);
}

{
  const result = cameraRelativeGravityToWorld({ x: 0.6, y: -0.8, z: 0 }, Math.PI / 2);
  near(result.x, 0);
  near(result.y, -0.8);
  near(result.z, -0.6);
}

console.log('Inner Rail gravity math tests passed.');
