import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
const FLAT_Y = -THICKNESS / 2;
const ENTRY_X = -2.6;
const EXIT_X = 2.6;

export const COMPOSED_SHUTTLE_PERIOD_SECONDS = 7;
export const COMPOSED_SHUTTLE_TRAVEL = EXIT_X - ENTRY_X;
export const COMPOSED_SHUTTLE_ROLL_DEG = 48;

export const COMPOSED_SHUTTLE_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 1, y: 0, z: 0 },
  amplitude: COMPOSED_SHUTTLE_TRAVEL / 2,
  periodSeconds: COMPOSED_SHUTTLE_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

/**
 * P1.3 is the first true mechanic composition. The player climbs onto a steep
 * magnetic surface, boards a magnetic kinematic shuttle, stays attached while
 * the surface translates laterally, then chooses when to leave for the static
 * magnetic receiver. Motion and magnetic attachment are simultaneous rules on
 * one collider rather than two sequential set pieces.
 */
const pieces = [
  trackBox('cmp-start', 'magnetic-intro', ENTRY_X, FLAT_Y, -28, 7.2, 9.0),
  trackBox('cmp-approach', 'magnetic-intro', ENTRY_X, FLAT_Y, -21.3, 6.2, 5.4),

  trackBox('cmp-ramp-00', 'magnetic-intro', ENTRY_X, FLAT_Y, -17.4, 5.0, 3.8, 0, 0, 0, 'magnetic'),
  trackBox('cmp-ramp-12', 'magnetic-overhang', ENTRY_X, FLAT_Y, -14.1, 5.0, 3.8, 0, 0, 12, 'magnetic'),
  trackBox('cmp-ramp-24', 'magnetic-overhang', ENTRY_X, FLAT_Y, -10.8, 5.0, 3.8, 0, 0, 24, 'magnetic'),
  trackBox('cmp-ramp-36', 'magnetic-overhang', ENTRY_X, FLAT_Y, -7.5, 5.0, 3.8, 0, 0, 36, 'magnetic'),
  trackBox('cmp-ramp-48', 'magnetic-overhang', ENTRY_X, FLAT_Y, -4.2, 5.0, 3.8, 0, 0, 48, 'magnetic'),

  // The composition: this same physical piece is both magnetic and kinematic.
  // It starts aligned with the entry lane, crosses to the receiver, and returns.
  trackBox(
    'cmp-magnetic-shuttle',
    'moving-crossing',
    0,
    FLAT_Y,
    0.5,
    5.0,
    5.8,
    0,
    0,
    COMPOSED_SHUTTLE_ROLL_DEG,
    'magnetic',
    COMPOSED_SHUTTLE_MOTION,
  ),

  // Static receiver is intentionally offset to the opposite end of the cycle.
  // The player must remain attached long enough for alignment, then commit.
  trackBox('cmp-receiver-48', 'magnetic-overhang', EXIT_X, FLAT_Y, 5.7, 5.0, 5.0, 0, 0, 48, 'magnetic'),
  trackBox('cmp-return-36', 'magnetic-release', EXIT_X, FLAT_Y, 9.9, 5.0, 3.8, 0, 0, 36, 'magnetic'),
  trackBox('cmp-return-24', 'magnetic-release', EXIT_X, FLAT_Y, 13.2, 5.0, 3.8, 0, 0, 24, 'magnetic'),
  trackBox('cmp-return-12', 'magnetic-release', EXIT_X, FLAT_Y, 16.5, 5.0, 3.8, 0, 0, 12, 'magnetic'),
  trackBox('cmp-return-00', 'magnetic-release', EXIT_X, FLAT_Y, 19.8, 5.0, 3.8, 0, 0, 0, 'magnetic'),

  trackBox('cmp-release', 'moving-release', EXIT_X, FLAT_Y, 23.6, 5.4, 4.6),
  trackBox('cmp-brake', 'moving-release', EXIT_X, FLAT_Y, 28.6, 5.8, 6.0),
  trackBox('cmp-goal', 'moving-release', EXIT_X, FLAT_Y, 34.2, 6.4, 5.8, 0, 0, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-composition-start',
    section: 'magnetic-intro',
    trigger: { x: ENTRY_X, y: 0, z: -28 },
    triggerRadius: 3,
    pose: { position: { x: ENTRY_X, y: 1.05, z: -28 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-composition-shuttle',
    section: 'moving-crossing',
    trigger: { x: ENTRY_X, y: 0, z: -4.2 },
    triggerRadius: 2.2,
    pose: { position: { x: ENTRY_X, y: 1.05, z: -4.4 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-composition-receiver',
    section: 'magnetic-release',
    trigger: { x: EXIT_X, y: 0, z: 6.7 },
    triggerRadius: 2.3,
    pose: { position: { x: EXIT_X, y: 1.05, z: 6.4 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-composition-release',
    section: 'moving-release',
    trigger: { x: EXIT_X, y: 0, z: 22.2 },
    triggerRadius: 2.2,
    pose: { position: { x: EXIT_X, y: 1.05, z: 22.5 }, cameraYawRad: 0 },
  },
];

export const COMPOSED_VOCABULARY_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: EXIT_X, y: 0.6, z: 34.2 },
    halfExtents: { x: 3.2, y: 2.5, z: 2.5 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -9,
    maxX: 9,
    minY: -10,
    maxY: 10,
    minZ: -36,
    maxZ: 43,
  },
};
