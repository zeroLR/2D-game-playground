export type VortexEvolutionPath = 'gravity-well' | 'orbit';
export type VortexEvolutionStage = 0 | 1 | 2;

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

const TIER_ONE_THRESHOLD = 3;
const TIER_TWO_THRESHOLD = 6;

export class VortexEvolutionSystem {
  private readonly path: VortexEvolutionPath;
  private qualifiedUses = 0;
  private stage: VortexEvolutionStage = 0;

  constructor(path: VortexEvolutionPath) {
    this.path = path;
  }

  get snapshot(): VortexEvolutionSnapshot {
    const nextThreshold = this.stage === 0
      ? TIER_ONE_THRESHOLD
      : this.stage === 1
        ? TIER_TWO_THRESHOLD
        : null;
    const previousThreshold = this.stage === 0 ? 0 : TIER_ONE_THRESHOLD;
    const progressToNext = nextThreshold === null
      ? 1
      : Math.min(1, Math.max(0, (this.qualifiedUses - previousThreshold) / (nextThreshold - previousThreshold)));

    return {
      path: this.path,
      stage: this.stage,
      qualifiedUses: this.qualifiedUses,
      nextThreshold,
      progressToNext,
      stageName: this.stageName(),
    };
  }

  registerQualifiedUse(): VortexEvolutionAdvance {
    if (this.stage === 2) return { snapshot: this.snapshot, evolved: false };

    this.qualifiedUses = Math.min(TIER_TWO_THRESHOLD, this.qualifiedUses + 1);
    const previousStage = this.stage;
    if (this.qualifiedUses >= TIER_TWO_THRESHOLD) this.stage = 2;
    else if (this.qualifiedUses >= TIER_ONE_THRESHOLD) this.stage = 1;

    return {
      snapshot: this.snapshot,
      evolved: this.stage !== previousStage,
    };
  }

  private stageName(): string {
    if (this.stage === 0) return 'VORTEX';
    if (this.path === 'gravity-well') return this.stage === 1 ? 'GRAVITY WELL' : 'SINGULARITY';
    return this.stage === 1 ? 'ORBIT' : 'EVENT HORIZON';
  }
}
