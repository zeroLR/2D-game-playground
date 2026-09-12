import { sampleTrackPieceMotion } from './TrackMotion.js';
import type { TrackPiece } from './TestTrack.js';

function near(actual: number, expected: number, epsilon = 1e-6): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}.`);
  }
}

const piece: TrackPiece = {
  id: 'moving-test',
  section: 'moving-crossing',
  position: { x: 2.4, y: -0.25, z: -3.5 },
  size: { x: 3.2, y: 0.5, z: 7.4 },
  rotation: { x: 0, y: 0, z: 0 },
  surface: 'moving',
  motion: {
    kind: 'sine-translate',
    axis: { x: 1, y: 0, z: 0 },
    amplitude: 2.4,
    periodSeconds: 6,
    phaseRad: -Math.PI / 2,
  },
};

{
  const sample = sampleTrackPieceMotion(piece, 0);
  near(sample.position.x, 0);
  near(sample.linearVelocity.x, 0);
}

{
  const sample = sampleTrackPieceMotion(piece, 3);
  near(sample.position.x, 4.8);
  near(sample.linearVelocity.x, 0);
}

{
  const sample = sampleTrackPieceMotion(piece, 6);
  near(sample.position.x, 0);
  near(sample.linearVelocity.x, 0);
}

{
  const sample = sampleTrackPieceMotion(piece, 1.5);
  near(sample.position.x, 2.4);
  if (!(sample.linearVelocity.x > 2.4)) {
    throw new Error('Quarter-cycle moving rail should be traveling laterally at useful speed.');
  }
}

console.log('Inner Rail track motion tests passed.');
