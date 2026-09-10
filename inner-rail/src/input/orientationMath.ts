export interface Vec2 {
  x: number;
  y: number;
}

export interface GravityDirection {
  x: number;
  y: number;
  z: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeDegrees(value: number): number {
  const normalized = ((value + 180) % 360 + 360) % 360 - 180;
  return Object.is(normalized, -0) ? 0 : normalized;
}

export function shortestAngleDelta(fromDeg: number, toDeg: number): number {
  return normalizeDegrees(toDeg - fromDeg);
}

/**
 * DeviceOrientation beta/gamma are expressed in the device's natural axes.
 * Rotate those axes into the current screen frame so screen-left/right and
 * screen-forward/back remain stable across portrait/landscape orientation.
 */
export function correctForScreenOrientation(
  betaDeg: number,
  gammaDeg: number,
  screenAngleDeg: number,
): Vec2 {
  const radians = (-normalizeDegrees(screenAngleDeg) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const deviceX = gammaDeg;
  const deviceY = betaDeg;

  return {
    x: deviceX * cos - deviceY * sin,
    y: deviceX * sin + deviceY * cos,
  };
}

export function relativeTilt(current: Vec2, neutral: Vec2): Vec2 {
  return {
    x: shortestAngleDelta(neutral.x, current.x),
    y: shortestAngleDelta(neutral.y, current.y),
  };
}

export function applyAxisResponse(
  deltaDeg: number,
  deadZoneDeg: number,
  saturationDeg: number,
): number {
  const safeSaturation = Math.max(deadZoneDeg + 0.001, saturationDeg);
  const magnitude = Math.abs(deltaDeg);
  if (magnitude <= deadZoneDeg) return 0;
  const normalized = (magnitude - deadZoneDeg) / (safeSaturation - deadZoneDeg);
  return Math.sign(deltaDeg) * clamp(normalized, 0, 1);
}

export function smoothExp(current: number, target: number, responsePerSecond: number, dtSeconds: number): number {
  const safeDt = clamp(dtSeconds, 0, 0.1);
  const alpha = 1 - Math.exp(-Math.max(0, responsePerSecond) * safeDt);
  return current + (target - current) * alpha;
}

export function normalizedTiltToGravityDirection(tilt: Vec2, maxTiltDeg = 25): GravityDirection {
  const maxTiltRad = (maxTiltDeg * Math.PI) / 180;
  const horizontalX = Math.tan(clamp(tilt.x, -1, 1) * maxTiltRad);
  const horizontalZ = -Math.tan(clamp(tilt.y, -1, 1) * maxTiltRad);
  const length = Math.hypot(horizontalX, 1, horizontalZ);

  return {
    x: horizontalX / length,
    y: -1 / length,
    z: horizontalZ / length,
  };
}
