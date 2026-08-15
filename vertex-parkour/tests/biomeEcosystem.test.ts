import { describe, expect, it } from 'vitest';
import { biomeExtraSpawns, biomeSpawnsForBand } from '../src/world/BiomeEcosystem';
import { platformSilhouetteForBiome } from '../src/world/BiomePlatformStyle';
import { WorldGenerator, type WorldBand } from '../src/world/WorldGenerator';
import { WorldState } from '../src/world/WorldState';

function collect(generator: WorldGenerator, count = 160) { return Array.from({ length: count }, () => generator.nextBand()); }

function band(encounter: WorldBand['encounter'], encounterStep: number, index = 20, rest = false): WorldBand {
  return { index, y: -1200, rest, encounter, encounterStep, spawns: [{ type: 'platform', x: 82, y: -1200, width: 104 }] };
}

describe('M7.5 biome ecosystem identity', () => {
  it('uses distinct structural platform silhouettes for all implemented ecosystems', () => {
    expect(platformSilhouetteForBiome('teal-ruins')).toBe('ruin-slab');
    expect(platformSilhouetteForBiome('amber-district')).toBe('industrial-deck');
    expect(platformSilhouetteForBiome('violet-zone')).toBe('night-slab');
    expect(platformSilhouetteForBiome('pale-heights')).toBe('pale-slab');
  });

  it('gives Amber an industrial threat vocabulary beyond a palette swap', () => {
    const teal = new WorldGenerator(20260815); teal.setBiome('teal-ruins');
    const amber = new WorldGenerator(20260815); amber.setBiome('amber-district');
    const tealSpawns = collect(teal).flatMap((entry) => entry.spawns);
    const amberSpawns = collect(amber).flatMap((entry) => entry.spawns);
    const tealIndustrial = tealSpawns.filter((spawn) => spawn.type === 'pulse-gate' || spawn.type === 'interceptor').length;
    const amberIndustrial = amberSpawns.filter((spawn) => spawn.type === 'pulse-gate' || spawn.type === 'interceptor').length;
    expect(amberIndustrial).toBeGreaterThan(tealIndustrial);
  });

  it('makes moving machinery materially more prominent in Amber', () => {
    const teal = new WorldGenerator(1618033); teal.setBiome('teal-ruins');
    const amber = new WorldGenerator(1618033); amber.setBiome('amber-district');
    const tealMoving = collect(teal, 240).flatMap((entry) => entry.spawns).filter((spawn) => spawn.type === 'platform' && spawn.motion).length;
    const amberMoving = collect(amber, 240).flatMap((entry) => entry.spawns).filter((spawn) => spawn.type === 'platform' && spawn.motion).length;
    expect(amberMoving).toBeGreaterThan(tealMoving);
  });

  it('replaces an ordinary Violet landing platform with multiple real colliders', () => {
    const source = band('wall-rescue', 0, 22);
    const tealPlatforms = biomeSpawnsForBand('teal-ruins', source).filter((spawn) => spawn.type === 'platform');
    const violetPlatforms = biomeSpawnsForBand('violet-zone', source).filter((spawn) => spawn.type === 'platform');
    expect(tealPlatforms).toHaveLength(1);
    expect(violetPlatforms.length).toBeGreaterThanOrEqual(2);
    expect(violetPlatforms.every((spawn) => spawn.type === 'platform' && spawn.width < 60)).toBe(true);
    expect(new Set(violetPlatforms.map((spawn) => spawn.type === 'platform' ? spawn.x : 0)).size).toBe(violetPlatforms.length);
    expect(new Set(violetPlatforms.map((spawn) => spawn.type === 'platform' ? spawn.y : 0)).size).toBeGreaterThan(1);
  });

  it('keeps Violet decision and recovery exits as stable full platforms', () => {
    expect(biomeSpawnsForBand('violet-zone', band('route-choice', 1, 25)).filter((spawn) => spawn.type === 'platform')).toHaveLength(1);
    expect(biomeSpawnsForBand('violet-zone', band('upgrade-choice', 1, 26)).filter((spawn) => spawn.type === 'platform')).toHaveLength(1);
    expect(biomeSpawnsForBand('violet-zone', band('wall-rescue', 3, 27, true)).filter((spawn) => spawn.type === 'platform')).toHaveLength(1);
  });

  it('adds Violet hunters to wall routing and phase denial to edge routing', () => {
    expect(biomeExtraSpawns('teal-ruins', band('wall-rescue', 1))).toEqual([]);
    expect(biomeExtraSpawns('amber-district', band('wall-rescue', 1))).toEqual([]);
    expect(biomeExtraSpawns('violet-zone', band('wall-rescue', 1)).some((spawn) => spawn.type === 'interceptor')).toBe(true);
    expect(biomeExtraSpawns('violet-zone', band('edge-read', 1)).some((spawn) => spawn.type === 'pulse-gate')).toBe(true);
  });

  it('snapshots Violet identity on threats as well as platforms', () => {
    const world = new WorldState();
    world.setActiveBiome('violet-zone');
    const hunter = world.addSpawn({ type: 'interceptor', x: 278, y: -800, phase: 0 });
    const gate = world.addSpawn({ type: 'pulse-gate', x: 180, y: -900, height: 108, phase: 0 });
    expect(hunter).toMatchObject({ type: 'interceptor', biomeTheme: 'violet-zone' });
    expect(gate).toMatchObject({ type: 'pulse-gate', biomeTheme: 'violet-zone' });
  });

  it('turns ordinary Pale traversal into broader independently drifting ice floes', () => {
    const source = band('dash-chain', 1, 32);
    source.spawns.push({ type: 'drone', x: 278, y: -1240, phase: 0 });
    const pale = biomeSpawnsForBand('pale-heights', source);
    const platforms = pale.filter((spawn) => spawn.type === 'platform');
    expect(platforms.length).toBeGreaterThanOrEqual(2);
    expect(platforms.every((spawn) => spawn.type === 'platform' && spawn.width >= 52 && spawn.width <= 76)).toBe(true);
    expect(platforms.every((spawn) => spawn.type === 'platform' && Boolean(spawn.motion))).toBe(true);
    expect(new Set(platforms.map((spawn) => spawn.type === 'platform' ? spawn.x : 0)).size).toBe(platforms.length);
    expect(new Set(platforms.map((spawn) => spawn.type === 'platform' ? spawn.y : 0)).size).toBeGreaterThan(1);
    expect(new Set(platforms.map((spawn) => spawn.type === 'platform' ? spawn.motion?.phase : 0)).size).toBe(platforms.length);
    expect(pale.some((spawn) => spawn.type === 'drone')).toBe(false);
  });

  it('keeps Pale decision and recovery beats on stable full ice shelves', () => {
    for (const source of [
      band('route-choice', 1, 40),
      band('upgrade-choice', 1, 41),
      band('rest-route', 1, 42),
      band('moving-window', 3, 43, true),
      band('climax', 3, 44, true),
    ]) {
      const platforms = biomeSpawnsForBand('pale-heights', source).filter((spawn) => spawn.type === 'platform');
      expect(platforms).toHaveLength(1);
      expect(platforms[0]).toMatchObject({ type: 'platform', width: 104 });
      if (platforms[0].type === 'platform') expect(platforms[0].motion).toBeUndefined();
    }
  });
});
