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

export class TargetSystem {
  private bounds: ArenaBounds;
  private readonly desiredCount: number;
  private readonly targets = new Map<number, TargetState>();
  private nextId = 1;
  private spawnCursor = 0;
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

  setBounds(bounds: ArenaBounds): void {
    this.bounds = bounds;
    for (const target of this.targets.values()) {
      target.position.x = this.clamp(target.position.x, bounds.left + target.radius, bounds.right - target.radius);
      target.position.y = this.clamp(target.position.y, bounds.top + target.radius, bounds.bottom - target.radius);
    }
  }

  update(dtSeconds: number): TargetState[] {
    const spawned: TargetState[] = [];
    if (this.targets.size >= this.desiredCount) return spawned;

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.respawnTimer = Math.max(0, this.respawnTimer - dt);
    if (this.respawnTimer > 0) return spawned;

    const target = this.spawnNext();
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
      this.respawnTimer = Math.max(this.respawnTimer, RESPAWN_DELAY_SECONDS);
    }

    return { target: resultTarget, destroyed, armorBroken };
  }

  private spawnNext(): TargetState {
    const anchor = SPAWN_ANCHORS[this.spawnCursor % SPAWN_ANCHORS.length];
    const sequenceIndex = this.spawnCursor;
    this.spawnCursor += 1;

    const kind: TargetKind = sequenceIndex % 4 === 3 ? 'armored' : 'crystal';
    const radius = kind === 'armored' ? 20 : 16;
    const maxHp = kind === 'armored' ? 2 : 1;
    const width = this.bounds.right - this.bounds.left;
    const height = this.bounds.bottom - this.bounds.top;

    const target: TargetState = {
      id: this.nextId,
      kind,
      position: {
        x: this.clamp(this.bounds.left + width * anchor.x, this.bounds.left + radius, this.bounds.right - radius),
        y: this.clamp(this.bounds.top + height * anchor.y, this.bounds.top + radius, this.bounds.bottom - radius),
      },
      radius,
      hp: maxHp,
      maxHp,
    };

    this.nextId += 1;
    this.targets.set(target.id, target);
    return target;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
