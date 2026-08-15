import type { PlatformEntity } from './WorldState';

export type WindField = {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
  forceX: number;
};

export const WIND_ACCELERATION = 215;
export const WIND_MAX_HORIZONTAL_SPEED = 430;

export function windFieldForPlatform(platform: PlatformEntity): WindField | null {
  if (platform.biomeTheme !== 'pale-heights' || !platform.motion) return null;
  const direction = ((platform.id + Math.round(platform.motion.phase * 10)) & 1) === 0 ? 1 : -1;
  const strength = WIND_ACCELERATION * (platform.width >= 65 ? 0.9 : 1.08);
  return {
    x: platform.x,
    y: platform.y - 52,
    halfWidth: Math.max(62, platform.width * 0.9),
    halfHeight: 58,
    forceX: direction * strength,
  };
}

export function windAccelerationAt(platforms: readonly PlatformEntity[], playerX: number, playerY: number): number {
  let acceleration = 0;
  for (const platform of platforms) {
    const field = windFieldForPlatform(platform);
    if (!field) continue;
    if (Math.abs(playerX - field.x) <= field.halfWidth && Math.abs(playerY - field.y) <= field.halfHeight) acceleration += field.forceX;
  }
  return Math.max(-WIND_ACCELERATION * 1.35, Math.min(WIND_ACCELERATION * 1.35, acceleration));
}

export function applyWindVelocity(velocityX: number, acceleration: number, dt: number): number {
  if (acceleration === 0 || dt <= 0) return velocityX;
  const next = velocityX + acceleration * Math.min(0.033, dt);
  return Math.max(-WIND_MAX_HORIZONTAL_SPEED, Math.min(WIND_MAX_HORIZONTAL_SPEED, next));
}
