import { describe, expect, it } from 'vitest';
import { WorldGenerator } from '../src/world/WorldGenerator';
import type { BiomeId } from '../src/world/Biome';

function generate(seed: number, biome: BiomeId, count: number) {
  const generator = new WorldGenerator(seed);
  generator.setBiome(biome);
  return Array.from({ length: count }, () => generator.nextBand());
}

describe('biome encounter vocabulary', () => {
  it('Amber introduces timing and pursuit threats into ordinary core packets', () => {
    const amber = generate(20260815, 'amber-district', 160)
      .filter((band) => !['upgrade-choice', 'route-choice', 'treasure', 'elite', 'rest-route', 'climax'].includes(band.encounter));
    expect(amber.some((band) => band.spawns.some((spawn) => spawn.type === 'pulse-gate'))).toBe(true);
    expect(amber.some((band) => band.spawns.some((spawn) => spawn.type === 'interceptor'))).toBe(true);
  });

  it('Amber moving windows use a stronger motion profile than Teal', () => {
    const amber = generate(1618033, 'amber-district', 600).filter((band) => band.encounter === 'moving-window');
    const teal = generate(1618033, 'teal-ruins', 600).filter((band) => band.encounter === 'moving-window');
    const amberMotion = amber.flatMap((band) => band.spawns).find((spawn) => spawn.type === 'platform' && spawn.motion);
    const tealMotion = teal.flatMap((band) => band.spawns).find((spawn) => spawn.type === 'platform' && spawn.motion);
    expect(amberMotion?.type === 'platform' && amberMotion.motion?.amplitude).toBeGreaterThan(tealMotion?.type === 'platform' && tealMotion.motion ? tealMotion.motion.amplitude : 0);
    expect(amberMotion?.type === 'platform' && amberMotion.motion?.speed).toBeGreaterThan(tealMotion?.type === 'platform' && tealMotion.motion ? tealMotion.motion.speed : 0);
  });

  it('Violet favors constrained edge and wall routing over Amber speed vocabulary', () => {
    const violet = generate(424242, 'violet-zone', 480)
      .filter((band) => !['upgrade-choice', 'route-choice', 'treasure', 'elite', 'rest-route', 'climax'].includes(band.encounter));
    const counts = violet.reduce<Record<string, number>>((acc, band) => {
      if (band.encounterStep === 0) acc[band.encounter] = (acc[band.encounter] ?? 0) + 1;
      return acc;
    }, {});
    expect((counts['wall-rescue'] ?? 0) + (counts['edge-read'] ?? 0)).toBeGreaterThan((counts['dash-chain'] ?? 0) + (counts['moving-window'] ?? 0));
  });
});
