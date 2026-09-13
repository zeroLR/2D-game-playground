import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
export const ROOM_B_LOWER_Y = -THICKNESS / 2;
export const ROOM_B_RISE = 4.8;
export const ROOM_B_UPPER_Y = ROOM_B_LOWER_Y + ROOM_B_RISE;

export const ROOM_B_BRIDGE_PERIOD_SECONDS = 6.5;
export const ROOM_B_BRIDGE_TRAVEL = 4.8;
export const ROOM_B_LIFT_PERIOD_SECONDS = 8;
export const ROOM_B_LIFT_ROLL_DEG = 24;

const ROOM_B_LIFT_CENTER_Y = ROOM_B_LOWER_Y + ROOM_B_RISE / 2;
const ROOM_B_BRIDGE_ROUTE_Z = -1;
const ROOM_B_BRIDGE_REST_Z = ROOM_B_BRIDGE_ROUTE_Z + ROOM_B_BRIDGE_TRAVEL / 2;

export const ROOM_B_BRIDGE_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 0, z: 1 },
  amplitude: ROOM_B_BRIDGE_TRAVEL / 2,
  periodSeconds: ROOM_B_BRIDGE_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

export const ROOM_B_LIFT_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 1, z: 0 },
  amplitude: ROOM_B_RISE / 2,
  periodSeconds: ROOM_B_LIFT_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

/**
 * P2.2 Room B varies the P2.1 grammar without adding vocabulary. The moving
 * timing problem happens before the elevation change, so the player first
 * crosses the chamber at floor level, then climbs on the far side and returns
 * above the route they already traversed. The elevated goal sits near the
 * starting side of the room, making the eventual return leg visible early.
 */
const pieces = [
  trackBox('room-b-start', 'room-entry', 6, ROOM_B_LOWER_Y, -8, 5.8, 4.6),
  trackBox('room-b-east-run', 'room-entry', 6, ROOM_B_LOWER_Y, -4.4, 4.6, 4.0),
  trackBox('room-b-turn-west', 'room-lower-route', 4.5, ROOM_B_LOWER_Y, -1.8, 4.0, 4.0, 0, -45),
  trackBox('room-b-bridge-entry', 'room-upper-crossing', 2.3, ROOM_B_LOWER_Y, ROOM_B_BRIDGE_ROUTE_Z, 3.8, 4.2, 0, -90),
  trackBox(
    'room-b-moving-bridge',
    'room-upper-crossing',
    -0.5,
    ROOM_B_LOWER_Y,
    ROOM_B_BRIDGE_REST_Z,
    3.6,
    4.8,
    0,
    -90,
    0,
    'moving',
    ROOM_B_BRIDGE_MOTION,
  ),
  trackBox('room-b-bridge-exit', 'room-lower-route', -3.5, ROOM_B_LOWER_Y, ROOM_B_BRIDGE_ROUTE_Z, 3.8, 4.2, 0, -90),
  trackBox('room-b-turn-north', 'room-lower-route', -5.5, ROOM_B_LOWER_Y, 0.5, 4.0, 4.0, 0, -45),
  trackBox('room-b-west-north', 'room-lower-route', -6, ROOM_B_LOWER_Y, 3.5, 3.8, 5.0),

  trackBox('room-b-mag-00', 'room-lift', -6, ROOM_B_LOWER_Y, 6.3, 4.2, 2.4, 0, 0, 0, 'magnetic'),
  trackBox('room-b-mag-12', 'room-lift', -6, ROOM_B_LOWER_Y, 8.3, 4.2, 2.4, 0, 0, 12, 'magnetic'),
  trackBox('room-b-mag-24', 'room-lift', -6, ROOM_B_LOWER_Y, 10.3, 4.2, 2.4, 0, 0, ROOM_B_LIFT_ROLL_DEG, 'magnetic'),
  trackBox(
    'room-b-magnetic-lift',
    'room-lift',
    -6,
    ROOM_B_LIFT_CENTER_Y,
    12.6,
    4.2,
    4.6,
    0,
    0,
    ROOM_B_LIFT_ROLL_DEG,
    'magnetic',
    ROOM_B_LIFT_MOTION,
  ),
  trackBox('room-b-upper-receiver', 'room-upper-route', -6, ROOM_B_UPPER_Y, 15.2, 4.2, 3.4, 0, 0, ROOM_B_LIFT_ROLL_DEG, 'magnetic'),
  trackBox('room-b-upper-turn-east', 'room-upper-route', -4.2, ROOM_B_UPPER_Y, 15.8, 4.0, 4.0, 0, 45),
  trackBox('room-b-upper-north-west', 'room-upper-route', -1.2, ROOM_B_UPPER_Y, 16, 3.8, 6.0, 0, 90),
  trackBox('room-b-upper-north-east', 'room-upper-route', 3.7, ROOM_B_UPPER_Y, 16, 3.8, 5.0, 0, 90),
  trackBox('room-b-upper-turn-south', 'room-upper-return', 5.8, ROOM_B_UPPER_Y, 14.2, 4.0, 4.0, 0, 135),
  trackBox('room-b-upper-south-a', 'room-upper-return', 6, ROOM_B_UPPER_Y, 10.8, 3.8, 5.4, 0, 180),
  trackBox('room-b-upper-south-b', 'room-upper-return', 6, ROOM_B_UPPER_Y, 6.0, 3.8, 5.2, 0, 180),
  trackBox('room-b-upper-south-c', 'room-upper-return', 6, ROOM_B_UPPER_Y, 1.8, 3.8, 4.4, 0, 180),
  trackBox('room-b-goal-approach', 'room-goal', 6, ROOM_B_UPPER_Y, -0.7, 4.4, 3.0, 0, 180),
  trackBox('room-b-goal', 'room-goal', 6, ROOM_B_UPPER_Y, -3.0, 5.0, 3.6, 0, 180, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-room-b-start',
    section: 'room-entry',
    trigger: { x: 6, y: ROOM_B_LOWER_Y, z: -8 },
    triggerRadius: 3,
    pose: { position: { x: 6, y: ROOM_B_LOWER_Y + 1.3, z: -8 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-b-bridge',
    section: 'room-upper-crossing',
    trigger: { x: 2.3, y: ROOM_B_LOWER_Y, z: ROOM_B_BRIDGE_ROUTE_Z },
    triggerRadius: 2.2,
    pose: { position: { x: 2.3, y: ROOM_B_LOWER_Y + 1.3, z: ROOM_B_BRIDGE_ROUTE_Z }, cameraYawRad: -Math.PI / 2 },
  },
  {
    id: 'cp-room-b-lift',
    section: 'room-lift',
    trigger: { x: -6, y: ROOM_B_LOWER_Y, z: 9.2 },
    triggerRadius: 2.2,
    pose: { position: { x: -6, y: ROOM_B_LOWER_Y + 1.3, z: 9.2 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-b-upper',
    section: 'room-upper-route',
    trigger: { x: -6, y: ROOM_B_UPPER_Y, z: 15.0 },
    triggerRadius: 2.2,
    pose: { position: { x: -6, y: ROOM_B_UPPER_Y + 1.3, z: 15.0 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-room-b-return',
    section: 'room-upper-return',
    trigger: { x: 6, y: ROOM_B_UPPER_Y, z: 5.5 },
    triggerRadius: 2.2,
    pose: { position: { x: 6, y: ROOM_B_UPPER_Y + 1.3, z: 5.5 }, cameraYawRad: Math.PI },
  },
];

export const SPATIAL_PUZZLE_ROOM_B_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 6, y: ROOM_B_UPPER_Y + 0.6, z: -3.0 },
    halfExtents: { x: 2.4, y: 2.5, z: 2.0 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -10,
    maxX: 10,
    minY: -8,
    maxY: 12,
    minZ: -12,
    maxZ: 22,
  },
};
