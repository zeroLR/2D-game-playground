import type { EncounterSequenceDefinition } from '../game/EncounterDirector';

export type StageId = 'shattered-gate' | 'prism-wake' | 'null-cathedral';

export interface StageDefinition {
  id: StageId;
  number: number;
  title: string;
  chapter: string;
  objective: string;
  status: 'available' | 'locked';
  durationSeconds: number;
  encounterSequence?: EncounterSequenceDefinition;
}

const SHATTERED_GATE_ENCOUNTERS: EncounterSequenceDefinition = {
  intermissionSeconds: 0.7,
  encounters: [
    {
      id: 'opening-vector',
      title: 'OPENING VECTOR',
      objective: 'Read the rebound lanes and clear the formation.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.18, y: 0.24 } },
        { kind: 'crystal', anchor: { x: 0.82, y: 0.24 } },
        { kind: 'crystal', anchor: { x: 0.24, y: 0.48 } },
        { kind: 'crystal', anchor: { x: 0.76, y: 0.48 } },
        { kind: 'crystal', anchor: { x: 0.34, y: 0.76 } },
        { kind: 'crystal', anchor: { x: 0.66, y: 0.76 } },
      ],
    },
    {
      id: 'convergence',
      title: 'CONVERGENCE',
      objective: 'Collapse the side clusters into a useful Split window.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.24, y: 0.32 } },
        { kind: 'crystal', anchor: { x: 0.30, y: 0.43 } },
        { kind: 'crystal', anchor: { x: 0.24, y: 0.54 } },
        { kind: 'crystal', anchor: { x: 0.76, y: 0.32 } },
        { kind: 'crystal', anchor: { x: 0.70, y: 0.43 } },
        { kind: 'crystal', anchor: { x: 0.76, y: 0.54 } },
        { kind: 'armored', anchor: { x: 0.50, y: 0.35 } },
        { kind: 'crystal', anchor: { x: 0.50, y: 0.60 } },
      ],
    },
    {
      id: 'relay-array',
      title: 'RELAY ARRAY',
      objective: 'Find a strong Chain origin and clear the armored relay.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.24, y: 0.72 } },
        { kind: 'crystal', anchor: { x: 0.34, y: 0.62 } },
        { kind: 'armored', anchor: { x: 0.44, y: 0.52 } },
        { kind: 'crystal', anchor: { x: 0.54, y: 0.42 } },
        { kind: 'armored', anchor: { x: 0.64, y: 0.32 } },
        { kind: 'crystal', anchor: { x: 0.74, y: 0.22 } },
        { kind: 'crystal', anchor: { x: 0.30, y: 0.34 } },
        { kind: 'crystal', anchor: { x: 0.42, y: 0.30 } },
        { kind: 'crystal', anchor: { x: 0.58, y: 0.66 } },
        { kind: 'crystal', anchor: { x: 0.70, y: 0.62 } },
      ],
    },
  ],
};

export const STAGES: readonly StageDefinition[] = [
  {
    id: 'shattered-gate',
    number: 1,
    title: 'SHATTERED GATE',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'Clear three authored formations before the field collapses.',
    status: 'available',
    durationSeconds: 75,
    encounterSequence: SHATTERED_GATE_ENCOUNTERS,
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
