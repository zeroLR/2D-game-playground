import type { EncounterSequenceDefinition } from '../game/EncounterDirector';
import type { RuneKind } from '../rune/RuneTypes';

export type StageId = 'shattered-gate' | 'prism-wake' | 'null-cathedral';
export type StageContentStatus = 'authored' | 'coming-soon';

export interface StageDefinition {
  id: StageId;
  number: number;
  title: string;
  chapter: string;
  objective: string;
  contentStatus: StageContentStatus;
  durationSeconds: number;
  requiresClear?: readonly StageId[];
  rewardRune?: RuneKind;
  featuredRune?: RuneKind;
  encounterSequence?: EncounterSequenceDefinition;
}

const SHATTERED_GATE_ENCOUNTERS: EncounterSequenceDefinition = {
  intermissionSeconds: 0.7,
  encounters: [
    {
      kind: 'formation',
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
      kind: 'formation',
      id: 'convergence',
      title: 'CONVERGENCE',
      objective: 'Read the drifting clusters, then collapse them into a useful Vortex window.',
      modifiers: [
        { kind: 'drift-field', direction: 'clockwise', turnsPerSecond: 0.014 },
      ],
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
      kind: 'elite',
      id: 'fracture-warden',
      title: 'FRACTURE WARDEN',
      objective: 'Keep Rune influence on the Warden while clearing its relay lattice.',
      elite: {
        title: 'FRACTURE WARDEN',
        trait: 'rune-ward',
      },
      targets: [
        { kind: 'crystal', anchor: { x: 0.24, y: 0.72 } },
        { kind: 'crystal', anchor: { x: 0.34, y: 0.62 } },
        { kind: 'armored', anchor: { x: 0.44, y: 0.52 } },
        { kind: 'crystal', role: 'elite', anchor: { x: 0.50, y: 0.40 } },
        { kind: 'armored', anchor: { x: 0.60, y: 0.48 } },
        { kind: 'crystal', anchor: { x: 0.70, y: 0.32 } },
        { kind: 'crystal', anchor: { x: 0.30, y: 0.34 } },
        { kind: 'crystal', anchor: { x: 0.42, y: 0.28 } },
        { kind: 'crystal', anchor: { x: 0.58, y: 0.66 } },
        { kind: 'crystal', anchor: { x: 0.72, y: 0.64 } },
      ],
    },
    {
      kind: 'boss',
      id: 'fracture-sentinel',
      title: 'FRACTURE SENTINEL',
      objective: 'Break its Ward field, then strike the exposed core.',
      boss: {
        id: 'fracture-sentinel',
        title: 'FRACTURE SENTINEL',
        coreAnchor: { x: 0.50, y: 0.43 },
        coreRadius: 32,
        phases: [
          {
            id: 'aegis-ring',
            title: 'AEGIS RING',
            objective: 'Collapse the Ward ring to expose the core.',
            exposureSeconds: 4,
            wards: [
              { kind: 'crystal', anchor: { x: 0.28, y: 0.26 } },
              { kind: 'crystal', anchor: { x: 0.50, y: 0.20 } },
              { kind: 'crystal', anchor: { x: 0.72, y: 0.26 } },
              { kind: 'crystal', anchor: { x: 0.26, y: 0.58 } },
              { kind: 'crystal', anchor: { x: 0.74, y: 0.58 } },
              { kind: 'armored', anchor: { x: 0.50, y: 0.70 } },
            ],
          },
          {
            id: 'fracture-relay',
            title: 'FRACTURE RELAY',
            objective: 'Break the relay topology, then cash out on the core.',
            exposureSeconds: 3.6,
            wards: [
              { kind: 'crystal', anchor: { x: 0.22, y: 0.70 } },
              { kind: 'crystal', anchor: { x: 0.32, y: 0.59 } },
              { kind: 'armored', anchor: { x: 0.40, y: 0.31 } },
              { kind: 'armored', anchor: { x: 0.60, y: 0.31 } },
              { kind: 'crystal', anchor: { x: 0.68, y: 0.59 } },
              { kind: 'crystal', anchor: { x: 0.78, y: 0.70 } },
            ],
          },
        ],
      },
    },
  ],
};

const PRISM_WAKE_ENCOUNTERS: EncounterSequenceDefinition = {
  intermissionSeconds: 0.7,
  encounters: [
    {
      kind: 'formation',
      id: 'mirror-lanes',
      title: 'MIRROR LANES',
      objective: 'Use Split echoes to pressure both mirrored lanes.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.27, y: 0.24 } },
        { kind: 'crystal', anchor: { x: 0.73, y: 0.24 } },
        { kind: 'crystal', anchor: { x: 0.27, y: 0.42 } },
        { kind: 'crystal', anchor: { x: 0.73, y: 0.42 } },
        { kind: 'armored', anchor: { x: 0.27, y: 0.62 } },
        { kind: 'armored', anchor: { x: 0.73, y: 0.62 } },
        { kind: 'crystal', anchor: { x: 0.40, y: 0.76 } },
        { kind: 'crystal', anchor: { x: 0.60, y: 0.76 } },
      ],
    },
    {
      kind: 'formation',
      id: 'prism-crosscurrent',
      title: 'CROSSCURRENT',
      objective: 'Read the rotating mirror lanes, then cast Split into the crossing window.',
      modifiers: [
        { kind: 'drift-field', direction: 'counterclockwise', turnsPerSecond: 0.012 },
      ],
      targets: [
        { kind: 'crystal', anchor: { x: 0.22, y: 0.34 } },
        { kind: 'crystal', anchor: { x: 0.34, y: 0.26 } },
        { kind: 'crystal', anchor: { x: 0.78, y: 0.34 } },
        { kind: 'crystal', anchor: { x: 0.66, y: 0.26 } },
        { kind: 'armored', anchor: { x: 0.42, y: 0.50 } },
        { kind: 'armored', anchor: { x: 0.58, y: 0.50 } },
        { kind: 'crystal', anchor: { x: 0.28, y: 0.70 } },
        { kind: 'crystal', anchor: { x: 0.72, y: 0.70 } },
      ],
    },
    {
      kind: 'elite',
      id: 'prism-keeper',
      title: 'PRISM KEEPER',
      objective: 'Route a Split or other active Rune impact into the Keeper.',
      elite: {
        title: 'PRISM KEEPER',
        trait: 'rune-ward',
      },
      targets: [
        { kind: 'crystal', anchor: { x: 0.24, y: 0.28 } },
        { kind: 'crystal', anchor: { x: 0.76, y: 0.28 } },
        { kind: 'armored', anchor: { x: 0.34, y: 0.48 } },
        { kind: 'crystal', role: 'elite', anchor: { x: 0.50, y: 0.43 } },
        { kind: 'armored', anchor: { x: 0.66, y: 0.48 } },
        { kind: 'crystal', anchor: { x: 0.30, y: 0.68 } },
        { kind: 'crystal', anchor: { x: 0.70, y: 0.68 } },
      ],
    },
    {
      kind: 'boss',
      id: 'prism-anchor',
      title: 'PRISM ANCHOR',
      objective: 'Split the mirrored Ward structures, then strike the exposed core.',
      boss: {
        id: 'prism-anchor',
        title: 'PRISM ANCHOR',
        coreAnchor: { x: 0.50, y: 0.43 },
        coreRadius: 32,
        phases: [
          {
            id: 'mirror-cage',
            title: 'MIRROR CAGE',
            objective: 'Break the paired Ward lanes to expose the core.',
            exposureSeconds: 4,
            wards: [
              { kind: 'crystal', anchor: { x: 0.26, y: 0.26 } },
              { kind: 'crystal', anchor: { x: 0.74, y: 0.26 } },
              { kind: 'armored', anchor: { x: 0.28, y: 0.55 } },
              { kind: 'armored', anchor: { x: 0.72, y: 0.55 } },
              { kind: 'crystal', anchor: { x: 0.40, y: 0.72 } },
              { kind: 'crystal', anchor: { x: 0.60, y: 0.72 } },
            ],
          },
          {
            id: 'crossed-prism',
            title: 'CROSSED PRISM',
            objective: 'Open both diagonal Ward lanes, then cash out on the core.',
            exposureSeconds: 3.8,
            wards: [
              { kind: 'crystal', anchor: { x: 0.24, y: 0.30 } },
              { kind: 'crystal', anchor: { x: 0.36, y: 0.42 } },
              { kind: 'crystal', anchor: { x: 0.64, y: 0.42 } },
              { kind: 'crystal', anchor: { x: 0.76, y: 0.30 } },
              { kind: 'armored', anchor: { x: 0.36, y: 0.66 } },
              { kind: 'armored', anchor: { x: 0.64, y: 0.66 } },
            ],
          },
        ],
      },
    },
  ],
};

export const STAGES: readonly StageDefinition[] = [
  {
    id: 'shattered-gate',
    number: 1,
    title: 'SHATTERED GATE',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'Learn Vortex control, break the Fracture Warden, and defeat the Sentinel.',
    contentStatus: 'authored',
    durationSeconds: 100,
    rewardRune: 'split',
    featuredRune: 'vortex',
    encounterSequence: SHATTERED_GATE_ENCOUNTERS,
  },
  {
    id: 'prism-wake',
    number: 2,
    title: 'PRISM WAKE',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'Learn Split trajectories across mirrored formations and break the Prism Anchor.',
    contentStatus: 'authored',
    durationSeconds: 100,
    requiresClear: ['shattered-gate'],
    rewardRune: 'chain',
    featuredRune: 'split',
    encounterSequence: PRISM_WAKE_ENCOUNTERS,
  },
  {
    id: 'null-cathedral',
    number: 3,
    title: 'NULL CATHEDRAL',
    chapter: 'CHAPTER I · THE FRACTURE',
    objective: 'A Chain-focused arena built around relay topology and unstable lanes.',
    contentStatus: 'coming-soon',
    durationSeconds: 100,
    requiresClear: ['prism-wake'],
    featuredRune: 'chain',
  },
];

export const DEFAULT_STAGE_ID: StageId = 'shattered-gate';

export function isStageId(value: unknown): value is StageId {
  return value === 'shattered-gate' || value === 'prism-wake' || value === 'null-cathedral';
}

export function getStage(stageId: StageId): StageDefinition {
  const stage = STAGES.find((candidate) => candidate.id === stageId);
  if (!stage) throw new Error(`Unknown Rune Ball stage: ${stageId}`);
  return stage;
}
