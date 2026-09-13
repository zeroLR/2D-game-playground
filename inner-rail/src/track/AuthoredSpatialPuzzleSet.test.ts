import { AUTHORED_SPATIAL_PUZZLE_SET } from './AuthoredSpatialPuzzleSet.js';
import { SPATIAL_PUZZLE_ROOM_B_TRACK } from './SpatialPuzzleRoomBTrack.js';
import { SPATIAL_PUZZLE_ROOM_C_TRACK } from './SpatialPuzzleRoomCTrack.js';
import type { TrackPiece, ValidationTrackDefinition } from './TestTrack.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function hasVerticalReuse(track: ValidationTrackDefinition): boolean {
  for (let i = 0; i < track.pieces.length; i += 1) {
    const a = track.pieces[i];
    for (let j = i + 1; j < track.pieces.length; j += 1) {
      const b = track.pieces[j];
      const horizontalDistance = Math.hypot(a.position.x - b.position.x, a.position.z - b.position.z);
      const verticalDistance = Math.abs(a.position.y - b.position.y);
      if (horizontalDistance <= 4.5 && verticalDistance >= 3.5) return true;
    }
  }
  return false;
}

function movingMagneticPieces(track: ValidationTrackDefinition): TrackPiece[] {
  return track.pieces.filter((piece) => piece.surface === 'magnetic' && Boolean(piece.motion));
}

assert(AUTHORED_SPATIAL_PUZZLE_SET.length === 3, 'P2.2 should stay a compact three-room authored set.');
assert(
  AUTHORED_SPATIAL_PUZZLE_SET.map((room) => room.role).join(',') === 'teach,vary,mastery',
  'P2.2 progression should remain teach → vary → mastery.',
);
assert(
  new Set(AUTHORED_SPATIAL_PUZZLE_SET.map((room) => room.id)).size === AUTHORED_SPATIAL_PUZZLE_SET.length,
  'Each authored room must keep a stable unique stage id.',
);

for (const room of AUTHORED_SPATIAL_PUZZLE_SET) {
  const surfaces = new Set(room.track.pieces.map((piece) => piece.surface));
  for (const surface of surfaces) {
    assert(
      surface === 'track' || surface === 'goal' || surface === 'magnetic' || surface === 'moving',
      `${room.id} introduced unsupported surface vocabulary: ${surface}`,
    );
  }
  assert(
    room.track.goal.center.y - room.track.start.position.y >= 3.5,
    `${room.id} should make elevation part of the spatial plan.`,
  );
  assert(hasVerticalReuse(room.track), `${room.id} should reuse chamber space at more than one height.`);
}

const roomBBridgeIndex = SPATIAL_PUZZLE_ROOM_B_TRACK.pieces.findIndex(
  (piece) => piece.id === 'room-b-moving-bridge',
);
const roomBLiftIndex = SPATIAL_PUZZLE_ROOM_B_TRACK.pieces.findIndex(
  (piece) => piece.id === 'room-b-magnetic-lift',
);
assert(roomBBridgeIndex >= 0 && roomBLiftIndex >= 0, 'Room B must contain both authored moving relationships.');
assert(
  roomBBridgeIndex < roomBLiftIndex,
  'Room B variation must move the timing crossing before the elevation change.',
);
assert(
  movingMagneticPieces(SPATIAL_PUZZLE_ROOM_B_TRACK).length === 1,
  'Room B should keep one moving magnetic lift and one separate ordinary moving bridge.',
);

const roomCMovingMagnetic = movingMagneticPieces(SPATIAL_PUZZLE_ROOM_C_TRACK);
assert(
  roomCMovingMagnetic.length === 2,
  'Room C mastery should compose exactly two known moving-magnetic relationships.',
);
assert(
  roomCMovingMagnetic.some((piece) => piece.id === 'room-c-magnetic-lift'),
  'Room C must reuse the vertical moving magnetic lift relationship.',
);
assert(
  roomCMovingMagnetic.some((piece) => piece.id === 'room-c-magnetic-shuttle'),
  'Room C must reuse the lateral moving magnetic shuttle relationship.',
);
assert(
  !SPATIAL_PUZZLE_ROOM_C_TRACK.pieces.some((piece) => piece.surface === 'moving'),
  'Room C mastery should not add a separate ordinary moving platform on top of the two composed relationships.',
);

console.log('Inner Rail authored spatial puzzle set tests passed.');
