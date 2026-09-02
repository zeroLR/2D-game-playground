import type { Trait } from '../synthesis/synthesis';
import type { WorldPressure } from '../world/pressure';
import type { RegionState } from '../world/regions';
import type { RootResource } from '../world/resources';

export type ResourceShift = Record<RootResource, number>;

export type EcologyState = {
  tickIndex: number;
  resourceShift: ResourceShift;
  hostility: number;
  regionStress: Record<string, number>;
  lastSignature: number | null;
};

export type WorldTickDelta = {
  tickIndex: number;
  signature: number;
  resourceShift: ResourceShift;
  hostilityShift: number;
  regionStressDelta: Record<string, number>;
};

const ROOT_RESOURCES: RootResource[] = ['MATTER', 'ENERGY', 'LIFE', 'SIGNAL'];

export function createEcologyState(): EcologyState {
  return {
    tickIndex: 0,
    resourceShift: { MATTER: 0, ENERGY: 0, LIFE: 0, SIGNAL: 0 },
    hostility: 0,
    regionStress: {},
    lastSignature: null,
  };
}

export function cloneEcologyState(state: EcologyState): EcologyState {
  return {
    tickIndex: state.tickIndex,
    resourceShift: { ...state.resourceShift },
    hostility: state.hostility,
    regionStress: { ...state.regionStress },
    lastSignature: state.lastSignature,
  };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function traitCount(pressure: WorldPressure, traits: Trait[]): number {
  return traits.reduce((total, trait) => total + (pressure.traitUsage[trait] ?? 0), 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pressureFingerprint(pressure: WorldPressure): string {
  const traits = Object.entries(pressure.traitUsage)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([trait, count]) => `${trait}:${count}`)
    .join(',');
  return `${ROOT_RESOURCES.map(resource => `${resource}:${pressure.gathered[resource]}`).join('|')}|kills:${pressure.creatureDefeats}|traits:${traits}`;
}

function resourceShiftForTick(pressure: WorldPressure, resource: RootResource, signature: number, offset: number): number {
  const extraction = pressure.gathered[resource];
  const recoveryBase = 2 - Math.floor(extraction / 3);
  const pulse = ((signature >>> offset) & 1) === 0 ? 0 : 1;
  return clamp(recoveryBase + pulse, -2, 2);
}

function stressForRegion(region: RegionState['generated'][number], pressure: WorldPressure): number {
  const nativePressure = region.biome === 'DATA_FIELD'
    ? pressure.gathered.MATTER + pressure.gathered.LIFE
    : region.biome === 'CRYSTAL_NODE'
      ? pressure.gathered.ENERGY + pressure.gathered.SIGNAL
      : Math.floor((pressure.gathered.MATTER + pressure.gathered.ENERGY + pressure.gathered.LIFE + pressure.gathered.SIGNAL) / 2);
  const hostility = pressure.creatureDefeats + traitCount(pressure, ['HOT', 'UNSTABLE']);
  return clamp(Math.floor(nativePressure / 3) + Math.floor(hostility / 2), 0, 9);
}

export function runWorldTick(
  state: EcologyState,
  pressure: WorldPressure,
  regions: RegionState,
  worldSeed: string,
): WorldTickDelta {
  const tickIndex = state.tickIndex + 1;
  const regionIds = regions.generated.map(region => region.id).join(',');
  const signature = hashSeed(`${worldSeed}::tick:${tickIndex}::${pressureFingerprint(pressure)}::regions:${regionIds}`);

  const resourceShift: ResourceShift = {
    MATTER: resourceShiftForTick(pressure, 'MATTER', signature, 0),
    ENERGY: resourceShiftForTick(pressure, 'ENERGY', signature, 3),
    LIFE: resourceShiftForTick(pressure, 'LIFE', signature, 6),
    SIGNAL: resourceShiftForTick(pressure, 'SIGNAL', signature, 9),
  };

  const volatileUsage = traitCount(pressure, ['HOT', 'UNSTABLE']);
  const stabilizingUsage = traitCount(pressure, ['ORGANIC', 'REFLECTIVE']);
  const hostilityShift = clamp(Math.floor(pressure.creatureDefeats / 2) + volatileUsage - Math.floor(stabilizingUsage / 2), -2, 4);
  const regionStressDelta = Object.fromEntries(regions.generated.map(region => [region.id, stressForRegion(region, pressure)]));

  state.tickIndex = tickIndex;
  state.lastSignature = signature;
  state.hostility = clamp(state.hostility + hostilityShift, 0, 12);
  for (const resource of ROOT_RESOURCES) state.resourceShift[resource] = clamp(state.resourceShift[resource] + resourceShift[resource], -6, 6);
  for (const [regionId, delta] of Object.entries(regionStressDelta)) state.regionStress[regionId] = clamp((state.regionStress[regionId] ?? 0) + delta, 0, 12);

  return { tickIndex, signature, resourceShift, hostilityShift, regionStressDelta };
}
