import { describe, expect, it } from 'vitest';
import { biomeExtraSpawns } from '../src/world/BiomeEcosystem';
import { platformSilhouetteForBiome } from '../src/world/BiomePlatformStyle';
import { WorldGenerator, type WorldBand } from '../src/world/WorldGenerator';
import { WorldState } from '../src/world/WorldState';

function collect(generator: WorldGenerator, count = 160) { return Array.from({ length: count }, () => generator.nextBand()); }

function band(encounter: WorldBand['encounter'], encounterStep: number, index = 20): WorldBand {
  return { index, y: -1200, rest: false, encounter, encounterStep, spawns: [{ type: 'platform', x: 82, y: -1200, width: 104 }] };
}

describe('M7.5 biome ecosystem identity', () => {
  it('uses distinct structural platform silhouettes for Teal, Amber and Violet', () => {
    expect(platformSilhouetteForBiome('teal-ruins')).toBe('ruin-slab');
    expect(platformSilhouetteForBiome('amber-district')).toBe('industrial-deck');
    expect(platformSilhouetteForBiome('violet-zone')).toBe('night-slab');
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
});
