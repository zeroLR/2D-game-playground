import { publishWorldAdvanceSignal } from './worldAdvanceSignal';
import type { EcologyState } from './worldTick';
import type { RegionState } from '../world/regions';
import { restoreResourceNode, type ResourceNode, type RootResource } from '../world/resources';

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
  publishWorldAdvanceSignal({
    tickIndex: ecology.tickIndex,
    hostility: ecology.hostility,
    signature: ecology.lastSignature ?? 0,
  });

  const recovered: RootResource[] = [];
  for (const node of nodes) {
    if (!node.depleted || !shouldRecoverResource(node.resource, ecology)) continue;
    if (restoreResourceNode(node)) recovered.push(node.resource);
  }
  return recovered;
}

export function regionStressLevel(ecology: EcologyState, regionId: string): 'CALM' | 'STRAINED' | 'ANOMALOUS' {
  const stress = ecology.regionStress[regionId] ?? 0;
  if (stress >= 8) return 'ANOMALOUS';
  if (stress >= 3) return 'STRAINED';
  return 'CALM';
}
