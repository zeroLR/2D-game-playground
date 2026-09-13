import { COMPACT_PUZZLE_ROOM_TRACK } from './CompactPuzzleRoomTrack.js';
import { SPATIAL_PUZZLE_ROOM_B_TRACK } from './SpatialPuzzleRoomBTrack.js';
import { SPATIAL_PUZZLE_ROOM_C_TRACK } from './SpatialPuzzleRoomCTrack.js';
import type { ValidationTrackDefinition } from './TestTrack.js';

export type AuthoredSpatialPuzzleRoomId = 'p2-room-a' | 'p2-room-b' | 'p2-room-c';
export type AuthoredSpatialPuzzleRole = 'teach' | 'vary' | 'mastery';

export interface AuthoredSpatialPuzzleRoom {
  id: AuthoredSpatialPuzzleRoomId;
  role: AuthoredSpatialPuzzleRole;
  track: ValidationTrackDefinition;
  title: string;
  body: string;
}

/**
 * P2.2 deliberately varies spatial relationships rather than vocabulary.
 * The set is small enough to test as an authored progression on a phone while
 * keeping each room individually diagnosable through a stable stage query.
 */
export const AUTHORED_SPATIAL_PUZZLE_SET: readonly AuthoredSpatialPuzzleRoom[] = [
  {
    id: 'p2-room-a',
    role: 'teach',
    track: COMPACT_PUZZLE_ROOM_TRACK,
    title: 'See the goal. Learn how this room folds.',
    body: 'Teach room: follow one compact lower route to the magnetic lift, cross the upper moving bridge, then recognize the same chamber from above as the path returns to the goal.',
  },
  {
    id: 'p2-room-b',
    role: 'vary',
    track: SPATIAL_PUZZLE_ROOM_B_TRACK,
    title: 'Cross first. Climb later. Return above your old route.',
    body: 'Variation room: solve the moving timing problem on the floor before finding the magnetic lift on the far side. The upper return then retraces the chamber from a different height.',
  },
  {
    id: 'p2-room-c',
    role: 'mastery',
    track: SPATIAL_PUZZLE_ROOM_C_TRACK,
    title: 'Combine the room map with both moving magnetic relationships.',
    body: 'Mastery room: climb on a moving magnetic lift, later ride a sideways magnetic shuttle, and keep the larger room layout in mind as the route folds back toward the goal visible near the start.',
  },
];

export function findAuthoredSpatialPuzzleRoom(id: string | null): AuthoredSpatialPuzzleRoom | null {
  return AUTHORED_SPATIAL_PUZZLE_SET.find((room) => room.id === id) ?? null;
}
