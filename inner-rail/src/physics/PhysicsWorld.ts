import * as CANNON from 'cannon-es';
import { sampleTrackPieceMotion, type TrackMotionSample } from '../track/TrackMotion';
import type { TrackPiece, TrackPose, ValidationTrackDefinition } from '../track/TestTrack';
import { VALIDATION_TRACK } from '../track/TestTrack';
import type { WorldGravityDirection } from './gravityMath';
import { sampleMagneticRail, type MagneticRailSample } from './MagneticRail';
import { PHYSICS_CONFIG } from './physicsConfig';

export interface BallState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
  speed: number;
  grounded: boolean;
  magnetic: MagneticRailSample;
}

interface MovingTrackBody {
  piece: TrackPiece;
  body: CANNON.Body;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const INACTIVE_MAGNETIC: MagneticRailSample = {
  active: false,
  pieceId: null,
  strength: 0,
  acceleration: { x: 0, y: 0, z: 0 },
  inwardNormal: null,
};

export class PhysicsWorld {
  readonly world: CANNON.World;
  readonly ball: CANNON.Body;

  private readonly trackMaterial = new CANNON.Material('track');
  private readonly ballMaterial = new CANNON.Material('ball');
  private readonly contactMaterial: CANNON.ContactMaterial;
  private readonly movingTrackBodies: MovingTrackBody[] = [];
  private magneticState: MagneticRailSample = INACTIVE_MAGNETIC;
  private trackMotionTimeSeconds = 0;

  constructor(private readonly track: ValidationTrackDefinition = VALIDATION_TRACK) {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -PHYSICS_CONFIG.gravityMagnitude, 0),
    });
    this.world.allowSleep = true;
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);

    this.contactMaterial = new CANNON.ContactMaterial(this.ballMaterial, this.trackMaterial, {
      friction: PHYSICS_CONFIG.contactFriction,
      restitution: PHYSICS_CONFIG.contactRestitution,
    });
    this.world.addContactMaterial(this.contactMaterial);
    this.world.defaultContactMaterial.friction = PHYSICS_CONFIG.contactFriction;
    this.world.defaultContactMaterial.restitution = PHYSICS_CONFIG.contactRestitution;

    this.createTrack();

    this.ball = new CANNON.Body({
      mass: PHYSICS_CONFIG.ballMass,
      material: this.ballMaterial,
      shape: new CANNON.Sphere(PHYSICS_CONFIG.ballRadius),
      position: new CANNON.Vec3(
        this.track.start.position.x,
        this.track.start.position.y,
        this.track.start.position.z,
      ),
    });
    this.ball.linearDamping = PHYSICS_CONFIG.ballLinearDamping;
    this.ball.angularDamping = PHYSICS_CONFIG.ballAngularDamping;
    this.ball.allowSleep = false;
    this.world.addBody(this.ball);

    // Simulation remains authoritative for dynamic rail transforms. Update the
    // kinematic bodies on each fixed sub-step, then apply magnetic seam/capture
    // adhesion against the resulting world state.
    this.world.addEventListener('preStep', () => {
      this.advanceMovingTrack();
      this.applyMagneticRailForce();
    });
  }

  setGravityDirection(direction: WorldGravityDirection): void {
    const g = PHYSICS_CONFIG.gravityMagnitude;
    this.world.gravity.set(direction.x * g, direction.y * g, direction.z * g);
  }

  setVerticalGravity(): void {
    this.world.gravity.set(0, -PHYSICS_CONFIG.gravityMagnitude, 0);
  }

  setBallLinearDamping(value: number): void {
    this.ball.linearDamping = Math.min(0.99, Math.max(0, value));
  }

  setContactTuning(friction: number, restitution: number): void {
    const nextFriction = clamp(friction, 0.15, 0.9);
    const nextRestitution = clamp(restitution, 0, 0.25);
    this.contactMaterial.friction = nextFriction;
    this.contactMaterial.restitution = nextRestitution;
    this.world.defaultContactMaterial.friction = nextFriction;
    this.world.defaultContactMaterial.restitution = nextRestitution;
  }

  step(deltaSeconds: number): void {
    const safeDelta = Math.min(Math.max(deltaSeconds, 0), 0.1);
    this.world.step(PHYSICS_CONFIG.fixedTimeStep, safeDelta, PHYSICS_CONFIG.maxSubSteps);
    this.applySafetySpeedLimit();
  }

  resetTrackMotion(): void {
    this.trackMotionTimeSeconds = 0;
    this.syncMovingTrack(0);
  }

  getMovingTrackState(): readonly TrackMotionSample[] {
    return this.movingTrackBodies.map(({ piece }) =>
      sampleTrackPieceMotion(piece, this.trackMotionTimeSeconds),
    );
  }

  resetBall(pose: TrackPose = this.track.start): void {
    this.ball.position.set(pose.position.x, pose.position.y, pose.position.z);
    this.ball.velocity.set(0, 0, 0);
    this.ball.angularVelocity.set(0, 0, 0);
    this.ball.quaternion.set(0, 0, 0, 1);
    this.ball.force.set(0, 0, 0);
    this.ball.torque.set(0, 0, 0);
    this.magneticState = INACTIVE_MAGNETIC;
    this.ball.wakeUp();
  }

  isOutOfBounds(): boolean {
    const { position } = this.ball;
    const bounds = this.track.bounds;
    return (
      position.x < bounds.minX ||
      position.x > bounds.maxX ||
      position.y < bounds.minY ||
      position.y > bounds.maxY ||
      position.z < bounds.minZ ||
      position.z > bounds.maxZ
    );
  }

  getBallState(): BallState {
    const { position, velocity, quaternion } = this.ball;
    return {
      position: { x: position.x, y: position.y, z: position.z },
      velocity: { x: velocity.x, y: velocity.y, z: velocity.z },
      quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
      speed: velocity.length(),
      grounded: this.world.contacts.some((contact) => contact.bi === this.ball || contact.bj === this.ball),
      magnetic: {
        active: this.magneticState.active,
        pieceId: this.magneticState.pieceId,
        strength: this.magneticState.strength,
        acceleration: { ...this.magneticState.acceleration },
        inwardNormal: this.magneticState.inwardNormal ? { ...this.magneticState.inwardNormal } : null,
      },
    };
  }

  private advanceMovingTrack(): void {
    if (this.movingTrackBodies.length === 0) return;
    this.trackMotionTimeSeconds += PHYSICS_CONFIG.fixedTimeStep;
    this.syncMovingTrack(this.trackMotionTimeSeconds);
  }

  private syncMovingTrack(elapsedSeconds: number): void {
    for (const { piece, body } of this.movingTrackBodies) {
      const sample = sampleTrackPieceMotion(piece, elapsedSeconds);
      body.position.set(sample.position.x, sample.position.y, sample.position.z);
      body.velocity.set(
        sample.linearVelocity.x,
        sample.linearVelocity.y,
        sample.linearVelocity.z,
      );
      body.quaternion.setFromEuler(
        sample.rotation.x,
        sample.rotation.y,
        sample.rotation.z,
        'XYZ',
      );
      body.angularVelocity.set(0, 0, 0);
      body.aabbNeedsUpdate = true;
      body.wakeUp();
    }
  }

  private applyMagneticRailForce(): void {
    this.magneticState = sampleMagneticRail(
      { x: this.ball.position.x, y: this.ball.position.y, z: this.ball.position.z },
      PHYSICS_CONFIG.ballRadius,
      this.track.pieces,
    );
    if (!this.magneticState.active) return;

    const mass = this.ball.mass;
    this.ball.force.x += this.magneticState.acceleration.x * mass;
    this.ball.force.y += this.magneticState.acceleration.y * mass;
    this.ball.force.z += this.magneticState.acceleration.z * mass;
  }

  private createTrack(): void {
    for (const piece of this.track.pieces) {
      const initial = sampleTrackPieceMotion(piece, 0);
      const body = new CANNON.Body({
        mass: 0,
        material: this.trackMaterial,
        shape: new CANNON.Box(
          new CANNON.Vec3(piece.size.x / 2, piece.size.y / 2, piece.size.z / 2),
        ),
        position: new CANNON.Vec3(initial.position.x, initial.position.y, initial.position.z),
      });
      body.quaternion.setFromEuler(
        initial.rotation.x,
        initial.rotation.y,
        initial.rotation.z,
        'XYZ',
      );

      if (piece.motion) {
        body.type = CANNON.Body.KINEMATIC;
        body.velocity.set(
          initial.linearVelocity.x,
          initial.linearVelocity.y,
          initial.linearVelocity.z,
        );
        body.allowSleep = false;
        body.updateMassProperties();
        this.movingTrackBodies.push({ piece, body });
      }

      this.world.addBody(body);
    }
  }

  private applySafetySpeedLimit(): void {
    const speed = this.ball.velocity.length();
    if (speed <= PHYSICS_CONFIG.safetySpeedLimit || speed === 0) return;
    const scale = PHYSICS_CONFIG.safetySpeedLimit / speed;
    this.ball.velocity.x *= scale;
    this.ball.velocity.y *= scale;
    this.ball.velocity.z *= scale;
  }
}
