import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
export const ROOM_LOWER_Y = -THICKNESS / 2;
export const ROOM_RISE = 4.8;
export const ROOM_UPPER_Y = ROOM_LOWER_Y + ROOM_RISE;

export const ROOM_LIFT_PERIOD_SECONDS = 8;
export const ROOM_LIFT_ROLL_DEG = 24;
export const ROOM_MOVING_BRIDGE_PERIOD_SECONDS = 6;
export const ROOM_MOVING_BRIDGE_TRAVEL = 4.8;

const ROOM_LIFT_CENTER_Y = ROOM_LOWER_Y + ROOM_RISE / 2;
const ROOM_BRIDGE_ROUTE_Z = 15;
const ROOM_BRIDGE_REST_Z = ROOM_BRIDGE_ROUTE_Z + ROOM_MOVING_BRIDGE_TRAVEL / 2;

export const ROOM_LIFT_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 1, z: 0 },
  amplitude: ROOM_RISE / 2,
  periodSeconds: ROOM_LIFT_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

export const ROOM_MOVING_BRIDGE_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 0, z: 1 },
  amplitude: ROOM_MOVING_BRIDGE_TRAVEL / 2,
  periodSeconds: ROOM_MOVING_BRIDGE_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

/**
 * P2.1 changes the authored unit from a linear validation course into one
 * compact spatial room. The goal is visible above the early lower route, but
 * the route must fold around the chamber, ride a moving magnetic lift to the
 * upper level, cross a timed moving bridge, then return over previously seen
 * space to reach that goal from above.
 *
 * No new gameplay rule is introduced. Every surface is ordinary, magnetic,
 * moving, or the already-accepted moving + magnetic composition.
 */
const pieces = [
  // Lower entry: the elevated goal is visible ahead, but there is no direct
  // lower connection to it. The route bends west beneath the future goal area.
  trackBox('room-start', 'room-entry', 0, ROOM_LOWER_Y, -8.0, 5.8, 4.6),
  trackBox('room-lower-approach', 'room-entry', 0, ROOM_LOWER_Y, -4.2, 4.6, 4.2),
  trackBox('room-lower-turn-west', 'room-lower-route', -1.4, ROOM_LOWER_Y, -1.6, 4.2, 4.0, 0, -45),
  trackBox('room-lower-west', 'room-lower-route', -4.6, ROOM_LOWER_Y, -1.0, 3.8, 5.8, 0, -90),
  trackBox('room-lower-turn-north', 'room-lower-route', -7.0, ROOM_LOWER_Y, 0.9, 4.0, 4.0, 0, -45),
  trackBox('room-lower-north', 'room-lower-route', -7.0, ROOM_LOWER_Y, 3.7, 3.8, 4.2),

  // Magnetic approach: a short, readable bank is enough to make attachment
  // matter while keeping the spatial route—not handling difficulty—the focus.
  trackBox('room-mag-00', 'room-lift', -7.0, ROOM_LOWER_Y, 5.6, 4.2, 2.4, 0, 0, 0, 'magnetic'),
  trackBox('room-mag-12', 'room-lift', -7.0, ROOM_LOWER_Y, 7.6, 4.2, 2.4, 0, 0, 12, 'magnetic'),
  trackBox('room-mag-24', 'room-lift', -7.0, ROOM_LOWER_Y, 9.6, 4.2, 2.4, 0, 0, ROOM_LIFT_ROLL_DEG, 'magnetic'),

  // Accepted composition reused as spatial transport. The lift starts at the
  // lower dock and reaches the upper receiver halfway through its cycle.
  trackBox(
    'room-magnetic-lift',
    'room-lift',
    -7.0,
    ROOM_LIFT_CENTER_Y,
    11.9,
    4.2,
    4.6,
    0,
    0,
    ROOM_LIFT_ROLL_DEG,
    'magnetic',
    ROOM_LIFT_MOTION,
  ),
  trackBox(
    'room-upper-receiver',
    'room-upper-route',
    -7.0,
    ROOM_UPPER_Y,
    14.5,
    4.2,
    3.4,
    0,
    0,
    ROOM_LIFT_ROLL_DEG,
    'magnetic',
  ),

  // Upper north edge folds east across the same chamber. A separate ordinary
  // moving bridge temporarily leaves the route line, forcing timing while the
  // player can still see both the lower route and eventual goal below/ahead.
  trackBox('room-upper-turn-east', 'room-upper-route', -5.4, ROOM_UPPER_Y, 15.2, 4.2, 4.0, 0, 45),
  trackBox('room-upper-west-deck', 'room-upper-crossing', -3.2, ROOM_UPPER_Y, ROOM_BRIDGE_ROUTE_Z, 3.8, 4.8, 0, 90),
  trackBox(
    'room-moving-bridge',
    'room-upper-crossing',
    0,
    ROOM_UPPER_Y,
    ROOM_BRIDGE_REST_Z,
    3.6,
    5.0,
    0,
    90,
    0,
    'moving',
    ROOM_MOVING_BRIDGE_MOTION,
  ),
  trackBox('room-upper-east-deck', 'room-upper-crossing', 3.2, ROOM_UPPER_Y, ROOM_BRIDGE_ROUTE_Z, 3.8, 4.8, 0, 90),

  // The upper path loops south and then west, deliberately returning over the
  // lower entry zone. The player sees the same chamber from a second height
  // before arriving at the goal that was visible near the start.
  trackBox('room-upper-turn-south', 'room-upper-return', 5.6, ROOM_UPPER_Y, 13.0, 4.0, 4.2, 0, 135),
  trackBox('room-upper-south-a', 'room-upper-return', 6.0, ROOM_UPPER_Y, 9.6, 3.8, 6.0, 0, 180),
  trackBox('room-upper-south-b', 'room-upper-return', 6.0, ROOM_UPPER_Y, 4.4, 3.8, 5.2, 0, 180),
  trackBox('room-upper-south-c', 'room-upper-return', 6.0, ROOM_UPPER_Y, 1.0, 3.8, 3.0, 0, 180),
  trackBox('room-upper-turn-home', 'room-upper-return', 4.5, ROOM_UPPER_Y, -0.5, 4.0, 4.0, 0, -135),
  trackBox('room-upper-home', 'room-goal', 2.2, ROOM_UPPER_Y, -0.5, 4.2, 4.8, 0, -90),
  trackBox('room-goal', 'room-goal', 0, ROOM_UPPER_Y, -0.5, 5.0, 4.6, 0, -90, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-room-start',
    section: 'room-entry',
    trigger: { x: 0, y: ROOM_LOWER_Y, z: -8.0 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: ROOM_LOWER_Y + 1.3, z: -8.0 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-lift',
    section: 'room-lift',
    trigger: { x: -7.0, y: ROOM_LOWER_Y, z: 8.7 },
    triggerRadius: 2.2,
    pose: { position: { x: -7.0, y: ROOM_LOWER_Y + 1.3, z: 8.7 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-upper',
    section: 'room-upper-route',
    trigger: { x: -7.0, y: ROOM_UPPER_Y, z: 14.2 },
    triggerRadius: 2.2,
    pose: { position: { x: -7.0, y: ROOM_UPPER_Y + 1.3, z: 14.2 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-crossed',
    section: 'room-upper-crossing',
    trigger: { x: 3.6, y: ROOM_UPPER_Y, z: ROOM_BRIDGE_ROUTE_Z },
    triggerRadius: 2.2,
    pose: { position: { x: 3.6, y: ROOM_UPPER_Y + 1.3, z: ROOM_BRIDGE_ROUTE_Z }, cameraYawRad: Math.PI / 2 },
  },
  {
    id: 'cp-room-return',
    section: 'room-upper-return',
    trigger: { x: 6.0, y: ROOM_UPPER_Y, z: 3.0 },
    triggerRadius: 2.1,
    pose: { position: { x: 6.0, y: ROOM_UPPER_Y + 1.3, z: 3.0 }, cameraYawRad: Math.PI },
  },
];

export const COMPACT_PUZZLE_ROOM_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0, y: ROOM_UPPER_Y + 0.6, z: -0.5 },
    halfExtents: { x: 2.3, y: 2.5, z: 2.5 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -11,
    maxX: 10,
    minY: -8,
    maxY: 12,
    minZ: -12,
    maxZ: 22,
  },
};
