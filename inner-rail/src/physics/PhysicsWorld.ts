import * as CANNON from 'cannon-es';
import { PHYSICS_CONFIG } from './physicsConfig';
import type { WorldGravityDirection } from './gravityMath';

export interface BallState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
  speed: number;
  grounded: boolean;
}

export class PhysicsWorld {
  readonly world: CANNON.World;
  readonly ball: CANNON.Body;

  private readonly trackMaterial = new CANNON.Material('track');
  private readonly ballMaterial = new CANNON.Material('ball');

  constructor() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -PHYSICS_CONFIG.gravityMagnitude, 0),
    });
    this.world.allowSleep = true;
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);

    const contact = new CANNON.ContactMaterial(this.ballMaterial, this.trackMaterial, {
      friction: PHYSICS_CONFIG.contactFriction,
      restitution: PHYSICS_CONFIG.contactRestitution,
    });
    this.world.addContactMaterial(contact);
    this.world.defaultContactMaterial.friction = PHYSICS_CONFIG.contactFriction;
    this.world.defaultContactMaterial.restitution = PHYSICS_CONFIG.contactRestitution;

    this.createSandbox();

    this.ball = new CANNON.Body({
      mass: PHYSICS_CONFIG.ballMass,
      material: this.ballMaterial,
      shape: new CANNON.Sphere(PHYSICS_CONFIG.ballRadius),
      position: new CANNON.Vec3(
        PHYSICS_CONFIG.spawn.x,
        PHYSICS_CONFIG.spawn.y,
        PHYSICS_CONFIG.spawn.z,
      ),
    });
    this.ball.linearDamping = PHYSICS_CONFIG.ballLinearDamping;
    this.ball.angularDamping = PHYSICS_CONFIG.ballAngularDamping;
    this.ball.allowSleep = false;
    this.world.addBody(this.ball);
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

  step(deltaSeconds: number): void {
    const safeDelta = Math.min(Math.max(deltaSeconds, 0), 0.1);
    this.world.step(PHYSICS_CONFIG.fixedTimeStep, safeDelta, PHYSICS_CONFIG.maxSubSteps);
    this.applySafetySpeedLimit();
  }

  resetBall(): void {
    this.ball.position.set(PHYSICS_CONFIG.spawn.x, PHYSICS_CONFIG.spawn.y, PHYSICS_CONFIG.spawn.z);
    this.ball.velocity.set(0, 0, 0);
    this.ball.angularVelocity.set(0, 0, 0);
    this.ball.quaternion.set(0, 0, 0, 1);
    this.ball.force.set(0, 0, 0);
    this.ball.torque.set(0, 0, 0);
    this.ball.wakeUp();
  }

  isOutOfBounds(): boolean {
    const { position } = this.ball;
    return (
      position.y < -4 ||
      Math.abs(position.x) > PHYSICS_CONFIG.sandboxWidth ||
      Math.abs(position.z) > PHYSICS_CONFIG.sandboxLength
    );
  }

  getBallState(): BallState {
    const { position, velocity, quaternion } = this.ball;
    const speed = velocity.length();
    const floorContactY = PHYSICS_CONFIG.ballRadius + 0.12;
    return {
      position: { x: position.x, y: position.y, z: position.z },
      velocity: { x: velocity.x, y: velocity.y, z: velocity.z },
      quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
      speed,
      grounded: position.y <= floorContactY && Math.abs(velocity.y) < 1.25,
    };
  }

  private createSandbox(): void {
    const floor = new CANNON.Body({
      mass: 0,
      material: this.trackMaterial,
      shape: new CANNON.Box(
        new CANNON.Vec3(
          PHYSICS_CONFIG.sandboxWidth / 2,
          PHYSICS_CONFIG.floorThickness / 2,
          PHYSICS_CONFIG.sandboxLength / 2,
        ),
      ),
      position: new CANNON.Vec3(0, -PHYSICS_CONFIG.floorThickness / 2, 0),
    });
    this.world.addBody(floor);

    const halfWallHeight = PHYSICS_CONFIG.wallHeight / 2;
    const halfWallThickness = PHYSICS_CONFIG.wallThickness / 2;
    const sideShape = new CANNON.Box(
      new CANNON.Vec3(
        halfWallThickness,
        halfWallHeight,
        PHYSICS_CONFIG.sandboxLength / 2,
      ),
    );
    const endShape = new CANNON.Box(
      new CANNON.Vec3(
        PHYSICS_CONFIG.sandboxWidth / 2,
        halfWallHeight,
        halfWallThickness,
      ),
    );

    const sideX = PHYSICS_CONFIG.sandboxWidth / 2 + halfWallThickness;
    const endZ = PHYSICS_CONFIG.sandboxLength / 2 + halfWallThickness;

    for (const x of [-sideX, sideX]) {
      const wall = new CANNON.Body({
        mass: 0,
        material: this.trackMaterial,
        shape: sideShape,
        position: new CANNON.Vec3(x, halfWallHeight, 0),
      });
      this.world.addBody(wall);
    }

    for (const z of [-endZ, endZ]) {
      const wall = new CANNON.Body({
        mass: 0,
        material: this.trackMaterial,
        shape: endShape,
        position: new CANNON.Vec3(0, halfWallHeight, z),
      });
      this.world.addBody(wall);
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
