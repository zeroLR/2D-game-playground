import type { Point2D } from '../input/SwipeClassifier';
import type { ChainEvolutionStage } from './RuneEvolutionCatalog';
import type { ChainLinkKind, ChainPropagationPlan } from './ChainEvolutionTuning';

export const RELAY_HOP_CADENCE_SECONDS = 0.075;
export const FUSE_DETONATION_DELAY_T1_SECONDS = 0.44;
export const FUSE_DETONATION_DELAY_T2_SECONDS = 0.36;

export interface RelayTimelineAction {
  delaySeconds: number;
  targetId: number;
  from: Point2D;
  to: Point2D;
  kind: ChainLinkKind;
}

export interface DetonationTimelineAction {
  delaySeconds: number;
  center: Point2D;
  radius: number;
  targetIds: number[];
}

export interface ChainResolutionTimeline {
  immediateTargetIds: number[];
  relayActions: RelayTimelineAction[];
  detonation: DetonationTimelineAction | null;
}

export function buildChainResolutionTimeline(
  plan: ChainPropagationPlan,
  stage: ChainEvolutionStage,
): ChainResolutionTimeline {
  if (plan.mode === 'base') {
    return {
      immediateTargetIds: [...plan.allTargetIds],
      relayActions: [],
      detonation: null,
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
      detonation: null,
    };
  }

  const endpointId = plan.routeTargetIds.at(-1) ?? null;
  const targetIds = endpointId === null
    ? []
    : [endpointId, ...plan.terminalTargetIds];

  return {
    immediateTargetIds: [],
    relayActions: [],
    detonation: plan.terminalCenter && targetIds.length > 0
      ? {
          delaySeconds: stage === 2 ? FUSE_DETONATION_DELAY_T2_SECONDS : FUSE_DETONATION_DELAY_T1_SECONDS,
          center: { ...plan.terminalCenter },
          radius: plan.terminalRadius,
          targetIds,
        }
      : null,
  };
}
