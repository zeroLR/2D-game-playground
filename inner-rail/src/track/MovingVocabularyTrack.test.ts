import {
  MOVING_RAIL_PERIOD_SECONDS,
  MOVING_RAIL_TRAVEL,
  MOVING_VOCABULARY_TRACK,
} from './MovingVocabularyTrack.js';
import { sampleTrackPieceMotion } from './TrackMotion.js';

const movingPieces = MOVING_VOCABULARY_TRACK.pieces.filter((piece) => piece.motion);
if (movingPieces.length !== 1) throw new Error('P1.2 should isolate exactly one moving rail piece.');

const shuttle = movingPieces[0];
if (shuttle.surface !== 'moving') throw new Error('Moving rail must use the moving surface language.');
if (shuttle.motion?.kind !== 'sine-translate') throw new Error('P1.2 moving rail must use predictable sinusoidal translation.');
if (MOVING_RAIL_PERIOD_SECONDS !== 6) throw new Error('P1.2 cycle should remain six seconds for phone timing validation.');
if (MOVING_RAIL_TRAVEL !== 4.8) throw new Error('P1.2 shuttle travel should remain 4.8 world units.');

const aligned = sampleTrackPieceMotion(shuttle, 0);
const away = sampleTrackPieceMotion(shuttle, MOVING_RAIL_PERIOD_SECONDS / 2);
if (Math.abs(aligned.position.x) > 1e-6) throw new Error('Shuttle should start aligned with the route.');
if (Math.abs(away.position.x - MOVING_RAIL_TRAVEL) > 1e-6) {
  throw new Error('Shuttle should reach the authored lateral turnaround.');
}

const wait = MOVING_VOCABULARY_TRACK.pieces.find((piece) => piece.id === 'mv-wait');
const exit = MOVING_VOCABULARY_TRACK.pieces.find((piece) => piece.id === 'mv-exit');
if (!wait || !exit) throw new Error('P1.2 route requires waiting and exit decks.');

const waitEndZ = wait.position.z + wait.size.z / 2;
const exitStartZ = exit.position.z - exit.size.z / 2;
if (!(exitStartZ - waitEndZ > 6)) {
  throw new Error('P1.2 should contain a real forward gap that only the moving rail can bridge.');
}

const hiddenStaticBridge = MOVING_VOCABULARY_TRACK.pieces.some((piece) => {
  if (piece.id === shuttle.id || piece.id === wait.id || piece.id === exit.id) return false;
  const minZ = piece.position.z - piece.size.z / 2;
  const maxZ = piece.position.z + piece.size.z / 2;
  return minZ < exitStartZ && maxZ > waitEndZ;
});
if (hiddenStaticBridge) throw new Error('Moving crossing must not be masked by a hidden static floor.');

if (MOVING_VOCABULARY_TRACK.pieces.some((piece) => piece.surface === 'magnetic')) {
  throw new Error('P1.2 must isolate moving-rail timing without Magnetic Rail composition.');
}

console.log('Inner Rail moving vocabulary track tests passed.');
