import {
  applyAxisResponse,
  normalizedTiltToGravityDirection,
  relativeTilt,
  smoothExp,
  type GravityDirection,
  type Vec2,
} from './orientationMath';
import type { RawOrientationTelemetry, TiltSourceKind, TiltSourceSample } from './types';

export interface TiltInputConfig {
  deadZoneDeg: number;
  saturationDeg: number;
  smoothingResponsePerSecond: number;
}

export interface TiltSnapshot {
  source: TiltSourceKind | null;
  hasSample: boolean;
  neutral: Vec2 | null;
  screenTiltDeg: Vec2;
  relativeTiltDeg: Vec2;
  normalized: Vec2;
  gravityDirection: GravityDirection;
  raw: RawOrientationTelemetry | null;
  lastSampleAtMs: number | null;
}

const DEFAULT_CONFIG: TiltInputConfig = {
  deadZoneDeg: 1.5,
  saturationDeg: 25,
  smoothingResponsePerSecond: 12,
};

export class TiltInput {
  private readonly config: TiltInputConfig;
  private current: Vec2 = { x: 0, y: 0 };
  private neutral: Vec2 | null = null;
  private filtered: Vec2 = { x: 0, y: 0 };
  private source: TiltSourceKind | null = null;
  private raw: RawOrientationTelemetry | null = null;
  private lastSampleAtMs: number | null = null;

  constructor(config: Partial<TiltInputConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  ingest(sample: TiltSourceSample): void {
    const previousAt = this.lastSampleAtMs;
    this.source = sample.source;
    this.current = { x: sample.screenXDeg, y: sample.screenYDeg };
    this.raw = sample.raw ?? null;
    this.lastSampleAtMs = sample.timestampMs;

    if (!this.neutral) return;

    const relative = relativeTilt(this.current, this.neutral);
    const target = {
      x: applyAxisResponse(relative.x, this.config.deadZoneDeg, this.config.saturationDeg),
      y: applyAxisResponse(relative.y, this.config.deadZoneDeg, this.config.saturationDeg),
    };
    const dtSeconds = previousAt === null ? 1 / 60 : Math.max(0, (sample.timestampMs - previousAt) / 1000);

    this.filtered = {
      x: smoothExp(this.filtered.x, target.x, this.config.smoothingResponsePerSecond, dtSeconds),
      y: smoothExp(this.filtered.y, target.y, this.config.smoothingResponsePerSecond, dtSeconds),
    };
  }

  recenter(): boolean {
    if (this.lastSampleAtMs === null) return false;
    this.neutral = { ...this.current };
    this.filtered = { x: 0, y: 0 };
    return true;
  }

  clearCalibration(): void {
    this.neutral = null;
    this.filtered = { x: 0, y: 0 };
  }

  snapshot(): TiltSnapshot {
    const relative = this.neutral ? relativeTilt(this.current, this.neutral) : { x: 0, y: 0 };
    return {
      source: this.source,
      hasSample: this.lastSampleAtMs !== null,
      neutral: this.neutral ? { ...this.neutral } : null,
      screenTiltDeg: { ...this.current },
      relativeTiltDeg: relative,
      normalized: { ...this.filtered },
      gravityDirection: normalizedTiltToGravityDirection(this.filtered, this.config.saturationDeg),
      raw: this.raw ? { ...this.raw } : null,
      lastSampleAtMs: this.lastSampleAtMs,
    };
  }
}
