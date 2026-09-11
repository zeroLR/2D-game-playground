import { describe, expect, it } from 'vitest';
import { BASE_SPLIT_PROFILE, getSplitCastProfile, projectSplitEchoes } from '../src/progression/SplitEvolutionTuning';

describe('SplitEvolutionTuning', () => {
  it('turns Prism into progressively wider attack coverage', () => {
    const t1 = getSplitCastProfile('prism', 1);
    const t2 = getSplitCastProfile('prism', 2);
    expect(BASE_SPLIT_PROFILE.offsets).toHaveLength(2);
    expect(t1.offsets).toHaveLength(4);
    expect(t2.offsets).toHaveLength(6);
    expect(Math.max(...t2.offsets.map((offset) => Math.abs(offset.lateral)))).toBeGreaterThan(100);
  });

  it('turns Lance into a forward-axis pressure column with a longer usage window', () => {
    const t1 = getSplitCastProfile('lance', 1);
    const t2 = getSplitCastProfile('lance', 2);
    expect(t1.offsets.every((offset) => Math.abs(offset.lateral) <= 12)).toBe(true);
    expect(t2.offsets.every((offset) => Math.abs(offset.lateral) <= 10)).toBe(true);
    expect(Math.max(...t2.offsets.map((offset) => offset.forward))).toBeGreaterThan(100);
    expect(t1.durationSeconds).toBe(1.6);
    expect(t2.durationSeconds).toBe(1.85);
    expect(t1.durationSeconds).toBeGreaterThan(getSplitCastProfile('prism', 1).durationSeconds);
    expect(t2.durationSeconds).toBeGreaterThan(getSplitCastProfile('prism', 2).durationSeconds);
  });

  it('projects the same profile relative to the current ball travel direction', () => {
    const echoes = projectSplitEchoes({ x: 100, y: 100 }, { x: 10, y: 0 }, getSplitCastProfile('lance', 2));
    expect(echoes).toHaveLength(3);
    expect(echoes.every((point) => point.x > 100)).toBe(true);
    expect(echoes.map((point) => point.y)).toEqual([110, 100, 90]);
  });
});
