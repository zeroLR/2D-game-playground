import {
  MAGNETIC_RELEASE_GAP,
  MAGNETIC_RELEASE_ROLL_DEG,
  MAGNETIC_TRANSITION_ROLL_DEG,
  MAGNETIC_VOCABULARY_TRACK,
  MAGNETIC_WALL_RIDE_ANGLE_RAD,
} from './MagneticVocabularyTrack.js';

const DEG = Math.PI / 180;

const maxRollDeg = Math.max(...MAGNETIC_TRANSITION_ROLL_DEG);
if (maxRollDeg !== 78) throw new Error(`Expected magnetic wall ride to cap at 78°, got ${maxRollDeg}°.`);

for (let index = 1; index < MAGNETIC_TRANSITION_ROLL_DEG.length; index += 1) {
  const delta = Math.abs(MAGNETIC_TRANSITION_ROLL_DEG[index] - MAGNETIC_TRANSITION_ROLL_DEG[index - 1]);
  if (delta > 12) throw new Error(`Magnetic transition step ${index} changes ${delta}°, above the 12° readability cap.`);
}

if (Math.abs(MAGNETIC_WALL_RIDE_ANGLE_RAD - 78 * DEG) > 1e-9) {
  throw new Error('Wall-ride angle export should match the authored 78° cap.');
}

if (MAGNETIC_TRANSITION_ROLL_DEG[MAGNETIC_TRANSITION_ROLL_DEG.length - 1] !== MAGNETIC_RELEASE_ROLL_DEG) {
  throw new Error('Magnetic decision gate should release while the surface is still banked.');
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

const lastMagnetic = transitionPieces[transitionPieces.length - 1];
const landing = MAGNETIC_VOCABULARY_TRACK.pieces.find((piece) => piece.id === 'm-release-landing');
if (!landing) throw new Error('P1.1.3 should author an ordinary landing after magnetic release.');
if (landing.surface !== 'track') throw new Error('Release landing must use ordinary track physics.');

const actualGap = landing.position.z - landing.size.z / 2 - (lastMagnetic.position.z + lastMagnetic.size.z / 2);
if (Math.abs(actualGap - MAGNETIC_RELEASE_GAP) > 1e-9) {
  throw new Error(`Expected ${MAGNETIC_RELEASE_GAP}m magnetic release gap, got ${actualGap}m.`);
}
if (!(landing.position.y < lastMagnetic.position.y - 0.8)) {
  throw new Error('Release catch deck should sit visibly below the magnetic wall ride.');
}
if (!(landing.position.x < -0.5)) {
  throw new Error('Release catch deck should align beneath the banked magnetic surface rather than masking the release with a centered floor.');
}

console.log('Inner Rail magnetic vocabulary track tests passed.');
