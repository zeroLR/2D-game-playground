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

  it('biases native biomes toward the less-extracted resource and keeps corruption deterministic', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'MATTER', 8);
    recordGatherPressure(pressure, 'ENERGY', 8);
    recordGatherPressure(pressure, 'SIGNAL', 8);

    const influence = { codexCount: 1, activeTraits: [] as const, pressure };
    const region = generateNextRegion(createRegionState(), 'world-resource', {
      codexCount: influence.codexCount,
      activeTraits: [...influence.activeTraits],
      pressure: influence.pressure,
    });
    const replay = generateNextRegion(createRegionState(), 'world-resource', {
      codexCount: influence.codexCount,
      activeTraits: [...influence.activeTraits],
      pressure: influence.pressure,
    });

    expect(region).not.toBeNull();
    expect(replay?.resourceBias).toBe(region?.resourceBias);
    if (!region) return;

    if (region.biome === 'DATA_FIELD') expect(region.resourceBias).toBe('LIFE');
    if (region.biome === 'CRYSTAL_NODE') expect(region.resourceBias).toBe('LIFE');
    if (region.biome === 'CORRUPTION_FIELD') expect(['MATTER', 'ENERGY', 'LIFE', 'SIGNAL']).toContain(region.resourceBias);
  });
});
