import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
export const ROOM_C_LOWER_Y = -THICKNESS / 2;
export const ROOM_C_RISE = 4.8;
export const ROOM_C_UPPER_Y = ROOM_C_LOWER_Y + ROOM_C_RISE;

export const ROOM_C_LIFT_PERIOD_SECONDS = 7.5;
export const ROOM_C_LIFT_ROLL_DEG = 24;
export const ROOM_C_SHUTTLE_PERIOD_SECONDS = 7;
export const ROOM_C_SHUTTLE_TRAVEL = 8;
export const ROOM_C_SHUTTLE_ROLL_DEG = 24;

const ROOM_C_LIFT_CENTER_Y = ROOM_C_LOWER_Y + ROOM_C_RISE / 2;

export const ROOM_C_LIFT_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 1, z: 0 },
  amplitude: ROOM_C_RISE / 2,
  periodSeconds: ROOM_C_LIFT_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

export const ROOM_C_SHUTTLE_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 1, y: 0, z: 0 },
  amplitude: ROOM_C_SHUTTLE_TRAVEL / 2,
  periodSeconds: ROOM_C_SHUTTLE_PERIOD_SECONDS,
  phaseRad: Math.PI / 2,
};

/**
 * P2.2 Room C is the first spatial mastery room. It reuses both accepted
 * composition patterns in one chamber: a vertical moving magnetic lift reaches
 * the upper route, then a second magnetic surface carries the player sideways
 * across the room before the route folds back toward the goal visible near the
 * starting area. No new rule is introduced; difficulty comes from remembering
 * how two known physical relationships fit into one mental map.
 */
const pieces = [
  trackBox('room-c-start', 'room-entry', 0, ROOM_C_LOWER_Y, -9, 5.8, 4.8),
  trackBox('room-c-approach', 'room-entry', 0, ROOM_C_LOWER_Y, -5.2, 4.8, 4.2),
  trackBox('room-c-turn-east', 'room-lower-route', 1.6, ROOM_C_LOWER_Y, -2.5, 4.0, 4.0, 0, 45),
  trackBox('room-c-lower-east', 'room-lower-route', 4.5, ROOM_C_LOWER_Y, -1.5, 3.8, 5.8, 0, 90),
  trackBox('room-c-turn-north', 'room-lower-route', 6.6, ROOM_C_LOWER_Y, 0.5, 4.0, 4.0, 0, 45),
  trackBox('room-c-lower-north', 'room-lower-route', 7, ROOM_C_LOWER_Y, 3.7, 3.8, 5.2),

  trackBox('room-c-mag-00', 'room-lift', 7, ROOM_C_LOWER_Y, 6.5, 4.2, 2.4, 0, 0, 0, 'magnetic'),
  trackBox('room-c-mag-12', 'room-lift', 7, ROOM_C_LOWER_Y, 8.5, 4.2, 2.4, 0, 0, 12, 'magnetic'),
  trackBox('room-c-mag-24', 'room-lift', 7, ROOM_C_LOWER_Y, 10.5, 4.2, 2.4, 0, 0, ROOM_C_LIFT_ROLL_DEG, 'magnetic'),
  trackBox(
    'room-c-magnetic-lift',
    'room-lift',
    7,
    ROOM_C_LIFT_CENTER_Y,
    12.8,
    4.2,
    4.6,
    0,
    0,
    ROOM_C_LIFT_ROLL_DEG,
    'magnetic',
    ROOM_C_LIFT_MOTION,
  ),
  trackBox('room-c-upper-receiver', 'room-upper-route', 7, ROOM_C_UPPER_Y, 15.3, 4.2, 3.4, 0, 0, ROOM_C_LIFT_ROLL_DEG, 'magnetic'),

  // Turn into a north-facing parallel lane at x=4. The shuttle starts aligned
  // with this lane, moves laterally to x=-4, then the player exits forward onto
  // a matching magnetic receiver. This is the accepted P1.3 composition used
  // as one relationship inside a larger spatial route.
  trackBox('room-c-upper-turn-west', 'room-upper-route', 5.4, ROOM_C_UPPER_Y, 16.5, 4.0, 4.0, 0, -45),
  trackBox('room-c-shuttle-entry', 'room-upper-crossing', 4, ROOM_C_UPPER_Y, 18.2, 4.2, 3.4, 0, 0, ROOM_C_SHUTTLE_ROLL_DEG, 'magnetic'),
  trackBox(
    'room-c-magnetic-shuttle',
    'room-upper-crossing',
    0,
    ROOM_C_UPPER_Y,
    21.2,
    4.2,
    4.8,
    0,
    0,
    ROOM_C_SHUTTLE_ROLL_DEG,
    'magnetic',
    ROOM_C_SHUTTLE_MOTION,
  ),
  trackBox('room-c-shuttle-receiver', 'room-upper-route', -4, ROOM_C_UPPER_Y, 24.1, 4.2, 3.8, 0, 0, ROOM_C_SHUTTLE_ROLL_DEG, 'magnetic'),
  trackBox('room-c-unwind-12', 'room-upper-route', -4, ROOM_C_UPPER_Y, 26.6, 4.2, 2.8, 0, 0, 12, 'magnetic'),
  trackBox('room-c-unwind-00', 'room-upper-route', -4, ROOM_C_UPPER_Y, 28.8, 4.2, 2.8, 0, 0, 0, 'magnetic'),

  // The return leg wraps around the west side and crosses the original start
  // area from above before entering the goal that was visible at spawn.
  trackBox('room-c-turn-west', 'room-upper-return', -5.7, ROOM_C_UPPER_Y, 29.5, 4.0, 4.0, 0, -45),
  trackBox('room-c-upper-west', 'room-upper-return', -7.2, ROOM_C_UPPER_Y, 27.8, 3.8, 4.2, 0, -90),
  trackBox('room-c-turn-south', 'room-upper-return', -8.2, ROOM_C_UPPER_Y, 25.5, 4.0, 4.0, 0, -135),
  trackBox('room-c-upper-south-a', 'room-upper-return', -8, ROOM_C_UPPER_Y, 21.7, 3.8, 6.0, 0, 180),
  trackBox('room-c-upper-south-b', 'room-upper-return', -8, ROOM_C_UPPER_Y, 16.2, 3.8, 5.6, 0, 180),
  trackBox('room-c-upper-south-c', 'room-upper-return', -8, ROOM_C_UPPER_Y, 10.8, 3.8, 5.6, 0, 180),
  trackBox('room-c-upper-south-d', 'room-upper-return', -8, ROOM_C_UPPER_Y, 5.4, 3.8, 5.6, 0, 180),
  trackBox('room-c-upper-south-e', 'room-upper-return', -8, ROOM_C_UPPER_Y, 0.2, 3.8, 5.4, 0, 180),
  trackBox('room-c-turn-home', 'room-upper-return', -6.2, ROOM_C_UPPER_Y, -2.5, 4.0, 4.0, 0, 135),
  trackBox('room-c-upper-home-west', 'room-goal', -3.8, ROOM_C_UPPER_Y, -4, 3.8, 5.2, 0, 90),
  trackBox('room-c-goal-approach', 'room-goal', -1.2, ROOM_C_UPPER_Y, -4, 4.2, 3.4, 0, 90),
  trackBox('room-c-goal', 'room-goal', 0.8, ROOM_C_UPPER_Y, -4, 5.0, 3.4, 0, 90, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-room-c-start',
    section: 'room-entry',
    trigger: { x: 0, y: ROOM_C_LOWER_Y, z: -9 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: ROOM_C_LOWER_Y + 1.3, z: -9 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-c-lift',
    section: 'room-lift',
    trigger: { x: 7, y: ROOM_C_LOWER_Y, z: 9.3 },
    triggerRadius: 2.2,
    pose: { position: { x: 7, y: ROOM_C_LOWER_Y + 1.3, z: 9.3 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-c-upper',
    section: 'room-upper-route',
    trigger: { x: 7, y: ROOM_C_UPPER_Y, z: 15.1 },
    triggerRadius: 2.2,
    pose: { position: { x: 7, y: ROOM_C_UPPER_Y + 1.3, z: 15.1 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-c-shuttle',
    section: 'room-upper-crossing',
    trigger: { x: 4, y: ROOM_C_UPPER_Y, z: 18.2 },
    triggerRadius: 2.2,
    pose: { position: { x: 4, y: ROOM_C_UPPER_Y + 1.3, z: 18.2 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-c-receiver',
    section: 'room-upper-route',
    trigger: { x: -4, y: ROOM_C_UPPER_Y, z: 24.5 },
    triggerRadius: 2.2,
    pose: { position: { x: -4, y: ROOM_C_UPPER_Y + 1.3, z: 24.5 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-c-return',
    section: 'room-upper-return',
    trigger: { x: -8, y: ROOM_C_UPPER_Y, z: 9.8 },
    triggerRadius: 2.2,
    pose: { position: { x: -8, y: ROOM_C_UPPER_Y + 1.3, z: 9.8 }, cameraYawRad: Math.PI },
  },
];

export const SPATIAL_PUZZLE_ROOM_C_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0.8, y: ROOM_C_UPPER_Y + 0.6, z: -4 },
    halfExtents: { x: 2.4, y: 2.5, z: 2.0 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -12,
    maxX: 11,
    minY: -8,
    maxY: 12,
    minZ: -13,
    maxZ: 34,
  },
};
