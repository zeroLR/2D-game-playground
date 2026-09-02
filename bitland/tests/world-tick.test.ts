import { describe, expect, it } from 'vitest';
import { createEcologyState, runWorldTick } from '../src/simulation/ecology/worldTick';
import { createWorldPressure, recordCreatureDefeat, recordGatherPressure, recordTraitUsage } from '../src/simulation/world/pressure';
import { createRegionState, generateNextRegion } from '../src/simulation/world/regions';

describe('world tick', () => {
  it('is deterministic for the same tick index and world snapshot', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'MATTER', 5);
    recordTraitUsage(pressure, ['HOT']);
    const regionsA = createRegionState();
    const regionsB = createRegionState();
    generateNextRegion(regionsA, 'world', { codexCount: 2, activeTraits: [], pressure });
    generateNextRegion(regionsB, 'world', { codexCount: 2, activeTraits: [], pressure });

    const deltaA = runWorldTick(createEcologyState(), pressure, regionsA, 'world');
    const deltaB = runWorldTick(createEcologyState(), pressure, regionsB, 'world');
    expect(deltaA).toEqual(deltaB);
  });

  it('turns extraction into negative resource recovery pressure', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'MATTER', 12);
    const delta = runWorldTick(createEcologyState(), pressure, createRegionState(), 'world');
    expect(delta.resourceShift.MATTER).toBeLessThan(0);
  });

  it('raises hostility after repeated defeats and volatile trait usage', () => {
    const pressure = createWorldPressure();
    for (let i = 0; i < 4; i += 1) recordCreatureDefeat(pressure);
    recordTraitUsage(pressure, ['HOT', 'UNSTABLE']);
    const state = createEcologyState();
    const delta = runWorldTick(state, pressure, createRegionState(), 'world');
    expect(delta.hostilityShift).toBeGreaterThan(0);
    expect(state.hostility).toBeGreaterThan(0);
  });

  it('accumulates region stress without changing region identity', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'LIFE', 8);
    const regions = createRegionState();
    const region = generateNextRegion(regions, 'world', { codexCount: 1, activeTraits: [], pressure });
    expect(region).not.toBeNull();
    const before = regions.generated[0].id;
    const state = createEcologyState();
    runWorldTick(state, pressure, regions, 'world');
    expect(regions.generated[0].id).toBe(before);
    expect(state.regionStress[before]).toBeGreaterThanOrEqual(0);
  });
});
