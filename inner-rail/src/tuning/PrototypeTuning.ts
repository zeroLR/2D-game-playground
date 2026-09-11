export interface PrototypeTuningValues {
  cameraFovDeg: number;
  cameraYawResponsePerSecond: number;
  ballInertia: number;
  tiltSensitivity: number;
}

export const DEFAULT_PROTOTYPE_TUNING: PrototypeTuningValues = {
  cameraFovDeg: 76,
  cameraYawResponsePerSecond: 4.2,
  ballInertia: (0.35 - 0.16) / (0.35 - 0.02),
  tiltSensitivity: 1,
};

export const PROTOTYPE_TUNING_RANGES = {
  cameraFovDeg: { min: 55, max: 95, step: 1 },
  cameraYawResponsePerSecond: { min: 1.5, max: 10, step: 0.1 },
  ballInertia: { min: 0, max: 1, step: 0.01 },
  tiltSensitivity: { min: 0.5, max: 2, step: 0.05 },
} as const;

const STORAGE_KEY = 'inner-rail:p0.2-tuning:v1';

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
  const sensitivity = PROTOTYPE_TUNING_RANGES.tiltSensitivity;

  return {
    cameraFovDeg: clamp(finiteOr(value.cameraFovDeg, DEFAULT_PROTOTYPE_TUNING.cameraFovDeg), fov.min, fov.max),
    cameraYawResponsePerSecond: clamp(
      finiteOr(value.cameraYawResponsePerSecond, DEFAULT_PROTOTYPE_TUNING.cameraYawResponsePerSecond),
      yaw.min,
      yaw.max,
    ),
    ballInertia: clamp(finiteOr(value.ballInertia, DEFAULT_PROTOTYPE_TUNING.ballInertia), inertia.min, inertia.max),
    tiltSensitivity: clamp(
      finiteOr(value.tiltSensitivity, DEFAULT_PROTOTYPE_TUNING.tiltSensitivity),
      sensitivity.min,
      sensitivity.max,
    ),
  };
}

export function loadPrototypeTuning(): PrototypeTuningValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROTOTYPE_TUNING };
    return sanitizePrototypeTuning(JSON.parse(raw) as Partial<PrototypeTuningValues>);
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
