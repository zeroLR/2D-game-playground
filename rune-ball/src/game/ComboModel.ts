export interface ComboSnapshot {
  combo: number;
  longestCombo: number;
  score: number;
  secondsRemaining: number;
}

export interface BreakReward {
  combo: number;
  multiplier: number;
  scoreAdded: number;
  totalScore: number;
}

const DEFAULT_COMBO_WINDOW_SECONDS = 2.2;
const CONTACT_GRACE_SECONDS = 0.9;

export class ComboModel {
  private combo = 0;
  private longestCombo = 0;
  private score = 0;
  private secondsRemaining = 0;

  constructor(private readonly comboWindowSeconds = DEFAULT_COMBO_WINDOW_SECONDS) {
    if (!(comboWindowSeconds > 0)) throw new Error('comboWindowSeconds must be greater than zero.');
  }

  get snapshot(): ComboSnapshot {
    return {
      combo: this.combo,
      longestCombo: this.longestCombo,
      score: this.score,
      secondsRemaining: this.secondsRemaining,
    };
  }

  update(dtSeconds: number): boolean {
    if (this.combo === 0) return false;
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.secondsRemaining = Math.max(0, this.secondsRemaining - dt);
    if (this.secondsRemaining > 0) return false;

    this.combo = 0;
    return true;
  }

  registerContact(): void {
    if (this.combo === 0) return;
    this.secondsRemaining = Math.max(this.secondsRemaining, Math.min(CONTACT_GRACE_SECONDS, this.comboWindowSeconds));
  }

  registerBreak(baseScore: number): BreakReward {
    this.combo += 1;
    this.longestCombo = Math.max(this.longestCombo, this.combo);
    this.secondsRemaining = this.comboWindowSeconds;

    const multiplier = Math.min(2.5, 1 + Math.floor((this.combo - 1) / 4) * 0.25);
    const safeBaseScore = Number.isFinite(baseScore) ? Math.max(0, baseScore) : 0;
    const scoreAdded = Math.round(safeBaseScore * multiplier);
    this.score += scoreAdded;

    return {
      combo: this.combo,
      multiplier,
      scoreAdded,
      totalScore: this.score,
    };
  }
}
