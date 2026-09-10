import { BallModel, type ArenaBounds, type BallSnapshot, type WallSide } from './BallModel';
import { ComboModel, type ComboSnapshot } from './ComboModel';
import { TargetSystem, type TargetKind, type TargetState } from './TargetSystem';
import type { Point2D, SwipeDirection } from '../input/SwipeClassifier';
import { FlowSystem, type FlowSnapshot } from '../progression/FlowSystem';
import { RuneSystem, type RuneSnapshot } from '../rune/RuneSystem';
import type { RuneKind } from '../rune/RuneTypes';

export type ImpactSource = 'ball' | 'split' | 'chain' | 'singularity';

export type DestructionEvent =
  | { type: 'wall-hit'; side: WallSide; assisted: boolean; targetId: number | null }
  | { type: 'target-hit'; targetId: number; kind: TargetKind; position: Point2D; armorBroken: boolean; source: ImpactSource }
  | { type: 'target-break'; targetId: number; kind: TargetKind; position: Point2D; combo: number; scoreAdded: number; source: ImpactSource; runeInfluence: RuneKind | null }
  | { type: 'target-spawn'; targetId: number; kind: TargetKind; position: Point2D }
  | { type: 'combo-reset' }
  | { type: 'rune-activated'; rune: RuneKind; center: Point2D }
  | { type: 'ascension-activated'; rune: 'vortex'; ascension: 'singularity'; center: Point2D; duration: number }
  | { type: 'ascension-pulse'; rune: 'vortex'; ascension: 'singularity'; center: Point2D; targets: Point2D[] }
  | { type: 'rune-failed'; rune: RuneKind; reason: 'charge' | 'busy'; center: Point2D }
  | { type: 'chain-triggered'; origin: Point2D; targets: Point2D[] }
  | { type: 'overdrive-enter'; duration: number }
  | { type: 'overdrive-exit' };

export interface DestructionSnapshot {
  ball: BallSnapshot;
  targets: TargetState[];
  combo: ComboSnapshot;
  runes: RuneSnapshot;
  flow: FlowSnapshot;
  splitEchoes: Point2D[];
}

const BASE_TARGET_COUNT = 8;
const OVERDRIVE_TARGET_COUNT = 11;
const VORTEX_RADIUS = 210;
const VORTEX_PULL_PER_SECOND = 2.15;
const SPLIT_ECHO_OFFSET = 42;
const SPLIT_ECHO_RADIUS = 13;
const CHAIN_RADIUS = 155;
const CHAIN_TARGET_LIMIT = 3;
const SINGULARITY_DURATION_SECONDS = 1.35;
const SINGULARITY_RADIUS = 300;
const SINGULARITY_PULL_PER_SECOND = 4.8;
const SINGULARITY_PULSE_RADIUS = 145;

export class DestructionSession {
  private readonly ball: BallModel;
  private readonly targets: TargetSystem;
  private readonly combo = new ComboModel();
  private readonly runes = new RuneSystem();
  private readonly flow = new FlowSystem();
  private activeOverlaps = new Set<number>();
  private activeSplitOverlaps = new Set<number>();
  private singularityCenter: Point2D | null = null;
  private singularitySecondsRemaining = 0;

  constructor(bounds: ArenaBounds) {
    this.ball = new BallModel(bounds);
    this.targets = new TargetSystem(bounds, BASE_TARGET_COUNT);
  }

  get snapshot(): DestructionSnapshot {
    const ball = this.ball.snapshot;
    const runes = this.runes.snapshot;
    return {
      ball,
      targets: this.targets.snapshot,
      combo: this.combo.snapshot,
      runes,
      flow: this.flow.snapshot,
      splitEchoes: runes.splitStrength > 0 ? this.splitEchoPositions(ball) : [],
    };
  }

  setBounds(bounds: ArenaBounds): void {
    this.ball.setBounds(bounds);
    this.targets.setBounds(bounds);
    this.activeOverlaps.clear();
    this.activeSplitOverlaps.clear();
    this.singularityCenter = null;
    this.singularitySecondsRemaining = 0;
  }

  applyDirectionalRedirect(direction: SwipeDirection): void {
    this.ball.applyDirectionalRedirect(direction);
  }

  activateRune(rune: RuneKind, center: Point2D): DestructionEvent[] {
    const events: DestructionEvent[] = [];
    const result = this.runes.activate(rune, center);
    if (!result.success) {
      return [{ type: 'rune-failed', rune, reason: result.reason, center: { ...center } }];
    }

    events.push({ type: 'rune-activated', rune, center: { ...center } });
    if (this.flow.registerRune()) this.enterOverdrive(events);
    return events;
  }

  activateVortexAscension(center: Point2D): DestructionEvent[] {
    if (this.singularitySecondsRemaining > 0) return [];
    this.singularityCenter = { ...center };
    this.singularitySecondsRemaining = SINGULARITY_DURATION_SECONDS;
    return [{
      type: 'ascension-activated',
      rune: 'vortex',
      ascension: 'singularity',
      center: { ...center },
      duration: SINGULARITY_DURATION_SECONDS,
    }];
  }

  interpolatedBallPosition(alpha: number): Point2D {
    return this.ball.interpolatedPosition(alpha);
  }

  update(dtSeconds: number): DestructionEvent[] {
    const events: DestructionEvent[] = [];
    if (this.flow.update(dtSeconds)) {
      this.syncOverdriveState(false);
      events.push({ type: 'overdrive-exit' });
    }
    this.runes.update(dtSeconds);

    let singularityPulseCenter: Point2D | null = null;
    if (this.singularityCenter && this.singularitySecondsRemaining > 0) {
      const dt = Math.max(0, dtSeconds);
      this.targets.applyVortex(
        this.singularityCenter,
        SINGULARITY_RADIUS,
        dt * SINGULARITY_PULL_PER_SECOND,
      );
      this.singularitySecondsRemaining = Math.max(0, this.singularitySecondsRemaining - dt);
      if (this.singularitySecondsRemaining <= 0) singularityPulseCenter = { ...this.singularityCenter };
    }

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

    const runeState = this.runes.snapshot;
    if (runeState.vortexCenter && runeState.vortexStrength > 0) {
      this.targets.applyVortex(
        runeState.vortexCenter,
        VORTEX_RADIUS,
        Math.max(0, dtSeconds) * VORTEX_PULL_PER_SECOND * runeState.vortexStrength,
      );
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

    if (this.combo.update(dtSeconds, this.flow.snapshot.overdriveActive)) events.push({ type: 'combo-reset' });

    const damagedThisStep = new Set<number>();
    if (singularityPulseCenter) {
      const targetIds = this.targets.collidingTargetIds(singularityPulseCenter, SINGULARITY_PULSE_RADIUS);
      const positionsById = new Map(this.targets.snapshot.map((target) => [target.id, target.position]));
      const pulseTargets = targetIds
        .map((id) => positionsById.get(id))
        .filter((position): position is Point2D => Boolean(position))
        .map((position) => ({ ...position }));
      events.push({
        type: 'ascension-pulse',
        rune: 'vortex',
        ascension: 'singularity',
        center: { ...singularityPulseCenter },
        targets: pulseTargets,
      });
      for (const targetId of targetIds) {
        this.resolveTargetHit(targetId, 'singularity', false, events, damagedThisStep);
      }
      this.singularityCenter = null;
    }

    const ball = this.ball.snapshot;
    const ballCollidingIds = this.targets.collidingTargetIds(ball.position, ball.radius);
    const currentOverlaps = new Set<number>(ballCollidingIds);

    for (const targetId of ballCollidingIds) {
      if (this.activeOverlaps.has(targetId)) continue;
      const destroyed = this.resolveTargetHit(targetId, 'ball', true, events, damagedThisStep);
      if (destroyed) currentOverlaps.delete(targetId);
    }
    this.activeOverlaps = currentOverlaps;

    const currentRuneState = this.runes.snapshot;
    if (currentRuneState.splitStrength > 0) {
      const echoIds = new Set<number>();
      for (const echo of this.splitEchoPositions(this.ball.snapshot)) {
        for (const targetId of this.targets.collidingTargetIds(echo, SPLIT_ECHO_RADIUS)) echoIds.add(targetId);
      }
      const currentSplitOverlaps = new Set<number>(echoIds);
      for (const targetId of echoIds) {
        if (this.activeSplitOverlaps.has(targetId)) continue;
        const destroyed = this.resolveTargetHit(targetId, 'split', true, events, damagedThisStep);
        if (destroyed) currentSplitOverlaps.delete(targetId);
      }
      this.activeSplitOverlaps = currentSplitOverlaps;
    } else {
      this.activeSplitOverlaps.clear();
    }

    return events;
  }

  private resolveTargetHit(
    targetId: number,
    source: ImpactSource,
    canTriggerChain: boolean,
    events: DestructionEvent[],
    damagedThisStep: Set<number>,
  ): boolean {
    if (damagedThisStep.has(targetId)) return false;
    const hit = this.targets.hit(targetId);
    if (!hit) return false;
    const runeStateAtImpact = this.runes.snapshot;
    const runeInfluence: RuneKind | null = source === 'split'
      ? 'split'
      : source === 'singularity'
        ? 'vortex'
        : source === 'chain'
        ? 'chain'
        : canTriggerChain && runeStateAtImpact.chainReady
          ? 'chain'
          : runeStateAtImpact.vortexStrength > 0
            ? 'vortex'
            : null;

    damagedThisStep.add(targetId);
    this.runes.registerImpact(hit.destroyed);
    if (this.flow.registerImpact(hit.destroyed)) this.enterOverdrive(events);

    events.push({
      type: 'target-hit',
      targetId,
      kind: hit.target.kind,
      position: { ...hit.target.position },
      armorBroken: hit.armorBroken,
      source,
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
        source,
        runeInfluence,
      });
    } else {
      this.combo.registerContact();
      if (source === 'ball') this.ball.applyTargetDeflection(hit.target.position);
    }

    if (canTriggerChain && this.runes.consumeChain()) {
      const excluded = new Set<number>(damagedThisStep);
      excluded.add(targetId);
      const chainedIds = this.targets.nearbyTargetIds(
        hit.target.position,
        CHAIN_RADIUS,
        excluded,
        CHAIN_TARGET_LIMIT,
      );
      const positionsById = new Map(this.targets.snapshot.map((target) => [target.id, target.position]));
      const chainedPositions = chainedIds
        .map((id) => positionsById.get(id))
        .filter((position): position is Point2D => Boolean(position))
        .map((position) => ({ ...position }));

      events.push({
        type: 'chain-triggered',
        origin: { ...hit.target.position },
        targets: chainedPositions,
      });
      if (this.flow.registerChain(chainedIds.length)) this.enterOverdrive(events);

      for (const chainedId of chainedIds) {
        this.resolveTargetHit(chainedId, 'chain', false, events, damagedThisStep);
      }
    }

    return hit.destroyed;
  }

  private enterOverdrive(events: DestructionEvent[]): void {
    this.syncOverdriveState(true);
    events.push({ type: 'overdrive-enter', duration: this.flow.snapshot.overdriveDuration });
  }

  private syncOverdriveState(active: boolean): void {
    this.runes.setOverdriveActive(active);
    this.targets.setDesiredCount(active ? OVERDRIVE_TARGET_COUNT : BASE_TARGET_COUNT);
  }

  private splitEchoPositions(ball: BallSnapshot): Point2D[] {
    const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
    if (!(speed > 0)) return [];
    const normal = { x: -ball.velocity.y / speed, y: ball.velocity.x / speed };
    return [
      {
        x: ball.position.x + normal.x * SPLIT_ECHO_OFFSET,
        y: ball.position.y + normal.y * SPLIT_ECHO_OFFSET,
      },
      {
        x: ball.position.x - normal.x * SPLIT_ECHO_OFFSET,
        y: ball.position.y - normal.y * SPLIT_ECHO_OFFSET,
      },
    ];
  }
}
