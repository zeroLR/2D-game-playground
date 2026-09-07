export interface FixedStepLoopOptions {
  stepMs?: number;
  maxStepsPerFrame?: number;
}

export class FixedStepLoop {
  private readonly stepMs: number;
  private readonly maxStepsPerFrame: number;
  private accumulatorMs = 0;

  constructor(
    private readonly update: (dtSeconds: number) => void,
    private readonly render: (alpha: number) => void,
    options: FixedStepLoopOptions = {},
  ) {
    this.stepMs = options.stepMs ?? 1000 / 60;
    this.maxStepsPerFrame = options.maxStepsPerFrame ?? 8;

    if (!(this.stepMs > 0)) throw new Error('FixedStepLoop stepMs must be greater than zero.');
    if (!Number.isInteger(this.maxStepsPerFrame) || this.maxStepsPerFrame <= 0) {
      throw new Error('FixedStepLoop maxStepsPerFrame must be a positive integer.');
    }
  }

  tick(elapsedMs: number): number {
    const finiteElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
    const clampedElapsed = Math.min(finiteElapsed, this.stepMs * this.maxStepsPerFrame);
    this.accumulatorMs += clampedElapsed;

    let steps = 0;
    while (this.accumulatorMs >= this.stepMs && steps < this.maxStepsPerFrame) {
      this.update(this.stepMs / 1000);
      this.accumulatorMs -= this.stepMs;
      steps += 1;
    }

    this.render(this.accumulatorMs / this.stepMs);
    return steps;
  }

  reset(): void {
    this.accumulatorMs = 0;
  }
}
