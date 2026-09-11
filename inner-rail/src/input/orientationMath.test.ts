import {
  applyAxisResponse,
  correctForScreenOrientation,
  normalizeDegrees,
  normalizedTiltToGravityDirection,
  relativeTilt,
  shortestAngleDelta,
} from './orientationMath.js';

function assertClose(actual: number, expected: number, epsilon = 1e-6): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
}

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${String(actual)} to equal ${String(expected)}`);
}

assertEqual(normalizeDegrees(270), -90);
assertEqual(shortestAngleDelta(170, -170), 20);

const portrait = correctForScreenOrientation(10, 4, 0);
assertClose(portrait.x, 4);
assertClose(portrait.y, 10);

const landscapeRight = correctForScreenOrientation(10, 4, 90);
assertClose(landscapeRight.x, 10);
assertClose(landscapeRight.y, -4);

const landscapeLeft = correctForScreenOrientation(10, 4, -90);
assertClose(landscapeLeft.x, -10);
assertClose(landscapeLeft.y, 4);

const upsideDown = correctForScreenOrientation(10, 4, 180);
assertClose(upsideDown.x, -4);
assertClose(upsideDown.y, -10);

const relative = relativeTilt({ x: -175, y: 20 }, { x: 175, y: 8 });
assertClose(relative.x, 10);
assertClose(relative.y, 12);

assertEqual(applyAxisResponse(1, 1.5, 25), 0);
assertClose(applyAxisResponse(25, 1.5, 25), 1);
assertClose(applyAxisResponse(-25, 1.5, 25), -1);

const gravity = normalizedTiltToGravityDirection({ x: 0.7, y: -0.45 });
assertClose(Math.hypot(gravity.x, gravity.y, gravity.z), 1);
if (gravity.y >= 0) throw new Error('Gravity must retain a downward component.');

console.log('Inner Rail orientation math tests passed.');
