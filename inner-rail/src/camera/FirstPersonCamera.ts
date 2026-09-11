import * as THREE from 'three';
import type { BallState } from '../physics/PhysicsWorld';
import { dampAngle, velocityHeadingRad } from './cameraMath';

const BASE_FOV_DEG = 76;
const HEADING_SPEED_THRESHOLD = 0.7;
const YAW_RESPONSE_PER_SECOND = 4.2;
const PITCH_RESPONSE_PER_SECOND = 4.5;
const MAX_PITCH_RAD = (7 * Math.PI) / 180;

export interface CameraTelemetry {
  yawRad: number;
  targetYawRad: number;
  pitchRad: number;
  fovDeg: number;
}

export class FirstPersonCamera {
  readonly camera: THREE.PerspectiveCamera;

  private yawRad = 0;
  private targetYawRad = 0;
  private pitchRad = 0;
  private readonly reducedMotion: boolean;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(BASE_FOV_DEG, 1, 0.05, 120);
    this.camera.up.set(0, 1, 0);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  get currentYawRad(): number {
    return this.yawRad;
  }

  reset(ballState: BallState): void {
    this.yawRad = 0;
    this.targetYawRad = 0;
    this.pitchRad = 0;
    this.camera.fov = BASE_FOV_DEG;
    this.syncTransform(ballState);
  }

  update(ballState: BallState, deltaSeconds: number): void {
    const horizontalSpeed = Math.hypot(ballState.velocity.x, ballState.velocity.z);
    if (horizontalSpeed >= HEADING_SPEED_THRESHOLD) {
      this.targetYawRad = velocityHeadingRad(ballState.velocity.x, ballState.velocity.z);
    }
    this.yawRad = dampAngle(this.yawRad, this.targetYawRad, YAW_RESPONSE_PER_SECOND, deltaSeconds);

    const pitchTarget = this.reducedMotion || ballState.grounded
      ? 0
      : Math.max(
          -MAX_PITCH_RAD,
          Math.min(MAX_PITCH_RAD, Math.atan2(ballState.velocity.y, Math.max(0.01, horizontalSpeed)) * 0.3),
        );
    const pitchAlpha = 1 - Math.exp(-PITCH_RESPONSE_PER_SECOND * Math.min(Math.max(deltaSeconds, 0), 0.1));
    this.pitchRad += (pitchTarget - this.pitchRad) * pitchAlpha;

    const targetFov = this.reducedMotion ? BASE_FOV_DEG : BASE_FOV_DEG + Math.min(4, ballState.speed * 0.2);
    const fovAlpha = 1 - Math.exp(-3.5 * Math.min(Math.max(deltaSeconds, 0), 0.1));
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
