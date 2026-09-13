import {
  COMPACT_PUZZLE_ROOM_TRACK,
  ROOM_LIFT_PERIOD_SECONDS,
  ROOM_LOWER_Y,
  ROOM_MOVING_BRIDGE_PERIOD_SECONDS,
  ROOM_MOVING_BRIDGE_TRAVEL,
  ROOM_RISE,
  ROOM_UPPER_Y,
} from './CompactPuzzleRoomTrack.js';
import { sampleTrackPieceMotion } from './TrackMotion.js';

const near = (actual: number, expected: number, epsilon = 1e-6): void => {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
};

const start = COMPACT_PUZZLE_ROOM_TRACK.start.position;
const goal = COMPACT_PUZZLE_ROOM_TRACK.goal.center;
const goalHorizontalDistance = Math.hypot(goal.x - start.x, goal.z - start.z);
if (goalHorizontalDistance > 9) throw new Error('P2.1 goal should remain spatially close enough to read from the start.');
if (goal.y - start.y < 4) throw new Error('P2.1 goal should clearly establish an elevated destination.');

const lift = COMPACT_PUZZLE_ROOM_TRACK.pieces.find((piece) => piece.id === 'room-magnetic-lift');
if (!lift || lift.surface !== 'magnetic' || !lift.motion) {
  throw new Error('P2.1 should contain one moving magnetic lift composition.');
}
const liftStart = sampleTrackPieceMotion(lift, 0);
const liftTop = sampleTrackPieceMotion(lift, ROOM_LIFT_PERIOD_SECONDS / 2);
near(liftStart.position.y, ROOM_LOWER_Y);
near(liftTop.position.y, ROOM_UPPER_Y);
near(liftTop.position.y - liftStart.position.y, ROOM_RISE);

const bridge = COMPACT_PUZZLE_ROOM_TRACK.pieces.find((piece) => piece.id === 'room-moving-bridge');
if (!bridge || bridge.surface !== 'moving' || !bridge.motion) {
  throw new Error('P2.1 should retain one isolated ordinary moving bridge.');
}
const bridgeAligned = sampleTrackPieceMotion(bridge, 0);
const bridgeAway = sampleTrackPieceMotion(bridge, ROOM_MOVING_BRIDGE_PERIOD_SECONDS / 2);
near(bridgeAway.position.z - bridgeAligned.position.z, ROOM_MOVING_BRIDGE_TRAVEL);

const movingMagnetic = COMPACT_PUZZLE_ROOM_TRACK.pieces.filter(
  (piece) => piece.surface === 'magnetic' && piece.motion,
);
if (movingMagnetic.length !== 1) throw new Error('P2.1 should isolate exactly one composed moving magnetic surface.');

const unsupportedSurface = COMPACT_PUZZLE_ROOM_TRACK.pieces.find(
  (piece) => !['track', 'goal', 'magnetic', 'moving'].includes(piece.surface),
);
if (unsupportedSurface) throw new Error(`Unexpected P2.1 surface vocabulary: ${unsupportedSurface.surface}`);

const lowerPieces = COMPACT_PUZZLE_ROOM_TRACK.pieces.filter((piece) => piece.position.y < ROOM_LOWER_Y + 1);
const upperPieces = COMPACT_PUZZLE_ROOM_TRACK.pieces.filter((piece) => piece.position.y > ROOM_UPPER_Y - 1);
const spatialReuse = lowerPieces.some((lower) => upperPieces.some((upper) => {
  const horizontal = Math.hypot(lower.position.x - upper.position.x, lower.position.z - upper.position.z);
  const vertical = Math.abs(lower.position.y - upper.position.y);
  return horizontal < 2.5 && vertical > 4;
}));
if (!spatialReuse) throw new Error('P2.1 should revisit previously seen horizontal space from another elevation.');

const spanX = COMPACT_PUZZLE_ROOM_TRACK.bounds.maxX - COMPACT_PUZZLE_ROOM_TRACK.bounds.minX;
const spanZ = COMPACT_PUZZLE_ROOM_TRACK.bounds.maxZ - COMPACT_PUZZLE_ROOM_TRACK.bounds.minZ;
if (spanX > 24 || spanZ > 36) throw new Error('P2.1 should stay compact instead of becoming another long validation track.');

console.log('Inner Rail compact puzzle room tests passed.');
