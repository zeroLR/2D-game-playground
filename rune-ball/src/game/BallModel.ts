import { directionVector, type Point2D, type SwipeDirection } from '../input/SwipeClassifier';

export interface ArenaBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface BallSnapshot {
  position: Point2D;
  previousPosition: Point2D;
  velocity: Point2D;
  radius: number;
  speed: number;
  reboundStrength: number;
}

export type WallSide = 'left' | 'right' | 'top' | 'bottom';

export interface BallUpdateResult {
  wallHits: WallSide[];
}

const CRUISE_SPEED = 360;
const NORMAL_MAX_SPEED = 400;
const REBOUND_MAX_SPEED = 470;
const REDIRECT_WEIGHT = 0.78;
const BOUNCE_SPEED_RETENTION = 1;
const TARGET_DEFLECTION_WEIGHT = 0.42;
const REBOUND_BOOST_MULTIPLIER = 1.24;
const REBOUND_DURATION_SECONDS = 0.72;
const REBOUND_ASSIST_MAX_TURN_RADIANS = Math.PI / 10;

export class BallModel {
  readonly radius = 18;

  private bounds: ArenaBounds;
  private position: Point2D;
  private previousPosition: Point2D;
  private velocity: Point2D;
  private reboundSecondsRemaining = 0;
  private reboundBonusSpeed = 0;
  private reboundInitialBonusSpeed = 0;

  constructor(bounds: ArenaBounds) {
    this.bounds = bounds;
    const center = this.centerOf(bounds);
    this.position = { ...center };
    this.previousPosition = { ...center };
    const diagonal = this.normalized({ x: 0.82, y: -0.57 });
    this.velocity = { x: diagonal.x * CRUISE_SPEED, y: diagonal.y * CRUISE_SPEED };
  }

  get snapshot(): BallSnapshot {
    return {
      position: { ...this.position },
      previousPosition: { ...this.previousPosition },
      velocity: { ...this.velocity },
      radius: this.radius,
      speed: Math.hypot(this.velocity.x, this.velocity.y),
      reboundStrength: this.clamp(this.reboundSecondsRemaining / REBOUND_DURATION_SECONDS, 0, 1),
    };
  }

  setBounds(bounds: ArenaBounds): void {
    this.bounds = bounds;
    this.position.x = this.clamp(this.position.x, bounds.left + this.radius, bounds.right - this.radius);
    this.position.y = this.clamp(this.position.y, bounds.top + this.radius, bounds.bottom - this.radius);
    this.previousPosition = { ...this.position };
  }

  applyDirectionalRedirect(direction: SwipeDirection): void {
    const intent = directionVector(direction);
    const current = this.normalized(this.velocity);
    const blended = this.normalized({
      x: current.x * (1 - REDIRECT_WEIGHT) + intent.x * REDIRECT_WEIGHT,
      y: current.y * (1 - REDIRECT_WEIGHT) + intent.y * REDIRECT_WEIGHT,
    });
    const currentSpeed = Math.hypot(this.velocity.x, this.velocity.y);
    const baseSpeed = Math.max(0, currentSpeed - this.reboundBonusSpeed);
    const nextBaseSpeed = this.clamp(Math.max(CRUISE_SPEED, baseSpeed), CRUISE_SPEED, NORMAL_MAX_SPEED);
    const nextSpeed = Math.min(REBOUND_MAX_SPEED, nextBaseSpeed + this.reboundBonusSpeed);

    this.velocity = {
      x: blended.x * nextSpeed,
      y: blended.y * nextSpeed,
    };
  }

  applyTargetDeflection(targetPosition: Point2D): void {
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    const current = this.normalized(this.velocity);
    const away = this.normalized({
      x: this.position.x - targetPosition.x,
      y: this.position.y - targetPosition.y,
    });
    const blended = this.normalized({
      x: current.x * (1 - TARGET_DEFLECTION_WEIGHT) + away.x * TARGET_DEFLECTION_WEIGHT,
      y: current.y * (1 - TARGET_DEFLECTION_WEIGHT) + away.y * TARGET_DEFLECTION_WEIGHT,
    });
    this.velocity = {
      x: blended.x * speed,
      y: blended.y * speed,
    };
  }

  applyReboundAssist(targetPosition: Point2D): boolean {
    const toTargetRaw = {
      x: targetPosition.x - this.position.x,
      y: targetPosition.y - this.position.y,
    };
    const targetDistance = Math.hypot(toTargetRaw.x, toTargetRaw.y);
    if (!(targetDistance > this.radius)) return false;

    const current = this.normalized(this.velocity);
    const toTarget = { x: toTargetRaw.x / targetDistance, y: toTargetRaw.y / targetDistance };
    const dot = this.clamp(current.x * toTarget.x + current.y * toTarget.y, -1, 1);
    if (dot <= 0) return false;

    const angle = Math.acos(dot);
    if (angle <= 0.0001) return true;

    const turn = Math.min(angle, REBOUND_ASSIST_MAX_TURN_RADIANS);
    const cross = current.x * toTarget.y - current.y * toTarget.x;
    const signedTurn = cross >= 0 ? turn : -turn;
    const cos = Math.cos(signedTurn);
    const sin = Math.sin(signedTurn);
    const assisted = {
      x: current.x * cos - current.y * sin,
      y: current.x * sin + current.y * cos,
    };
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    this.velocity = { x: assisted.x * speed, y: assisted.y * speed };
    return true;
  }

  update(dtSeconds: number): BallUpdateResult {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.updateReboundDecay(dt);
    this.previousPosition = { ...this.position };
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    const wallHits: WallSide[] = [];
    const minX = this.bounds.left + this.radius;
    const maxX = this.bounds.right - this.radius;
    const minY = this.bounds.top + this.radius;
    const maxY = this.bounds.bottom - this.radius;

    if (this.position.x < minX) {
      this.position.x = minX;
      this.velocity.x = Math.abs(this.velocity.x);
      wallHits.push('left');
    } else if (this.position.x > maxX) {
      this.position.x = maxX;
      this.velocity.x = -Math.abs(this.velocity.x);
      wallHits.push('right');
    }

    if (this.position.y < minY) {
      this.position.y = minY;
      this.velocity.y = Math.abs(this.velocity.y);
      wallHits.push('top');
    } else if (this.position.y > maxY) {
      this.position.y = maxY;
      this.velocity.y = -Math.abs(this.velocity.y);
      wallHits.push('bottom');
    }

    if (wallHits.length > 0) {
      const totalSpeed = Math.hypot(this.velocity.x, this.velocity.y);
      const baseSpeed = Math.max(0, totalSpeed - this.reboundBonusSpeed);
      const retained = this.clamp(
        baseSpeed * BOUNCE_SPEED_RETENTION,
        CRUISE_SPEED,
        NORMAL_MAX_SPEED,
      );
      const direction = this.normalized(this.velocity);
      this.clearReboundBoost();
      this.velocity = { x: direction.x * retained, y: direction.y * retained };
      this.activateReboundBoost();
    }

    return { wallHits };
  }

  interpolatedPosition(alpha: number): Point2D {
    const t = this.clamp(Number.isFinite(alpha) ? alpha : 0, 0, 1);
    return {
      x: this.previousPosition.x + (this.position.x - this.previousPosition.x) * t,
      y: this.previousPosition.y + (this.position.y - this.previousPosition.y) * t,
    };
  }

  private activateReboundBoost(): void {
    const baseSpeed = Math.hypot(this.velocity.x, this.velocity.y);
    const boosted = this.clamp(
      baseSpeed * REBOUND_BOOST_MULTIPLIER,
      CRUISE_SPEED,
      REBOUND_MAX_SPEED,
    );
    const direction = this.normalized(this.velocity);
    this.reboundInitialBonusSpeed = Math.max(0, boosted - baseSpeed);
    this.reboundBonusSpeed = this.reboundInitialBonusSpeed;
    this.reboundSecondsRemaining = REBOUND_DURATION_SECONDS;
    this.velocity = { x: direction.x * boosted, y: direction.y * boosted };
  }

  private updateReboundDecay(dtSeconds: number): void {
    if (this.reboundSecondsRemaining <= 0 || this.reboundBonusSpeed <= 0) return;

    const previousBonus = this.reboundBonusSpeed;
    this.reboundSecondsRemaining = Math.max(0, this.reboundSecondsRemaining - dtSeconds);
    const strength = this.clamp(this.reboundSecondsRemaining / REBOUND_DURATION_SECONDS, 0, 1);
    const nextBonus = this.reboundInitialBonusSpeed * strength;
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    const baseSpeed = Math.max(0, speed - previousBonus);
    const nextSpeed = Math.min(REBOUND_MAX_SPEED, baseSpeed + nextBonus);
    const direction = this.normalized(this.velocity);
    this.velocity = { x: direction.x * nextSpeed, y: direction.y * nextSpeed };
    this.reboundBonusSpeed = nextBonus;

    if (this.reboundSecondsRemaining <= 0) this.clearReboundBoost();
  }

  private clearReboundBoost(): void {
    this.reboundSecondsRemaining = 0;
    this.reboundBonusSpeed = 0;
    this.reboundInitialBonusSpeed = 0;
  }

  private centerOf(bounds: ArenaBounds): Point2D {
    return {
      x: (bounds.left + bounds.right) / 2,
      y: (bounds.top + bounds.bottom) / 2,
    };
  }

  private normalized(vector: Point2D): Point2D {
    const length = Math.hypot(vector.x, vector.y);
    if (!(length > 0)) return { x: 1, y: 0 };
    return { x: vector.x / length, y: vector.y / length };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
