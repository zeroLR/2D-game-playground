export type RuneTreeId = 'vortex' | 'split' | 'chain';
export type VortexEvolutionPath = 'gravity-well' | 'orbit';
export type VortexEvolutionStage = 0 | 1 | 2;
export type VortexEvolutionTier = 1 | 2;
export type SplitEvolutionPath = 'prism' | 'lance';
export type SplitEvolutionStage = 0 | 1 | 2;
export type SplitEvolutionTier = 1 | 2;

export interface RuneBaseDefinition {
  id: RuneTreeId;
  glyph: string;
  name: string;
  role: string;
  description: string;
  playPattern: string;
  evolutionStatus: 'authored' | 'future';
}

export interface VortexEvolutionNodeDefinition {
  id: string;
  tier: VortexEvolutionTier;
  name: string;
  threshold: number;
  description: string;
  playPattern: string;
}

export interface VortexEvolutionPathDefinition {
  id: VortexEvolutionPath;
  title: string;
  identity: string;
  summary: string;
  tierOne: VortexEvolutionNodeDefinition;
  tierTwo: VortexEvolutionNodeDefinition;
}

export interface SplitEvolutionNodeDefinition {
  id: string;
  tier: SplitEvolutionTier;
  name: string;
  threshold: number;
  description: string;
  playPattern: string;
}

export interface SplitEvolutionPathDefinition {
  id: SplitEvolutionPath;
  title: string;
  identity: string;
  summary: string;
  tierOne: SplitEvolutionNodeDefinition;
  tierTwo: SplitEvolutionNodeDefinition;
}

export const VORTEX_TIER_ONE_THRESHOLD = 3;
export const VORTEX_TIER_TWO_THRESHOLD = 6;
export const SPLIT_TIER_ONE_THRESHOLD = 3;
export const SPLIT_TIER_TWO_THRESHOLD = 6;

export const RUNE_BASE_DEFINITIONS: Readonly<Record<RuneTreeId, RuneBaseDefinition>> = {
  vortex: {
    id: 'vortex',
    glyph: '○',
    name: 'VORTEX',
    role: 'SETUP / CONTROL',
    description: 'Pull nearby targets toward a useful impact zone.',
    playPattern: 'Gather → reposition → create the next break window',
    evolutionStatus: 'authored',
  },
  split: {
    id: 'split',
    glyph: 'V',
    name: 'SPLIT',
    role: 'TRAJECTORY / ECHO',
    description: 'Create temporary attack echoes that reshape the core impact into multiple attack lanes.',
    playPattern: 'Multiply lanes → reshape attack space',
    evolutionStatus: 'authored',
  },
  chain: {
    id: 'chain',
    glyph: 'Z',
    name: 'CHAIN',
    role: 'PROPAGATION / PAYOFF',
    description: 'Arm the next impact so destruction propagates across nearby targets.',
    playPattern: 'Prime impact → propagate the break',
    evolutionStatus: 'future',
  },
};

export const VORTEX_EVOLUTION_PATHS: Readonly<Record<VortexEvolutionPath, VortexEvolutionPathDefinition>> = {
  'gravity-well': {
    id: 'gravity-well',
    title: 'GRAVITY',
    identity: 'CLUSTER / COLLAPSE',
    summary: 'Gather targets harder, then cash the cluster into a collapse payoff.',
    tierOne: {
      id: 'gravity-well',
      tier: 1,
      name: 'GRAVITY WELL',
      threshold: VORTEX_TIER_ONE_THRESHOLD,
      description: 'The field becomes larger, lasts longer, and pulls targets inward more strongly.',
      playPattern: 'Gather → compress → line up the core',
    },
    tierTwo: {
      id: 'singularity',
      tier: 2,
      name: 'SINGULARITY',
      threshold: VORTEX_TIER_TWO_THRESHOLD,
      description: 'The stronger Gravity Well ends every evolved Vortex with a collapse pulse.',
      playPattern: 'Gather → collapse → chain payoff',
    },
  },
  orbit: {
    id: 'orbit',
    title: 'ORBIT',
    identity: 'CAPTURE / CONTROL',
    summary: 'Capture targets into orbital motion and hold a longer setup window.',
    tierOne: {
      id: 'orbit',
      tier: 1,
      name: 'ORBIT',
      threshold: VORTEX_TIER_ONE_THRESHOLD,
      description: 'Targets gain tangential motion while the Vortex continues pulling them inward.',
      playPattern: 'Capture → orbit → redirect',
    },
    tierTwo: {
      id: 'event-horizon',
      tier: 2,
      name: 'EVENT HORIZON',
      threshold: VORTEX_TIER_TWO_THRESHOLD,
      description: 'The orbital control field becomes larger, longer-lived, and stronger.',
      playPattern: 'Capture → sustain → release',
    },
  },
};

export const SPLIT_EVOLUTION_PATHS: Readonly<Record<SplitEvolutionPath, SplitEvolutionPathDefinition>> = {
  prism: {
    id: 'prism',
    title: 'PRISM',
    identity: 'COVERAGE / SPREAD',
    summary: 'Fan Split echoes outward so one core trajectory pressures a much wider slice of the arena.',
    tierOne: {
      id: 'refraction',
      tier: 1,
      name: 'REFRACTION',
      threshold: SPLIT_TIER_ONE_THRESHOLD,
      description: 'Split unfolds into four offset echoes that cover a wider attack fan.',
      playPattern: 'Fan → cover → catch side targets',
    },
    tierTwo: {
      id: 'aurora-prism',
      tier: 2,
      name: 'AURORA PRISM',
      threshold: SPLIT_TIER_TWO_THRESHOLD,
      description: 'The fan expands into six echoes, turning the moving core into a broad sweep across the arena.',
      playPattern: 'Spread → sweep → multiply breaks',
    },
  },
  lance: {
    id: 'lance',
    title: 'LANCE',
    identity: 'FOCUS / PIERCE',
    summary: 'Collapse Split echoes onto the travel axis and trade coverage for deliberate forward reach.',
    tierOne: {
      id: 'convergence',
      tier: 1,
      name: 'CONVERGENCE',
      threshold: SPLIT_TIER_ONE_THRESHOLD,
      description: 'Split echoes converge near the forward axis and extend the core impact ahead of the ball.',
      playPattern: 'Align → focus → pierce',
    },
    tierTwo: {
      id: 'void-lance',
      tier: 2,
      name: 'VOID LANCE',
      threshold: SPLIT_TIER_TWO_THRESHOLD,
      description: 'A longer forward echo column turns precise ball direction into a sustained piercing pressure line.',
      playPattern: 'Aim → pierce → drive through',
    },
  },
};

export const RUNE_TREE_ORDER: readonly RuneTreeId[] = ['vortex', 'split', 'chain'];
export const VORTEX_PATH_ORDER: readonly VortexEvolutionPath[] = ['gravity-well', 'orbit'];
export const SPLIT_PATH_ORDER: readonly SplitEvolutionPath[] = ['prism', 'lance'];

export function getRuneBaseDefinition(id: RuneTreeId): RuneBaseDefinition {
  return RUNE_BASE_DEFINITIONS[id];
}

export function getVortexPathDefinition(path: VortexEvolutionPath): VortexEvolutionPathDefinition {
  return VORTEX_EVOLUTION_PATHS[path];
}

export function getVortexEvolutionNode(
  path: VortexEvolutionPath,
  tier: VortexEvolutionTier,
): VortexEvolutionNodeDefinition {
  const definition = getVortexPathDefinition(path);
  return tier === 1 ? definition.tierOne : definition.tierTwo;
}

export function getVortexEvolutionStageName(
  path: VortexEvolutionPath,
  stage: VortexEvolutionStage,
): string {
  if (stage === 0) return RUNE_BASE_DEFINITIONS.vortex.name;
  return getVortexEvolutionNode(path, stage).name;
}

export function getSplitPathDefinition(path: SplitEvolutionPath): SplitEvolutionPathDefinition {
  return SPLIT_EVOLUTION_PATHS[path];
}

export function getSplitEvolutionNode(
  path: SplitEvolutionPath,
  tier: SplitEvolutionTier,
): SplitEvolutionNodeDefinition {
  const definition = getSplitPathDefinition(path);
  return tier === 1 ? definition.tierOne : definition.tierTwo;
}

export function getSplitEvolutionStageName(
  path: SplitEvolutionPath,
  stage: SplitEvolutionStage,
): string {
  if (stage === 0) return RUNE_BASE_DEFINITIONS.split.name;
  return getSplitEvolutionNode(path, stage).name;
}
