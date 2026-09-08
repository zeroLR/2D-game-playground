import type { Point2D } from '../input/SwipeClassifier';
import type { RuneKind } from './RuneTypes';

export interface RuneSnapshot {
  charge: number;
  maxCharge: number;
  cost: number;
  vortexCenter: Point2D | null;
  vortexStrength: number;
  splitStrength: number;
  chainReady: boolean;
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
  private splitSecondsRemaining = 0;
  private chainReady = false;

  get snapshot(): RuneSnapshot {
    return {
      charge: this.charge,
      maxCharge: MAX_CHARGE,
      cost: RUNE_COST,
      vortexCenter: this.vortexCenter ? { ...this.vortexCenter } : null,
      vortexStrength: this.clamp01(this.vortexSecondsRemaining / VORTEX_DURATION_SECONDS),
      splitStrength: this.clamp01(this.splitSecondsRemaining / SPLIT_DURATION_SECONDS),
      chainReady: this.chainReady,
    };
  }

  update(dtSeconds: number): void {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.vortexSecondsRemaining = Math.max(0, this.vortexSecondsRemaining - dt);
    if (this.vortexSecondsRemaining <= 0) this.vortexCenter = null;
    this.splitSecondsRemaining = Math.max(0, this.splitSecondsRemaining - dt);
  }

  activate(rune: RuneKind, center: Point2D): RuneActivationResult {
    if (this.charge < RUNE_COST) return { success: false, rune, reason: 'charge' };
    if (rune === 'chain' && this.chainReady) return { success: false, rune, reason: 'busy' };

    this.charge -= RUNE_COST;
    switch (rune) {
      case 'vortex':
        this.vortexCenter = { ...center };
        this.vortexSecondsRemaining = VORTEX_DURATION_SECONDS;
        break;
      case 'split':
        this.splitSecondsRemaining = SPLIT_DURATION_SECONDS;
        break;
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
