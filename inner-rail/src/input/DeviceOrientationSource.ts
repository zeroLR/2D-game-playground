import { correctForScreenOrientation } from './orientationMath';
import type { TiltSource, TiltSourceSample, TiltSourceStartResult } from './types';

type PermissionResult = 'granted' | 'denied';
type PermissionCapableDeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionResult>;
};

function getScreenAngleDeg(): number {
  if (typeof screen !== 'undefined' && screen.orientation && Number.isFinite(screen.orientation.angle)) {
    return screen.orientation.angle;
  }
  const legacyWindow = window as Window & { orientation?: number };
  return Number.isFinite(legacyWindow.orientation) ? Number(legacyWindow.orientation) : 0;
}

export class DeviceOrientationSource implements TiltSource {
  readonly kind = 'device' as const;
  private listener: ((sample: TiltSourceSample) => void) | null = null;

  private readonly handleOrientation = (event: DeviceOrientationEvent): void => {
    if (event.beta === null || event.gamma === null || !this.listener) return;
    const screenAngleDeg = getScreenAngleDeg();
    const corrected = correctForScreenOrientation(event.beta, event.gamma, screenAngleDeg);
    this.listener({
      source: this.kind,
      screenXDeg: corrected.x,
      screenYDeg: corrected.y,
      timestampMs: performance.now(),
      raw: {
        betaDeg: event.beta,
        gammaDeg: event.gamma,
        screenAngleDeg,
      },
    });
  };

  static isSupported(): boolean {
    return typeof DeviceOrientationEvent !== 'undefined';
  }

  async start(listener: (sample: TiltSourceSample) => void): Promise<TiltSourceStartResult> {
    if (!DeviceOrientationSource.isSupported()) {
      return { status: 'unavailable', reason: 'This browser does not expose device orientation.' };
    }

    try {
      const ctor = DeviceOrientationEvent as PermissionCapableDeviceOrientationConstructor;
      if (typeof ctor.requestPermission === 'function') {
        const permission = await ctor.requestPermission();
        if (permission !== 'granted') {
          return { status: 'denied', reason: 'Motion access was denied by the browser.' };
        }
      }

      this.listener = listener;
      window.addEventListener('deviceorientation', this.handleOrientation, { passive: true });
      return { status: 'started' };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unable to start device orientation.';
      return { status: 'error', reason };
    }
  }

  stop(): void {
    window.removeEventListener('deviceorientation', this.handleOrientation);
    this.listener = null;
  }
}
