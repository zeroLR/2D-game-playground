import type { ArenaBounds } from './BallModel';
import type { Point2D } from '../input/SwipeClassifier';

export type TargetKind = 'crystal' | 'armored';

export interface TargetState {
  id: number;
  kind: TargetKind;
  position: Point2D;
  radius: number;
  hp: number;
  maxHp: number;
}

export interface TargetHitResult {
  target: TargetState;
  destroyed: boolean;
  armorBroken: boolean;
}

export interface ChaseContext {
  origin: Point2D;
  velocity: Point2D;
}

const SPAWN_ANCHORS: Point2D[] = [
  { x: 0.20, y: 0.18 },
  { x: 0.50, y: 0.14 },
  { x: 0.80, y: 0.21 },
  { x: 0.28, y: 0.38 },
  { x: 0.72, y: 0.40 },
  { x: 0.18, y: 0.61 },
  { x: 0.50, y: 0.55 },
  { x: 0.82, y: 0.63 },
  { x: 0.31, y: 0.80 },
  { x: 0.68, y: 0.82 },
  { x: 0.50, y: 0.91 },
  { x: 0.12, y: 0.45 },
];

const DEFAULT_TARGET_COUNT = 8;
const RESPAWN_DELAY_SECONDS = 0.24;
const REBOUND_TARGET_MAX_ANGLE_RADIANS = Math.PI * 0.42;
const CHASE_SPAWN_LOOKAHEAD = 4;

export class TargetSystem {
  private bounds: ArenaBounds;
  private desiredCount: number;
  private readonly targets = new Map<number, TargetState>();
  private nextId = 1;
  private spawnCount = 0;
  private anchorCursor = 0;
  private respawnTimer = 0;

  constructor(bounds: ArenaBounds, desiredCount = DEFAULT_TARGET_COUNT) {
    this.bounds = bounds;
    this.desiredCount = Math.max(1, Math.floor(desiredCount));
    while (this.targets.size < this.desiredCount) this.spawnNext();
  }

  get snapshot(): TargetState[] {
    return [...this.targets.values()].map((target) => ({
      ...target,
      position: { ...target.position },
    }));
  }

  setDesiredCount(desiredCount: number): void {
    this.desiredCount = Math.max(1, Math.floor(Number.isFinite(desiredCount) ? desiredCount : DEFAULT_TARGET_COUNT));
    if (this.targets.size < this.desiredCount) this.respawnTimer = 0;
  }

  setBounds(bounds: ArenaBounds): void {
    this.bounds = bounds;
    for (const target of this.targets.values()) {
      target.position.x = this.clamp(target.position.x, bounds.left + target.radius, bounds.right - target.radius);
      target.position.y = this.clamp(target.position.y, bounds.top + target.radius, bounds.bottom - target.radius);
    }
  }

  update(dtSeconds: number, chaseContext?: ChaseContext): TargetState[] {
    const spawned: TargetState[] = [];
    if (this.targets.size >= this.desiredCount) return spawned;

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.respawnTimer = Math.max(0, this.respawnTimer - dt);
    if (this.respawnTimer > 0) return spawned;

    const target = this.spawnNext(chaseContext);
    spawned.push({ ...target, position: { ...target.position } });
    this.respawnTimer = RESPAWN_DELAY_SECONDS;
    return spawned;
  }

  collidingTargetIds(point: Point2D, radius: number): number[] {
    const ids: number[] = [];
    for (const target of this.targets.values()) {
      const dx = point.x - target.position.x;
      const dy = point.y - target.position.y;
      const combined = radius + target.radius;
      if (dx * dx + dy * dy <= combined * combined) ids.push(target.id);
    }
    return ids;
  }

  findReboundTarget(origin: Point2D, velocity: Point2D): TargetState | null {
    const speed = Math.hypot(velocity.x, velocity.y);
    if (!(speed > 0)) return null;

    const forward = { x: velocity.x / speed, y: velocity.y / speed };
    const minAlignment = Math.cos(REBOUND_TARGET_MAX_ANGLE_RADIANS);
    const diagonal = Math.hypot(this.bounds.right - this.bounds.left, this.bounds.bottom - this.bounds.top);
    let best: TargetState | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const target of this.targets.values()) {
      const dx = target.position.x - origin.x;
      const dy = target.position.y - origin.y;
      const distance = Math.hypot(dx, dy);
      if (!(distance > 0)) continue;

      const alignment = (dx * forward.x + dy * forward.y) / distance;
      if (alignment < minAlignment) continue;

      const proximity = 1 - this.clamp(distance / diagonal, 0, 1);
      const score = alignment * 0.76 + proximity * 0.24;
      if (score <= bestScore) continue;
      bestScore = score;
      best = target;
    }

    return best ? { ...best, position: { ...best.position } } : null;
  }

  nearbyTargetIds(center: Point2D, radius: number, excluded: ReadonlySet<number>, limit: number): number[] {
    return [...this.targets.values()]
      .filter((target) => !excluded.has(target.id))
      .map((target) => ({
        id: target.id,
        distance: Math.hypot(target.position.x - center.x, target.position.y - center.y),
      }))
      .filter((candidate) => candidate.distance <= radius)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, Math.max(0, Math.floor(limit)))
      .map((candidate) => candidate.id);
  }

  applyVortex(center: Point2D, radius: number, pullFactor: number): number[] {
    const safeRadius = Math.max(1, radius);
    const safeFactor = this.clamp(Number.isFinite(pullFactor) ? pullFactor : 0, 0, 0.45);
    if (safeFactor <= 0) return [];

    const affected: number[] = [];
    for (const target of this.targets.values()) {
      const dx = center.x - target.position.x;
      const dy = center.y - target.position.y;
      const distance = Math.hypot(dx, dy);
      if (!(distance > 0) || distance > safeRadius) continue;

      const falloff = 1 - distance / safeRadius;
      const step = safeFactor * (0.45 + falloff * 0.55);
      target.position.x = this.clamp(
        target.position.x + dx * step,
        this.bounds.left + target.radius,
        this.bounds.right - target.radius,
      );
      target.position.y = this.clamp(
        target.position.y + dy * step,
        this.bounds.top + target.radius,
        this.bounds.bottom - target.radius,
      );
      affected.push(target.id);
    }
    return affected;
  }

  hit(targetId: number): TargetHitResult | null {
    const target = this.targets.get(targetId);
    if (!target) return null;

    target.hp = Math.max(0, target.hp - 1);
    const destroyed = target.hp === 0;
    const armorBroken = target.kind === 'armored' && target.hp === 1;
    const resultTarget: TargetState = {
      ...target,
      position: { ...target.position },
    };

    if (destroyed) {
      this.targets.delete(targetId);
      if (this.targets.size < this.desiredCount) {
        this.respawnTimer = Math.max(this.respawnTimer, RESPAWN_DELAY_SECONDS);
      }
    }

    return { target: resultTarget, destroyed, armorBroken };
  }

  private spawnNext(chaseContext?: ChaseContext): TargetState {
    const sequenceIndex = this.spawnCount;
    this.spawnCount += 1;

    const kind: TargetKind = sequenceIndex % 4 === 3 ? 'armored' : 'crystal';
    const radius = kind === 'armored' ? 20 : 16;
    const maxHp = kind === 'armored' ? 2 : 1;
    const anchorIndex = this.chooseAnchor(radius, chaseContext);
    const position = this.positionForAnchor(SPAWN_ANCHORS[anchorIndex], radius);

    const target: TargetState = {
      id: this.nextId,
      kind,
      position,
      radius,
      hp: maxHp,
      maxHp,
    };

    this.nextId += 1;
    this.targets.set(target.id, target);
    return target;
  }

  private chooseAnchor(radius: number, chaseContext?: ChaseContext): number {
    const fallbackIndex = this.anchorCursor % SPAWN_ANCHORS.length;
    if (!chaseContext) {
      this.anchorCursor = (fallbackIndex + 1) % SPAWN_ANCHORS.length;
      return fallbackIndex;
    }

    const speed = Math.hypot(chaseContext.velocity.x, chaseContext.velocity.y);
    if (!(speed > 0)) {
      this.anchorCursor = (fallbackIndex + 1) % SPAWN_ANCHORS.length;
      return fallbackIndex;
    }

    const forward = { x: chaseContext.velocity.x / speed, y: chaseContext.velocity.y / speed };
    const diagonal = Math.hypot(this.bounds.right - this.bounds.left, this.bounds.bottom - this.bounds.top);
    const idealDistance = diagonal * 0.38;
    let bestIndex = fallbackIndex;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let offset = 0; offset < CHASE_SPAWN_LOOKAHEAD; offset += 1) {
      const index = (this.anchorCursor + offset) % SPAWN_ANCHORS.length;
      const position = this.positionForAnchor(SPAWN_ANCHORS[index], radius);
      const dx = position.x - chaseContext.origin.x;
      const dy = position.y - chaseContext.origin.y;
      const distance = Math.hypot(dx, dy);
      if (!(distance > 0)) continue;

      const alignment = (dx * forward.x + dy * forward.y) / distance;
      const distanceScore = 1 - this.clamp(Math.abs(distance - idealDistance) / idealDistance, 0, 1);
      let nearestTargetDistance = diagonal;
      for (const target of this.targets.values()) {
        nearestTargetDistance = Math.min(
          nearestTargetDistance,
          Math.hypot(position.x - target.position.x, position.y - target.position.y),
        );
      }
      const separation = this.clamp(nearestTargetDistance / 96, 0, 1);
      const nearBallPenalty = distance < 88 ? 0.8 : 0;
      const score = alignment * 0.62 + distanceScore * 0.24 + separation * 0.14 - nearBallPenalty;

      if (score <= bestScore) continue;
      bestScore = score;
      bestIndex = index;
    }

    this.anchorCursor = (bestIndex + 1) % SPAWN_ANCHORS.length;
    return bestIndex;
  }

  private positionForAnchor(anchor: Point2D, radius: number): Point2D {
    const width = this.bounds.right - this.bounds.left;
    const height = this.bounds.bottom - this.bounds.top;
    return {
      x: this.clamp(this.bounds.left + width * anchor.x, this.bounds.left + radius, this.bounds.right - radius),
      y: this.clamp(this.bounds.top + height * anchor.y, this.bounds.top + radius, this.bounds.bottom - radius),
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
