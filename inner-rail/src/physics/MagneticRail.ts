import type { TrackPiece, TrackVec3 } from '../track/TestTrack.js';

export interface MagneticRailSample {
  active: boolean;
  pieceId: string | null;
  strength: number;
  acceleration: TrackVec3;
}

export interface MagneticRailConfig {
  acceleration: number;
  captureDistance: number;
  footprintPadding: number;
}

export const DEFAULT_MAGNETIC_RAIL_CONFIG: MagneticRailConfig = {
  acceleration: 18,
  captureDistance: 0.9,
  footprintPadding: 0.45,
};

const INACTIVE_SAMPLE: MagneticRailSample = {
  active: false,
  pieceId: null,
  strength: 0,
  acceleration: { x: 0, y: 0, z: 0 },
};

function rotateX(v: TrackVec3, angle: number): TrackVec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
}

function rotateY(v: TrackVec3, angle: number): TrackVec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
}

function rotateZ(v: TrackVec3, angle: number): TrackVec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c, z: v.z };
}

function localToWorld(v: TrackVec3, rotation: TrackVec3): TrackVec3 {
  return rotateZ(rotateY(rotateX(v, rotation.x), rotation.y), rotation.z);
}

function worldToLocal(v: TrackVec3, rotation: TrackVec3): TrackVec3 {
  return rotateX(rotateY(rotateZ(v, -rotation.z), -rotation.y), -rotation.x);
}

function smoothFalloff(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return 1 - t * t * (3 - 2 * t);
}

/**
 * Samples the strongest magnetic rail field affecting the sphere center.
 *
 * Magnetic pieces attract toward their nearest local face. The field only
 * acts close to the authored footprint, so it behaves like surface attachment
 * rather than a global magnet or scripted path constraint.
 */
export function sampleMagneticRail(
  ballPosition: TrackVec3,
  ballRadius: number,
  pieces: readonly TrackPiece[],
  config: MagneticRailConfig = DEFAULT_MAGNETIC_RAIL_CONFIG,
): MagneticRailSample {
  let best: MagneticRailSample = INACTIVE_SAMPLE;

  for (const piece of pieces) {
    if (piece.surface !== 'magnetic') continue;

    const local = worldToLocal(
      {
        x: ballPosition.x - piece.position.x,
        y: ballPosition.y - piece.position.y,
        z: ballPosition.z - piece.position.z,
      },
      piece.rotation,
    );

    const halfX = piece.size.x / 2;
    const halfY = piece.size.y / 2;
    const halfZ = piece.size.z / 2;
    const padding = config.footprintPadding + ballRadius * 0.35;
    if (Math.abs(local.x) > halfX + padding || Math.abs(local.z) > halfZ + padding) continue;

    const gapFromSurface = Math.max(0, Math.abs(local.y) - halfY - ballRadius);
    if (gapFromSurface > config.captureDistance) continue;

    const strength = smoothFalloff(gapFromSurface / Math.max(0.001, config.captureDistance));
    if (strength <= best.strength) continue;

    const side = local.y >= 0 ? 1 : -1;
    const outwardNormal = localToWorld({ x: 0, y: side, z: 0 }, piece.rotation);
    const magnitude = config.acceleration * strength;
    best = {
      active: true,
      pieceId: piece.id,
      strength,
      acceleration: {
        x: -outwardNormal.x * magnitude,
        y: -outwardNormal.y * magnitude,
        z: -outwardNormal.z * magnitude,
      },
    };
  }

  return best;
}
