import type { TrackPiece, TrackVec3 } from '../track/TestTrack.js';

export interface MagneticRailSample {
  active: boolean;
  pieceId: string | null;
  strength: number;
  acceleration: TrackVec3;
  inwardNormal: TrackVec3 | null;
}

export interface MagneticRailConfig {
  acceleration: number;
  captureDistance: number;
  footprintPadding: number;
}

export const DEFAULT_MAGNETIC_RAIL_CONFIG: MagneticRailConfig = {
  acceleration: 18,
  captureDistance: 1.15,
  footprintPadding: 0.6,
};

const INACTIVE_SAMPLE: MagneticRailSample = {
  active: false,
  pieceId: null,
  strength: 0,
  acceleration: { x: 0, y: 0, z: 0 },
  inwardNormal: null,
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

function normalize(v: TrackVec3): TrackVec3 {
  const length = Math.hypot(v.x, v.y, v.z);
  if (length <= 1e-9) return { x: 0, y: -1, z: 0 };
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function smoothFalloff(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return 1 - t * t * (3 - 2 * t);
}

/**
 * Re-bases only the passive "down" component of camera-relative gravity onto
 * the active magnetic surface. Horizontal tilt intent remains camera-relative,
 * so forward/back and left/right keep the same screen semantics while neutral
 * gravity presses the sphere into a wall or overhang instead of making it fall
 * down that surface.
 */
export function magneticSurfaceGravityDirection(
  cameraDirection: TrackVec3,
  cameraYawRad: number,
  inwardNormal: TrackVec3,
): TrackVec3 {
  const cos = Math.cos(cameraYawRad);
  const sin = Math.sin(cameraYawRad);
  const horizontalX = cameraDirection.x * cos + cameraDirection.z * sin;
  const horizontalZ = -cameraDirection.x * sin + cameraDirection.z * cos;
  const downMagnitude = Math.max(0, -cameraDirection.y);

  return normalize({
    x: horizontalX + inwardNormal.x * downMagnitude,
    y: inwardNormal.y * downMagnitude,
    z: horizontalZ + inwardNormal.z * downMagnitude,
  });
}

/**
 * Samples the strongest magnetic rail field affecting the sphere center.
 *
 * The explicit attraction force keeps contact robust around authored seams.
 * While attached, the returned inward normal also lets gameplay re-base the
 * passive gravity component onto the surface. This is necessary for a rolling
 * sphere: normal attraction alone cannot stop ordinary world gravity from
 * making the sphere roll down a vertical wall.
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
    const outwardNormal = normalize(localToWorld({ x: 0, y: side, z: 0 }, piece.rotation));
    const inwardNormal = {
      x: -outwardNormal.x,
      y: -outwardNormal.y,
      z: -outwardNormal.z,
    };
    const magnitude = config.acceleration * strength;
    best = {
      active: true,
      pieceId: piece.id,
      strength,
      acceleration: {
        x: inwardNormal.x * magnitude,
        y: inwardNormal.y * magnitude,
        z: inwardNormal.z * magnitude,
      },
      inwardNormal,
    };
  }

  return best;
}
