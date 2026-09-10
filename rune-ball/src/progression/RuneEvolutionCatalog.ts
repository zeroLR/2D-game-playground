export type RuneTreeId = 'vortex' | 'split' | 'chain';
export type VortexEvolutionPath = 'gravity-well' | 'orbit';
export type VortexEvolutionStage = 0 | 1 | 2;
export type VortexEvolutionTier = 1 | 2;

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

export const VORTEX_TIER_ONE_THRESHOLD = 3;
export const VORTEX_TIER_TWO_THRESHOLD = 6;

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
    description: 'Create temporary attack echoes that fan the core impact into multiple trajectories.',
    playPattern: 'Multiply lanes → widen pressure',
    evolutionStatus: 'future',
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

export const RUNE_TREE_ORDER: readonly RuneTreeId[] = ['vortex', 'split', 'chain'];
export const VORTEX_PATH_ORDER: readonly VortexEvolutionPath[] = ['gravity-well', 'orbit'];

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
