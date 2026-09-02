import type { Trait } from '../synthesis/synthesis';
import type { RootResource } from './resources';

export type ResourcePressure = Record<RootResource, number>;
export type TraitUsage = Partial<Record<Trait, number>>;

export type WorldPressure = {
  gathered: ResourcePressure;
  creatureDefeats: number;
  traitUsage: TraitUsage;
};

export function createWorldPressure(): WorldPressure {
  return {
    gathered: { MATTER: 0, ENERGY: 0, LIFE: 0, SIGNAL: 0 },
    creatureDefeats: 0,
    traitUsage: {},
  };
}

export function cloneWorldPressure(pressure: WorldPressure): WorldPressure {
  return {
    gathered: { ...pressure.gathered },
    creatureDefeats: pressure.creatureDefeats,
    traitUsage: { ...pressure.traitUsage },
  };
}

export function recordGatherPressure(pressure: WorldPressure, resource: RootResource, amount: number): void {
  pressure.gathered[resource] += Math.max(0, amount);
}

export function recordCreatureDefeat(pressure: WorldPressure): void {
  pressure.creatureDefeats += 1;
}

export function recordTraitUsage(pressure: WorldPressure, traits: Trait[]): void {
  for (const trait of new Set(traits)) pressure.traitUsage[trait] = (pressure.traitUsage[trait] ?? 0) + 1;
}

export function traitUsageCount(pressure: WorldPressure, traits: Trait[]): number {
  return traits.reduce((total, trait) => total + (pressure.traitUsage[trait] ?? 0), 0);
}
