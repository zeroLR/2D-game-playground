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
}

export type WallSide = 'left' | 'right' | 'top' | 'bottom';

export interface BallUpdateResult {
  wallHits: WallSide[];
}

const START_SPEED = 260;
const REDIRECT_MIN_SPEED = 320;
const REDIRECT_GAIN = 28;
const MAX_SPEED = 440;
const REDIRECT_WEIGHT = 0.78;
const BOUNCE_SPEED_RETENTION = 0.985;

export class BallModel {
  readonly radius = 18;

  private bounds: ArenaBounds;
  private position: Point2D;
  private previousPosition: Point2D;
  private velocity: Point2D;

  constructor(bounds: ArenaBounds) {
    this.bounds = bounds;
    const center = this.centerOf(bounds);
    this.position = { ...center };
    this.previousPosition = { ...center };
    const diagonal = this.normalized({ x: 0.82, y: -0.57 });
    this.velocity = { x: diagonal.x * START_SPEED, y: diagonal.y * START_SPEED };
  }

  get snapshot(): BallSnapshot {
    return {
      position: { ...this.position },
      previousPosition: { ...this.previousPosition },
      velocity: { ...this.velocity },
      radius: this.radius,
      speed: Math.hypot(this.velocity.x, this.velocity.y),
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
    const nextSpeed = this.clamp(Math.max(REDIRECT_MIN_SPEED, currentSpeed + REDIRECT_GAIN), REDIRECT_MIN_SPEED, MAX_SPEED);

    this.velocity = {
      x: blended.x * nextSpeed,
      y: blended.y * nextSpeed,
    };
  }

  update(dtSeconds: number): BallUpdateResult {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
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
      const speed = Math.hypot(this.velocity.x, this.velocity.y);
      const retained = this.clamp(speed * BOUNCE_SPEED_RETENTION, REDIRECT_MIN_SPEED * 0.88, MAX_SPEED);
      const direction = this.normalized(this.velocity);
      this.velocity = { x: direction.x * retained, y: direction.y * retained };
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
