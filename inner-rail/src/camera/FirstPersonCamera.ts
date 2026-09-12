import * as THREE from 'three';
import type { BallState } from '../physics/PhysicsWorld';
import { dampAngle, shortestAngleDeltaRad } from './cameraMath';

const DEFAULT_BASE_FOV_DEG = 76;
const DEFAULT_YAW_RESPONSE_PER_SECOND = 4.2;
const PITCH_RESPONSE_PER_SECOND = 4.5;
const MAX_PITCH_RAD = (7 * Math.PI) / 180;

export interface CameraTuning {
  baseFovDeg: number;
  yawResponsePerSecond: number;
}

export type CameraHeadingState = 'track-forward';

export interface CameraTelemetry {
  yawRad: number;
  targetYawRad: number;
  headingErrorRad: number;
  headingState: CameraHeadingState;
  pitchRad: number;
  fovDeg: number;
}

export class FirstPersonCamera {
  readonly camera: THREE.PerspectiveCamera;

  private yawRad = 0;
  private targetYawRad = 0;
  private pitchRad = 0;
  private baseFovDeg = DEFAULT_BASE_FOV_DEG;
  private yawResponsePerSecond = DEFAULT_YAW_RESPONSE_PER_SECOND;
  private headingErrorRad = 0;
  private readonly reducedMotion: boolean;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(this.baseFovDeg, 1, 0.05, 140);
    this.camera.up.set(0, 1, 0);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  get currentYawRad(): number {
    return this.yawRad;
  }

  setTuning(tuning: Partial<CameraTuning>): void {
    if (tuning.baseFovDeg !== undefined) {
      this.baseFovDeg = Math.min(95, Math.max(55, tuning.baseFovDeg));
    }
    if (tuning.yawResponsePerSecond !== undefined) {
      this.yawResponsePerSecond = Math.min(10, Math.max(1.5, tuning.yawResponsePerSecond));
    }
    if (this.reducedMotion || this.camera.fov < 55 || this.camera.fov > 99) {
      this.camera.fov = this.baseFovDeg;
    }
    this.camera.updateProjectionMatrix();
  }

  reset(ballState: BallState, yawRad = 0): void {
    this.yawRad = yawRad;
    this.targetYawRad = yawRad;
    this.pitchRad = 0;
    this.headingErrorRad = 0;
    this.camera.fov = this.baseFovDeg;
    this.syncTransform(ballState);
  }

  /**
   * Camera yaw follows authored route-forward, never ball travel direction.
   * The sphere may brake, slide sideways, or roll backward while the player's
   * view keeps facing the intended route. Velocity remains presentation input
   * only for airborne pitch and subtle speed FOV.
   */
  update(ballState: BallState, trackForwardYawRad: number, deltaSeconds: number): void {
    const dt = Math.min(Math.max(deltaSeconds, 0), 0.1);
    const horizontalSpeed = Math.hypot(ballState.velocity.x, ballState.velocity.z);

    this.targetYawRad = trackForwardYawRad;
    this.headingErrorRad = shortestAngleDeltaRad(this.yawRad, this.targetYawRad);
    this.yawRad = dampAngle(this.yawRad, this.targetYawRad, this.yawResponsePerSecond, dt);
    this.headingErrorRad = shortestAngleDeltaRad(this.yawRad, this.targetYawRad);

    const pitchTarget = this.reducedMotion || ballState.grounded
      ? 0
      : Math.max(
          -MAX_PITCH_RAD,
          Math.min(MAX_PITCH_RAD, Math.atan2(ballState.velocity.y, Math.max(0.01, horizontalSpeed)) * 0.3),
        );
    const pitchAlpha = 1 - Math.exp(-PITCH_RESPONSE_PER_SECOND * dt);
    this.pitchRad += (pitchTarget - this.pitchRad) * pitchAlpha;

    const targetFov = this.reducedMotion ? this.baseFovDeg : this.baseFovDeg + Math.min(4, ballState.speed * 0.2);
    const fovAlpha = 1 - Math.exp(-3.5 * dt);
    this.camera.fov += (targetFov - this.camera.fov) * fovAlpha;
    this.camera.updateProjectionMatrix();

    this.syncTransform(ballState);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = Math.max(0.1, width / Math.max(1, height));
    this.camera.updateProjectionMatrix();
  }

  telemetry(): CameraTelemetry {
    return {
      yawRad: this.yawRad,
      targetYawRad: this.targetYawRad,
      headingErrorRad: this.headingErrorRad,
      headingState: 'track-forward',
      pitchRad: this.pitchRad,
      fovDeg: this.camera.fov,
    };
  }

  private syncTransform(ballState: BallState): void {
    this.camera.position.set(
      ballState.position.x,
      ballState.position.y + 0.08,
      ballState.position.z,
    );

    const cosPitch = Math.cos(this.pitchRad);
    const lookDirection = new THREE.Vector3(
      Math.sin(this.yawRad) * cosPitch,
      Math.sin(this.pitchRad),
      Math.cos(this.yawRad) * cosPitch,
    );
    this.camera.lookAt(this.camera.position.clone().add(lookDirection));
  }
}
