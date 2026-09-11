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
  private target: Vec2 = { x: 0, y: 0 };
  private lastFilterUpdateAtMs: number | null = null;
  private source: TiltSourceKind | null = null;
  private raw: RawOrientationTelemetry | null = null;
  private lastSampleAtMs: number | null = null;
  private sensitivityMultiplier = 1;

  constructor(config: Partial<TiltInputConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  ingest(sample: TiltSourceSample): void {
    this.source = sample.source;
    this.current = { x: sample.screenXDeg, y: sample.screenYDeg };
    this.raw = sample.raw ?? null;
    this.lastSampleAtMs = sample.timestampMs;
    this.refreshTarget();
  }

  setSensitivityMultiplier(multiplier: number): void {
    this.sensitivityMultiplier = Math.min(2, Math.max(0.5, multiplier));
    this.refreshTarget();
  }

  update(nowMs: number): void {
    if (!this.neutral) return;
    const dtSeconds = this.lastFilterUpdateAtMs === null ? 1 / 60 : Math.max(0, (nowMs - this.lastFilterUpdateAtMs) / 1000);
    this.lastFilterUpdateAtMs = nowMs;
    this.filtered = {
      x: smoothExp(this.filtered.x, this.target.x, this.config.smoothingResponsePerSecond, dtSeconds),
      y: smoothExp(this.filtered.y, this.target.y, this.config.smoothingResponsePerSecond, dtSeconds),
    };
  }

  recenter(): boolean {
    if (this.lastSampleAtMs === null) return false;
    this.neutral = { ...this.current };
    this.target = { x: 0, y: 0 };
    this.filtered = { x: 0, y: 0 };
    this.lastFilterUpdateAtMs = null;
    return true;
  }

  clearCalibration(): void {
    this.neutral = null;
    this.target = { x: 0, y: 0 };
    this.filtered = { x: 0, y: 0 };
    this.lastFilterUpdateAtMs = null;
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

  private refreshTarget(): void {
    if (!this.neutral) return;
    const relative = relativeTilt(this.current, this.neutral);
    const effectiveSaturationDeg = Math.max(
      this.config.deadZoneDeg + 0.001,
      this.config.saturationDeg / this.sensitivityMultiplier,
    );
    this.target = {
      x: applyAxisResponse(relative.x, this.config.deadZoneDeg, effectiveSaturationDeg),
      y: applyAxisResponse(relative.y, this.config.deadZoneDeg, effectiveSaturationDeg),
    };
  }
}
