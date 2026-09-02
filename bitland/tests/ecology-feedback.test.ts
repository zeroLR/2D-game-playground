import { describe, expect, it } from 'vitest';
import { applyResourceRecovery, feedbackForEcology, regionStressLevel } from '../src/simulation/ecology/feedback';
import { createEcologyState } from '../src/simulation/ecology/worldTick';
import { createRegionState, generateNextRegion } from '../src/simulation/world/regions';
import { createWorldPressure } from '../src/simulation/world/pressure';
import type { ResourceNode } from '../src/simulation/world/resources';

describe('ecology feedback', () => {
  it('turns hostility into bounded enemy pressure multipliers', () => {
    const ecology = createEcologyState();
    ecology.hostility = 6;
    const feedback = feedbackForEcology(ecology, createRegionState());
    expect(feedback.enemySpeedMultiplier).toBeGreaterThan(1);
    expect(feedback.enemySpeedMultiplier).toBeLessThanOrEqual(1.48);
    expect(feedback.contactPressureMultiplier).toBeGreaterThan(1);
  });

  it('recovers depleted resources only when ecology shift is positive', () => {
    const ecology = createEcologyState();
    ecology.resourceShift.LIFE = 2;
    ecology.resourceShift.MATTER = -2;
    const nodes: ResourceNode[] = [
      { id: 'life', resource: 'LIFE', amount: 1, x: 0, depleted: true },
      { id: 'matter', resource: 'MATTER', amount: 1, x: 0, depleted: true },
    ];
    expect(applyResourceRecovery(nodes, ecology)).toEqual(['LIFE']);
    expect(nodes[0].depleted).toBe(false);
    expect(nodes[1].depleted).toBe(true);
  });

  it('maps persisted region stress into readable anomaly levels', () => {
    const regions = createRegionState();
    const region = generateNextRegion(regions, 'world', { codexCount: 0, activeTraits: [], pressure: createWorldPressure() });
    if (!region) throw new Error('expected region');
    const ecology = createEcologyState();
    ecology.regionStress[region.id] = 9;
    expect(regionStressLevel(ecology, region.id)).toBe('ANOMALOUS');
    expect(feedbackForEcology(ecology, regions).stressedRegions).toEqual([{ regionId: region.id, stress: 9 }]);
  });
});
