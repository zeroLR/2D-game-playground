export interface PrototypeTuningValues {
  cameraFovDeg: number;
  cameraYawResponsePerSecond: number;
  ballInertia: number;
  contactFriction: number;
  contactRestitution: number;
  tiltSensitivity: number;
  tiltDeadZoneDeg: number;
  tiltSaturationDeg: number;
  tiltSmoothingResponsePerSecond: number;
}

export const DEFAULT_PROTOTYPE_TUNING: PrototypeTuningValues = {
  cameraFovDeg: 76,
  cameraYawResponsePerSecond: 4.2,
  ballInertia: (0.35 - 0.16) / (0.35 - 0.02),
  contactFriction: 0.48,
  contactRestitution: 0.08,
  tiltSensitivity: 1,
  tiltDeadZoneDeg: 1.5,
  tiltSaturationDeg: 25,
  tiltSmoothingResponsePerSecond: 12,
};

export const PROTOTYPE_TUNING_RANGES = {
  cameraFovDeg: { min: 55, max: 95, step: 1 },
  cameraYawResponsePerSecond: { min: 1.5, max: 10, step: 0.1 },
  ballInertia: { min: 0, max: 1, step: 0.01 },
  contactFriction: { min: 0.15, max: 0.9, step: 0.01 },
  contactRestitution: { min: 0, max: 0.25, step: 0.01 },
  tiltSensitivity: { min: 0.5, max: 2, step: 0.05 },
  tiltDeadZoneDeg: { min: 0.25, max: 4, step: 0.25 },
  tiltSaturationDeg: { min: 15, max: 35, step: 1 },
  tiltSmoothingResponsePerSecond: { min: 4, max: 24, step: 1 },
} as const;

const STORAGE_KEY = 'inner-rail:p0.4-tuning:v2';
const LEGACY_STORAGE_KEY = 'inner-rail:p0.2-tuning:v1';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function sanitizePrototypeTuning(value: Partial<PrototypeTuningValues>): PrototypeTuningValues {
  const fov = PROTOTYPE_TUNING_RANGES.cameraFovDeg;
  const yaw = PROTOTYPE_TUNING_RANGES.cameraYawResponsePerSecond;
  const inertia = PROTOTYPE_TUNING_RANGES.ballInertia;
  const friction = PROTOTYPE_TUNING_RANGES.contactFriction;
  const restitution = PROTOTYPE_TUNING_RANGES.contactRestitution;
  const sensitivity = PROTOTYPE_TUNING_RANGES.tiltSensitivity;
  const deadZone = PROTOTYPE_TUNING_RANGES.tiltDeadZoneDeg;
  const saturation = PROTOTYPE_TUNING_RANGES.tiltSaturationDeg;
  const smoothing = PROTOTYPE_TUNING_RANGES.tiltSmoothingResponsePerSecond;

  return {
    cameraFovDeg: clamp(finiteOr(value.cameraFovDeg, DEFAULT_PROTOTYPE_TUNING.cameraFovDeg), fov.min, fov.max),
    cameraYawResponsePerSecond: clamp(
      finiteOr(value.cameraYawResponsePerSecond, DEFAULT_PROTOTYPE_TUNING.cameraYawResponsePerSecond),
      yaw.min,
      yaw.max,
    ),
    ballInertia: clamp(finiteOr(value.ballInertia, DEFAULT_PROTOTYPE_TUNING.ballInertia), inertia.min, inertia.max),
    contactFriction: clamp(
      finiteOr(value.contactFriction, DEFAULT_PROTOTYPE_TUNING.contactFriction),
      friction.min,
      friction.max,
    ),
    contactRestitution: clamp(
      finiteOr(value.contactRestitution, DEFAULT_PROTOTYPE_TUNING.contactRestitution),
      restitution.min,
      restitution.max,
    ),
    tiltSensitivity: clamp(
      finiteOr(value.tiltSensitivity, DEFAULT_PROTOTYPE_TUNING.tiltSensitivity),
      sensitivity.min,
      sensitivity.max,
    ),
    tiltDeadZoneDeg: clamp(
      finiteOr(value.tiltDeadZoneDeg, DEFAULT_PROTOTYPE_TUNING.tiltDeadZoneDeg),
      deadZone.min,
      deadZone.max,
    ),
    tiltSaturationDeg: clamp(
      finiteOr(value.tiltSaturationDeg, DEFAULT_PROTOTYPE_TUNING.tiltSaturationDeg),
      saturation.min,
      saturation.max,
    ),
    tiltSmoothingResponsePerSecond: clamp(
      finiteOr(value.tiltSmoothingResponsePerSecond, DEFAULT_PROTOTYPE_TUNING.tiltSmoothingResponsePerSecond),
      smoothing.min,
      smoothing.max,
    ),
  };
}

function parseStoredTuning(raw: string | null): PrototypeTuningValues | null {
  if (!raw) return null;
  try {
    return sanitizePrototypeTuning(JSON.parse(raw) as Partial<PrototypeTuningValues>);
  } catch {
    return null;
  }
}

export function loadPrototypeTuning(): PrototypeTuningValues {
  try {
    return (
      parseStoredTuning(localStorage.getItem(STORAGE_KEY)) ??
      parseStoredTuning(localStorage.getItem(LEGACY_STORAGE_KEY)) ??
      { ...DEFAULT_PROTOTYPE_TUNING }
    );
  } catch {
    return { ...DEFAULT_PROTOTYPE_TUNING };
  }
}

export function savePrototypeTuning(values: PrototypeTuningValues): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizePrototypeTuning(values)));
  } catch {
    // Tuning persistence is optional; runtime controls still work when storage is unavailable.
  }
}

export function ballInertiaToLinearDamping(inertia: number): number {
  const normalized = clamp(inertia, 0, 1);
  const maxDamping = 0.35;
  const minDamping = 0.02;
  return maxDamping + (minDamping - maxDamping) * normalized;
}
