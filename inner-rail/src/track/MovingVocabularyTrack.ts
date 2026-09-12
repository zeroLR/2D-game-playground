import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
const FLAT_Y = -THICKNESS / 2;

export const MOVING_RAIL_PERIOD_SECONDS = 6;
export const MOVING_RAIL_TRAVEL = 4.8;

export const MOVING_RAIL_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 1, y: 0, z: 0 },
  amplitude: MOVING_RAIL_TRAVEL / 2,
  periodSeconds: MOVING_RAIL_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

/**
 * P1.2 isolates one new rule: an authored rail can move on a predictable cycle.
 * The shuttle starts aligned with the route, moves laterally away, then returns.
 * There is no hidden floor beneath the crossing and no automatic propulsion.
 */
const pieces = [
  trackBox('mv-start', 'moving-intro', 0, FLAT_Y, -25, 7.5, 10),
  trackBox('mv-approach', 'moving-intro', 0, FLAT_Y, -16, 6.5, 8),
  trackBox('mv-wait', 'moving-intro', 0, FLAT_Y, -9.5, 6.0, 5.0),

  trackBox(
    'mv-shuttle',
    'moving-crossing',
    MOVING_RAIL_TRAVEL / 2,
    FLAT_Y,
    -3.5,
    3.2,
    7.4,
    0,
    0,
    0,
    'moving',
    MOVING_RAIL_MOTION,
  ),

  trackBox('mv-exit', 'moving-release', 0, FLAT_Y, 2.8, 5.6, 5.6),
  trackBox('mv-brake', 'moving-release', 0, FLAT_Y, 8.9, 5.6, 7.0),
  trackBox('mv-goal', 'moving-release', 0, FLAT_Y, 15.2, 6.4, 6.2, 0, 0, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-moving-start',
    section: 'moving-intro',
    trigger: { x: 0, y: 0, z: -25 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: 1.05, z: -25 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-moving-wait',
    section: 'moving-crossing',
    trigger: { x: 0, y: 0, z: -10 },
    triggerRadius: 2.2,
    pose: { position: { x: 0, y: 1.05, z: -10 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-moving-exit',
    section: 'moving-release',
    trigger: { x: 0, y: 0, z: 2.8 },
    triggerRadius: 2.4,
    pose: { position: { x: 0, y: 1.05, z: 3.1 }, cameraYawRad: 0 },
  },
];

export const MOVING_VOCABULARY_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0, y: 0.6, z: 15.2 },
    halfExtents: { x: 3.2, y: 2.5, z: 2.6 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -8,
    maxX: 10,
    minY: -8,
    maxY: 8,
    minZ: -34,
    maxZ: 24,
  },
};
