import type { Point2D } from '../input/SwipeClassifier';
import type { RuneKind } from './RuneTypes';

export interface RuneSnapshot {
  charge: number;
  maxCharge: number;
  cost: number;
  baseCost: number;
  vortexCenter: Point2D | null;
  vortexStrength: number;
  splitStrength: number;
  chainReady: boolean;
  overdriveActive: boolean;
}

export interface RuneActivationOptions {
  vortexDurationSeconds?: number;
  splitDurationSeconds?: number;
}

export type RuneActivationResult =
  | { success: true; rune: RuneKind }
  | { success: false; rune: RuneKind; reason: 'charge' | 'busy' };

const MAX_CHARGE = 100;
const RUNE_COST = 30;
const STARTING_CHARGE = 100;
const HIT_CHARGE = 5;
const BREAK_CHARGE = 11;
const VORTEX_DURATION_SECONDS = 0.65;
const SPLIT_DURATION_SECONDS = 1.25;

export class RuneSystem {
  private charge = STARTING_CHARGE;
  private vortexCenter: Point2D | null = null;
  private vortexSecondsRemaining = 0;
  private vortexDurationSeconds = VORTEX_DURATION_SECONDS;
  private splitSecondsRemaining = 0;
  private splitDurationSeconds = SPLIT_DURATION_SECONDS;
  private chainReady = false;
  private overdriveActive = false;

  get snapshot(): RuneSnapshot {
    return {
      charge: this.charge,
      maxCharge: MAX_CHARGE,
      cost: this.overdriveActive ? 0 : RUNE_COST,
      baseCost: RUNE_COST,
      vortexCenter: this.vortexCenter ? { ...this.vortexCenter } : null,
      vortexStrength: this.clamp01(this.vortexSecondsRemaining / this.vortexDurationSeconds),
      splitStrength: this.clamp01(this.splitSecondsRemaining / this.splitDurationSeconds),
      chainReady: this.chainReady,
      overdriveActive: this.overdriveActive,
    };
  }

  update(dtSeconds: number): void {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.vortexSecondsRemaining = Math.max(0, this.vortexSecondsRemaining - dt);
    if (this.vortexSecondsRemaining <= 0) this.vortexCenter = null;
    this.splitSecondsRemaining = Math.max(0, this.splitSecondsRemaining - dt);
  }

  setOverdriveActive(active: boolean): void {
    this.overdriveActive = active;
  }

  activate(rune: RuneKind, center: Point2D, options: RuneActivationOptions = {}): RuneActivationResult {
    const cost = this.overdriveActive ? 0 : RUNE_COST;
    if (this.charge < cost) return { success: false, rune, reason: 'charge' };
    if (rune === 'chain' && this.chainReady) return { success: false, rune, reason: 'busy' };

    this.charge -= cost;
    switch (rune) {
      case 'vortex': {
        const requestedDuration = options.vortexDurationSeconds ?? VORTEX_DURATION_SECONDS;
        this.vortexDurationSeconds = Number.isFinite(requestedDuration)
          ? Math.max(0.1, requestedDuration)
          : VORTEX_DURATION_SECONDS;
        this.vortexCenter = { ...center };
        this.vortexSecondsRemaining = this.vortexDurationSeconds;
        break;
      }
      case 'split': {
        const requestedDuration = options.splitDurationSeconds ?? SPLIT_DURATION_SECONDS;
        this.splitDurationSeconds = Number.isFinite(requestedDuration)
          ? Math.max(0.1, requestedDuration)
          : SPLIT_DURATION_SECONDS;
        this.splitSecondsRemaining = this.splitDurationSeconds;
        break;
      }
      case 'chain':
        this.chainReady = true;
        break;
    }
    return { success: true, rune };
  }

  registerImpact(destroyed: boolean): void {
    this.charge = Math.min(MAX_CHARGE, this.charge + HIT_CHARGE + (destroyed ? BREAK_CHARGE : 0));
  }

  consumeChain(): boolean {
    if (!this.chainReady) return false;
    this.chainReady = false;
    return true;
  }

  private clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
}
