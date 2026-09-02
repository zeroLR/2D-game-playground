import { describe, expect, it } from 'vitest';
import { createWorldPressure, recordCreatureDefeat, recordGatherPressure, recordTraitUsage } from '../src/simulation/world/pressure';
import { createRegionState, generateNextRegion } from '../src/simulation/world/regions';

describe('world-state region influence', () => {
  it('changes the canonical region signature when world pressure changes', () => {
    const calm = createWorldPressure();
    const pressured = createWorldPressure();
    recordGatherPressure(pressured, 'MATTER', 5);
    recordTraitUsage(pressured, ['HOT']);

    const a = generateNextRegion(createRegionState(), 'world', { codexCount: 2, activeTraits: [], pressure: calm });
    const b = generateNextRegion(createRegionState(), 'world', { codexCount: 2, activeTraits: [], pressure: pressured });
    expect(a?.signature).not.toBe(b?.signature);
  });

  it('captures pressure at first observation and raises hostile encounter pressure', () => {
    const pressure = createWorldPressure();
    for (let i = 0; i < 4; i += 1) recordCreatureDefeat(pressure);
    recordTraitUsage(pressure, ['UNSTABLE', 'HOT']);

    const region = generateNextRegion(createRegionState(), 'world', { codexCount: 5, activeTraits: ['UNSTABLE'], pressure });
    expect(region?.influence.pressure?.creatureDefeats).toBe(4);
    expect(region?.encounterPressure).toBe('HIGH');
  });

  it('biases a biome toward the less-extracted native resource', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'MATTER', 8);
    recordGatherPressure(pressure, 'ENERGY', 8);
    recordGatherPressure(pressure, 'SIGNAL', 8);

    const region = generateNextRegion(createRegionState(), 'world-resource', { codexCount: 1, activeTraits: [], pressure });
    expect(region).not.toBeNull();
    if (!region) return;

    if (region.biome === 'DATA_FIELD') expect(region.resourceBias).toBe('LIFE');
    if (region.biome === 'CRYSTAL_NODE') expect(region.resourceBias).toBe('ENERGY');
    if (region.biome === 'CORRUPTION_FIELD') expect(region.resourceBias).toBe('MATTER');
  });
});
