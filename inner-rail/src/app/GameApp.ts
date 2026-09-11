import { FirstPersonCamera } from '../camera/FirstPersonCamera';
import { DeviceOrientationSource } from '../input/DeviceOrientationSource';
import { SyntheticTiltSource } from '../input/SyntheticTiltSource';
import { TiltInput } from '../input/TiltInput';
import type { TiltSource } from '../input/types';
import { cameraRelativeGravityToWorld, type WorldGravityDirection } from '../physics/gravityMath';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { GameScene } from '../render/GameScene';
import { PrototypeTelemetry } from '../telemetry/PrototypeTelemetry';
import { TrackProgress } from '../track/TrackProgress';
import { VALIDATION_TRACK } from '../track/TestTrack';
import {
  ballInertiaToLinearDamping,
  DEFAULT_PROTOTYPE_TUNING,
  loadPrototypeTuning,
  sanitizePrototypeTuning,
  savePrototypeTuning,
  type PrototypeTuningValues,
} from '../tuning/PrototypeTuning';
import { PrototypeTuningPanel } from '../tuning/PrototypeTuningPanel';
import { PrototypeOverlay } from '../ui/PrototypeOverlay';

const SENSOR_SAMPLE_TIMEOUT_MS = 1800;

type ViewportOrientation = 'portrait' | 'landscape';

export class GameApp {
  private readonly tiltInput = new TiltInput();
  private readonly deviceSource = new DeviceOrientationSource();
  private readonly syntheticSource = new SyntheticTiltSource();
  private readonly physics = new PhysicsWorld(VALIDATION_TRACK);
  private readonly trackProgress = new TrackProgress(VALIDATION_TRACK);
  private readonly camera = new FirstPersonCamera();
  private readonly overlay: PrototypeOverlay;
  private readonly scene: GameScene;
  private readonly telemetry: PrototypeTelemetry;
  private readonly tuningPanel: PrototypeTuningPanel;

  private activeSource: TiltSource | null = null;
  private sensorTimeoutId: number | null = null;
  private animationFrameId: number | null = null;
  private lastFrameAtMs: number | null = null;
  private gameplayActive = false;
  private fallResetCount = 0;
  private syntheticKeyboard = { left: false, right: false, forward: false, back: false };
  private viewportOrientation: ViewportOrientation;
  private worldGravityDirection: WorldGravityDirection = { x: 0, y: -1, z: 0 };
  private tuning: PrototypeTuningValues = loadPrototypeTuning();

  constructor(root: HTMLElement) {
    this.overlay = new PrototypeOverlay(root, {
      onStartDevice: () => void this.startDevice(),
      onStartSynthetic: () => void this.startSynthetic(),
      onCalibrate: () => this.calibrate(),
      onRestart: () => this.restart(),
      onRecenter: () => this.recenter(),
      onSyntheticTilt: (x, y) => this.syntheticSource.setNormalized(x, y),
    });
    this.scene = new GameScene(this.overlay.sceneRoot, VALIDATION_TRACK);
    this.telemetry = new PrototypeTelemetry(this.overlay.telemetryRoot);
    this.tuningPanel = new PrototypeTuningPanel(this.overlay.tuningRoot, this.tuning, {
      onChange: (values) => this.applyTuning(values),
      onReset: () => this.resetTuning(),
    });
    this.applyTuning(this.tuning, false);

    const debugVisible = new URLSearchParams(location.search).get('debug') === '1';
    this.overlay.setDebugVisible(debugVisible);
    this.viewportOrientation = this.readViewportOrientation();
    this.camera.reset(this.physics.getBallState(), VALIDATION_TRACK.start.cameraYawRad);
    this.scene.setTrackProgress(this.trackProgress.snapshot(VALIDATION_TRACK.start.position));
    this.resizeScene();
    this.bindKeyboard();
    window.addEventListener('resize', this.handleViewportResize);
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
    window.removeEventListener('resize', this.handleViewportResize);
    this.scene.destroy();
  }

  private async startDevice(): Promise<void> {
    this.stopActiveSource();
    this.pauseGameplay();
    this.tiltInput.clearCalibration();
    this.viewportOrientation = this.readViewportOrientation();
    this.overlay.renderState({ kind: 'requesting' });
    const result = await this.deviceSource.start((sample) => {
      this.tiltInput.ingest(sample);
      if (this.sensorTimeoutId !== null) {
        window.clearTimeout(this.sensorTimeoutId);
        this.sensorTimeoutId = null;
        this.overlay.renderState({ kind: 'calibration', sourceLabel: `device sensor / ${this.viewportOrientation}` });
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
          detail: 'The browser exposed the API but did not deliver orientation data. You can still verify the full physics loop with synthetic controls.',
        });
      }
    }, SENSOR_SAMPLE_TIMEOUT_MS);
  }

  private async startSynthetic(): Promise<void> {
    this.stopActiveSource();
    this.pauseGameplay();
    this.tiltInput.clearCalibration();
    this.viewportOrientation = this.readViewportOrientation();
    const result = await this.syntheticSource.start((sample) => this.tiltInput.ingest(sample));
    if (result.status !== 'started') return;
    this.activeSource = this.syntheticSource;
    this.overlay.renderState({ kind: 'calibration', sourceLabel: `synthetic input / ${this.viewportOrientation}` });
  }

  private calibrate(): void {
    if (!this.tiltInput.recenter()) return;
    this.resetSimulation();
    this.gameplayActive = true;
    this.overlay.renderState({ kind: 'active', synthetic: this.activeSource?.kind === 'synthetic' });
  }

  private restart(): void {
    if (!this.gameplayActive) return;
    this.resetSimulation();
  }

  private recenter(): void {
    this.tiltInput.recenter();
  }

  private applyTuning(values: PrototypeTuningValues, persist = true): void {
    this.tuning = sanitizePrototypeTuning(values);
    this.camera.setTuning({
      baseFovDeg: this.tuning.cameraFovDeg,
      yawResponsePerSecond: this.tuning.cameraYawResponsePerSecond,
    });
    this.physics.setBallLinearDamping(ballInertiaToLinearDamping(this.tuning.ballInertia));
    this.tiltInput.setSensitivityMultiplier(this.tuning.tiltSensitivity);
    if (persist) savePrototypeTuning(this.tuning);
  }

  private resetTuning(): void {
    this.tuning = { ...DEFAULT_PROTOTYPE_TUNING };
    this.tuningPanel.setValues(this.tuning);
    this.applyTuning(this.tuning);
  }

  private resetSimulation(): void {
    this.trackProgress.reset();
    this.resetToPose(VALIDATION_TRACK.start);
  }

  private recoverToCheckpoint(): void {
    this.resetToPose(this.trackProgress.recoveryPose());
  }

  private resetToPose(pose: typeof VALIDATION_TRACK.start): void {
    this.physics.resetBall(pose);
    this.physics.setVerticalGravity();
    this.worldGravityDirection = { x: 0, y: -1, z: 0 };
    this.camera.reset(this.physics.getBallState(), pose.cameraYawRad);
  }

  private pauseGameplay(): void {
    this.gameplayActive = false;
    this.physics.setVerticalGravity();
    this.worldGravityDirection = { x: 0, y: -1, z: 0 };
  }

  private stopActiveSource(): void {
    if (this.sensorTimeoutId !== null) {
      window.clearTimeout(this.sensorTimeoutId);
      this.sensorTimeoutId = null;
    }
    this.activeSource?.stop();
    this.activeSource = null;
  }

  private readViewportOrientation(): ViewportOrientation {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  private resizeScene(): void {
    this.scene.resize(window.innerWidth, window.innerHeight);
    this.camera.resize(window.innerWidth, window.innerHeight);
  }

  private handleViewportResize = (): void => {
    this.resizeScene();
    const nextOrientation = this.readViewportOrientation();
    if (nextOrientation === this.viewportOrientation) return;

    this.viewportOrientation = nextOrientation;
    if (!this.activeSource || !this.tiltInput.snapshot().neutral) return;

    this.pauseGameplay();
    this.tiltInput.clearCalibration();
    const sourceLabel = `${this.activeSource.kind === 'device' ? 'device sensor' : 'synthetic input'} / ${nextOrientation}`;
    this.overlay.renderState({ kind: 'calibration', sourceLabel });
  };

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
    const nowMs = performance.now();
    const deltaSeconds = this.lastFrameAtMs === null ? 1 / 60 : Math.min(0.1, Math.max(0, (nowMs - this.lastFrameAtMs) / 1000));
    this.lastFrameAtMs = nowMs;

    this.tiltInput.update(nowMs);
    const tiltSnapshot = this.tiltInput.snapshot();

    if (this.gameplayActive) {
      this.worldGravityDirection = cameraRelativeGravityToWorld(
        tiltSnapshot.gravityDirection,
        this.camera.currentYawRad,
      );
      this.physics.setGravityDirection(this.worldGravityDirection);
      this.physics.step(deltaSeconds);

      const steppedBallState = this.physics.getBallState();
      this.trackProgress.update(steppedBallState.position, steppedBallState.speed, deltaSeconds);

      if (this.physics.isOutOfBounds()) {
        this.fallResetCount += 1;
        this.recoverToCheckpoint();
      } else {
        this.camera.update(steppedBallState, deltaSeconds);
      }
    }

    const ballState = this.physics.getBallState();
    const trackSnapshot = this.trackProgress.snapshot(ballState.position);
    this.overlay.renderVector(tiltSnapshot.normalized.x, tiltSnapshot.normalized.y);
    this.telemetry.render(tiltSnapshot, {
      ball: ballState,
      camera: this.camera.telemetry(),
      track: trackSnapshot,
      worldGravity: this.worldGravityDirection,
      fallResetCount: this.fallResetCount,
      gameplayActive: this.gameplayActive,
    });
    this.scene.setTrackProgress(trackSnapshot);
    this.scene.render(this.camera.camera, ballState);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
