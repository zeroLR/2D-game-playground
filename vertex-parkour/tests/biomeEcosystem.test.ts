import { describe, expect, it } from 'vitest';
import { platformSilhouetteForBiome } from '../src/world/BiomePlatformStyle';
import { WorldGenerator } from '../src/world/WorldGenerator';

function collect(generator: WorldGenerator, count = 160) { return Array.from({ length: count }, () => generator.nextBand()); }

describe('M7.5 biome ecosystem identity', () => {
  it('uses a different structural platform silhouette in Teal and Amber', () => {
    expect(platformSilhouetteForBiome('teal-ruins')).toBe('ruin-slab');
    expect(platformSilhouetteForBiome('amber-district')).toBe('industrial-deck');
  });

  it('gives Amber an industrial threat vocabulary beyond a palette swap', () => {
    const teal = new WorldGenerator(20260815); teal.setBiome('teal-ruins');
    const amber = new WorldGenerator(20260815); amber.setBiome('amber-district');
    const tealSpawns = collect(teal).flatMap((band) => band.spawns);
    const amberSpawns = collect(amber).flatMap((band) => band.spawns);
    const tealIndustrial = tealSpawns.filter((spawn) => spawn.type === 'pulse-gate' || spawn.type === 'interceptor').length;
    const amberIndustrial = amberSpawns.filter((spawn) => spawn.type === 'pulse-gate' || spawn.type === 'interceptor').length;
    expect(amberIndustrial).toBeGreaterThan(tealIndustrial);
  });

  it('makes moving machinery materially more prominent in Amber', () => {
    const teal = new WorldGenerator(1618033); teal.setBiome('teal-ruins');
    const amber = new WorldGenerator(1618033); amber.setBiome('amber-district');
    const tealMoving = collect(teal, 240).flatMap((band) => band.spawns).filter((spawn) => spawn.type === 'platform' && spawn.motion).length;
    const amberMoving = collect(amber, 240).flatMap((band) => band.spawns).filter((spawn) => spawn.type === 'platform' && spawn.motion).length;
    expect(amberMoving).toBeGreaterThan(tealMoving);
  });
});
