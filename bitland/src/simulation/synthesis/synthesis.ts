import { canonicalPairKey, discoverySeed } from '../seed';
import type { Inventory, RootResource } from '../world/resources';

export type Trait = 'HEAVY' | 'LIGHTWEIGHT' | 'HOT' | 'REFLECTIVE' | 'ORGANIC' | 'PULSING' | 'CONDUCTIVE' | 'UNSTABLE';

export type Discovery = {
  id: string;
  pairKey: string;
  discoveryIndex: number;
  displayName: string;
  traits: Trait[];
};

export type SynthesisState = {
  discoveriesByPair: Record<string, Discovery[]>;
  lastDiscovery: Discovery | null;
};

export const MAX_NOVEL_DISCOVERIES_PER_PAIR = 3;

const TRAITS: Trait[] = ['HEAVY', 'LIGHTWEIGHT', 'HOT', 'REFLECTIVE', 'ORGANIC', 'PULSING', 'CONDUCTIVE', 'UNSTABLE'];

const NAME_PARTS = ['Node', 'Shard', 'Core', 'Relay', 'Bloom', 'Prism', 'Shell', 'Beacon'];

export function createSynthesisState(): SynthesisState {
  return { discoveriesByPair: {}, lastDiscovery: null };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function consume(inventory: Inventory, resource: RootResource): boolean {
  if (inventory[resource] <= 0) return false;
  inventory[resource] -= 1;
  return true;
}

export function availablePairs(inventory: Inventory): Array<[RootResource, RootResource]> {
  const resources = (Object.keys(inventory) as RootResource[]).filter(resource => inventory[resource] > 0);
  const pairs: Array<[RootResource, RootResource]> = [];
  for (let i = 0; i < resources.length; i += 1) {
    for (let j = i + 1; j < resources.length; j += 1) pairs.push([resources[i], resources[j]]);
  }
  return pairs;
}

export function synthesize(
  state: SynthesisState,
  inventory: Inventory,
  worldSeed: string,
  inputA: RootResource,
  inputB: RootResource,
): Discovery | null {
  if (inputA === inputB || inventory[inputA] <= 0 || inventory[inputB] <= 0) return null;

  const pairKey = canonicalPairKey(inputA, inputB);
  const pool = state.discoveriesByPair[pairKey] ?? [];
  const discoveryIndex = Math.min(pool.length, MAX_NOVEL_DISCOVERIES_PER_PAIR - 1);

  if (!consume(inventory, inputA) || !consume(inventory, inputB)) return null;

  if (pool.length >= MAX_NOVEL_DISCOVERIES_PER_PAIR) {
    const seed = discoverySeed(worldSeed, inputA, inputB, pool.length);
    const existing = pool[hashSeed(seed) % pool.length];
    state.lastDiscovery = existing;
    return existing;
  }

  const seed = discoverySeed(worldSeed, inputA, inputB, discoveryIndex);
  const hash = hashSeed(seed);
  const primary = TRAITS[hash % TRAITS.length];
  let secondary = TRAITS[(hash >>> 5) % TRAITS.length];
  if (secondary === primary) secondary = TRAITS[(TRAITS.indexOf(primary) + 1) % TRAITS.length];
  const discovery: Discovery = {
    id: seed,
    pairKey,
    discoveryIndex,
    displayName: `${inputA.slice(0, 3)}-${inputB.slice(0, 3)} ${NAME_PARTS[(hash >>> 9) % NAME_PARTS.length]}`,
    traits: [primary, secondary],
  };
  state.discoveriesByPair[pairKey] = [...pool, discovery];
  state.lastDiscovery = discovery;
  return discovery;
}
