import { describe, expect, it } from 'vitest';
import { WorldGenerator } from '../src/world/WorldGenerator';

function generate(seed: number, biome: 'teal-ruins' | 'amber-district', count: number) {
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
});
