import { strict as assert } from 'node:assert';
import { dampAngle, shortestAngleDeltaRad, velocityHeadingRad } from './cameraMath.js';

const near = (actual: number, expected: number, epsilon = 1e-6): void => {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
};

near(velocityHeadingRad(0, 1), 0);
near(velocityHeadingRad(1, 0), Math.PI / 2);
near(shortestAngleDeltaRad((170 * Math.PI) / 180, (-170 * Math.PI) / 180), (20 * Math.PI) / 180);

{
  const current = (170 * Math.PI) / 180;
  const target = (-170 * Math.PI) / 180;
  const next = dampAngle(current, target, 6, 1 / 60);
  assert.ok(shortestAngleDeltaRad(current, next) > 0, 'camera should take the short path across ±π');
}

console.log('cameraMath tests passed');
