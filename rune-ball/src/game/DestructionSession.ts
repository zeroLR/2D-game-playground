import { BallModel, type ArenaBounds, type BallSnapshot, type WallSide } from './BallModel';
import { ComboModel, type ComboSnapshot } from './ComboModel';
import { TargetSystem, type TargetKind, type TargetState } from './TargetSystem';
import type { Point2D, SwipeDirection } from '../input/SwipeClassifier';
import { FlowSystem, type FlowSnapshot } from '../progression/FlowSystem';
import {
  VortexEvolutionSystem,
  type VortexEvolutionPath,
  type VortexEvolutionSnapshot,
  type VortexEvolutionStage,
} from '../progression/VortexEvolutionSystem';
import { RuneSystem, type RuneSnapshot } from '../rune/RuneSystem';
import {
  BASE_VORTEX_PROFILE,
  getVortexCastProfile,
  type VortexCastProfile,
} from '../progression/VortexEvolutionTuning';
import type { RuneKind } from '../rune/RuneTypes';
import {
  SplitEvolutionSystem,
  type SplitEvolutionPath,
  type SplitEvolutionSnapshot,
  type SplitEvolutionStage,
} from '../progression/SplitEvolutionSystem';
import {
  BASE_SPLIT_PROFILE,
  getSplitCastProfile,
  projectSplitEchoes,
  type SplitCastProfile,
} from '../progression/SplitEvolutionTuning';
import {
  ChainEvolutionSystem,
  type ChainEvolutionPath,
  type ChainEvolutionSnapshot,
  type ChainEvolutionStage,
} from '../progression/ChainEvolutionSystem';
import {
  getChainCastProfile,
  planChainPropagation,
  type ChainLinkKind,
  type ChainPropagationMode,
} from '../progression/ChainEvolutionTuning';
import { buildChainResolutionTimeline, selectDetonationZoneTargetIds } from '../progression/ChainResolutionTimeline';
import { resolveRuneSynergy, type RuneSynergyKind } from '../progression/RuneSynergy';

export type ImpactSource = 'ball' | 'split' | 'chain' | 'singularity';

export type DestructionEvent =
  | { type: 'wall-hit'; side: WallSide; assisted: boolean; targetId: number | null }
  | { type: 'target-hit'; targetId: number; kind: TargetKind; position: Point2D; armorBroken: boolean; source: ImpactSource }
  | { type: 'target-break'; targetId: number; kind: TargetKind; position: Point2D; combo: number; scoreAdded: number; source: ImpactSource; runeInfluence: RuneKind | null }
  | { type: 'target-spawn'; targetId: number; kind: TargetKind; position: Point2D }
  | { type: 'combo-reset' }
  | { type: 'rune-activated'; rune: RuneKind; center: Point2D }
  | { type: 'vortex-evolution-progress'; path: VortexEvolutionPath; stage: VortexEvolutionStage; stageName: string; qualifiedUses: number; nextThreshold: number | null }
  | { type: 'vortex-evolved'; path: VortexEvolutionPath; stage: 1 | 2; stageName: string; qualifiedUses: number; nextThreshold: number | null; center: Point2D }
  | { type: 'vortex-collapse'; center: Point2D; targets: Point2D[] }
  | { type: 'split-evolution-progress'; path: SplitEvolutionPath; stage: SplitEvolutionStage; stageName: string; qualifiedUses: number; nextThreshold: number | null }
  | { type: 'split-evolved'; path: SplitEvolutionPath; stage: 1 | 2; stageName: string; qualifiedUses: number; nextThreshold: number | null; center: Point2D }
  | { type: 'chain-evolution-progress'; path: ChainEvolutionPath; stage: ChainEvolutionStage; stageName: string; qualifiedUses: number; nextThreshold: number | null }
  | { type: 'chain-evolved'; path: ChainEvolutionPath; stage: 1 | 2; stageName: string; qualifiedUses: number; nextThreshold: number | null; center: Point2D }
  | { type: 'rune-failed'; rune: RuneKind; reason: 'charge' | 'busy'; center: Point2D }
  | { type: 'chain-triggered'; origin: Point2D; targets: Point2D[]; links: { from: Point2D; to: Point2D }[]; zones: { center: Point2D; radius: number }[]; path: ChainEvolutionPath; stage: ChainEvolutionStage; mode: ChainPropagationMode; terminalCenter: Point2D | null; terminalRadius: number }
  | { type: 'chain-hop'; from: Point2D; to: Point2D; path: ChainEvolutionPath; stage: ChainEvolutionStage; kind: ChainLinkKind }
  | { type: 'chain-detonated'; center: Point2D; radius: number; targets: Point2D[]; path: ChainEvolutionPath; stage: ChainEvolutionStage }
  | { type: 'rune-synergy'; kind: RuneSynergyKind; runes: RuneKind[]; center: Point2D }
  | { type: 'overdrive-enter'; duration: number }
  | { type: 'overdrive-exit' };

export interface DestructionSnapshot {
  ball: BallSnapshot;
  targets: TargetState[];
  combo: ComboSnapshot;
  runes: RuneSnapshot;
  flow: FlowSnapshot;
  vortexEvolution: VortexEvolutionSnapshot;
  splitEvolution: SplitEvolutionSnapshot;
  chainEvolution: ChainEvolutionSnapshot;
  splitEchoes: Point2D[];
}

export interface DestructionSessionOptions {
  vortexEvolutionPath?: VortexEvolutionPath;
  splitEvolutionPath?: SplitEvolutionPath;
  chainEvolutionPath?: ChainEvolutionPath;
}

const BASE_TARGET_COUNT = 8;
const OVERDRIVE_TARGET_COUNT = 11;

interface PendingRelayHit {
  remainingSeconds: number;
  targetId: number;
  from: Point2D;
  to: Point2D;
  kind: ChainLinkKind;
  path: ChainEvolutionPath;
  stage: ChainEvolutionStage;
}

interface PendingDetonation {
  remainingSeconds: number;
  center: Point2D;
  radius: number;
  targetLimit: number;
  path: ChainEvolutionPath;
  stage: ChainEvolutionStage;
}

export class DestructionSession {
  private readonly ball: BallModel;
  private readonly targets: TargetSystem;
  private readonly combo = new ComboModel();
  private readonly runes = new RuneSystem();
  private readonly flow = new FlowSystem();
  private readonly vortexEvolution: VortexEvolutionSystem;
  private readonly splitEvolution: SplitEvolutionSystem;
  private readonly chainEvolution: ChainEvolutionSystem;
  private activeOverlaps = new Set<number>();
  private activeSplitOverlaps = new Set<number>();
  private activeVortexProfile: VortexCastProfile = BASE_VORTEX_PROFILE;
  private activeSplitProfile: SplitCastProfile = BASE_SPLIT_PROFILE;
  private splitCastQualified = false;
  private splitCastVortexSynergyRewarded = false;
  private pendingRelayHits: PendingRelayHit[] = [];
  private pendingDetonations: PendingDetonation[] = [];

  constructor(bounds: ArenaBounds, options: DestructionSessionOptions = {}) {
    this.ball = new BallModel(bounds);
    this.targets = new TargetSystem(bounds, BASE_TARGET_COUNT);
    this.vortexEvolution = new VortexEvolutionSystem(options.vortexEvolutionPath ?? 'gravity-well');
    this.splitEvolution = new SplitEvolutionSystem(options.splitEvolutionPath ?? 'prism');
    this.chainEvolution = new ChainEvolutionSystem(options.chainEvolutionPath ?? 'relay');
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
      vortexEvolution: this.vortexEvolution.snapshot,
      splitEvolution: this.splitEvolution.snapshot,
      chainEvolution: this.chainEvolution.snapshot,
      splitEchoes: runes.splitStrength > 0 ? this.splitEchoPositions(ball, this.activeSplitProfile) : [],
    };
  }

  setBounds(bounds: ArenaBounds): void {
    this.ball.setBounds(bounds);
    this.targets.setBounds(bounds);
    this.activeOverlaps.clear();
    this.activeSplitOverlaps.clear();
  }

  applyDirectionalRedirect(direction: SwipeDirection): void {
    this.ball.applyDirectionalRedirect(direction);
  }

  activateRune(rune: RuneKind, center: Point2D): DestructionEvent[] {
    const events: DestructionEvent[] = [];
    const vortexProfile = rune === 'vortex' ? this.vortexProfileForCurrentStage() : BASE_VORTEX_PROFILE;
    const splitProfile = rune === 'split' ? this.splitProfileForCurrentStage() : BASE_SPLIT_PROFILE;
    const activationOptions = rune === 'vortex'
      ? { vortexDurationSeconds: vortexProfile.durationSeconds }
      : rune === 'split'
        ? { splitDurationSeconds: splitProfile.durationSeconds }
        : {};
    const result = this.runes.activate(rune, center, activationOptions);
    if (!result.success) {
      return [{ type: 'rune-failed', rune, reason: result.reason, center: { ...center } }];
    }

    if (rune === 'vortex') this.activeVortexProfile = vortexProfile;
    if (rune === 'split') {
      this.activeSplitProfile = splitProfile;
      this.activeSplitOverlaps.clear();
      this.splitCastQualified = false;
      this.splitCastVortexSynergyRewarded = false;
    }
    events.push({ type: 'rune-activated', rune, center: { ...center } });

    if (rune === 'vortex') {
      const qualified = this.targets.collidingTargetIds(center, vortexProfile.radius).length > 0;
      if (qualified) {
        const advance = this.vortexEvolution.registerQualifiedUse();
        const evolution = advance.snapshot;
        const progressEvent: DestructionEvent = {
          type: 'vortex-evolution-progress',
          path: evolution.path,
          stage: evolution.stage,
          stageName: evolution.stageName,
          qualifiedUses: evolution.qualifiedUses,
          nextThreshold: evolution.nextThreshold,
        };
        events.push(progressEvent);
        if (advance.evolved && (evolution.stage === 1 || evolution.stage === 2)) {
          events.push({
            type: 'vortex-evolved',
            path: evolution.path,
            stage: evolution.stage,
            stageName: evolution.stageName,
            qualifiedUses: evolution.qualifiedUses,
            nextThreshold: evolution.nextThreshold,
            center: { ...center },
          });
        }
      }
    }

    if (this.flow.registerRune()) this.enterOverdrive(events);
    return events;
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

    const vortexBeforeUpdate = this.runes.snapshot;
    this.runes.update(dtSeconds);
    const runeState = this.runes.snapshot;
    const collapseCenter = vortexBeforeUpdate.vortexCenter
      && vortexBeforeUpdate.vortexStrength > 0
      && !runeState.vortexCenter
      && this.activeVortexProfile.collapseRadius > 0
      ? { ...vortexBeforeUpdate.vortexCenter }
      : null;

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

    if (runeState.vortexCenter && runeState.vortexStrength > 0) {
      const dt = Math.max(0, dtSeconds);
      if (this.activeVortexProfile.mode === 'orbit') {
        this.targets.applyOrbit(
          runeState.vortexCenter,
          this.activeVortexProfile.radius,
          dt * this.activeVortexProfile.orbitPerSecond * runeState.vortexStrength,
          dt * this.activeVortexProfile.inwardPerSecond * runeState.vortexStrength,
        );
      } else {
        this.targets.applyVortex(
          runeState.vortexCenter,
          this.activeVortexProfile.radius,
          dt * this.activeVortexProfile.pullPerSecond * runeState.vortexStrength,
        );
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

    if (this.combo.update(dtSeconds, this.flow.snapshot.overdriveActive)) events.push({ type: 'combo-reset' });

    const damagedThisStep = new Set<number>();
    this.resolvePendingChain(dtSeconds, events, damagedThisStep);
    if (collapseCenter) {
      const targetIds = this.targets.collidingTargetIds(collapseCenter, this.activeVortexProfile.collapseRadius);
      const positionsById = new Map(this.targets.snapshot.map((target) => [target.id, target.position]));
      const pulseTargets = targetIds
        .map((id) => positionsById.get(id))
        .filter((position): position is Point2D => Boolean(position))
        .map((position) => ({ ...position }));
      events.push({ type: 'vortex-collapse', center: { ...collapseCenter }, targets: pulseTargets });
      for (const targetId of targetIds) {
        this.resolveTargetHit(targetId, 'singularity', false, events, damagedThisStep);
      }
      this.activeVortexProfile = BASE_VORTEX_PROFILE;
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
      for (const echo of this.splitEchoPositions(this.ball.snapshot, this.activeSplitProfile)) {
        for (const targetId of this.targets.collidingTargetIds(echo, this.activeSplitProfile.hitRadius)) echoIds.add(targetId);
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

    if (source === 'split' && !this.splitCastQualified) {
      this.splitCastQualified = true;
      const advance = this.splitEvolution.registerQualifiedUse();
      const evolution = advance.snapshot;
      events.push({
        type: 'split-evolution-progress',
        path: evolution.path,
        stage: evolution.stage,
        stageName: evolution.stageName,
        qualifiedUses: evolution.qualifiedUses,
        nextThreshold: evolution.nextThreshold,
      });
      if (advance.evolved && (evolution.stage === 1 || evolution.stage === 2)) {
        events.push({
          type: 'split-evolved',
          path: evolution.path,
          stage: evolution.stage,
          stageName: evolution.stageName,
          qualifiedUses: evolution.qualifiedUses,
          nextThreshold: evolution.nextThreshold,
          center: { ...this.ball.snapshot.position },
        });
      }
    }

    const runeStateAtImpact = this.runes.snapshot;
    const insideActiveVortex = this.isInsideActiveVortex(hit.target.position, runeStateAtImpact);
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

    let chainTriggered = false;
    let chainQualified = false;
    if (canTriggerChain && this.runes.consumeChain()) {
      chainTriggered = true;
      const evolutionBeforeCast = this.chainEvolution.snapshot;
      const profile = getChainCastProfile(evolutionBeforeCast.path, evolutionBeforeCast.stage);
      const excluded = new Set<number>(damagedThisStep);
      excluded.add(targetId);
      const targetSnapshot = this.targets.snapshot;
      const plan = planChainPropagation(hit.target.position, targetSnapshot, excluded, profile);
      const timeline = buildChainResolutionTimeline(plan, evolutionBeforeCast.stage);
      const positionsById = new Map(targetSnapshot.map((target) => [target.id, target.position]));
      const eventTargetIds = plan.mode === 'detonation' ? plan.routeTargetIds : plan.allTargetIds;
      const chainedPositions = eventTargetIds
        .map((id) => positionsById.get(id))
        .filter((position): position is Point2D => Boolean(position))
        .map((position) => ({ ...position }));
      const visibleLinks = plan.mode === 'detonation'
        ? plan.links.filter((link) => link.kind !== 'terminal')
        : plan.links;
      chainQualified = plan.qualificationCount >= 2;

      events.push({
        type: 'chain-triggered',
        origin: { ...hit.target.position },
        targets: chainedPositions,
        links: visibleLinks.map((link) => ({ from: { ...link.from }, to: { ...link.to } })),
        path: evolutionBeforeCast.path,
        stage: evolutionBeforeCast.stage,
        mode: plan.mode,
        zones: timeline.detonationZones.map((zone) => ({ center: { ...zone.center }, radius: zone.radius })),
        terminalCenter: plan.mode === 'detonation' ? null : plan.terminalCenter ? { ...plan.terminalCenter } : null,
        terminalRadius: plan.mode === 'detonation' ? 0 : plan.terminalRadius,
      });
      if (this.flow.registerChain(eventTargetIds.length)) this.enterOverdrive(events);

      for (const chainedId of timeline.immediateTargetIds) {
        this.resolveTargetHit(chainedId, 'chain', false, events, damagedThisStep);
      }

      for (const action of timeline.relayActions) {
        this.pendingRelayHits.push({
          remainingSeconds: action.delaySeconds,
          targetId: action.targetId,
          from: { ...action.from },
          to: { ...action.to },
          kind: action.kind,
          path: evolutionBeforeCast.path,
          stage: evolutionBeforeCast.stage,
        });
      }

      for (const zone of timeline.detonationZones) {
        this.pendingDetonations.push({
          remainingSeconds: zone.delaySeconds,
          center: { ...zone.center },
          radius: zone.radius,
          targetLimit: zone.targetLimit,
          path: evolutionBeforeCast.path,
          stage: evolutionBeforeCast.stage,
        });
      }

      if (chainQualified) {
        const advance = this.chainEvolution.registerQualifiedUse();
        const evolution = advance.snapshot;
        events.push({
          type: 'chain-evolution-progress',
          path: evolution.path,
          stage: evolution.stage,
          stageName: evolution.stageName,
          qualifiedUses: evolution.qualifiedUses,
          nextThreshold: evolution.nextThreshold,
        });
        if (advance.evolved && (evolution.stage === 1 || evolution.stage === 2)) {
          events.push({
            type: 'chain-evolved',
            path: evolution.path,
            stage: evolution.stage,
            stageName: evolution.stageName,
            qualifiedUses: evolution.qualifiedUses,
            nextThreshold: evolution.nextThreshold,
            center: plan.terminalCenter ? { ...plan.terminalCenter } : { ...hit.target.position },
          });
        }
      }
    }

    const synergy = resolveRuneSynergy({
      splitImpact: source === 'split',
      insideActiveVortex,
      chainTriggered,
      chainQualified,
      vortexSplitAlreadyRewarded: this.splitCastVortexSynergyRewarded,
    });
    if (synergy) {
      if (synergy.marksVortexSplitWindow) this.splitCastVortexSynergyRewarded = true;
      this.registerRuneSynergy(synergy.kind, synergy.runes, hit.target.position, events);
    }

    return hit.destroyed;
  }

  private resolvePendingChain(
    dtSeconds: number,
    events: DestructionEvent[],
    damagedThisStep: Set<number>,
  ): void {
    const dt = Math.min(0.12, Math.max(0, Number.isFinite(dtSeconds) ? dtSeconds : 0));

    const remainingRelayHits: PendingRelayHit[] = [];
    for (const action of this.pendingRelayHits) {
      const remainingSeconds = action.remainingSeconds - dt;
      if (remainingSeconds > 0) {
        remainingRelayHits.push({ ...action, remainingSeconds });
        continue;
      }

      const targetStillExists = this.targets.snapshot.some((target) => target.id === action.targetId);
      if (!targetStillExists) continue;
      events.push({
        type: 'chain-hop',
        from: { ...action.from },
        to: { ...action.to },
        path: action.path,
        stage: action.stage,
        kind: action.kind,
      });
      this.resolveTargetHit(action.targetId, 'chain', false, events, damagedThisStep);
    }
    this.pendingRelayHits = remainingRelayHits;

    const remainingDetonations: PendingDetonation[] = [];
    for (const action of this.pendingDetonations) {
      const remainingSeconds = action.remainingSeconds - dt;
      if (remainingSeconds > 0) {
        remainingDetonations.push({ ...action, remainingSeconds });
        continue;
      }

      const liveSnapshot = this.targets.snapshot;
      const targetIds = selectDetonationZoneTargetIds(
        action.center,
        action.radius,
        action.targetLimit,
        liveSnapshot,
      );
      const positionsById = new Map(liveSnapshot.map((target) => [target.id, target.position]));
      const targetPositions = targetIds
        .map((id) => positionsById.get(id))
        .filter((position): position is Point2D => Boolean(position))
        .map((position) => ({ ...position }));

      events.push({
        type: 'chain-detonated',
        center: { ...action.center },
        radius: action.radius,
        targets: targetPositions,
        path: action.path,
        stage: action.stage,
      });
      for (const targetId of targetIds) {
        this.resolveTargetHit(targetId, 'chain', false, events, damagedThisStep);
      }
    }
    this.pendingDetonations = remainingDetonations;
  }

  private vortexProfileForCurrentStage(): VortexCastProfile {
    const evolution = this.vortexEvolution.snapshot;
    return getVortexCastProfile(evolution.path, evolution.stage);
  }

  private splitProfileForCurrentStage(): SplitCastProfile {
    const evolution = this.splitEvolution.snapshot;
    return getSplitCastProfile(evolution.path, evolution.stage);
  }

  private isInsideActiveVortex(point: Point2D, runes: RuneSnapshot): boolean {
    if (!runes.vortexCenter || runes.vortexStrength <= 0) return false;
    const dx = point.x - runes.vortexCenter.x;
    const dy = point.y - runes.vortexCenter.y;
    return dx * dx + dy * dy <= this.activeVortexProfile.radius * this.activeVortexProfile.radius;
  }

  private registerRuneSynergy(
    kind: RuneSynergyKind,
    runes: readonly RuneKind[],
    center: Point2D,
    events: DestructionEvent[],
  ): void {
    events.push({ type: 'rune-synergy', kind, runes: [...runes], center: { ...center } });
    const runeCount: 2 | 3 = kind === 'triad' ? 3 : 2;
    if (this.flow.registerSynergy(runeCount)) this.enterOverdrive(events);
  }

  private enterOverdrive(events: DestructionEvent[]): void {
    this.syncOverdriveState(true);
    events.push({ type: 'overdrive-enter', duration: this.flow.snapshot.overdriveDuration });
  }

  private syncOverdriveState(active: boolean): void {
    this.runes.setOverdriveActive(active);
    this.targets.setDesiredCount(active ? OVERDRIVE_TARGET_COUNT : BASE_TARGET_COUNT);
  }

  private splitEchoPositions(ball: BallSnapshot, profile: SplitCastProfile): Point2D[] {
    return projectSplitEchoes(ball.position, ball.velocity, profile);
  }
}
