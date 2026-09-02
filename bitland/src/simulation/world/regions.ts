import type { Trait } from '../synthesis/synthesis';
import { cloneWorldPressure, createWorldPressure, traitUsageCount, type WorldPressure } from './pressure';
import type { RootResource } from './resources';

export type BiomeId = 'DATA_FIELD' | 'CRYSTAL_NODE' | 'CORRUPTION_FIELD';
export type EncounterPressure = 'LOW' | 'MEDIUM' | 'HIGH';

export type RegionInfluence = {
  codexCount: number;
  activeTraits: Trait[];
  pressure?: WorldPressure;
};

export type RegionDescriptor = {
  id: string;
  index: number;
  startX: number;
  width: number;
  biome: BiomeId;
  signature: number;
  influence: RegionInfluence;
  resourceBias: RootResource;
  encounterPressure: EncounterPressure;
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

function normalizedPressure(input?: WorldPressure): WorldPressure {
  return input ? cloneWorldPressure(input) : createWorldPressure();
}

function chooseBiome(hash: number, traits: Trait[], pressure: WorldPressure): BiomeId {
  let dataWeight = 4;
  let crystalWeight = 4;
  let corruptionWeight = 2;

  const dataHarvest = pressure.gathered.MATTER + pressure.gathered.LIFE;
  const crystalHarvest = pressure.gathered.ENERGY + pressure.gathered.SIGNAL;
  dataWeight = Math.max(1, dataWeight - Math.floor(dataHarvest / 3));
  crystalWeight = Math.max(1, crystalWeight - Math.floor(crystalHarvest / 3));
  corruptionWeight += Math.floor((dataHarvest + crystalHarvest) / 5) + Math.floor(pressure.creatureDefeats / 2);

  if (traits.includes('ORGANIC')) dataWeight += 2;
  if (traits.includes('CONDUCTIVE') || traits.includes('REFLECTIVE') || traits.includes('PULSING')) crystalWeight += 2;
  if (traits.includes('HOT') || traits.includes('UNSTABLE')) corruptionWeight += 3;

  dataWeight += traitUsageCount(pressure, ['ORGANIC']);
  crystalWeight += traitUsageCount(pressure, ['CONDUCTIVE', 'REFLECTIVE', 'PULSING']);
  corruptionWeight += traitUsageCount(pressure, ['HOT', 'UNSTABLE']);

  const total = dataWeight + crystalWeight + corruptionWeight;
  const roll = hash % total;
  if (roll < dataWeight) return 'DATA_FIELD';
  if (roll < dataWeight + crystalWeight) return 'CRYSTAL_NODE';
  return 'CORRUPTION_FIELD';
}

function nativeResources(biome: BiomeId): [RootResource, RootResource] {
  if (biome === 'DATA_FIELD') return ['MATTER', 'LIFE'];
  if (biome === 'CRYSTAL_NODE') return ['SIGNAL', 'ENERGY'];
  return ['ENERGY', 'MATTER'];
}

function chooseResourceBias(biome: BiomeId, pressure: WorldPressure, hash: number): RootResource {
  const [a, b] = nativeResources(biome);
  const aPressure = pressure.gathered[a];
  const bPressure = pressure.gathered[b];
  if (aPressure === bPressure) return hash % 2 === 0 ? a : b;
  return aPressure < bPressure ? a : b;
}

function chooseEncounterPressure(pressure: WorldPressure, traits: Trait[]): EncounterPressure {
  const hostileScore = pressure.creatureDefeats + traitUsageCount(pressure, ['HOT', 'UNSTABLE']) + (traits.includes('UNSTABLE') ? 2 : 0);
  if (hostileScore >= 6) return 'HIGH';
  if (hostileScore >= 3) return 'MEDIUM';
  return 'LOW';
}

function pressureSeed(pressure: WorldPressure): string {
  const traitPairs = Object.entries(pressure.traitUsage).sort(([a], [b]) => a.localeCompare(b));
  return [
    `g:${pressure.gathered.MATTER},${pressure.gathered.ENERGY},${pressure.gathered.LIFE},${pressure.gathered.SIGNAL}`,
    `k:${pressure.creatureDefeats}`,
    `t:${traitPairs.map(([trait, count]) => `${trait}:${count}`).join(',')}`,
  ].join('::');
}

export function generateNextRegion(
  state: RegionState,
  worldSeed: string,
  influence: RegionInfluence,
): RegionDescriptor | null {
  if (state.generated.length >= MAX_MVP_GENERATED_REGIONS) return null;

  const index = state.generated.length;
  const normalizedTraits = [...new Set(influence.activeTraits)].sort();
  const pressure = normalizedPressure(influence.pressure);
  const seed = `${worldSeed}::region::${index}::codex:${influence.codexCount}::traits:${normalizedTraits.join(',')}::${pressureSeed(pressure)}`;
  const signature = hashSeed(seed);
  const biome = chooseBiome(signature, normalizedTraits, pressure);
  const startX = BASE_WORLD_WIDTH + index * REGION_WIDTH;
  const platformHeights = [0, 1, 2].map((offset) => 286 + ((signature >>> (offset * 5)) % 4) * 22);

  const region: RegionDescriptor = {
    id: `${worldSeed}::region::${index}::${signature.toString(16)}`,
    index,
    startX,
    width: REGION_WIDTH,
    biome,
    signature,
    influence: { codexCount: influence.codexCount, activeTraits: normalizedTraits, pressure },
    resourceBias: chooseResourceBias(biome, pressure, signature >>> 8),
    encounterPressure: chooseEncounterPressure(pressure, normalizedTraits),
    platformHeights,
  };
  state.generated.push(region);
  return cloneRegion(region);
}

function fallbackResourceBias(biome: BiomeId): RootResource {
  return nativeResources(biome)[0];
}

export function cloneRegion(region: RegionDescriptor): RegionDescriptor {
  return {
    ...region,
    influence: {
      codexCount: region.influence.codexCount,
      activeTraits: [...region.influence.activeTraits],
      pressure: normalizedPressure(region.influence.pressure),
    },
    resourceBias: region.resourceBias ?? fallbackResourceBias(region.biome),
    encounterPressure: region.encounterPressure ?? 'LOW',
    platformHeights: [...region.platformHeights],
  };
}
