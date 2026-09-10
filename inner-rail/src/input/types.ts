export type TiltSourceKind = 'device' | 'synthetic';

export interface RawOrientationTelemetry {
  betaDeg: number;
  gammaDeg: number;
  screenAngleDeg: number;
}

export interface TiltSourceSample {
  source: TiltSourceKind;
  screenXDeg: number;
  screenYDeg: number;
  timestampMs: number;
  raw?: RawOrientationTelemetry;
}

export interface TiltSource {
  readonly kind: TiltSourceKind;
  start(listener: (sample: TiltSourceSample) => void): Promise<TiltSourceStartResult>;
  stop(): void;
}

export type TiltSourceStartResult =
  | { status: 'started' }
  | { status: 'denied'; reason: string }
  | { status: 'unavailable'; reason: string }
  | { status: 'error'; reason: string };
