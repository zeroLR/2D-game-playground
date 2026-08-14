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

  it('always keeps at least one static safe landing platform per band', () => {
    for (const band of generate(123, 200)) {
      const staticPlatforms = band.spawns.filter((spawn) => spawn.type === 'platform' && !spawn.motion);
      expect(staticPlatforms.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('uses all six encounter families across a long deterministic run', () => {
    const types = new Set(generate(20260813, 600).map((band) => band.encounter));
    expect(types).toEqual(new Set(['recovery', 'dash-chain', 'edge-read', 'wall-rescue', 'moving-window', 'upgrade-choice']));
  });

  it('forces a route upgrade encounter at a bounded cadence', () => {
    const groups = encounters(generate(123456, 160));
    const choiceIndexes = groups.flatMap((group, index) => group[0].encounter === 'upgrade-choice' ? [index] : []);
    expect(choiceIndexes.length).toBeGreaterThan(1);
    for (let index = 1; index < choiceIndexes.length; index += 1) expect(choiceIndexes[index] - choiceIndexes[index - 1]).toBe(4);
  });

  it('authors upgrade choice as two readable routes that rejoin safely', () => {
    const groups = encounters(generate(77, 160)).filter((group) => group[0].encounter === 'upgrade-choice');
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const branchPlatforms = group[1].spawns.filter((spawn) => spawn.type === 'platform' && !spawn.motion);
      const upgrades = group[1].spawns.filter((spawn) => spawn.type === 'upgrade');
      expect(branchPlatforms).toHaveLength(2);
      expect(new Set(branchPlatforms.map((spawn) => spawn.x))).toEqual(new Set([82, 278]));
      expect(upgrades).toHaveLength(2);
      expect(new Set(upgrades.map((spawn) => spawn.type === 'upgrade' ? spawn.kind : null))).toEqual(new Set(['dash', 'flow']));
      expect(group[2].spawns.some((spawn) => spawn.type === 'platform' && spawn.x === 180)).toBe(true);
      expect(group[3].rest).toBe(true);
    }
  });

  it('keeps recovery encounters resource-positive', () => {
    const groups = encounters(generate(42, 400)).filter((group) => group[0].encounter === 'recovery');
    for (const group of groups) expect(group.some((band) => band.spawns.some((spawn) => spawn.type === 'crystal'))).toBe(true);
  });

  it('authors dash-chain encounters as drone route then resource landing', () => {
    const groups = encounters(generate(314159, 400)).filter((group) => group[0].encounter === 'dash-chain');
    for (const group of groups) {
      expect(group[1].spawns.some((spawn) => spawn.type === 'drone')).toBe(true);
      expect(group[2].spawns.some((spawn) => spawn.type === 'crystal')).toBe(true);
    }
  });

  it('authors moving-window as an optional moving shortcut with a static fallback', () => {
    const groups = encounters(generate(1618033, 800)).filter((group) => group[0].encounter === 'moving-window');
    for (const group of groups) {
      const movingPlatforms = group[1].spawns.filter((spawn) => spawn.type === 'platform' && spawn.motion);
      const staticPlatforms = group[1].spawns.filter((spawn) => spawn.type === 'platform' && !spawn.motion);
      expect(movingPlatforms).toHaveLength(1);
      expect(staticPlatforms).toHaveLength(1);
    }
  });
});
