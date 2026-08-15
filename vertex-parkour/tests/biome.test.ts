import { describe, expect, it } from 'vitest';
import { getBiomeTheme, mixTint } from '../src/presentation/BiomeTheme';
import { STARTING_BIOME, nextBiome } from '../src/world/Biome';
import { WorldState } from '../src/world/WorldState';

describe('Biome foundation', () => {
  it('progresses Teal Ruins to Amber District to Night / Violet Zone', () => {
    expect(STARTING_BIOME).toBe('teal-ruins');
    expect(nextBiome('teal-ruins')).toBe('amber-district');
    expect(nextBiome('amber-district')).toBe('violet-zone');
    expect(nextBiome('violet-zone')).toBe('violet-zone');
  });

  it('snapshots biome identity on already generated platforms', () => {
    const world = new WorldState();
    const teal = world.addSpawn({ type: 'platform', x: 180, y: 500, width: 100 });
    world.setActiveBiome('amber-district');
    const amber = world.addSpawn({ type: 'platform', x: 180, y: 400, width: 100 });
    world.setActiveBiome('violet-zone');
    const violet = world.addSpawn({ type: 'platform', x: 180, y: 300, width: 100 });
    expect(teal).toMatchObject({ type: 'platform', biomeTheme: 'teal-ruins' });
    expect(amber).toMatchObject({ type: 'platform', biomeTheme: 'amber-district' });
    expect(violet).toMatchObject({ type: 'platform', biomeTheme: 'violet-zone' });
  });

  it('keeps all biome palette identities visually distinct', () => {
    const teal = getBiomeTheme('teal-ruins');
    const amber = getBiomeTheme('amber-district');
    const violet = getBiomeTheme('violet-zone');
    expect(new Set([teal.platformTint, amber.platformTint, violet.platformTint]).size).toBe(3);
    expect(new Set([teal.ambient, amber.ambient, violet.ambient]).size).toBe(3);
    expect(mixTint(amber.platformTint, violet.platformTint, 0.5)).not.toBe(amber.platformTint);
    expect(mixTint(amber.platformTint, violet.platformTint, 0.5)).not.toBe(violet.platformTint);
  });

  it('resets biome progression with the world', () => {
    const world = new WorldState();
    world.setActiveBiome('violet-zone');
    world.clear();
    expect(world.getActiveBiome()).toBe('teal-ruins');
  });
});
