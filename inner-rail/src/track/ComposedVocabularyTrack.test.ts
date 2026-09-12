import {
  COMPOSED_SHUTTLE_MOTION,
  COMPOSED_SHUTTLE_PERIOD_SECONDS,
  COMPOSED_SHUTTLE_ROLL_DEG,
  COMPOSED_SHUTTLE_TRAVEL,
  COMPOSED_VOCABULARY_TRACK,
} from './ComposedVocabularyTrack.js';
import { sampleTrackPieceMotion } from './TrackMotion.js';

const shuttle = COMPOSED_VOCABULARY_TRACK.pieces.find((piece) => piece.id === 'cmp-magnetic-shuttle');
if (!shuttle) throw new Error('Expected composed magnetic shuttle piece.');
if (shuttle.surface !== 'magnetic') throw new Error('Composition shuttle must remain magnetic.');
if (!shuttle.motion) throw new Error('Composition shuttle must also be kinematic.');
if (COMPOSED_SHUTTLE_ROLL_DEG !== 48) throw new Error('First composition should use the authored 48° bank.');
if (COMPOSED_SHUTTLE_PERIOD_SECONDS !== 7) throw new Error('Composition timing cycle should remain seven seconds.');
if (Math.abs(COMPOSED_SHUTTLE_TRAVEL - 5.2) > 1e-9) throw new Error('Composition shuttle travel should remain 5.2 world units.');
if (COMPOSED_SHUTTLE_MOTION !== shuttle.motion) throw new Error('Track should use the exported composition motion contract.');

const start = sampleTrackPieceMotion(shuttle, 0);
const opposite = sampleTrackPieceMotion(shuttle, COMPOSED_SHUTTLE_PERIOD_SECONDS / 2);
if (Math.abs(start.position.x + 2.6) > 1e-6) throw new Error(`Shuttle should start aligned to entry at x=-2.6, got ${start.position.x}.`);
if (Math.abs(opposite.position.x - 2.6) > 1e-6) throw new Error(`Shuttle should align to receiver at x=2.6 halfway through the cycle, got ${opposite.position.x}.`);

const receiver = COMPOSED_VOCABULARY_TRACK.pieces.find((piece) => piece.id === 'cmp-receiver-48');
if (!receiver || receiver.surface !== 'magnetic') throw new Error('Receiver must preserve magnetic attachment.');
if (Math.abs(receiver.position.x - opposite.position.x) > 1e-6) throw new Error('Receiver should align with the shuttle at the opposite motion extreme.');
if (Math.abs(receiver.rotation.z - shuttle.rotation.z) > 1e-9) throw new Error('Shuttle and receiver must share the same bank angle for readable transfer.');

const movingMagneticPieces = COMPOSED_VOCABULARY_TRACK.pieces.filter(
  (piece) => piece.surface === 'magnetic' && piece.motion,
);
if (movingMagneticPieces.length !== 1) throw new Error('First composition should isolate exactly one moving magnetic collider.');
if (COMPOSED_VOCABULARY_TRACK.pieces.some((piece) => piece.surface === 'moving')) {
  throw new Error('Composition route should not add a separate ordinary moving platform.');
}

console.log('Inner Rail composed vocabulary track tests passed.');
