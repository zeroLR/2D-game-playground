import { COMPACT_PUZZLE_ROOM_TRACK } from './CompactPuzzleRoomTrack.js';
import {
  applyGuardrailPolicy,
  type GuardrailPolicy,
} from './GuardrailPolicy.js';
import { SPATIAL_PUZZLE_ROOM_B_TRACK } from './SpatialPuzzleRoomBTrack.js';
import { SPATIAL_PUZZLE_ROOM_C_TRACK } from './SpatialPuzzleRoomCTrack.js';
import type { TrackPiece, ValidationTrackDefinition } from './TestTrack.js';

export type AuthoredSpatialPuzzleRoomId = 'p2-room-a' | 'p2-room-b' | 'p2-room-c';
export type AuthoredSpatialPuzzleRole = 'teach' | 'vary' | 'mastery';

export interface AuthoredSpatialPuzzleRoom {
  id: AuthoredSpatialPuzzleRoomId;
  role: AuthoredSpatialPuzzleRole;
  track: ValidationTrackDefinition;
  title: string;
  body: string;
}

function noGoalGuardrail(piece: TrackPiece): boolean {
  return piece.surface !== 'goal';
}

const ROOM_A_GUARDRAILS: GuardrailPolicy = (piece) => {
  if (!noGoalGuardrail(piece)) return null;
  if (piece.motion) return 'rail';
  if (piece.surface === 'magnetic') return 'curb';
  return 'rail';
};

const ROOM_B_GUARDRAILS: GuardrailPolicy = (piece) => {
  if (!noGoalGuardrail(piece)) return null;
  if (piece.motion) return 'rail';
  if (piece.surface === 'magnetic') return 'curb';
  if (piece.section === 'room-entry' || piece.section === 'room-upper-crossing') return 'rail';
  if (piece.section === 'room-lower-route' || piece.section === 'room-upper-route') return 'curb';
  return null;
};

const ROOM_C_CRITICAL_CURBS = new Set([
  'room-c-start',
  'room-c-approach',
  'room-c-turn-east',
  'room-c-turn-north',
  'room-c-upper-turn-west',
  'room-c-turn-home',
]);

const ROOM_C_GUARDRAILS: GuardrailPolicy = (piece) => {
  if (!noGoalGuardrail(piece)) return null;
  if (piece.motion) return 'rail';
  if (piece.surface === 'magnetic') return 'curb';
  if (ROOM_C_CRITICAL_CURBS.has(piece.id)) return 'curb';
  return null;
};

export const GUARDED_SPATIAL_PUZZLE_ROOM_A_TRACK = applyGuardrailPolicy(
  COMPACT_PUZZLE_ROOM_TRACK,
  ROOM_A_GUARDRAILS,
);

export const GUARDED_SPATIAL_PUZZLE_ROOM_B_TRACK = applyGuardrailPolicy(
  SPATIAL_PUZZLE_ROOM_B_TRACK,
  ROOM_B_GUARDRAILS,
);

export const GUARDED_SPATIAL_PUZZLE_ROOM_C_TRACK = applyGuardrailPolicy(
  SPATIAL_PUZZLE_ROOM_C_TRACK,
  ROOM_C_GUARDRAILS,
);

/**
 * P2.2 deliberately varies spatial relationships rather than vocabulary.
 * The set is small enough to test as an authored progression on a phone while
 * keeping each room individually diagnosable through a stable stage query.
 *
 * P2.2.1 adds a progressive safety layer on top of the same room topology:
 * Teach uses broad protection, Vary mixes rails and curbs, and Mastery protects
 * only critical transitions. Guardrails are assistance geometry, not a new
 * puzzle mechanic, and can be reduced later without rebuilding the rooms.
 */
export const AUTHORED_SPATIAL_PUZZLE_SET: readonly AuthoredSpatialPuzzleRoom[] = [
  {
    id: 'p2-room-a',
    role: 'teach',
    track: GUARDED_SPATIAL_PUZZLE_ROOM_A_TRACK,
    title: 'See the goal. Learn how this room folds.',
    body: 'Teach room: generous safety rails keep attention on reading the folded route, magnetic lift, upper bridge, and return to the goal rather than on accidental edge falls.',
  },
  {
    id: 'p2-room-b',
    role: 'vary',
    track: GUARDED_SPATIAL_PUZZLE_ROOM_B_TRACK,
    title: 'Cross first. Climb later. Return above your old route.',
    body: 'Variation room: full rails protect the main timing and moving transitions, while lower curbs begin restoring edge risk on ordinary route segments.',
  },
  {
    id: 'p2-room-c',
    role: 'mastery',
    track: GUARDED_SPATIAL_PUZZLE_ROOM_C_TRACK,
    title: 'Combine the room map with both moving magnetic relationships.',
    body: 'Mastery room: only critical moving magnetic transfers and selected turns remain protected; planning and composition stay difficult without making routine traversal needlessly punishing.',
  },
];

export function findAuthoredSpatialPuzzleRoom(id: string | null): AuthoredSpatialPuzzleRoom | null {
  return AUTHORED_SPATIAL_PUZZLE_SET.find((room) => room.id === id) ?? null;
}
