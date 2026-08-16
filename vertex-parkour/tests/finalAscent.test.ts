import { describe, expect, it } from 'vitest';
import { buildFinalAscent, finalAscentTopY } from '../src/world/FinalAscent';

describe('FinalAscent', () => {
  it('authors a finite ordered capstone sequence above the terminal Climax', () => {
    const startY = -2400;
    const bands = buildFinalAscent(startY);

    expect(bands.map((band) => band.stage)).toEqual([
      'storm-gate',
      'fractured-transfer',
      'wall-rescue',
      'moving-bridge',
      'pursuit',
      'storm-commitment',
      'crown-steps',
      'summit-approach',
    ]);
    expect(bands).toHaveLength(8);
    for (let i = 0; i < bands.length; i += 1) {
      expect(bands[i].y).toBeLessThan(i === 0 ? startY : bands[i - 1].y);
    }
    expect(finalAscentTopY(startY)).toBe(bands[bands.length - 1].y);
  });

  it('remixes learned traversal mechanics without procedural choices', () => {
    const spawns = buildFinalAscent(-2400).flatMap((band) => band.spawns);
    expect(spawns.some((spawn) => spawn.type === 'pulse-gate')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'wall')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'interceptor')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'spike')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'platform' && spawn.motion)).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'route')).toBe(false);
    expect(spawns.some((spawn) => spawn.type === 'upgrade')).toBe(false);
    expect(spawns.some((spawn) => spawn.type === 'crystal')).toBe(false);
  });

  it('ends on a wide stable summit approach reserved for Slice 3C', () => {
    const bands = buildFinalAscent(-2400);
    const summit = bands[bands.length - 1];
    expect(summit.stage).toBe('summit-approach');
    expect(summit.spawns).toEqual([
      expect.objectContaining({ type: 'platform', x: 180, width: 154 }),
    ]);
    const platform = summit.spawns[0];
    expect(platform.type).toBe('platform');
    if (platform.type === 'platform') expect(platform.motion).toBeUndefined();
  });
});
