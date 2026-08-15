import type { PlatformEntity } from './WorldState';

export type WindField = {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
  forceX: number;
};

// Strong enough to visibly overcome ordinary air nudge over a short exposure,
// while a committed Dash can still punch through the corridor.
export const WIND_ACCELERATION = 1120;
export const WIND_MAX_HORIZONTAL_SPEED = 460;
const WIND_ANCHOR_INTERVAL = 9;

function isWindAnchor(platform: PlatformEntity): boolean {
  return platform.id % WIND_ANCHOR_INTERVAL === 0;
}

export function windFieldForPlatform(platform: PlatformEntity): WindField | null {
  if (platform.biomeTheme !== 'pale-heights' || !platform.motion || !isWindAnchor(platform)) return null;

  // The floe only provides a deterministic vertical anchor. The corridor itself
  // spans the play space and remains fixed in world coordinates while the floe drifts.
  const direction = Math.floor(Math.abs(platform.y) / 260) % 2 === 0 ? 1 : -1;
  return {
    x: 180,
    y: platform.y - 68,
    halfWidth: 126,
    halfHeight: 74,
    forceX: direction * WIND_ACCELERATION,
  };
}

export function windAccelerationAt(platforms: readonly PlatformEntity[], playerX: number, playerY: number): number {
  for (const platform of platforms) {
    const field = windFieldForPlatform(platform);
    if (!field) continue;
    if (Math.abs(playerX - field.x) <= field.halfWidth && Math.abs(playerY - field.y) <= field.halfHeight) return field.forceX;
  }
  return 0;
}

export function applyWindVelocity(velocityX: number, acceleration: number, dt: number): number {
  if (acceleration === 0 || dt <= 0) return velocityX;
  const next = velocityX + acceleration * Math.min(0.033, dt);
  return Math.max(-WIND_MAX_HORIZONTAL_SPEED, Math.min(WIND_MAX_HORIZONTAL_SPEED, next));
}
