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
const RELEASE_LANDING_X = -0.8;
const RELEASE_LANDING_Y = -1.45;
const RELEASE_LANDING_LENGTH = 5.8;

/**
 * P1.1.3 keeps the accepted magnetic wall-ride geometry but stops the luminous
 * surface while the route is still steep. The player must prepare momentum
 * before attachment ends, cross a short free-gravity release window, and land
 * on an ordinary lower catch deck.
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
] as const;

export const MAGNETIC_RELEASE_ROLL_DEG = 60;
export const MAGNETIC_RELEASE_GAP = 1.4;

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

const releasePiece = transitionPieces[transitionPieces.length - 1];
const releaseEndZ = releasePiece.position.z + releasePiece.size.z / 2;
const releaseLandingStartZ = releaseEndZ + MAGNETIC_RELEASE_GAP;
const releaseLandingCenterZ = releaseLandingStartZ + RELEASE_LANDING_LENGTH / 2;
const brakeCenterZ = releaseLandingCenterZ + 5.6;
const goalCenterZ = brakeCenterZ + 6.0;

/**
 * P1 deliberately isolates one new world rule: luminous magnetic rail pieces
 * create a local attached-surface gravity frame. P1.1.3 now asks whether that
 * state changes planning, not merely whether the sphere can cling to a wall.
 */
const pieces = [
  trackBox('m-start', 'magnetic-intro', 0, FLAT_Y, -30.0, 7.5, 9.0),
  trackBox('m-approach', 'magnetic-intro', 0, FLAT_Y, -22.8, 6.2, 5.8),
  trackBox('m-flat', 'magnetic-intro', 0, FLAT_Y, -17.4, 5.0, 5.8, 0, 0, 0, 'magnetic'),

  ...transitionPieces,

  // The glow ends while still banked at 60°. There is intentionally no hidden
  // floor in the release window: world gravity returns immediately and the
  // player must carry enough forward momentum onto the lower ordinary deck.
  trackBox(
    'm-release-landing',
    'magnetic-release',
    RELEASE_LANDING_X,
    RELEASE_LANDING_Y,
    releaseLandingCenterZ,
    6.0,
    RELEASE_LANDING_LENGTH,
  ),
  trackBox(
    'm-release-brake',
    'magnetic-release',
    RELEASE_LANDING_X,
    RELEASE_LANDING_Y,
    brakeCenterZ,
    5.6,
    5.8,
  ),
  trackBox(
    'm-goal',
    'magnetic-release',
    RELEASE_LANDING_X,
    RELEASE_LANDING_Y,
    goalCenterZ,
    6.4,
    6.6,
    0,
    0,
    0,
    'goal',
  ),
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
    id: 'cp-magnetic-catch',
    section: 'magnetic-release',
    trigger: { x: RELEASE_LANDING_X, y: -0.55, z: releaseLandingCenterZ },
    triggerRadius: 2.5,
    pose: {
      position: { x: RELEASE_LANDING_X, y: -0.4, z: releaseLandingCenterZ },
      cameraYawRad: 0,
    },
  },
];

export const MAGNETIC_VOCABULARY_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: RELEASE_LANDING_X, y: -0.55, z: goalCenterZ },
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
    maxZ: goalCenterZ + 10,
  },
};

export const MAGNETIC_WALL_RIDE_ANGLE_RAD = 78 * DEG;
