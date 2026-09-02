import type { Trait } from '../synthesis/synthesis';

export type BiomeId = 'DATA_FIELD' | 'CRYSTAL_NODE' | 'CORRUPTION_FIELD';

export type RegionInfluence = {
  codexCount: number;
  activeTraits: Trait[];
};

export type RegionDescriptor = {
  id: string;
  index: number;
  startX: number;
  width: number;
  biome: BiomeId;
  signature: number;
  influence: RegionInfluence;
  platformHeights: number[];
};

export type RegionState = {
  generated: RegionDescriptor[];
};

export const BASE_WORLD_WIDTH = 1920;
export const REGION_WIDTH = 640;
export const REGION_REVEAL_DISTANCE = 180;
export const MAX_MVP_GENERATED_REGIONS = 3;

export function createRegionState(generated: RegionDescriptor[] = []): RegionState {
  return { generated: generated.map(cloneRegion) };
}

export function worldExtent(state: RegionState): number {
  return BASE_WORLD_WIDTH + state.generated.length * REGION_WIDTH;
}

export function shouldRevealNextRegion(playerX: number, state: RegionState): boolean {
  if (state.generated.length >= MAX_MVP_GENERATED_REGIONS) return false;
  return playerX >= worldExtent(state) - REGION_REVEAL_DISTANCE;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function chooseBiome(hash: number, traits: Trait[]): BiomeId {
  let dataWeight = 3;
  let crystalWeight = 3;
  let corruptionWeight = 2;
  if (traits.includes('ORGANIC')) dataWeight += 3;
  if (traits.includes('CONDUCTIVE') || traits.includes('REFLECTIVE') || traits.includes('PULSING')) crystalWeight += 3;
  if (traits.includes('HOT') || traits.includes('UNSTABLE')) corruptionWeight += 4;

  const total = dataWeight + crystalWeight + corruptionWeight;
  const roll = hash % total;
  if (roll < dataWeight) return 'DATA_FIELD';
  if (roll < dataWeight + crystalWeight) return 'CRYSTAL_NODE';
  return 'CORRUPTION_FIELD';
}

export function generateNextRegion(
  state: RegionState,
  worldSeed: string,
  influence: RegionInfluence,
): RegionDescriptor | null {
  if (state.generated.length >= MAX_MVP_GENERATED_REGIONS) return null;

  const index = state.generated.length;
  const normalizedTraits = [...new Set(influence.activeTraits)].sort();
  const seed = `${worldSeed}::region::${index}::codex:${influence.codexCount}::traits:${normalizedTraits.join(',')}`;
  const signature = hashSeed(seed);
  const biome = chooseBiome(signature, normalizedTraits);
  const startX = BASE_WORLD_WIDTH + index * REGION_WIDTH;
  const platformHeights = [0, 1, 2].map((offset) => 286 + ((signature >>> (offset * 5)) % 4) * 22);

  const region: RegionDescriptor = {
    id: `${worldSeed}::region::${index}::${signature.toString(16)}`,
    index,
    startX,
    width: REGION_WIDTH,
    biome,
    signature,
    influence: { codexCount: influence.codexCount, activeTraits: normalizedTraits },
    platformHeights,
  };
  state.generated.push(region);
  return cloneRegion(region);
}

export function cloneRegion(region: RegionDescriptor): RegionDescriptor {
  return {
    ...region,
    influence: { codexCount: region.influence.codexCount, activeTraits: [...region.influence.activeTraits] },
    platformHeights: [...region.platformHeights],
  };
}
