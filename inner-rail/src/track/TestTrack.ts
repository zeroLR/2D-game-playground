export type TrackSectionId =
  | 'calibration'
  | 's-curve'
  | 'narrow-rail'
  | 'momentum-gap'
  | 'banked-turn'
  | 'goal-brake'
  | 'magnetic-intro'
  | 'magnetic-overhang'
  | 'magnetic-release'
  | 'moving-intro'
  | 'moving-crossing'
  | 'moving-release'
  | 'room-entry'
  | 'room-lower-route'
  | 'room-lift'
  | 'room-upper-route'
  | 'room-upper-crossing'
  | 'room-upper-return'
  | 'room-goal';

export interface TrackVec3 {
  x: number;
  y: number;
  z: number;
}

export interface TrackPose {
  position: TrackVec3;
  cameraYawRad: number;
}

export interface TrackMotion {
  kind: 'sine-translate';
  axis: TrackVec3;
  amplitude: number;
  periodSeconds: number;
  phaseRad?: number;
}

export interface TrackPiece {
  id: string;
  section: TrackSectionId;
  position: TrackVec3;
  size: TrackVec3;
  rotation: TrackVec3;
  surface: 'track' | 'goal' | 'magnetic' | 'moving';
  motion?: TrackMotion;
}

export interface RecoveryCheckpoint {
  id: string;
  section: TrackSectionId;
  trigger: TrackVec3;
  triggerRadius: number;
  pose: TrackPose;
}

export interface GoalZone {
  center: TrackVec3;
  halfExtents: TrackVec3;
  maxSpeed: number;
  holdSeconds: number;
}

export interface TrackBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface ValidationTrackDefinition {
  pieces: readonly TrackPiece[];
  checkpoints: readonly RecoveryCheckpoint[];
  goal: GoalZone;
  bounds: TrackBounds;
  start: TrackPose;
}

const DEG = Math.PI / 180;
const THICKNESS = 0.5;
const FLAT_Y = -THICKNESS / 2;

export function trackBox(
  id: string,
  section: TrackSectionId,
  x: number,
  y: number,
  z: number,
  width: number,
  length: number,
  pitchDeg = 0,
  yawDeg = 0,
  rollDeg = 0,
  surface: TrackPiece['surface'] = 'track',
  motion?: TrackMotion,
): TrackPiece {
  return {
    id,
    section,
    position: { x, y, z },
    size: { x: width, y: THICKNESS, z: length },
    rotation: {
      x: pitchDeg * DEG,
      y: yawDeg * DEG,
      z: rollDeg * DEG,
    },
    surface,
    motion,
  };
}

const pieces: TrackPiece[] = [
  // A — Calibration Deck: broad and forgiving so the player can read cause/effect.
  trackBox('a-deck', 'calibration', 0, FLAT_Y, -31.5, 8.5, 11),
  trackBox('a-exit', 'calibration', -0.2, FLAT_Y, -23.5, 7.2, 6.5, 0, -5),

  // B — Wide S-Curve: no guard rails; the challenge is anticipatory correction.
  trackBox('b-s1', 's-curve', -1.1, FLAT_Y, -18.4, 6.6, 6.6, 0, -14),
  trackBox('b-s2', 's-curve', -2.6, FLAT_Y, -12.9, 6.4, 6.4, 0, -14),
  trackBox('b-s3', 's-curve', -2.3, FLAT_Y, -7.5, 6.2, 6.4, 0, 8),
  trackBox('b-s4', 's-curve', -0.5, FLAT_Y, -2.2, 6.0, 6.4, 0, 17),
  trackBox('b-s5', 's-curve', 1.5, FLAT_Y, 3.0, 5.8, 6.2, 0, 12),

  // C — Narrow Rail: same physics, much less lateral margin.
  trackBox('c-n1', 'narrow-rail', 2.5, FLAT_Y, 8.9, 2.8, 7.6),
  trackBox('c-n2', 'narrow-rail', 2.5, FLAT_Y, 16.0, 2.5, 7.2),

  // D — Momentum Dip + Gap: enter the dip, build speed, commit to the launch.
  trackBox('d-dip-in', 'momentum-gap', 2.5, -0.58, 22.0, 3.2, 6.2, 7),
  trackBox('d-dip-floor', 'momentum-gap', 2.5, -1.02, 26.8, 3.2, 4.4),
  trackBox('d-launch', 'momentum-gap', 2.5, -0.60, 31.3, 3.2, 5.8, -11),
  // Intentional authored gap between launch and landing: no hidden floor or scripted impulse.
  trackBox('d-landing', 'momentum-gap', 2.5, FLAT_Y, 38.4, 3.8, 5.0),

  // E — Banked Turn: the rail supplies the physical banking; steering rules do not change.
  trackBox('e-b1', 'banked-turn', 3.3, FLAT_Y, 43.2, 3.8, 6.0, 0, 10, -6),
  trackBox('e-b2', 'banked-turn', 5.6, FLAT_Y, 48.1, 3.8, 6.0, 0, 24, -10),
  trackBox('e-b3', 'banked-turn', 9.0, FLAT_Y, 51.9, 3.8, 6.0, 0, 38, -12),
  trackBox('e-b4', 'banked-turn', 13.1, FLAT_Y, 54.3, 3.9, 6.0, 0, 55, -10),
  trackBox('e-b5', 'banked-turn', 17.4, FLAT_Y, 55.5, 4.1, 6.0, 0, 72, -6),

  // F — Goal Brake Zone: enough runway to deliberately cancel momentum.
  trackBox('f-brake', 'goal-brake', 22.0, FLAT_Y, 55.5, 5.2, 7.2, 0, 90),
  trackBox('f-goal', 'goal-brake', 28.0, FLAT_Y, 55.5, 6.2, 7.2, 0, 90, 0, 'goal'),
];

const checkpoints: RecoveryCheckpoint[] = [
  {
    id: 'cp-start',
    section: 'calibration',
    trigger: { x: 0, y: 0, z: -31.5 },
    triggerRadius: 3,
    pose: { position: { x: 0, y: 1.05, z: -31.5 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-s-exit',
    section: 'narrow-rail',
    trigger: { x: 2.3, y: 0, z: 5.7 },
    triggerRadius: 2.2,
    pose: { position: { x: 2.5, y: 1.05, z: 6.2 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-narrow-exit',
    section: 'momentum-gap',
    trigger: { x: 2.5, y: 0, z: 18.6 },
    triggerRadius: 2.0,
    pose: { position: { x: 2.5, y: 1.05, z: 19.0 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-gap-landing',
    section: 'banked-turn',
    trigger: { x: 2.5, y: 0, z: 39.4 },
    triggerRadius: 2.0,
    pose: { position: { x: 2.5, y: 1.05, z: 39.4 }, cameraYawRad: 0 },
  },
  {
    id: 'cp-bank-entry',
    section: 'banked-turn',
    trigger: { x: 4.0, y: 0, z: 44.0 },
    triggerRadius: 2.0,
    pose: { position: { x: 3.6, y: 1.05, z: 43.7 }, cameraYawRad: 12 * DEG },
  },
  {
    id: 'cp-brake-entry',
    section: 'goal-brake',
    trigger: { x: 19.3, y: 0, z: 55.5 },
    triggerRadius: 2.2,
    pose: { position: { x: 19.2, y: 1.05, z: 55.5 }, cameraYawRad: 90 * DEG },
  },
];

export const VALIDATION_TRACK: ValidationTrackDefinition = {
  pieces,
  checkpoints,
  start: checkpoints[0].pose,
  goal: {
    center: { x: 28.1, y: 0.6, z: 55.5 },
    halfExtents: { x: 3.1, y: 2.5, z: 2.7 },
    maxSpeed: 1.25,
    holdSeconds: 0.75,
  },
  bounds: {
    minX: -11,
    maxX: 36,
    minY: -8,
    maxY: 9,
    minZ: -40,
    maxZ: 64,
  },
};

export const TRACK_SECTION_LABELS: Record<TrackSectionId, string> = {
  calibration: 'CALIBRATION DECK',
  's-curve': 'WIDE S-CURVE',
  'narrow-rail': 'NARROW RAIL',
  'momentum-gap': 'MOMENTUM DIP + GAP',
  'banked-turn': 'BANKED TURN',
  'goal-brake': 'GOAL BRAKE ZONE',
  'magnetic-intro': 'MAGNETIC ENTRY',
  'magnetic-overhang': 'MAGNETIC OVERHANG',
  'magnetic-release': 'MAGNETIC RELEASE',
  'moving-intro': 'MOVING RAIL APPROACH',
  'moving-crossing': 'MOVING RAIL CROSSING',
  'moving-release': 'MOVING RAIL EXIT',
  'room-entry': 'ROOM ENTRY',
  'room-lower-route': 'LOWER LOOP',
  'room-lift': 'MAGNETIC LIFT',
  'room-upper-route': 'UPPER RECEIVER',
  'room-upper-crossing': 'UPPER MOVING CROSSING',
  'room-upper-return': 'UPPER RETURN',
  'room-goal': 'GOAL OVERLOOK',
};
