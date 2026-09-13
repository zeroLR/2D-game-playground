import type { TargetState } from '../game/TargetSystem';
import type { Point2D } from '../input/SwipeClassifier';
import type { ChainEvolutionStage } from './RuneEvolutionCatalog';
import type { ChainLinkKind, ChainPropagationPlan } from './ChainEvolutionTuning';

export const RELAY_HOP_CADENCE_SECONDS = 0.075;
export const FUSE_ZONE_DELAY_T1_SECONDS = 0.48;
export const FUSE_ZONE_DELAY_T2_SECONDS = 0.40;
export const FUSE_ZONE_RADIUS_T1 = 48;
export const FUSE_ZONE_RADIUS_T2 = 56;
export const FUSE_ZONE_TARGET_LIMIT_T1 = 2;
export const FUSE_ZONE_TARGET_LIMIT_T2 = 3;

export interface RelayTimelineAction {
  delaySeconds: number;
  targetId: number;
  from: Point2D;
  to: Point2D;
  kind: ChainLinkKind;
}

export interface DetonationZoneTimelineAction {
  delaySeconds: number;
  center: Point2D;
  radius: number;
  targetLimit: number;
}

export interface ChainResolutionTimeline {
  immediateTargetIds: number[];
  relayActions: RelayTimelineAction[];
  detonationZones: DetonationZoneTimelineAction[];
}

export function buildChainResolutionTimeline(
  plan: ChainPropagationPlan,
  stage: ChainEvolutionStage,
): ChainResolutionTimeline {
  if (plan.mode === 'base') {
    return {
      immediateTargetIds: [...plan.allTargetIds],
      relayActions: [],
      detonationZones: [],
    };
  }

  if (plan.mode === 'relay') {
    return {
      immediateTargetIds: [],
      relayActions: plan.links.map((link, index) => ({
        delaySeconds: RELAY_HOP_CADENCE_SECONDS * (index + 1),
        targetId: link.targetId,
        from: { ...link.from },
        to: { ...link.to },
        kind: link.kind,
      })),
      detonationZones: [],
    };
  }

  const delaySeconds = stage === 2 ? FUSE_ZONE_DELAY_T2_SECONDS : FUSE_ZONE_DELAY_T1_SECONDS;
  const radius = stage === 2 ? FUSE_ZONE_RADIUS_T2 : FUSE_ZONE_RADIUS_T1;
  const targetLimit = stage === 2 ? FUSE_ZONE_TARGET_LIMIT_T2 : FUSE_ZONE_TARGET_LIMIT_T1;

  return {
    immediateTargetIds: [],
    relayActions: [],
    detonationZones: plan.links
      .filter((link) => link.kind === 'route')
      .map((link) => ({
        delaySeconds,
        center: { ...link.to },
        radius,
        targetLimit,
      })),
  };
}

export function selectDetonationZoneTargetIds(
  center: Point2D,
  radius: number,
  targetLimit: number,
  targets: readonly TargetState[],
): number[] {
  const safeRadius = Math.max(0, Number.isFinite(radius) ? radius : 0);
  const safeLimit = Math.max(0, Math.floor(Number.isFinite(targetLimit) ? targetLimit : 0));
  if (safeRadius <= 0 || safeLimit <= 0) return [];

  return targets
    .map((target) => ({
      id: target.id,
      distance: Math.hypot(target.position.x - center.x, target.position.y - center.y),
    }))
    .filter((candidate) => candidate.distance <= safeRadius)
    .sort((left, right) => left.distance - right.distance || left.id - right.id)
    .slice(0, safeLimit)
    .map((candidate) => candidate.id);
}
