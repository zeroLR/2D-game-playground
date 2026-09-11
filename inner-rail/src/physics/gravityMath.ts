import type { GravityDirection } from '../input/orientationMath';

export interface WorldGravityDirection {
  x: number;
  y: number;
  z: number;
}

/**
 * TiltInput produces a screen/camera-relative direction where +X is screen-right
 * and +Z is camera-forward. Rotate only the horizontal component by camera yaw;
 * vertical gravity remains world-down.
 */
export function cameraRelativeGravityToWorld(
  direction: GravityDirection,
  cameraYawRad: number,
): WorldGravityDirection {
  const cos = Math.cos(cameraYawRad);
  const sin = Math.sin(cameraYawRad);

  return {
    x: direction.x * cos + direction.z * sin,
    y: direction.y,
    z: -direction.x * sin + direction.z * cos,
  };
}
