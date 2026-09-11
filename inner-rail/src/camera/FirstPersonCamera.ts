import * as THREE from 'three';
import type { BallState } from '../physics/PhysicsWorld';
import {
  dampAngle,
  headingFollowWeight,
  shortestAngleDeltaRad,
  velocityHeadingRad,
} from './cameraMath';

const DEFAULT_BASE_FOV_DEG = 76;
const HEADING_SPEED_THRESHOLD = 0.7;
const DEFAULT_YAW_RESPONSE_PER_SECOND = 4.2;
const HEADING_HOLD_ANGLE_RAD = (14 * Math.PI) / 180;
const HEADING_FULL_FOLLOW_ANGLE_RAD = (42 * Math.PI) / 180;
const HEADING_RELEASE_ANGLE_RAD = (7 * Math.PI) / 180;
const HEADING_COMMIT_SECONDS = 0.2;
const FOLLOW_RESPONSE_FLOOR = 0.25;
const PITCH_RESPONSE_PER_SECOND = 4.5;
const MAX_PITCH_RAD = (7 * Math.PI) / 180;

export interface CameraTuning {
  baseFovDeg: number;
  yawResponsePerSecond: number;
}

export type CameraHeadingState = 'low-speed' | 'hold' | 'commit' | 'follow';

export interface CameraTelemetry {
  yawRad: number;
  targetYawRad: number;
  headingErrorRad: number;
  headingState: CameraHeadingState;
  headingCommitProgress: number;
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
  private headingState: CameraHeadingState = 'low-speed';
  private headingCommitSeconds = 0;
  private headingCommitSign = 0;
  private headingFollowing = false;
  private readonly reducedMotion: boolean;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(this.baseFovDeg, 1, 0.05, 120);
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

  reset(ballState: BallState): void {
    this.yawRad = 0;
    this.targetYawRad = 0;
    this.pitchRad = 0;
    this.headingErrorRad = 0;
    this.headingState = 'low-speed';
    this.headingCommitSeconds = 0;
    this.headingCommitSign = 0;
    this.headingFollowing = false;
    this.camera.fov = this.baseFovDeg;
    this.syncTransform(ballState);
  }

  update(ballState: BallState, deltaSeconds: number): void {
    const dt = Math.min(Math.max(deltaSeconds, 0), 0.1);
    const horizontalSpeed = Math.hypot(ballState.velocity.x, ballState.velocity.z);

    if (horizontalSpeed < HEADING_SPEED_THRESHOLD) {
      this.targetYawRad = this.yawRad;
      this.headingErrorRad = 0;
      this.headingState = 'low-speed';
      this.headingCommitSeconds = 0;
      this.headingCommitSign = 0;
      this.headingFollowing = false;
    } else {
      this.targetYawRad = velocityHeadingRad(ballState.velocity.x, ballState.velocity.z);
      this.headingErrorRad = shortestAngleDeltaRad(this.yawRad, this.targetYawRad);
      const absoluteError = Math.abs(this.headingErrorRad);
      const errorSign = Math.sign(this.headingErrorRad);

      if (!this.headingFollowing) {
        if (absoluteError <= HEADING_HOLD_ANGLE_RAD) {
          this.headingState = 'hold';
          this.headingCommitSeconds = 0;
          this.headingCommitSign = 0;
        } else {
          if (errorSign !== this.headingCommitSign) {
            this.headingCommitSeconds = 0;
            this.headingCommitSign = errorSign;
          }
          this.headingCommitSeconds += dt;
          this.headingState = 'commit';
          if (this.headingCommitSeconds >= HEADING_COMMIT_SECONDS) {
            this.headingFollowing = true;
            this.headingState = 'follow';
          }
        }
      }

      if (this.headingFollowing) {
        const followWeight = headingFollowWeight(
          this.headingErrorRad,
          HEADING_HOLD_ANGLE_RAD,
          HEADING_FULL_FOLLOW_ANGLE_RAD,
        );
        const effectiveResponse = this.yawResponsePerSecond * Math.max(FOLLOW_RESPONSE_FLOOR, followWeight);
        this.yawRad = dampAngle(this.yawRad, this.targetYawRad, effectiveResponse, dt);
        this.headingErrorRad = shortestAngleDeltaRad(this.yawRad, this.targetYawRad);
        this.headingState = 'follow';

        if (Math.abs(this.headingErrorRad) <= HEADING_RELEASE_ANGLE_RAD) {
          this.headingFollowing = false;
          this.headingCommitSeconds = 0;
          this.headingCommitSign = 0;
          this.headingState = 'hold';
        }
      }
    }

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
      headingState: this.headingState,
      headingCommitProgress: Math.min(1, this.headingCommitSeconds / HEADING_COMMIT_SECONDS),
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
