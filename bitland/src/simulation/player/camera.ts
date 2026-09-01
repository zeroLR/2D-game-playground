export type CameraState = {
  x: number;
  lookAhead: number;
};

export type CameraConfig = {
  viewportWidth: number;
  worldWidth: number;
  deadZoneHalfWidth: number;
  lookAheadDistance: number;
  followSharpness: number;
  lookAheadSharpness: number;
};

export const DEFAULT_CAMERA: CameraConfig = {
  viewportWidth: 960,
  worldWidth: 1920,
  deadZoneHalfWidth: 120,
  lookAheadDistance: 90,
  followSharpness: 8,
  lookAheadSharpness: 6,
};

const damp = (current: number, target: number, sharpness: number, dt: number): number => {
  return current + (target - current) * (1 - Math.exp(-sharpness * dt));
};

export function createCameraState(): CameraState {
  return { x: 0, lookAhead: 0 };
}

export function stepCamera(
  state: CameraState,
  playerX: number,
  playerVelocityX: number,
  dt: number,
  config: CameraConfig = DEFAULT_CAMERA,
): void {
  const maxCameraX = Math.max(0, config.worldWidth - config.viewportWidth);
  const desiredLookAhead = Math.abs(playerVelocityX) < 10
    ? 0
    : Math.sign(playerVelocityX) * config.lookAheadDistance;
  state.lookAhead = damp(state.lookAhead, desiredLookAhead, config.lookAheadSharpness, dt);

  const targetScreenX = playerX - state.x + state.lookAhead;
  const screenCenter = config.viewportWidth / 2;
  const leftEdge = screenCenter - config.deadZoneHalfWidth;
  const rightEdge = screenCenter + config.deadZoneHalfWidth;

  let targetCameraX = state.x;
  if (targetScreenX < leftEdge) targetCameraX -= leftEdge - targetScreenX;
  if (targetScreenX > rightEdge) targetCameraX += targetScreenX - rightEdge;

  targetCameraX = Math.max(0, Math.min(maxCameraX, targetCameraX));
  state.x = damp(state.x, targetCameraX, config.followSharpness, dt);
}
