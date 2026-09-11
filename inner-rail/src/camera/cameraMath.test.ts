import { dampAngle, shortestAngleDeltaRad, velocityHeadingRad } from './cameraMath.js';

const near = (actual: number, expected: number, epsilon = 1e-6): void => {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
};

near(velocityHeadingRad(0, 1), 0);
near(velocityHeadingRad(1, 0), Math.PI / 2);
near(shortestAngleDeltaRad((170 * Math.PI) / 180, (-170 * Math.PI) / 180), (20 * Math.PI) / 180);

{
  const current = (170 * Math.PI) / 180;
  const target = (-170 * Math.PI) / 180;
  const next = dampAngle(current, target, 6, 1 / 60);
  if (shortestAngleDeltaRad(current, next) <= 0) {
    throw new Error('Camera should take the short path across ±π.');
  }
}

console.log('Inner Rail camera math tests passed.');
