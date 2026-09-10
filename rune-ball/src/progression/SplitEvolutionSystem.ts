import {
  SPLIT_TIER_ONE_THRESHOLD,
  SPLIT_TIER_TWO_THRESHOLD,
  getSplitEvolutionStageName,
  type SplitEvolutionPath,
  type SplitEvolutionStage,
} from './RuneEvolutionCatalog';

export type { SplitEvolutionPath } from './RuneEvolutionCatalog';
export type { SplitEvolutionStage } from './RuneEvolutionCatalog';

export interface SplitEvolutionSnapshot {
  path: SplitEvolutionPath;
  stage: SplitEvolutionStage;
  qualifiedUses: number;
  nextThreshold: number | null;
  progressToNext: number;
  stageName: string;
}

export interface SplitEvolutionAdvance {
  snapshot: SplitEvolutionSnapshot;
  evolved: boolean;
}

export class SplitEvolutionSystem {
  private readonly path: SplitEvolutionPath;
  private qualifiedUses = 0;
  private stage: SplitEvolutionStage = 0;

  constructor(path: SplitEvolutionPath) {
    this.path = path;
  }

  get snapshot(): SplitEvolutionSnapshot {
    const nextThreshold = this.stage === 0
      ? SPLIT_TIER_ONE_THRESHOLD
      : this.stage === 1
        ? SPLIT_TIER_TWO_THRESHOLD
        : null;
    const previousThreshold = this.stage === 0 ? 0 : SPLIT_TIER_ONE_THRESHOLD;
    const progressToNext = nextThreshold === null
      ? 1
      : Math.min(1, Math.max(0, (this.qualifiedUses - previousThreshold) / (nextThreshold - previousThreshold)));

    return {
      path: this.path,
      stage: this.stage,
      qualifiedUses: this.qualifiedUses,
      nextThreshold,
      progressToNext,
      stageName: getSplitEvolutionStageName(this.path, this.stage),
    };
  }

  registerQualifiedUse(): SplitEvolutionAdvance {
    if (this.stage === 2) return { snapshot: this.snapshot, evolved: false };

    this.qualifiedUses = Math.min(SPLIT_TIER_TWO_THRESHOLD, this.qualifiedUses + 1);
    const previousStage = this.stage;
    if (this.qualifiedUses >= SPLIT_TIER_TWO_THRESHOLD) this.stage = 2;
    else if (this.qualifiedUses >= SPLIT_TIER_ONE_THRESHOLD) this.stage = 1;

    return {
      snapshot: this.snapshot,
      evolved: this.stage !== previousStage,
    };
  }
}
