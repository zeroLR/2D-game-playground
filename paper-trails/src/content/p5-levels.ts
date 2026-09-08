import type { LevelDefinition, PageSeed, Rotation } from '../domain/model';
import { DEMO_DEFINITION_REGISTRY } from '../domain/demo-level';

export type RelicPolicy = 'none' | 'optional' | 'required';
export type TutorialCue = 'rotate' | 'swap' | null;

export interface P5Level {
  readonly index: number;
  readonly title: string;
  readonly focus: string;
  readonly allowRotate: boolean;
  readonly allowSwap: boolean;
  readonly relicPolicy: RelicPolicy;
  readonly tutorialCue: TutorialCue;
  readonly level: LevelDefinition;
}

type PageSpec = readonly [
  definitionId: string,
  rotation?: Rotation,
  objective?: 'goal' | 'treasure',
];

function page(index: number, spec: PageSpec): PageSeed {
  const [definitionId, rotation = 0, objective] = spec;
  const row = Math.floor((index - 1) / 3);
  const column = (index - 1) % 3;
  return {
    id: `p${index}`,
    definitionId,
    position: { row, column },
    rotation,
    state: objective ? { objective } : undefined,
  };
}

function level(
  index: number,
  title: string,
  focus: string,
  travelerStartPageId: string,
  specs: readonly PageSpec[],
  options: Pick<P5Level, 'allowRotate' | 'allowSwap' | 'relicPolicy' | 'tutorialCue'>,
): P5Level {
  if (specs.length !== 9) throw new Error(`P5 L${index} must author exactly 9 Pages`);
  return {
    index,
    title,
    focus,
    ...options,
    level: {
      id: `paper-trails-p5-l${index}`,
      width: 3,
      height: 3,
      travelerStartPageId,
      pages: specs.map((spec, offset) => page(offset + 1, spec)),
    },
  };
}

const F: PageSpec = ['forest-path', 0];
const FH: PageSpec = ['forest-path', 90];
const B: PageSpec = ['stone-bridge', 0];
const BH: PageSpec = ['stone-bridge', 90];
const S: PageSpec = ['shrine-seal', 0];
const C: PageSpec = ['crossroads', 0];
const H: PageSpec = ['hidden-grove', 0];

export const P5_LEVELS: readonly P5Level[] = [
  level(
    1,
    'TURN',
    'Rotate one Page to complete the first road.',
    'p7',
    [
      ['ruined-gate', 180, 'goal'], F, B,
      B, F, F,
      ['shrine-seal', 270], B, H,
    ],
    { allowRotate: true, allowSwap: false, relicPolicy: 'none', tutorialCue: 'rotate' },
  ),
  level(
    2,
    'MATCH',
    'Read both edges: two orientations must agree.',
    'p7',
    [
      ['ruined-gate', 180, 'goal'], F, B,
      FH, C, F,
      ['shrine-seal', 270], B, H,
    ],
    { allowRotate: true, allowSwap: false, relicPolicy: 'none', tutorialCue: null },
  ),
  level(
    3,
    'EXCHANGE',
    'The correct connector exists, but in the wrong place.',
    'p7',
    [
      ['ruined-gate', 180, 'goal'], F, B,
      S, B, F,
      S, F, H,
    ],
    { allowRotate: false, allowSwap: true, relicPolicy: 'none', tutorialCue: 'swap' },
  ),
  level(
    4,
    'RESHAPE',
    'Combine rotation and exchange in one route.',
    'p7',
    [
      ['ruined-gate', 180, 'goal'], F, B,
      S, B, F,
      ['shrine-seal', 270], F, H,
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'none', tutorialCue: null },
  ),
  level(
    5,
    'DETOUR',
    'The exit already works. The distant relic asks you to break it.',
    'p5',
    [
      ['ruined-gate', 90, 'goal'], FH, B,
      ['ruined-gate', 0], C, S,
      B, FH, ['hidden-grove', 0, 'treasure'],
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'optional', tutorialCue: null },
  ),
  level(
    6,
    'FORK',
    'A crossroads supports more than one valid solution.',
    'p5',
    [
      ['ruined-gate', 90, 'goal'], ['ruined-gate', 270], F,
      ['ruined-gate', 90], C, F,
      B, S, H,
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'none', tutorialCue: null },
  ),
  level(
    7,
    'SEAL',
    'A reachable gate can still be closed by world state.',
    'p8',
    [
      F, ['ruined-gate', 180, 'goal'], BH,
      FH, C, ['ruined-gate', 180],
      B, S, ['hidden-grove', 0, 'treasure'],
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'required', tutorialCue: null },
  ),
  level(
    8,
    'UNMAKE',
    'Destroy a working road and repurpose its key connector.',
    'p5',
    [
      F, FH, B,
      ['ruined-gate', 0], C, S,
      B, FH, ['ruined-gate', 0, 'goal'],
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'none', tutorialCue: null },
  ),
  level(
    9,
    'RETURN',
    'Open the relic route, then rebuild the world for the sealed exit.',
    'p5',
    [
      ['ruined-gate', 90, 'goal'], FH, B,
      ['ruined-gate', 0], C, S,
      B, FH, ['hidden-grove', 0, 'treasure'],
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'required', tutorialCue: null },
  ),
  level(
    10,
    'MASTERY',
    'All six Page families. No new rule.',
    'p8',
    [
      ['ruined-gate', 90, 'goal'], BH, F,
      FH, C, ['ruined-gate', 0],
      B, ['shrine-seal', 90], ['hidden-grove', 0, 'treasure'],
    ],
    { allowRotate: true, allowSwap: true, relicPolicy: 'required', tutorialCue: null },
  ),
];

export const P5_DEFINITION_REGISTRY = DEMO_DEFINITION_REGISTRY;

export function firstIncompleteLevelIndex(completedLevelIds: readonly string[]): number {
  const index = P5_LEVELS.findIndex((entry) => !completedLevelIds.includes(entry.level.id));
  return index === -1 ? P5_LEVELS.length - 1 : index;
}

export function hasNextLevel(index: number): boolean {
  return index >= 0 && index < P5_LEVELS.length - 1;
}

export function levelAt(index: number): P5Level {
  const entry = P5_LEVELS[index];
  if (!entry) throw new Error(`Unknown P5 level index: ${index}`);
  return entry;
}

export function treasureRequired(entry: P5Level): boolean {
  return entry.relicPolicy === 'required';
}

export function treasureExists(entry: P5Level): boolean {
  return entry.relicPolicy !== 'none';
}

export function validateP5LevelSet(): readonly string[] {
  const errors: string[] = [];
  if (P5_LEVELS.length !== 10) errors.push(`Expected 10 levels, got ${P5_LEVELS.length}`);

  for (const entry of P5_LEVELS) {
    const ids = new Set(entry.level.pages.map((candidate) => candidate.id));
    if (entry.level.width !== 3 || entry.level.height !== 3) errors.push(`L${entry.index}: board must be 3×3`);
    if (entry.level.pages.length !== 9 || ids.size !== 9) errors.push(`L${entry.index}: Pages must contain 9 unique IDs`);
    if (!ids.has(entry.level.travelerStartPageId)) errors.push(`L${entry.index}: traveler start is missing`);

    const goals = entry.level.pages.filter((candidate) => candidate.state?.objective === 'goal');
    const treasures = entry.level.pages.filter((candidate) => candidate.state?.objective === 'treasure');
    if (goals.length !== 1) errors.push(`L${entry.index}: expected exactly one goal`);
    if (entry.relicPolicy === 'none' && treasures.length !== 0) errors.push(`L${entry.index}: unexpected relic`);
    if (entry.relicPolicy !== 'none' && treasures.length !== 1) errors.push(`L${entry.index}: expected exactly one relic`);

    for (const candidate of entry.level.pages) {
      if (!P5_DEFINITION_REGISTRY.has(candidate.definitionId)) {
        errors.push(`L${entry.index}: unknown Page definition ${candidate.definitionId}`);
      }
    }
  }

  return errors;
}
