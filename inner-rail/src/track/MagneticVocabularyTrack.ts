import {
  trackBox,
  type RecoveryCheckpoint,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const DEG = Math.PI / 180;
const THICKNESS = 0.5;
const FLAT_Y = -THICKNESS / 2;
const TRANSITION_START_Z = -14.2;
const TRANSITION_SPACING = 3.35;
const TRANSITION_LENGTH = 3.8;

/**
 * P1.1.2 keeps the magnetic rule unchanged and makes the authored transition
 * physically readable. The first pass jumped 25° → 55° → 85° → 115° between
 * long boxes, which created hard collision seams near vertical. This sequence
 * caps the first vocabulary gate at a steep wall ride and changes roll in
 * smaller increments with slight overlap between pieces.
 */
export const MAGNETIC_TRANSITION_ROLL_DEG = [
  0,
  12,
  24,
  36,
  48,
  60,
  70,
  78,
  78,
  70,
  60,
  48,
  36,
  24,
  12,
  0,
] as const;

const transitionPieces = MAGNETIC_TRANSITION_ROLL_DEG.map((rollDeg, index) =>
  trackBox(
    `m-transition-${index.toString().padStart(2, '0')}`,
    'magnetic-overhang',
    0,
    FLAT_Y,
    TRANSITION_START_Z + index * TRANSITION_SPACING,
    4.8,
    TRANSITION_LENGTH,
    0,
    0,
    rollDeg,
    'magnetic',
  ),
);

const transitionEndZ = TRANSITION_START_Z + (MAGNETIC_TRANSITION_ROLL_DEG.length - 1) * TRANSITION_SPACING;

/**
 * P1 deliberately isolates one new world rule: luminous magnetic rail pieces
 * create a local attached-surface gravity frame. P1.1.2 tests that rule on a
 * steep but still readable wall ride before attempting inversion/overhang.
 */
const pieces = [
  trackBox('m-start', 'magnetic-intro', 0, FLAT_Y, -30.0, 7.5, 9.0),
  trackBox('m-approach', 'magnetic-intro', 0, FLAT_Y, -22.8, 6.2, 5.8),
  trackBox('m-flat', 'magnetic-intro', 0, FLAT_Y, -17.4, 5.0, 5.8, 0, 0, 0, 'magnetic'),

  ...transitionPieces,

  // Leaving luminous material removes attachment immediately. The final
  // straight asks the player to re-read ordinary momentum and brake normally.
  trackBox('m-release', 'magnetic-release', 0, FLAT_Y, transitionEndZ + 4.9, 5.4, 6.4),
  trackBox('m-goal', 'magnetic-release', 0, FLAT_Y, transitionEndZ + 11.2, 6.4, 6.6, 0, 0, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-magnetic-start',
    section: 'magnetic-intro',
    trigger: { x: 0, y: 0, z: -30 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: 1.05, z: -30 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-magnetic-entry',
    section: 'magnetic-overhang',
    trigger: { x: 0, y: 0, z: -17.4 },
    triggerRadius: 2.2,
    pose: { position: { x: 0, y: 1.05, z: -17.4 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-magnetic-release',
    section: 'magnetic-release',
    trigger: { x: 0, y: 0, z: transitionEndZ + 1.9 },
    triggerRadius: 2.2,
    pose: { position: { x: 0, y: 1.05, z: transitionEndZ + 2.2 }, cameraYawRad: 0 },
  },
];

export const MAGNETIC_VOCABULARY_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0, y: 0.6, z: transitionEndZ + 11.2 },
    halfExtents: { x: 3.1, y: 2.5, z: 2.7 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -10,
    maxX: 10,
    minY: -10,
    maxY: 10,
    minZ: -38,
    maxZ: transitionEndZ + 19,
  },
};

export const MAGNETIC_WALL_RIDE_ANGLE_RAD = 78 * DEG;
