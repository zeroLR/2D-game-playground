import type {
  TrackMotion,
  TrackPiece,
  TrackVec3,
  ValidationTrackDefinition,
} from './TestTrack.js';

export type GuardrailProfile = 'curb' | 'rail';
export type GuardrailPolicy = (piece: TrackPiece) => GuardrailProfile | null;

interface GuardrailDimensions {
  height: number;
  thickness: number;
}

const GUARDRAIL_DIMENSIONS: Record<GuardrailProfile, GuardrailDimensions> = {
  curb: { height: 0.32, thickness: 0.16 },
  rail: { height: 0.82, thickness: 0.18 },
};

export const GUARDRAIL_ID_PREFIX = 'guardrail-';

function cloneMotion(motion: TrackMotion | undefined): TrackMotion | undefined {
  if (!motion) return undefined;
  return { ...motion, axis: { ...motion.axis } };
}

function rotateByEulerXYZ(vector: TrackVec3, rotation: TrackVec3): TrackVec3 {
  const hx = rotation.x / 2;
  const hy = rotation.y / 2;
  const hz = rotation.z / 2;
  const c1 = Math.cos(hx);
  const c2 = Math.cos(hy);
  const c3 = Math.cos(hz);
  const s1 = Math.sin(hx);
  const s2 = Math.sin(hy);
  const s3 = Math.sin(hz);

  const qx = s1 * c2 * c3 + c1 * s2 * s3;
  const qy = c1 * s2 * c3 - s1 * c2 * s3;
  const qz = c1 * c2 * s3 + s1 * s2 * c3;
  const qw = c1 * c2 * c3 - s1 * s2 * s3;

  const ix = qw * vector.x + qy * vector.z - qz * vector.y;
  const iy = qw * vector.y + qz * vector.x - qx * vector.z;
  const iz = qw * vector.z + qx * vector.y - qy * vector.x;
  const iw = -qx * vector.x - qy * vector.y - qz * vector.z;

  return {
    x: ix * qw + iw * -qx + iy * -qz - iz * -qy,
    y: iy * qw + iw * -qy + iz * -qx - ix * -qz,
    z: iz * qw + iw * -qz + ix * -qy - iy * -qx,
  };
}

function guardrailForSide(
  piece: TrackPiece,
  profile: GuardrailProfile,
  side: 'left' | 'right',
): TrackPiece {
  const dimensions = GUARDRAIL_DIMENSIONS[profile];
  const sideSign = side === 'left' ? -1 : 1;
  const localOffset: TrackVec3 = {
    x: sideSign * (piece.size.x / 2 - dimensions.thickness / 2),
    y: piece.size.y / 2 + dimensions.height / 2,
    z: 0,
  };
  const worldOffset = rotateByEulerXYZ(localOffset, piece.rotation);

  return {
    id: `${GUARDRAIL_ID_PREFIX}${profile}-${piece.id}-${side}`,
    section: piece.section,
    position: {
      x: piece.position.x + worldOffset.x,
      y: piece.position.y + worldOffset.y,
      z: piece.position.z + worldOffset.z,
    },
    size: {
      x: dimensions.thickness,
      y: dimensions.height,
      z: Math.max(0.4, piece.size.z - 0.18),
    },
    rotation: { ...piece.rotation },
    surface: piece.motion ? 'moving' : 'track',
    motion: cloneMotion(piece.motion),
  };
}

export function isGuardrailPiece(piece: TrackPiece): boolean {
  return piece.id.startsWith(GUARDRAIL_ID_PREFIX);
}

export function applyGuardrailPolicy(
  track: ValidationTrackDefinition,
  policy: GuardrailPolicy,
): ValidationTrackDefinition {
  const basePieces = track.pieces.filter((piece) => !isGuardrailPiece(piece));
  const guardrails: TrackPiece[] = [];

  for (const piece of basePieces) {
    const profile = policy(piece);
    if (!profile) continue;
    guardrails.push(
      guardrailForSide(piece, profile, 'left'),
      guardrailForSide(piece, profile, 'right'),
    );
  }

  return {
    ...track,
    pieces: [...basePieces, ...guardrails],
  };
}
