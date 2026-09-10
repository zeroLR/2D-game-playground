import type { TiltSource, TiltSourceSample, TiltSourceStartResult } from './types';

export class SyntheticTiltSource implements TiltSource {
  readonly kind = 'synthetic' as const;
  private listener: ((sample: TiltSourceSample) => void) | null = null;
  private x = 0;
  private y = 0;
  private readonly saturationDeg: number;

  constructor(saturationDeg = 25) {
    this.saturationDeg = saturationDeg;
  }

  async start(listener: (sample: TiltSourceSample) => void): Promise<TiltSourceStartResult> {
    this.listener = listener;
    this.emit();
    return { status: 'started' };
  }

  setNormalized(x: number, y: number): void {
    this.x = Math.max(-1, Math.min(1, x));
    this.y = Math.max(-1, Math.min(1, y));
    this.emit();
  }

  stop(): void {
    this.listener = null;
  }

  private emit(): void {
    this.listener?.({
      source: this.kind,
      screenXDeg: this.x * this.saturationDeg,
      screenYDeg: this.y * this.saturationDeg,
      timestampMs: performance.now(),
    });
  }
}
