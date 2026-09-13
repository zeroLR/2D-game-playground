import {
  GUARDED_SPATIAL_PUZZLE_ROOM_A_TRACK,
  GUARDED_SPATIAL_PUZZLE_ROOM_B_TRACK,
  GUARDED_SPATIAL_PUZZLE_ROOM_C_TRACK,
} from './AuthoredSpatialPuzzleSet.js';
import { GUARDRAIL_ID_PREFIX, isGuardrailPiece } from './GuardrailPolicy.js';
import type { TrackPiece, ValidationTrackDefinition } from './TestTrack.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function guardrails(track: ValidationTrackDefinition): TrackPiece[] {
  return track.pieces.filter(isGuardrailPiece);
}

function profileCount(track: ValidationTrackDefinition, profile: 'curb' | 'rail'): number {
  return guardrails(track).filter((piece) =>
    piece.id.startsWith(`${GUARDRAIL_ID_PREFIX}${profile}-`),
  ).length;
}

const roomAGuards = guardrails(GUARDED_SPATIAL_PUZZLE_ROOM_A_TRACK);
const roomBGuards = guardrails(GUARDED_SPATIAL_PUZZLE_ROOM_B_TRACK);
const roomCGuards = guardrails(GUARDED_SPATIAL_PUZZLE_ROOM_C_TRACK);

assert(roomAGuards.length > roomBGuards.length, 'Teach room should carry more protection than Vary.');
assert(roomBGuards.length > roomCGuards.length, 'Vary room should carry more protection than Mastery.');
assert(profileCount(GUARDED_SPATIAL_PUZZLE_ROOM_A_TRACK, 'rail') > 0, 'Room A needs full safety rails.');
assert(profileCount(GUARDED_SPATIAL_PUZZLE_ROOM_B_TRACK, 'curb') > 0, 'Room B should mix rails with lower curbs.');
assert(profileCount(GUARDED_SPATIAL_PUZZLE_ROOM_C_TRACK, 'rail') > 0, 'Room C must still protect critical moving transfers.');

for (const guard of [...roomAGuards, ...roomBGuards, ...roomCGuards]) {
  assert(
    guard.surface === 'track' || guard.surface === 'moving',
    `Guardrail ${guard.id} must stay assistance geometry, not magnetic / goal vocabulary.`,
  );
  if (guard.motion) {
    assert(guard.surface === 'moving', `Moving guardrail ${guard.id} should use moving visual language.`);
  }
}

assert(
  roomAGuards.some((piece) => piece.id.includes('room-moving-bridge') && piece.id.includes('rail')),
  'Room A moving bridge should receive full rails.',
);
assert(
  roomBGuards.some((piece) => piece.id.includes('room-b-moving-bridge') && piece.id.includes('rail')),
  'Room B timing bridge should remain fully protected.',
);
assert(
  roomCGuards.some((piece) => piece.id.includes('room-c-magnetic-lift') && piece.id.includes('rail')),
  'Room C vertical moving magnetic lift should keep critical rails.',
);
assert(
  roomCGuards.some((piece) => piece.id.includes('room-c-magnetic-shuttle') && piece.id.includes('rail')),
  'Room C lateral moving magnetic shuttle should keep critical rails.',
);
assert(
  !roomCGuards.some((piece) => piece.id.includes('room-c-upper-south-a')),
  'Room C long mastery return should remain intentionally unguarded.',
);

console.log('Inner Rail progressive guardrail policy tests passed.');
