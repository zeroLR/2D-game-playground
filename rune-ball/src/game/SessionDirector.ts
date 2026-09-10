import type { DestructionEvent } from './DestructionSession';
import type { RuneKind } from '../rune/RuneTypes';

export type SessionPhase = 'ready' | 'playing' | 'final-release' | 'results';

export interface RuneUsageSummary {
  vortex: number;
  split: number;
  chain: number;
}

export interface SessionStats {
  score: number;
  maxCombo: number;
  breaks: number;
  runeBreaks: number;
  runesCast: number;
  runeUsage: RuneUsageSummary;
  chainTriggers: number;
  chainLinks: number;
  overdriveReached: boolean;
  overdriveBreaks: number;
}

export interface SessionSnapshot {
  phase: SessionPhase;
  elapsedSeconds: number;
  secondsRemaining: number;
  phaseSecondsRemaining: number;
  paused: boolean;
  stats: SessionStats;
}

export interface SessionDirectorOptions {
  totalSeconds?: number;
  finalReleaseSeconds?: number;
}

const DEFAULT_TOTAL_SECONDS = 75;
const DEFAULT_FINAL_RELEASE_SECONDS = 3;

function emptyRuneUsage(): RuneUsageSummary {
  return { vortex: 0, split: 0, chain: 0 };
}

function emptyStats(): SessionStats {
  return {
    score: 0,
    maxCombo: 0,
    breaks: 0,
    runeBreaks: 0,
    runesCast: 0,
    runeUsage: emptyRuneUsage(),
    chainTriggers: 0,
    chainLinks: 0,
    overdriveReached: false,
    overdriveBreaks: 0,
  };
}

export class SessionDirector {
  private readonly totalSeconds: number;
  private readonly finalReleaseSeconds: number;
  private readonly playingSeconds: number;
  private phase: SessionPhase = 'ready';
  private elapsedSeconds = 0;
  private paused = false;
  private overdriveActive = false;
  private stats = emptyStats();

  constructor(options: SessionDirectorOptions = {}) {
    this.totalSeconds = options.totalSeconds ?? DEFAULT_TOTAL_SECONDS;
    this.finalReleaseSeconds = options.finalReleaseSeconds ?? DEFAULT_FINAL_RELEASE_SECONDS;

    if (!(this.totalSeconds > 0)) throw new Error('SessionDirector totalSeconds must be greater than zero.');
    if (!(this.finalReleaseSeconds > 0) || this.finalReleaseSeconds >= this.totalSeconds) {
      throw new Error('SessionDirector finalReleaseSeconds must be greater than zero and shorter than the run.');
    }

    this.playingSeconds = this.totalSeconds - this.finalReleaseSeconds;
  }

  get snapshot(): SessionSnapshot {
    const secondsRemaining = Math.max(0, this.totalSeconds - this.elapsedSeconds);
    const phaseSecondsRemaining = this.phase === 'final-release'
      ? secondsRemaining
      : this.phase === 'playing'
        ? Math.max(0, this.playingSeconds - this.elapsedSeconds)
        : this.phase === 'ready'
          ? this.totalSeconds
          : 0;

    return {
      phase: this.phase,
      elapsedSeconds: this.elapsedSeconds,
      secondsRemaining,
      phaseSecondsRemaining,
      paused: this.paused,
      stats: {
        ...this.stats,
        runeUsage: { ...this.stats.runeUsage },
      },
    };
  }

  start(): boolean {
    if (this.phase !== 'ready') return false;
    this.phase = 'playing';
    return true;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
  }

  update(dtSeconds: number): SessionPhase | null {
    if (this.paused || this.phase === 'ready' || this.phase === 'results') return null;

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.elapsedSeconds = Math.min(this.totalSeconds, this.elapsedSeconds + dt);

    if (this.elapsedSeconds >= this.totalSeconds) {
      this.phase = 'results';
      this.overdriveActive = false;
      return 'results';
    }

    if (this.phase === 'playing' && this.elapsedSeconds >= this.playingSeconds) {
      this.phase = 'final-release';
      return 'final-release';
    }

    return null;
  }

  registerEvent(event: DestructionEvent): void {
    if (this.phase === 'results') return;

    switch (event.type) {
      case 'target-break':
        this.stats.score += event.scoreAdded;
        this.stats.breaks += 1;
        this.stats.maxCombo = Math.max(this.stats.maxCombo, event.combo);
        if (event.source !== 'ball') this.stats.runeBreaks += 1;
        if (this.overdriveActive) this.stats.overdriveBreaks += 1;
        break;
      case 'rune-activated':
        this.registerRune(event.rune);
        break;
      case 'chain-triggered':
        this.stats.chainTriggers += 1;
        this.stats.chainLinks += event.targets.length;
        break;
      case 'overdrive-enter':
        this.overdriveActive = true;
        this.stats.overdriveReached = true;
        break;
      case 'overdrive-exit':
        this.overdriveActive = false;
        break;
      default:
        break;
    }
  }

  reset(): void {
    this.phase = 'ready';
    this.elapsedSeconds = 0;
    this.paused = false;
    this.overdriveActive = false;
    this.stats = emptyStats();
  }

  private registerRune(rune: RuneKind): void {
    this.stats.runesCast += 1;
    this.stats.runeUsage[rune] += 1;
  }
}
