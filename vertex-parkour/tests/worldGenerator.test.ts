import { describe, expect, it } from 'vitest';
import {
  REGULAR_GAP_MAX,
  REGULAR_GAP_MIN,
  REST_GAP_MAX,
  REST_GAP_MIN,
  START_PLATFORM_Y,
  WorldGenerator,
} from '../src/world/WorldGenerator';

describe('WorldGenerator', () => {
  it('replays the same world for the same seed', () => {
    const a = new WorldGenerator(12345);
    const b = new WorldGenerator(12345);
    expect(Array.from({ length: 12 }, () => a.nextBand())).toEqual(
      Array.from({ length: 12 }, () => b.nextBand()),
    );
  });

  it('keeps every fourth band as a rest band', () => {
    const generator = new WorldGenerator(7);
    const bands = Array.from({ length: 8 }, () => generator.nextBand());
    expect(bands.map((band) => band.rest)).toEqual([false, false, false, true, false, false, false, true]);
  });

  it('preserves regular and rest gap ranges', () => {
    const generator = new WorldGenerator(99);
    let previousY = START_PLATFORM_Y;
    for (let i = 0; i < 40; i += 1) {
      const band = generator.nextBand();
      const gap = previousY - band.y;
      if (band.rest) {
        expect(gap).toBeGreaterThanOrEqual(REST_GAP_MIN);
        expect(gap).toBeLessThanOrEqual(REST_GAP_MAX);
      } else {
        expect(gap).toBeGreaterThanOrEqual(REGULAR_GAP_MIN);
        expect(gap).toBeLessThanOrEqual(REGULAR_GAP_MAX);
      }
      previousY = band.y;
    }
  });

  it('always emits one platform per band and walls on every fifth non-rest band', () => {
    const generator = new WorldGenerator(123);
    const bands = Array.from({ length: 20 }, () => generator.nextBand());
    for (const band of bands) {
      expect(band.spawns.filter((spawn) => spawn.type === 'platform')).toHaveLength(1);
      if (band.index % 5 === 0 && !band.rest) {
        expect(band.spawns.some((spawn) => spawn.type === 'wall')).toBe(true);
      }
    }
  });

  it('keeps spikes out of rest and wall-rescue bands', () => {
    const generator = new WorldGenerator(20260813);
    const bands = Array.from({ length: 120 }, () => generator.nextBand());
    expect(bands.some((band) => band.spawns.some((spawn) => spawn.type === 'spike'))).toBe(true);
    for (const band of bands) {
      if (band.rest || band.index % 5 === 0) {
        expect(band.spawns.some((spawn) => spawn.type === 'spike')).toBe(false);
      }
    }
  });

  it('only places spikes on wide platforms and leaves landing space', () => {
    const generator = new WorldGenerator(314159);
    const bands = Array.from({ length: 160 }, () => generator.nextBand());
    for (const band of bands) {
      const platform = band.spawns.find((spawn) => spawn.type === 'platform');
      const spike = band.spawns.find((spawn) => spawn.type === 'spike');
      if (!platform || platform.type !== 'platform' || !spike || spike.type !== 'spike') continue;
      expect(platform.width).toBeGreaterThanOrEqual(88);
      expect(Math.abs(spike.x - platform.x) + spike.width / 2).toBeLessThan(platform.width / 2);
    }
  });
});
