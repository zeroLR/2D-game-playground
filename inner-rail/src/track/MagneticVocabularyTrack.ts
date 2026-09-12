import {
  trackBox,
  type RecoveryCheckpoint,
  type ValidationTrackDefinition,
} from './TestTrack.js';

const DEG = Math.PI / 180;
const THICKNESS = 0.5;
const FLAT_Y = -THICKNESS / 2;

/**
 * P1.1 deliberately isolates one new rule: luminous magnetic rail pieces pull
 * the sphere toward their local surface. The route rolls past vertical so the
 * player can verify attachment without introducing a button, switch, or new
 * steering model.
 */
const pieces = [
  trackBox('m-start', 'magnetic-intro', 0, FLAT_Y, -30.0, 7.5, 9.0),
  trackBox('m-approach', 'magnetic-intro', 0, FLAT_Y, -22.8, 6.2, 5.8),
  trackBox('m-flat', 'magnetic-intro', 0, FLAT_Y, -17.4, 5.0, 5.8, 0, 0, 0, 'magnetic'),

  // Continuous roll transition. Local +Z remains route-forward while the
  // surface normal rotates around it, so camera facing can remain stable.
  trackBox('m-roll-25', 'magnetic-overhang', 0, FLAT_Y, -12.1, 4.6, 5.8, 0, 0, 25, 'magnetic'),
  trackBox('m-roll-55', 'magnetic-overhang', 0, FLAT_Y, -6.8, 4.6, 5.8, 0, 0, 55, 'magnetic'),
  trackBox('m-roll-85', 'magnetic-overhang', 0, FLAT_Y, -1.5, 4.6, 5.8, 0, 0, 85, 'magnetic'),
  trackBox('m-roll-115a', 'magnetic-overhang', 0, FLAT_Y, 3.8, 4.6, 5.8, 0, 0, 115, 'magnetic'),
  trackBox('m-roll-115b', 'magnetic-overhang', 0, FLAT_Y, 9.1, 4.6, 5.8, 0, 0, 115, 'magnetic'),
  trackBox('m-return-85', 'magnetic-overhang', 0, FLAT_Y, 14.4, 4.6, 5.8, 0, 0, 85, 'magnetic'),
  trackBox('m-return-55', 'magnetic-overhang', 0, FLAT_Y, 19.7, 4.6, 5.8, 0, 0, 55, 'magnetic'),
  trackBox('m-return-25', 'magnetic-overhang', 0, FLAT_Y, 25.0, 4.8, 5.8, 0, 0, 25, 'magnetic'),
  trackBox('m-return-flat', 'magnetic-overhang', 0, FLAT_Y, 30.3, 5.0, 5.8, 0, 0, 0, 'magnetic'),

  // Leaving the luminous material removes attachment immediately. The final
  // straight asks the player to re-read ordinary momentum and brake normally.
  trackBox('m-release', 'magnetic-release', 0, FLAT_Y, 36.2, 5.4, 6.4),
  trackBox('m-goal', 'magnetic-release', 0, FLAT_Y, 42.5, 6.4, 6.6, 0, 0, 0, 'goal'),
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
    trigger: { x: 0, y: 0, z: 31.8 },
    triggerRadius: 2.2,
    pose: { position: { x: 0, y: 1.05, z: 32.0 }, cameraYawRad: 0 },
  },
];

export const MAGNETIC_VOCABULARY_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 0, y: 0.6, z: 42.5 },
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
    maxZ: 50,
  },
};

export const MAGNETIC_OVERHANG_ANGLE_RAD = 115 * DEG;
