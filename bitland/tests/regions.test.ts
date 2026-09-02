import { describe, expect, it } from 'vitest';
import {
  BASE_WORLD_WIDTH,
  REGION_REVEAL_DISTANCE,
  createRegionState,
  generateNextRegion,
  shouldRevealNextRegion,
  worldExtent,
} from '../src/simulation/world/regions';

describe('lazy region generation', () => {
  it('reveals only when the player approaches the observed boundary', () => {
    const state = createRegionState();
    expect(shouldRevealNextRegion(BASE_WORLD_WIDTH - REGION_REVEAL_DISTANCE - 1, state)).toBe(false);
    expect(shouldRevealNextRegion(BASE_WORLD_WIDTH - REGION_REVEAL_DISTANCE, state)).toBe(true);
  });

  it('is deterministic for the same world state snapshot', () => {
    const a = createRegionState();
    const b = createRegionState();
    const influence = { codexCount: 4, activeTraits: ['HOT', 'CONDUCTIVE'] as const };
    const regionA = generateNextRegion(a, 'seed-a', { codexCount: influence.codexCount, activeTraits: [...influence.activeTraits] });
    const regionB = generateNextRegion(b, 'seed-a', { codexCount: influence.codexCount, activeTraits: [...influence.activeTraits] });
    expect(regionA).toEqual(regionB);
  });

  it('captures the world-state influence at first observation', () => {
    const state = createRegionState();
    const region = generateNextRegion(state, 'seed-a', { codexCount: 7, activeTraits: ['UNSTABLE', 'HOT'] });
    expect(region?.influence.codexCount).toBe(7);
    expect(region?.influence.activeTraits).toEqual(['HOT', 'UNSTABLE']);
  });

  it('extends the observed world by one region at a time', () => {
    const state = createRegionState();
    const before = worldExtent(state);
    generateNextRegion(state, 'seed-a', { codexCount: 0, activeTraits: [] });
    expect(worldExtent(state)).toBeGreaterThan(before);
    expect(state.generated).toHaveLength(1);
  });
});
