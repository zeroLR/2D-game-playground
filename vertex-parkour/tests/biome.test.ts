import { describe, expect, it } from 'vitest';
import { getBiomeTheme, mixTint } from '../src/presentation/BiomeTheme';
import { STARTING_BIOME, nextBiome } from '../src/world/Biome';
import { WorldState } from '../src/world/WorldState';

describe('Biome foundation', () => {
  it('starts in Teal Ruins and advances to Amber District', () => {
    expect(STARTING_BIOME).toBe('teal-ruins');
    expect(nextBiome('teal-ruins')).toBe('amber-district');
    expect(nextBiome('amber-district')).toBe('amber-district');
  });

  it('snapshots biome identity on already generated platforms', () => {
    const world = new WorldState();
    const teal = world.addSpawn({ type: 'platform', x: 180, y: 500, width: 100 });
    world.setActiveBiome('amber-district');
    const amber = world.addSpawn({ type: 'platform', x: 180, y: 400, width: 100 });
    expect(teal).toMatchObject({ type: 'platform', biomeTheme: 'teal-ruins' });
    expect(amber).toMatchObject({ type: 'platform', biomeTheme: 'amber-district' });
  });

  it('keeps biome and route palette identities visually distinct', () => {
    const teal = getBiomeTheme('teal-ruins');
    const amber = getBiomeTheme('amber-district');
    expect(teal.platformTint).not.toBe(amber.platformTint);
    expect(teal.ambient).not.toBe(amber.ambient);
    expect(mixTint(teal.platformTint, amber.platformTint, 0.5)).not.toBe(teal.platformTint);
    expect(mixTint(teal.platformTint, amber.platformTint, 0.5)).not.toBe(amber.platformTint);
  });

  it('resets biome progression with the world', () => {
    const world = new WorldState();
    world.setActiveBiome('amber-district');
    world.clear();
    expect(world.getActiveBiome()).toBe('teal-ruins');
  });
});
