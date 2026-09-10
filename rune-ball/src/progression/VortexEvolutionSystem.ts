import {
  VORTEX_TIER_ONE_THRESHOLD,
  VORTEX_TIER_TWO_THRESHOLD,
  getVortexEvolutionStageName,
  type VortexEvolutionPath,
  type VortexEvolutionStage,
} from './RuneEvolutionCatalog';

export type { VortexEvolutionPath } from './RuneEvolutionCatalog';
export type { VortexEvolutionStage } from './RuneEvolutionCatalog';

export interface VortexEvolutionSnapshot {
  path: VortexEvolutionPath;
  stage: VortexEvolutionStage;
  qualifiedUses: number;
  nextThreshold: number | null;
  progressToNext: number;
  stageName: string;
}

export interface VortexEvolutionAdvance {
  snapshot: VortexEvolutionSnapshot;
  evolved: boolean;
}

export class VortexEvolutionSystem {
  private readonly path: VortexEvolutionPath;
  private qualifiedUses = 0;
  private stage: VortexEvolutionStage = 0;

  constructor(path: VortexEvolutionPath) {
    this.path = path;
  }

  get snapshot(): VortexEvolutionSnapshot {
    const nextThreshold = this.stage === 0
      ? VORTEX_TIER_ONE_THRESHOLD
      : this.stage === 1
        ? VORTEX_TIER_TWO_THRESHOLD
        : null;
    const previousThreshold = this.stage === 0 ? 0 : VORTEX_TIER_ONE_THRESHOLD;
    const progressToNext = nextThreshold === null
      ? 1
      : Math.min(1, Math.max(0, (this.qualifiedUses - previousThreshold) / (nextThreshold - previousThreshold)));

    return {
      path: this.path,
      stage: this.stage,
      qualifiedUses: this.qualifiedUses,
      nextThreshold,
      progressToNext,
      stageName: getVortexEvolutionStageName(this.path, this.stage),
    };
  }

  registerQualifiedUse(): VortexEvolutionAdvance {
    if (this.stage === 2) return { snapshot: this.snapshot, evolved: false };

    this.qualifiedUses = Math.min(VORTEX_TIER_TWO_THRESHOLD, this.qualifiedUses + 1);
    const previousStage = this.stage;
    if (this.qualifiedUses >= VORTEX_TIER_TWO_THRESHOLD) this.stage = 2;
    else if (this.qualifiedUses >= VORTEX_TIER_ONE_THRESHOLD) this.stage = 1;

    return {
      snapshot: this.snapshot,
      evolved: this.stage !== previousStage,
    };
  }
}
