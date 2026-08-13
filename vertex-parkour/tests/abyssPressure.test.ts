import { describe, expect, it } from 'vitest';
import {
  ABYSS_APPROACH_SPEED,
  ABYSS_START_WORLD_Y,
  AbyssPressureSystem,
} from '../src/systems/AbyssPressureSystem';

describe('AbyssPressureSystem', () => {
  it('starts at the configured world-space boundary', () => {
    const abyss = new AbyssPressureSystem();
    expect(abyss.getWorldY()).toBe(ABYSS_START_WORLD_Y);
  });

  it('moves upward continuously in world space', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(1);
    expect(abyss.getWorldY()).toBeCloseTo(ABYSS_START_WORLD_Y - ABYSS_APPROACH_SPEED);
  });

  it('projects the same world boundary through the camera offset', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(2);
    expect(abyss.getScreenY(120)).toBeCloseTo(abyss.getWorldY() + 120);
  });

  it('does not recover just because the player reaches a new height', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(1);
    const before = abyss.getWorldY();
    abyss.update(1);
    expect(abyss.getWorldY()).toBeCloseTo(before - ABYSS_APPROACH_SPEED);
  });

  it('catches the player when their world position reaches the boundary', () => {
    const abyss = new AbyssPressureSystem();
    const boundary = abyss.getWorldY();
    expect(abyss.isCaught(boundary - 1)).toBe(false);
    expect(abyss.isCaught(boundary)).toBe(true);
    expect(abyss.isCaught(boundary + 20)).toBe(true);
  });

  it('reset restores the initial world-space boundary', () => {
    const abyss = new AbyssPressureSystem();
    abyss.update(5);
    abyss.reset();
    expect(abyss.getWorldY()).toBe(ABYSS_START_WORLD_Y);
  });
});
