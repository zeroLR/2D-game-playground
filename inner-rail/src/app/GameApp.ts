import { DeviceOrientationSource } from '../input/DeviceOrientationSource';
import { SyntheticTiltSource } from '../input/SyntheticTiltSource';
import { TiltInput } from '../input/TiltInput';
import type { TiltSource } from '../input/types';
import { PrototypeTelemetry } from '../telemetry/PrototypeTelemetry';
import { PrototypeOverlay } from '../ui/PrototypeOverlay';

const SENSOR_SAMPLE_TIMEOUT_MS = 1800;

export class GameApp {
  private readonly tiltInput = new TiltInput();
  private readonly deviceSource = new DeviceOrientationSource();
  private readonly syntheticSource = new SyntheticTiltSource();
  private readonly overlay: PrototypeOverlay;
  private readonly telemetry: PrototypeTelemetry;
  private activeSource: TiltSource | null = null;
  private sensorTimeoutId: number | null = null;
  private animationFrameId: number | null = null;
  private syntheticKeyboard = { left: false, right: false, forward: false, back: false };

  constructor(root: HTMLElement) {
    this.overlay = new PrototypeOverlay(root, {
      onStartDevice: () => void this.startDevice(),
      onStartSynthetic: () => void this.startSynthetic(),
      onCalibrate: () => this.calibrate(),
      onRecenter: () => this.recenter(),
      onSyntheticTilt: (x, y) => this.syntheticSource.setNormalized(x, y),
    });
    this.telemetry = new PrototypeTelemetry(this.overlay.telemetryRoot);
    this.overlay.setDebugVisible(new URLSearchParams(location.search).get('debug') === '1');
    this.bindKeyboard();
  }

  start(): void {
    const preferSynthetic = window.matchMedia('(pointer: fine)').matches;
    this.overlay.renderState({
      kind: 'start',
      preferSynthetic,
      deviceSupported: DeviceOrientationSource.isSupported(),
    });
    this.tick();
  }

  destroy(): void {
    this.activeSource?.stop();
    if (this.sensorTimeoutId !== null) window.clearTimeout(this.sensorTimeoutId);
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
  }

  private async startDevice(): Promise<void> {
    this.stopActiveSource();
    this.tiltInput.clearCalibration();
    this.overlay.renderState({ kind: 'requesting' });
    const result = await this.deviceSource.start((sample) => {
      this.tiltInput.ingest(sample);
      if (this.sensorTimeoutId !== null) {
        window.clearTimeout(this.sensorTimeoutId);
        this.sensorTimeoutId = null;
        this.overlay.renderState({ kind: 'calibration', sourceLabel: 'device sensor' });
      }
    });

    if (result.status !== 'started') {
      this.overlay.renderState({
        kind: 'error',
        title: result.status === 'denied' ? 'Motion access blocked.' : 'Motion sensor unavailable.',
        detail: result.reason,
      });
      return;
    }

    this.activeSource = this.deviceSource;
    this.overlay.renderState({ kind: 'awaiting-sensor' });
    this.sensorTimeoutId = window.setTimeout(() => {
      this.sensorTimeoutId = null;
      if (!this.tiltInput.snapshot().hasSample) {
        this.deviceSource.stop();
        this.activeSource = null;
        this.overlay.renderState({
          kind: 'error',
          title: 'No motion samples received.',
          detail: 'The browser exposed the API but did not deliver orientation data. You can still verify the input pipeline with synthetic controls.',
        });
      }
    }, SENSOR_SAMPLE_TIMEOUT_MS);
  }

  private async startSynthetic(): Promise<void> {
    this.stopActiveSource();
    this.tiltInput.clearCalibration();
    const result = await this.syntheticSource.start((sample) => this.tiltInput.ingest(sample));
    if (result.status !== 'started') return;
    this.activeSource = this.syntheticSource;
    this.overlay.renderState({ kind: 'calibration', sourceLabel: 'synthetic input' });
  }

  private calibrate(): void {
    if (!this.tiltInput.recenter()) return;
    this.overlay.renderState({ kind: 'active', synthetic: this.activeSource?.kind === 'synthetic' });
  }

  private recenter(): void {
    this.tiltInput.recenter();
  }

  private stopActiveSource(): void {
    if (this.sensorTimeoutId !== null) {
      window.clearTimeout(this.sensorTimeoutId);
      this.sensorTimeoutId = null;
    }
    this.activeSource?.stop();
    this.activeSource = null;
  }

  private bindKeyboard(): void {
    const keyToField = (key: string): keyof typeof this.syntheticKeyboard | null => {
      switch (key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          return 'left';
        case 'd':
        case 'arrowright':
          return 'right';
        case 'w':
        case 'arrowup':
          return 'forward';
        case 's':
        case 'arrowdown':
          return 'back';
        default:
          return null;
      }
    };

    const sync = (): void => {
      if (this.activeSource?.kind !== 'synthetic') return;
      const x = Number(this.syntheticKeyboard.right) - Number(this.syntheticKeyboard.left);
      const y = Number(this.syntheticKeyboard.back) - Number(this.syntheticKeyboard.forward);
      this.syntheticSource.setNormalized(x, y);
    };

    window.addEventListener('keydown', (event) => {
      const field = keyToField(event.key);
      if (!field) return;
      event.preventDefault();
      this.syntheticKeyboard[field] = true;
      sync();
    });
    window.addEventListener('keyup', (event) => {
      const field = keyToField(event.key);
      if (!field) return;
      event.preventDefault();
      this.syntheticKeyboard[field] = false;
      sync();
    });
  }

  private tick = (): void => {
    this.tiltInput.update(performance.now());
    const snapshot = this.tiltInput.snapshot();
    this.overlay.renderVector(snapshot.normalized.x, snapshot.normalized.y);
    this.telemetry.render(snapshot);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
