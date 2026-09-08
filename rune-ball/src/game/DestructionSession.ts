import { BallModel, type ArenaBounds, type BallSnapshot, type WallSide } from './BallModel';
import { ComboModel, type ComboSnapshot } from './ComboModel';
import { TargetSystem, type TargetKind, type TargetState } from './TargetSystem';
import type { Point2D, SwipeDirection } from '../input/SwipeClassifier';

export type DestructionEvent =
  | { type: 'wall-hit'; side: WallSide; assisted: boolean; targetId: number | null }
  | { type: 'target-hit'; targetId: number; kind: TargetKind; position: Point2D; armorBroken: boolean }
  | { type: 'target-break'; targetId: number; kind: TargetKind; position: Point2D; combo: number; scoreAdded: number }
  | { type: 'target-spawn'; targetId: number; kind: TargetKind; position: Point2D }
  | { type: 'combo-reset' };

export interface DestructionSnapshot {
  ball: BallSnapshot;
  targets: TargetState[];
  combo: ComboSnapshot;
}

export class DestructionSession {
  private readonly ball: BallModel;
  private readonly targets: TargetSystem;
  private readonly combo = new ComboModel();
  private activeOverlaps = new Set<number>();

  constructor(bounds: ArenaBounds) {
    this.ball = new BallModel(bounds);
    this.targets = new TargetSystem(bounds);
  }

  get snapshot(): DestructionSnapshot {
    return {
      ball: this.ball.snapshot,
      targets: this.targets.snapshot,
      combo: this.combo.snapshot,
    };
  }

  setBounds(bounds: ArenaBounds): void {
    this.ball.setBounds(bounds);
    this.targets.setBounds(bounds);
    this.activeOverlaps.clear();
  }

  applyDirectionalRedirect(direction: SwipeDirection): void {
    this.ball.applyDirectionalRedirect(direction);
  }

  interpolatedBallPosition(alpha: number): Point2D {
    return this.ball.interpolatedPosition(alpha);
  }

  update(dtSeconds: number): DestructionEvent[] {
    const events: DestructionEvent[] = [];
    const ballUpdate = this.ball.update(dtSeconds);

    let assisted = false;
    let reboundTargetId: number | null = null;
    if (ballUpdate.wallHits.length > 0) {
      const afterBounce = this.ball.snapshot;
      const reboundTarget = this.targets.findReboundTarget(afterBounce.position, afterBounce.velocity);
      if (reboundTarget) {
        assisted = this.ball.applyReboundAssist(reboundTarget.position);
        reboundTargetId = assisted ? reboundTarget.id : null;
      }
      for (const side of ballUpdate.wallHits) {
        events.push({ type: 'wall-hit', side, assisted, targetId: reboundTargetId });
      }
    }

    const chaseBall = this.ball.snapshot;
    const spawned = this.targets.update(dtSeconds, {
      origin: chaseBall.position,
      velocity: chaseBall.velocity,
    });
    for (const target of spawned) {
      events.push({
        type: 'target-spawn',
        targetId: target.id,
        kind: target.kind,
        position: { ...target.position },
      });
    }

    if (this.combo.update(dtSeconds)) events.push({ type: 'combo-reset' });

    const ball = this.ball.snapshot;
    const collidingIds = this.targets.collidingTargetIds(ball.position, ball.radius);
    const currentOverlaps = new Set<number>(collidingIds);

    for (const targetId of collidingIds) {
      if (this.activeOverlaps.has(targetId)) continue;
      const hit = this.targets.hit(targetId);
      if (!hit) continue;

      events.push({
        type: 'target-hit',
        targetId,
        kind: hit.target.kind,
        position: { ...hit.target.position },
        armorBroken: hit.armorBroken,
      });

      if (hit.destroyed) {
        const reward = this.combo.registerBreak(hit.target.kind === 'armored' ? 180 : 100);
        events.push({
          type: 'target-break',
          targetId,
          kind: hit.target.kind,
          position: { ...hit.target.position },
          combo: reward.combo,
          scoreAdded: reward.scoreAdded,
        });
        currentOverlaps.delete(targetId);
      } else {
        this.combo.registerContact();
        this.ball.applyTargetDeflection(hit.target.position);
      }
    }

    this.activeOverlaps = currentOverlaps;
    return events;
  }
}
