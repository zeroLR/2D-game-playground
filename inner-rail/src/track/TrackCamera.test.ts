import {
  COMPACT_PUZZLE_ROOM_TRACK,
  ROOM_LOWER_Y,
  ROOM_UPPER_Y,
} from './CompactPuzzleRoomTrack.js';
import { resolveTrackForward } from './TrackCamera.js';
import { VALIDATION_TRACK } from './TestTrack.js';

const near = (actual: number, expected: number, epsilon = 1e-6): void => {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
};

{
  const sample = resolveTrackForward({ x: 0, y: 1, z: -31.5 }, VALIDATION_TRACK);
  if (sample.pieceId !== 'a-deck') throw new Error(`Expected a-deck, got ${String(sample.pieceId)}`);
  near(sample.yawRad, 0);
}

{
  const sample = resolveTrackForward({ x: 9, y: 1, z: 51.9 }, VALIDATION_TRACK);
  if (sample.pieceId !== 'e-b3') throw new Error(`Expected e-b3, got ${String(sample.pieceId)}`);
  near(sample.yawRad, (38 * Math.PI) / 180);
}

{
  const sample = resolveTrackForward({ x: 24, y: 1, z: 55.5 }, VALIDATION_TRACK);
  if (sample.pieceId !== 'f-brake') throw new Error(`Expected f-brake, got ${String(sample.pieceId)}`);
  near(sample.yawRad, Math.PI / 2);
}

{
  // The resolver depends on authored track position, not ball velocity. A ball
  // moving backward at this point therefore retains the same forward heading.
  const forward = resolveTrackForward({ x: 2.5, y: 1, z: 12 }, VALIDATION_TRACK);
  const backward = resolveTrackForward({ x: 2.5, y: 1, z: 12 }, VALIDATION_TRACK);
  near(forward.yawRad, backward.yawRad);
  near(backward.yawRad, 0);
}

{
  // P2 intentionally stacks the goal route above an earlier lower turn. The
  // same X/Z position must resolve to the route at the player's elevation.
  const lower = resolveTrackForward(
    { x: 0, y: ROOM_LOWER_Y + 1, z: -0.5 },
    COMPACT_PUZZLE_ROOM_TRACK,
  );
  if (lower.pieceId !== 'room-lower-turn-west') {
    throw new Error(`Expected lower stacked route, got ${String(lower.pieceId)}`);
  }
  near(lower.yawRad, -Math.PI / 4);

  const upper = resolveTrackForward(
    { x: 0, y: ROOM_UPPER_Y + 1, z: -0.5 },
    COMPACT_PUZZLE_ROOM_TRACK,
  );
  if (upper.pieceId !== 'room-goal') {
    throw new Error(`Expected upper stacked route, got ${String(upper.pieceId)}`);
  }
  near(upper.yawRad, -Math.PI / 2);
}

console.log('Inner Rail track camera tests passed.');
