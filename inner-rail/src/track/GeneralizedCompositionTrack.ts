import {
  trackBox,
  type RecoveryCheckpoint,
  type TrackMotion,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const THICKNESS = 0.5;
const LOWER_Y = -THICKNESS / 2;

export const GENERALIZATION_LIFT_PERIOD_SECONDS = 8;
export const GENERALIZATION_LIFT_RISE = 4.6;
export const GENERALIZATION_LIFT_ROLL_DEG = 36;
export const GENERALIZATION_UPPER_Y = LOWER_Y + GENERALIZATION_LIFT_RISE;

const LIFT_CENTER_Y = LOWER_Y + GENERALIZATION_LIFT_RISE / 2;

export const GENERALIZATION_LIFT_MOTION: TrackMotion = {
  kind: 'sine-translate',
  axis: { x: 0, y: 1, z: 0 },
  amplitude: GENERALIZATION_LIFT_RISE / 2,
  periodSeconds: GENERALIZATION_LIFT_PERIOD_SECONDS,
  phaseRad: -Math.PI / 2,
};

/**
 * P1.4 asks whether the accepted Moving + Magnetic vocabulary generalizes into
 * a second puzzle instead of producing only lateral shuttle timing variants.
 *
 * The player boards a short 36° magnetic lift at the lower dock, holds position
 * while the same magnetic surface rises, then prepares forward momentum before
 * the upper magnetic receiver becomes physically reachable. No new mechanic or
 * player input is introduced: this is still translated kinematic geometry plus
 * magnetic attachment using the accepted gravity contract.
 */
const pieces = [
  trackBox('gen-start', 'magnetic-intro', 0, LOWER_Y, -28, 7.2, 9.0),
  trackBox('gen-approach', 'magnetic-intro', 0, LOWER_Y, -21.3, 6.2, 5.4),

  trackBox('gen-ramp-00', 'magnetic-intro', 0, LOWER_Y, -17.4, 5.0, 3.8, 0, 0, 0, 'magnetic'),
  trackBox('gen-ramp-12', 'magnetic-overhang', 0, LOWER_Y, -14.1, 5.0, 3.8, 0, 0, 12, 'magnetic'),
  trackBox('gen-ramp-24', 'magnetic-overhang', 0, LOWER_Y, -10.8, 5.0, 3.8, 0, 0, 24, 'magnetic'),
  trackBox('gen-ramp-36', 'magnetic-overhang', 0, LOWER_Y, -7.5, 5.0, 3.8, 0, 0, 36, 'magnetic'),

  // The second composition puzzle: the magnetic surface moves vertically.
  // It starts docked to the lower lane and reaches the upper receiver halfway
  // through the cycle. The player must remain on the short surface during rise
  // and choose when to build forward velocity for the upper transfer.
  trackBox(
    'gen-magnetic-lift',
    'moving-crossing',
    0,
    LIFT_CENTER_Y,
    -2.6,
    4.6,
    6.0,
    0,
    0,
    GENERALIZATION_LIFT_ROLL_DEG,
    'magnetic',
    GENERALIZATION_LIFT_MOTION,
  ),

  trackBox(
    'gen-upper-receiver-36',
    'magnetic-overhang',
    0,
    GENERALIZATION_UPPER_Y,
    3.2,
    4.6,
    5.4,
    0,
    0,
    36,
    'magnetic',
  ),
  trackBox('gen-upper-24', 'magnetic-release', 0, GENERALIZATION_UPPER_Y, 7.5, 5.0, 3.8, 0, 0, 24, 'magnetic'),
  trackBox('gen-upper-12', 'magnetic-release', 0, GENERALIZATION_UPPER_Y, 10.8, 5.0, 3.8, 0, 0, 12, 'magnetic'),
  trackBox('gen-upper-00', 'magnetic-release', 0, GENERALIZATION_UPPER_Y, 14.1, 5.0, 3.8, 0, 0, 0, 'magnetic'),

  trackBox('gen-release', 'moving-release', 0, GENERALIZATION_UPPER_Y, 18.0, 5.4, 4.6),
  trackBox('gen-brake', 'moving-release', 0, GENERALIZATION_UPPER_Y, 23.0, 5.8, 6.0),
  trackBox('gen-goal', 'moving-release', 0, GENERALIZATION_UPPER_Y, 28.6, 6.4, 5.8, 0, 0, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-generalization-start',
    section: 'magnetic-intro',
    trigger: { x: 0, y: LOWER_Y, z: -28 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: 1.05, z: -28 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-generalization-lift',
    section: 'moving-crossing',
    trigger: { x: 0, y: LOWER_Y, z: -7.6 },
    triggerRadius: 2.2,
    pose: { position: { x: 0, y: 1.05, z: -7.8 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-generalization-upper',
    section: 'magnetic-release',
    trigger: { x: 0, y: GENERALIZATION_UPPER_Y, z: 4.8 },
    triggerRadius: 2.2,
    pose: {
      position: { x: 0, y: GENERALIZATION_UPPER_Y + 1.05, z: 4.6 },
      cameraYawRad: 0,
    },
  },
  {
    id: 'cp-generalization-release',
    section: 'moving-release',
    trigger: { x: 0, y: GENERALIZATION_UPPER_Y, z: 16.2 },
    triggerRadius: 2.2,
    pose: {
      position: { x: 0, y: GENERALIZATION_UPPER_Y + 1.05, z: 16.3 },
      cameraYawRad: 0,
    },
  },
];

export const GENERALIZED_COMPOSITION_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0, y: GENERALIZATION_UPPER_Y + 0.6, z: 28.6 },
    halfExtents: { x: 3.2, y: 2.5, z: 2.5 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -8,
    maxX: 8,
    minY: -8,
    maxY: 11,
    minZ: -36,
    maxZ: 37,
  },
};
