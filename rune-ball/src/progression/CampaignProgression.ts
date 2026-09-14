import { DEFAULT_STAGE_ID, STAGES, getStage, isStageId, type StageId } from '../content/StageCatalog';
import type { RuneKind } from '../rune/RuneTypes';

export type StageProgressState = 'locked' | 'available' | 'cleared' | 'coming-soon';

export interface StageProgressEntry {
  id: StageId;
  state: StageProgressState;
  rewardRune: RuneKind | null;
  featuredRune: RuneKind | null;
}

export interface CampaignProgressionSnapshot {
  clearedStageIds: StageId[];
  unlockedRunes: RuneKind[];
  continueStageId: StageId;
  stages: StageProgressEntry[];
}

export interface StageCompletionResult {
  newlyCleared: boolean;
  unlockedRune: RuneKind | null;
  nextStageId: StageId | null;
  snapshot: CampaignProgressionSnapshot;
}

const BASE_UNLOCKED_RUNES: readonly RuneKind[] = ['vortex'];
const RUNE_ORDER: readonly RuneKind[] = ['vortex', 'split', 'chain'];

export class CampaignProgression {
  private readonly cleared = new Set<StageId>();

  constructor(clearedStageIds: readonly StageId[] = []) {
    for (const stageId of clearedStageIds) {
      if (isStageId(stageId)) this.cleared.add(stageId);
    }
  }

  get snapshot(): CampaignProgressionSnapshot {
    return {
      clearedStageIds: STAGES.filter((stage) => this.cleared.has(stage.id)).map((stage) => stage.id),
      unlockedRunes: this.unlockedRunes(),
      continueStageId: this.continueStageId(),
      stages: STAGES.map((stage) => ({
        id: stage.id,
        state: this.stageState(stage.id),
        rewardRune: stage.rewardRune ?? null,
        featuredRune: stage.featuredRune ?? null,
      })),
    };
  }

  stageState(stageId: StageId): StageProgressState {
    const stage = getStage(stageId);
    if (stage.contentStatus === 'coming-soon') return 'coming-soon';
    if (this.cleared.has(stageId)) return 'cleared';
    const requirements = stage.requiresClear ?? [];
    return requirements.every((requiredId) => this.cleared.has(requiredId)) ? 'available' : 'locked';
  }

  isRuneUnlocked(rune: RuneKind): boolean {
    return this.unlockedRunes().includes(rune);
  }

  completeStage(stageId: StageId): StageCompletionResult {
    const stage = getStage(stageId);
    const state = this.stageState(stageId);
    if (stage.contentStatus !== 'authored' || (state !== 'available' && state !== 'cleared')) {
      throw new Error(`Stage ${stageId} cannot be completed from progression state ${state}.`);
    }

    const newlyCleared = !this.cleared.has(stageId);
    this.cleared.add(stageId);
    const unlockedRune = newlyCleared ? stage.rewardRune ?? null : null;
    const nextStageId = this.nextAvailableUnclearedStageId();

    return {
      newlyCleared,
      unlockedRune,
      nextStageId,
      snapshot: this.snapshot,
    };
  }

  private unlockedRunes(): RuneKind[] {
    const unlocked = new Set<RuneKind>(BASE_UNLOCKED_RUNES);
    for (const stage of STAGES) {
      if (this.cleared.has(stage.id) && stage.rewardRune) unlocked.add(stage.rewardRune);
    }
    return RUNE_ORDER.filter((rune) => unlocked.has(rune));
  }

  private nextAvailableUnclearedStageId(): StageId | null {
    const next = STAGES.find((stage) => this.stageState(stage.id) === 'available');
    return next?.id ?? null;
  }

  private continueStageId(): StageId {
    const next = this.nextAvailableUnclearedStageId();
    if (next) return next;
    const latestCleared = [...STAGES].reverse().find((stage) => this.cleared.has(stage.id) && stage.contentStatus === 'authored');
    return latestCleared?.id ?? DEFAULT_STAGE_ID;
  }
}
