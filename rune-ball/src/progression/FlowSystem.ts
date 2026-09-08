export interface FlowSnapshot {
  value: number;
  threshold: number;
  ratio: number;
  presentationIntensity: number;
  overdriveActive: boolean;
  overdriveSecondsRemaining: number;
  overdriveDuration: number;
  overdriveUsed: boolean;
}

const FLOW_THRESHOLD = 100;
const OVERDRIVE_DURATION_SECONDS = 12;
const HIT_FLOW = 2;
const BREAK_FLOW = 5;
const RUNE_FLOW = 4;
const CHAIN_TARGET_FLOW = 1.5;
const CHAIN_FLOW_CAP = 5;

export class FlowSystem {
  private value = 0;
  private overdriveActive = false;
  private overdriveSecondsRemaining = 0;
  private overdriveUsed = false;

  get snapshot(): FlowSnapshot {
    const ratio = this.clamp01(this.value / FLOW_THRESHOLD);
    return {
      value: this.value,
      threshold: FLOW_THRESHOLD,
      ratio,
      presentationIntensity: this.overdriveActive ? 1 : ratio,
      overdriveActive: this.overdriveActive,
      overdriveSecondsRemaining: this.overdriveSecondsRemaining,
      overdriveDuration: OVERDRIVE_DURATION_SECONDS,
      overdriveUsed: this.overdriveUsed,
    };
  }

  update(dtSeconds: number): boolean {
    if (!this.overdriveActive) return false;
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.overdriveSecondsRemaining = Math.max(0, this.overdriveSecondsRemaining - dt);
    if (this.overdriveSecondsRemaining > 0) return false;

    this.overdriveActive = false;
    this.value = 0;
    return true;
  }

  registerImpact(destroyed: boolean): boolean {
    return this.addFlow(HIT_FLOW + (destroyed ? BREAK_FLOW : 0));
  }

  registerRune(): boolean {
    return this.addFlow(RUNE_FLOW);
  }

  registerChain(targetCount: number): boolean {
    const count = Number.isFinite(targetCount) ? Math.max(0, Math.floor(targetCount)) : 0;
    return this.addFlow(Math.min(CHAIN_FLOW_CAP, count * CHAIN_TARGET_FLOW));
  }

  private addFlow(amount: number): boolean {
    if (this.overdriveActive || this.overdriveUsed) return false;
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    this.value = Math.min(FLOW_THRESHOLD, this.value + safeAmount);
    if (this.value < FLOW_THRESHOLD) return false;

    this.overdriveActive = true;
    this.overdriveUsed = true;
    this.overdriveSecondsRemaining = OVERDRIVE_DURATION_SECONDS;
    return true;
  }

  private clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
}
