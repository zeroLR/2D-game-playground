import { describe, expect, it } from 'vitest';
import {
  ABYSS_APPROACH_SPEED,
  ABYSS_BASE_Y,
  ABYSS_MAX_RISE,
  ABYSS_RECOVERY_SPEED,
  AbyssPressureSystem,
} from '../src/systems/AbyssPressureSystem';

describe('AbyssPressureSystem', () => {
  it('starts at the baseline boundary', () => {
    const abyss = new AbyssPressureSystem();
    expect(abyss.getBoundaryY()).toBe(ABYSS_BASE_Y);
  });

  it('approaches while the player is not making new upward progress', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(500, 0.1);
    const before = abyss.getBoundaryY();
    abyss.update(500, 1);
    expect(abyss.getBoundaryY()).toBeCloseTo(before - ABYSS_APPROACH_SPEED);
  });

  it('recovers faster when the player reaches a new height', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(500, 0.1);
    abyss.update(500, 2);
    const pressured = abyss.getBoundaryY();
    abyss.update(450, 0.5);
    expect(abyss.getBoundaryY()).toBeCloseTo(Math.min(ABYSS_BASE_Y, pressured + ABYSS_RECOVERY_SPEED * 0.5));
  });

  it('caps pressure at the configured maximum rise', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(500, 0.1);
    abyss.update(500, 100);
    expect(abyss.getBoundaryY()).toBe(ABYSS_BASE_Y - ABYSS_MAX_RISE);
  });

  it('catches the player at or below the visible boundary', () => {
    const abyss = new AbyssPressureSystem();
    expect(abyss.isCaught(ABYSS_BASE_Y - 1)).toBe(false);
    expect(abyss.isCaught(ABYSS_BASE_Y)).toBe(true);
    expect(abyss.isCaught(ABYSS_BASE_Y + 20)).toBe(true);
  });

  it('reset clears accumulated pressure', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(500, 0.1);
    abyss.update(500, 5);
    abyss.reset();
    expect(abyss.getBoundaryY()).toBe(ABYSS_BASE_Y);
  });
});
