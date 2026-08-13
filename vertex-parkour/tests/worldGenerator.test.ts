import { describe, expect, it } from 'vitest';
import { REGULAR_GAP_MAX, REGULAR_GAP_MIN, REST_GAP_MAX, REST_GAP_MIN, START_PLATFORM_Y, WorldGenerator, type WorldBand } from '../src/world/WorldGenerator';

function generate(seed: number, count: number) { const generator = new WorldGenerator(seed); return Array.from({ length: count }, () => generator.nextBand()); }
function encounters(bands: WorldBand[]) { const groups: WorldBand[][] = []; for (let index = 0; index < bands.length; index += 4) groups.push(bands.slice(index, index + 4)); return groups; }

describe('WorldGenerator', () => {
  it('replays the same encounter sequence for the same seed', () => { expect(generate(12345, 24)).toEqual(generate(12345, 24)); });

  it('builds encounters as four-band authored sequences with a final rest beat', () => {
    for (const group of encounters(generate(7, 40))) {
      expect(group).toHaveLength(4);
      expect(group.map((band) => band.encounterStep)).toEqual([0, 1, 2, 3]);
      expect(new Set(group.map((band) => band.encounter)).size).toBe(1);
      expect(group.map((band) => band.rest)).toEqual([false, false, false, true]);
    }
  });

  it('preserves regular and rest gap ranges', () => {
    const bands = generate(99, 80); let previousY = START_PLATFORM_Y;
    for (const band of bands) {
      const gap = previousY - band.y;
      expect(gap).toBeGreaterThanOrEqual(band.rest ? REST_GAP_MIN : REGULAR_GAP_MIN);
      expect(gap).toBeLessThanOrEqual(band.rest ? REST_GAP_MAX : REGULAR_GAP_MAX);
      previousY = band.y;
    }
  });

  it('always emits exactly one static safe landing platform per band', () => {
    for (const band of generate(123, 200)) {
      const staticPlatforms = band.spawns.filter((spawn) => spawn.type === 'platform' && !spawn.motion);
      expect(staticPlatforms).toHaveLength(1);
    }
  });

  it('uses all five encounter families across a long deterministic run', () => {
    const types = new Set(generate(20260813, 600).map((band) => band.encounter));
    expect(types).toEqual(new Set(['recovery', 'dash-chain', 'edge-read', 'wall-rescue', 'moving-window']));
  });

  it('keeps recovery encounters readable and resource-positive', () => {
    const groups = encounters(generate(42, 400)).filter((group) => group[0].encounter === 'recovery');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group.some((band) => band.spawns.some((spawn) => spawn.type === 'crystal'))).toBe(true);
      expect(group.some((band) => band.spawns.some((spawn) => spawn.type === 'spike' || spawn.type === 'wall' || spawn.type === 'hazard'))).toBe(false);
    }
  });

  it('authors dash-chain encounters as drone route then resource landing', () => {
    const groups = encounters(generate(314159, 400)).filter((group) => group[0].encounter === 'dash-chain');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group[1].spawns.some((spawn) => spawn.type === 'drone')).toBe(true);
      expect(group[2].spawns.some((spawn) => spawn.type === 'crystal')).toBe(true);
      expect(group.some((band) => band.spawns.some((spawn) => spawn.type === 'spike' || spawn.type === 'wall'))).toBe(false);
    }
  });

  it('makes edge-read encounters leave a broad center and route away from the spike', () => {
    const groups = encounters(generate(271828, 500)).filter((group) => group[0].encounter === 'edge-read');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const firstPlatform = group[0].spawns.find((spawn) => spawn.type === 'platform');
      const spike = group[0].spawns.find((spawn) => spawn.type === 'spike');
      const nextPlatform = group[1].spawns.find((spawn) => spawn.type === 'platform');
      if (firstPlatform?.type !== 'platform' || spike?.type !== 'spike' || nextPlatform?.type !== 'platform') continue;
      expect(firstPlatform.width).toBeGreaterThanOrEqual(102);
      expect(spike.width).toBe(18);
      expect(Math.abs(spike.x - firstPlatform.x) - spike.width / 2).toBeGreaterThanOrEqual(28);
      expect(Math.sign(nextPlatform.x - firstPlatform.x)).toBe(-Math.sign(spike.x - firstPlatform.x));
    }
  });

  it('uses wall-rescue encounters as recovery geometry rather than random hazards', () => {
    const groups = encounters(generate(8675309, 500)).filter((group) => group[0].encounter === 'wall-rescue');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group[1].spawns.some((spawn) => spawn.type === 'wall')).toBe(true);
      expect(group[2].spawns.some((spawn) => spawn.type === 'crystal')).toBe(true);
      expect(group.some((band) => band.spawns.some((spawn) => spawn.type === 'spike' || spawn.type === 'hazard'))).toBe(false);
    }
  });

  it('authors moving-window as an optional moving shortcut with a static fallback', () => {
    const groups = encounters(generate(1618033, 800)).filter((group) => group[0].encounter === 'moving-window');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const movingPlatforms = group[1].spawns.filter((spawn) => spawn.type === 'platform' && spawn.motion);
      const staticPlatforms = group[1].spawns.filter((spawn) => spawn.type === 'platform' && !spawn.motion);
      expect(movingPlatforms).toHaveLength(1);
      expect(staticPlatforms).toHaveLength(1);
      const moving = movingPlatforms[0];
      if (moving.type !== 'platform' || !moving.motion) continue;
      expect(moving.width).toBe(118);
      expect(moving.motion.axis).toBe('x');
      expect(moving.motion.amplitude).toBe(46);
      expect(moving.motion.speed).toBe(0.9);
      expect(group[2].spawns.some((spawn) => spawn.type === 'crystal')).toBe(true);
      expect(group[3].rest).toBe(true);
    }
  });
});
