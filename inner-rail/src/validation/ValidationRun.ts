import type { TiltSourceKind } from '../input/types';
import type { TrackProgressSnapshot } from '../track/TrackProgress';
import type { TrackSectionId } from '../track/TestTrack';
import type { PrototypeTuningValues } from '../tuning/PrototypeTuning';

export type ValidationOrientation = 'portrait' | 'landscape';

export interface ValidationRunSummary {
  orientation: ValidationOrientation;
  source: TiltSourceKind;
  durationSeconds: number;
  fallCount: number;
  sectionSeconds: Partial<Record<TrackSectionId, number>>;
  tuning: PrototypeTuningValues;
  completedAtIso: string;
}

export interface ValidationRunSnapshot {
  active: boolean;
  elapsedSeconds: number;
  fallCount: number;
  sectionSeconds: Partial<Record<TrackSectionId, number>>;
}

const HISTORY_KEY = 'inner-rail:p0.4-validation-history:v1';
const HISTORY_LIMIT = 12;

export class ValidationRunRecorder {
  private startedAtMs: number | null = null;
  private sectionStartedAtMs: number | null = null;
  private section: TrackSectionId | null = null;
  private orientation: ValidationOrientation = 'portrait';
  private source: TiltSourceKind = 'synthetic';
  private tuning: PrototypeTuningValues | null = null;
  private fallCount = 0;
  private sectionSeconds: Partial<Record<TrackSectionId, number>> = {};
  private completionEmitted = false;

  start(
    nowMs: number,
    orientation: ValidationOrientation,
    source: TiltSourceKind,
    tuning: PrototypeTuningValues,
    initialTrack: TrackProgressSnapshot,
  ): void {
    this.startedAtMs = nowMs;
    this.sectionStartedAtMs = nowMs;
    this.section = initialTrack.section;
    this.orientation = orientation;
    this.source = source;
    this.tuning = { ...tuning };
    this.fallCount = 0;
    this.sectionSeconds = {};
    this.completionEmitted = false;
  }

  cancel(): void {
    this.startedAtMs = null;
    this.sectionStartedAtMs = null;
    this.section = null;
    this.tuning = null;
    this.completionEmitted = false;
  }

  recordFall(): void {
    if (this.startedAtMs !== null) this.fallCount += 1;
  }

  update(nowMs: number, track: TrackProgressSnapshot): ValidationRunSummary | null {
    if (this.startedAtMs === null || this.sectionStartedAtMs === null || this.section === null || !this.tuning) {
      return null;
    }

    if (track.section !== this.section) {
      this.commitSection(nowMs);
      this.section = track.section;
      this.sectionStartedAtMs = nowMs;
    }

    if (!track.complete || this.completionEmitted) return null;

    this.commitSection(nowMs);
    this.completionEmitted = true;
    return {
      orientation: this.orientation,
      source: this.source,
      durationSeconds: Math.max(0, (nowMs - this.startedAtMs) / 1000),
      fallCount: this.fallCount,
      sectionSeconds: { ...this.sectionSeconds },
      tuning: { ...this.tuning },
      completedAtIso: new Date().toISOString(),
    };
  }

  snapshot(nowMs: number): ValidationRunSnapshot {
    return {
      active: this.startedAtMs !== null && !this.completionEmitted,
      elapsedSeconds: this.startedAtMs === null ? 0 : Math.max(0, (nowMs - this.startedAtMs) / 1000),
      fallCount: this.fallCount,
      sectionSeconds: this.sectionSecondsWithCurrent(nowMs),
    };
  }

  private commitSection(nowMs: number): void {
    if (this.sectionStartedAtMs === null || this.section === null) return;
    const elapsed = Math.max(0, (nowMs - this.sectionStartedAtMs) / 1000);
    this.sectionSeconds[this.section] = (this.sectionSeconds[this.section] ?? 0) + elapsed;
  }

  private sectionSecondsWithCurrent(nowMs: number): Partial<Record<TrackSectionId, number>> {
    const snapshot = { ...this.sectionSeconds };
    if (this.sectionStartedAtMs !== null && this.section !== null && this.startedAtMs !== null) {
      snapshot[this.section] = (snapshot[this.section] ?? 0) + Math.max(0, (nowMs - this.sectionStartedAtMs) / 1000);
    }
    return snapshot;
  }
}

export function loadValidationHistory(): ValidationRunSummary[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidationRunSummary).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveValidationRun(summary: ValidationRunSummary): ValidationRunSummary[] {
  const next = [summary, ...loadValidationHistory()].slice(0, HISTORY_LIMIT);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Session metrics are optional instrumentation and never block gameplay.
  }
  return next;
}

export function bestDeviceRun(
  history: readonly ValidationRunSummary[],
  orientation: ValidationOrientation,
): ValidationRunSummary | null {
  let best: ValidationRunSummary | null = null;
  for (const run of history) {
    if (run.source !== 'device' || run.orientation !== orientation) continue;
    if (!best || run.durationSeconds < best.durationSeconds) best = run;
  }
  return best;
}

function isValidationRunSummary(value: unknown): value is ValidationRunSummary {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ValidationRunSummary>;
  return (
    (candidate.orientation === 'portrait' || candidate.orientation === 'landscape') &&
    (candidate.source === 'device' || candidate.source === 'synthetic') &&
    typeof candidate.durationSeconds === 'number' &&
    Number.isFinite(candidate.durationSeconds) &&
    typeof candidate.fallCount === 'number' &&
    !!candidate.tuning &&
    typeof candidate.completedAtIso === 'string'
  );
}
