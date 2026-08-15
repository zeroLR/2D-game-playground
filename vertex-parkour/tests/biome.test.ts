import { describe, expect, it } from 'vitest';
import { getBiomeTheme, mixTint } from '../src/presentation/BiomeTheme';
import { BIOME_SEQUENCE, STARTING_BIOME, nextBiome } from '../src/world/Biome';
import { WorldState } from '../src/world/WorldState';

describe('Biome foundation', () => {
  it('progresses through all four biome chapters and terminates at Pale Heights', () => {
    expect(STARTING_BIOME).toBe('teal-ruins');
    expect(BIOME_SEQUENCE).toEqual(['teal-ruins', 'amber-district', 'violet-zone', 'pale-heights']);
    expect(nextBiome('teal-ruins')).toBe('amber-district');
    expect(nextBiome('amber-district')).toBe('violet-zone');
    expect(nextBiome('violet-zone')).toBe('pale-heights');
    expect(nextBiome('pale-heights')).toBe('pale-heights');
  });

  it('snapshots biome identity on already generated platforms', () => {
    const world = new WorldState();
    const teal = world.addSpawn({ type: 'platform', x: 180, y: 500, width: 100 });
    world.setActiveBiome('amber-district');
    const amber = world.addSpawn({ type: 'platform', x: 180, y: 400, width: 100 });
    world.setActiveBiome('violet-zone');
    const violet = world.addSpawn({ type: 'platform', x: 180, y: 300, width: 100 });
    world.setActiveBiome('pale-heights');
    const pale = world.addSpawn({ type: 'platform', x: 180, y: 200, width: 100 });
    expect(teal).toMatchObject({ type: 'platform', biomeTheme: 'teal-ruins' });
    expect(amber).toMatchObject({ type: 'platform', biomeTheme: 'amber-district' });
    expect(violet).toMatchObject({ type: 'platform', biomeTheme: 'violet-zone' });
    expect(pale).toMatchObject({ type: 'platform', biomeTheme: 'pale-heights' });
  });

  it('keeps all biome palette identities visually distinct', () => {
    const themes = BIOME_SEQUENCE.map(getBiomeTheme);
    expect(new Set(themes.map((theme) => theme.platformTint)).size).toBe(BIOME_SEQUENCE.length);
    expect(new Set(themes.map((theme) => theme.ambient)).size).toBe(BIOME_SEQUENCE.length);
    const violet = getBiomeTheme('violet-zone');
    const pale = getBiomeTheme('pale-heights');
    expect(mixTint(violet.platformTint, pale.platformTint, 0.5)).not.toBe(violet.platformTint);
    expect(mixTint(violet.platformTint, pale.platformTint, 0.5)).not.toBe(pale.platformTint);
  });

  it('resets biome progression with the world', () => {
    const world = new WorldState();
    world.setActiveBiome('pale-heights');
    world.clear();
    expect(world.getActiveBiome()).toBe('teal-ruins');
  });
});
