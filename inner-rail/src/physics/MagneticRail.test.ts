import { sampleMagneticRail } from './MagneticRail.js';
import type { TrackPiece } from '../track/TestTrack.js';

const DEG = Math.PI / 180;

function near(actual: number, expected: number, epsilon = 1e-6): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
}

function piece(surface: TrackPiece['surface'], rollDeg = 0): TrackPiece {
  return {
    id: 'test-piece',
    section: 'magnetic-overhang',
    position: { x: 0, y: -0.25, z: 0 },
    size: { x: 4, y: 0.5, z: 6 },
    rotation: { x: 0, y: 0, z: rollDeg * DEG },
    surface,
  };
}

{
  const sample = sampleMagneticRail({ x: 0, y: 0.65, z: 0 }, 0.65, [piece('magnetic')]);
  if (!sample.active || sample.pieceId !== 'test-piece') throw new Error('Flat magnetic rail should capture the sphere.');
  near(sample.strength, 1);
  near(sample.acceleration.x, 0);
  if (!(sample.acceleration.y < -17.9)) throw new Error('Flat magnetic rail should pull toward the surface.');
}

{
  const sample = sampleMagneticRail({ x: 8, y: 0.65, z: 0 }, 0.65, [piece('magnetic')]);
  if (sample.active) throw new Error('Magnetic field must not act outside the authored footprint.');
}

{
  const sample = sampleMagneticRail({ x: 0, y: 0.65, z: 0 }, 0.65, [piece('track')]);
  if (sample.active) throw new Error('Ordinary track pieces must never emit magnetic attachment force.');
}

{
  const roll = 115 * DEG;
  const localSurfaceCenter = { x: 0, y: 0.9, z: 0 };
  const worldOffset = {
    x: -localSurfaceCenter.y * Math.sin(roll),
    y: localSurfaceCenter.y * Math.cos(roll),
    z: 0,
  };
  const sample = sampleMagneticRail(
    { x: worldOffset.x, y: -0.25 + worldOffset.y, z: 0 },
    0.65,
    [piece('magnetic', 115)],
  );
  if (!sample.active) throw new Error('Overhanging magnetic rail should remain attached at contact range.');
  if (!(sample.acceleration.y > 0)) {
    throw new Error('Overhanging magnetic rail must pull upward against gravity on its authored outer face.');
  }
}

{
  const sample = sampleMagneticRail({ x: 0, y: 1.1, z: 0 }, 0.65, [piece('magnetic')]);
  if (!(sample.strength > 0 && sample.strength < 1)) {
    throw new Error('Magnetic capture should fall off smoothly before contact.');
  }
}

console.log('Inner Rail magnetic rail tests passed.');
