export function normalizeRadians(value: number): number {
  const tau = Math.PI * 2;
  const normalized = ((value + Math.PI) % tau + tau) % tau - Math.PI;
  return Object.is(normalized, -0) ? 0 : normalized;
}

export function shortestAngleDeltaRad(from: number, to: number): number {
  return normalizeRadians(to - from);
}

export function dampAngle(
  current: number,
  target: number,
  responsePerSecond: number,
  deltaSeconds: number,
): number {
  const dt = Math.min(Math.max(deltaSeconds, 0), 0.1);
  const alpha = 1 - Math.exp(-Math.max(responsePerSecond, 0) * dt);
  return normalizeRadians(current + shortestAngleDeltaRad(current, target) * alpha);
}

export function velocityHeadingRad(x: number, z: number): number {
  return Math.atan2(x, z);
}

/**
 * Keep small lateral trajectory changes visible instead of immediately rotating
 * the camera to erase them. Once the travel-heading error is large enough, the
 * follow response ramps smoothly to full strength.
 */
export function headingFollowWeight(
  headingErrorRad: number,
  holdAngleRad: number,
  fullFollowAngleRad: number,
): number {
  const error = Math.abs(headingErrorRad);
  const hold = Math.max(0, holdAngleRad);
  const full = Math.max(hold + 1e-6, fullFollowAngleRad);
  if (error <= hold) return 0;
  if (error >= full) return 1;

  const t = (error - hold) / (full - hold);
  return t * t * (3 - 2 * t);
}
