import {
  MAGNETIC_TRANSITION_ROLL_DEG,
  MAGNETIC_VOCABULARY_TRACK,
  MAGNETIC_WALL_RIDE_ANGLE_RAD,
} from './MagneticVocabularyTrack.js';

const DEG = Math.PI / 180;

const maxRollDeg = Math.max(...MAGNETIC_TRANSITION_ROLL_DEG);
if (maxRollDeg !== 78) throw new Error(`Expected P1.1.2 wall ride to cap at 78°, got ${maxRollDeg}°.`);

for (let index = 1; index < MAGNETIC_TRANSITION_ROLL_DEG.length; index += 1) {
  const delta = Math.abs(MAGNETIC_TRANSITION_ROLL_DEG[index] - MAGNETIC_TRANSITION_ROLL_DEG[index - 1]);
  if (delta > 12) throw new Error(`Magnetic transition step ${index} changes ${delta}°, above the 12° readability cap.`);
}

if (Math.abs(MAGNETIC_WALL_RIDE_ANGLE_RAD - 78 * DEG) > 1e-9) {
  throw new Error('Wall-ride angle export should match the authored 78° cap.');
}

const transitionPieces = MAGNETIC_VOCABULARY_TRACK.pieces.filter((piece) => piece.id.startsWith('m-transition-'));
if (transitionPieces.length !== MAGNETIC_TRANSITION_ROLL_DEG.length) {
  throw new Error('Every authored transition angle should map to exactly one track piece.');
}

for (let index = 1; index < transitionPieces.length; index += 1) {
  const previous = transitionPieces[index - 1];
  const current = transitionPieces[index];
  const spacing = current.position.z - previous.position.z;
  const halfLengthSum = previous.size.z / 2 + current.size.z / 2;
  if (!(spacing < halfLengthSum)) {
    throw new Error(`Transition pieces ${previous.id} and ${current.id} should overlap slightly to avoid a hard seam gap.`);
  }
}

console.log('Inner Rail magnetic vocabulary track tests passed.');
