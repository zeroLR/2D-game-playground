import type { EcologyState } from './worldTick';
import type { RegionState } from '../world/regions';
import type { ResourceNode, RootResource } from '../world/resources';

export type EcologyFeedback = {
  enemySpeedMultiplier: number;
  contactPressureMultiplier: number;
  stressedRegions: Array<{ regionId: string; stress: number }>;
};

export function feedbackForEcology(ecology: EcologyState, regions: RegionState): EcologyFeedback {
  const hostility = Math.max(0, ecology.hostility);
  return {
    enemySpeedMultiplier: 1 + Math.min(hostility, 8) * 0.06,
    contactPressureMultiplier: 1 + Math.min(hostility, 8) * 0.05,
    stressedRegions: regions.generated
      .map(region => ({ regionId: region.id, stress: ecology.regionStress[region.id] ?? 0 }))
      .filter(entry => entry.stress > 0),
  };
}

export function shouldRecoverResource(resource: RootResource, ecology: EcologyState): boolean {
  return ecology.resourceShift[resource] > 0;
}

export function applyResourceRecovery(nodes: ResourceNode[], ecology: EcologyState): RootResource[] {
  const recovered: RootResource[] = [];
  for (const node of nodes) {
    if (!node.depleted || !shouldRecoverResource(node.resource, ecology)) continue;
    node.depleted = false;
    recovered.push(node.resource);
  }
  return recovered;
}

export function regionStressLevel(ecology: EcologyState, regionId: string): 'CALM' | 'STRAINED' | 'ANOMALOUS' {
  const stress = ecology.regionStress[regionId] ?? 0;
  if (stress >= 8) return 'ANOMALOUS';
  if (stress >= 3) return 'STRAINED';
  return 'CALM';
}
