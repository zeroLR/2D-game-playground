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
