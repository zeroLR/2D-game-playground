import {
  CHAIN_TIER_ONE_THRESHOLD,
  CHAIN_TIER_TWO_THRESHOLD,
  getChainEvolutionStageName,
  type ChainEvolutionPath,
  type ChainEvolutionStage,
} from './RuneEvolutionCatalog';

export type { ChainEvolutionPath } from './RuneEvolutionCatalog';
export type { ChainEvolutionStage } from './RuneEvolutionCatalog';

export interface ChainEvolutionSnapshot {
  path: ChainEvolutionPath;
  stage: ChainEvolutionStage;
  qualifiedUses: number;
  nextThreshold: number | null;
  progressToNext: number;
  stageName: string;
}

export interface ChainEvolutionAdvance {
  snapshot: ChainEvolutionSnapshot;
  evolved: boolean;
}

export class ChainEvolutionSystem {
  private readonly path: ChainEvolutionPath;
  private qualifiedUses = 0;
  private stage: ChainEvolutionStage = 0;

  constructor(path: ChainEvolutionPath) {
    this.path = path;
  }

  get snapshot(): ChainEvolutionSnapshot {
    const nextThreshold = this.stage === 0
      ? CHAIN_TIER_ONE_THRESHOLD
      : this.stage === 1
        ? CHAIN_TIER_TWO_THRESHOLD
        : null;
    const previousThreshold = this.stage === 0 ? 0 : CHAIN_TIER_ONE_THRESHOLD;
    const progressToNext = nextThreshold === null
      ? 1
      : Math.min(1, Math.max(0, (this.qualifiedUses - previousThreshold) / (nextThreshold - previousThreshold)));

    return {
      path: this.path,
      stage: this.stage,
      qualifiedUses: this.qualifiedUses,
      nextThreshold,
      progressToNext,
      stageName: getChainEvolutionStageName(this.path, this.stage),
    };
  }

  registerQualifiedUse(): ChainEvolutionAdvance {
    if (this.stage === 2) return { snapshot: this.snapshot, evolved: false };

    this.qualifiedUses = Math.min(CHAIN_TIER_TWO_THRESHOLD, this.qualifiedUses + 1);
    const previousStage = this.stage;
    if (this.qualifiedUses >= CHAIN_TIER_TWO_THRESHOLD) this.stage = 2;
    else if (this.qualifiedUses >= CHAIN_TIER_ONE_THRESHOLD) this.stage = 1;

    return {
      snapshot: this.snapshot,
      evolved: this.stage !== previousStage,
    };
  }
}
