export type StageId = 'shattered-gate' | 'prism-wake' | 'null-cathedral';

export interface StageDefinition {
  id: StageId;
  number: number;
  title: string;
  chapter: string;
  objective: string;
  status: 'available' | 'locked';
  durationSeconds: number;
}

export const STAGES: readonly StageDefinition[] = [
  {
    id: 'shattered-gate',
    number: 1,
    title: 'SHATTERED GATE',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'Break as many crystals as possible before the field collapses.',
    status: 'available',
    durationSeconds: 75,
  },
  {
    id: 'prism-wake',
    number: 2,
    title: 'PRISM WAKE',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'A denser formation built around split trajectories.',
    status: 'locked',
    durationSeconds: 75,
  },
  {
    id: 'null-cathedral',
    number: 3,
    title: 'NULL CATHEDRAL',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'A chain-heavy arena with unstable crystal lanes.',
    status: 'locked',
    durationSeconds: 75,
  },
];

export const DEFAULT_STAGE_ID: StageId = 'shattered-gate';

export function getStage(stageId: StageId): StageDefinition {
  const stage = STAGES.find((candidate) => candidate.id === stageId);
  if (!stage) throw new Error(`Unknown Rune Ball stage: ${stageId}`);
  return stage;
}
