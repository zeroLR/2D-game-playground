import {
  GENERALIZATION_LIFT_MOTION,
  GENERALIZATION_LIFT_PERIOD_SECONDS,
  GENERALIZATION_LIFT_RISE,
  GENERALIZATION_LIFT_ROLL_DEG,
  GENERALIZATION_UPPER_Y,
  GENERALIZED_COMPOSITION_TRACK,
} from './GeneralizedCompositionTrack.js';
import { sampleTrackPieceMotion } from './TrackMotion.js';

const lift = GENERALIZED_COMPOSITION_TRACK.pieces.find((piece) => piece.id === 'gen-magnetic-lift');
if (!lift) throw new Error('Expected generalized magnetic lift piece.');
if (lift.surface !== 'magnetic') throw new Error('Generalization lift must remain magnetic.');
if (!lift.motion) throw new Error('Generalization lift must also be kinematic.');
if (GENERALIZATION_LIFT_ROLL_DEG !== 36) throw new Error('Generalization lift should use the authored 36° bank.');
if (GENERALIZATION_LIFT_PERIOD_SECONDS !== 8) throw new Error('Generalization cycle should remain eight seconds.');
if (Math.abs(GENERALIZATION_LIFT_RISE - 4.6) > 1e-9) throw new Error('Generalization lift rise should remain 4.6 world units.');
if (GENERALIZATION_LIFT_MOTION !== lift.motion) throw new Error('Track should use the exported lift motion contract.');

const lower = sampleTrackPieceMotion(lift, 0);
const upper = sampleTrackPieceMotion(lift, GENERALIZATION_LIFT_PERIOD_SECONDS / 2);
if (Math.abs(lower.position.y + 0.25) > 1e-6) {
  throw new Error(`Lift should start at the lower dock y=-0.25, got ${lower.position.y}.`);
}
if (Math.abs(upper.position.y - GENERALIZATION_UPPER_Y) > 1e-6) {
  throw new Error(`Lift should reach the upper dock y=${GENERALIZATION_UPPER_Y}, got ${upper.position.y}.`);
}
if (Math.abs(lower.position.x - upper.position.x) > 1e-9 || Math.abs(lower.position.z - upper.position.z) > 1e-9) {
  throw new Error('Second composition must be vertical translation rather than another lateral shuttle.');
}

const receiver = GENERALIZED_COMPOSITION_TRACK.pieces.find((piece) => piece.id === 'gen-upper-receiver-36');
if (!receiver || receiver.surface !== 'magnetic') throw new Error('Upper receiver must preserve magnetic attachment.');
if (Math.abs(receiver.position.y - upper.position.y) > 1e-6) throw new Error('Upper receiver should align with the lift at the high motion extreme.');
if (Math.abs(receiver.rotation.z - lift.rotation.z) > 1e-9) throw new Error('Lift and receiver must share the same bank angle for readable transfer.');

const movingMagneticPieces = GENERALIZED_COMPOSITION_TRACK.pieces.filter(
  (piece) => piece.surface === 'magnetic' && piece.motion,
);
if (movingMagneticPieces.length !== 1) throw new Error('Generalization route should isolate exactly one moving magnetic collider.');
if (GENERALIZED_COMPOSITION_TRACK.pieces.some((piece) => piece.surface === 'moving')) {
  throw new Error('Generalization route must not introduce a separate ordinary moving platform.');
}

console.log('Inner Rail generalized composition track tests passed.');
