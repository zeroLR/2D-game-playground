import { describe, expect, it } from 'vitest';
import { ComboModel } from '../src/game/ComboModel';

describe('ComboModel', () => {
  it('increments combo only on breaks and tracks longest combo', () => {
    const combo = new ComboModel();
    combo.registerContact();
    expect(combo.snapshot.combo).toBe(0);

    combo.registerBreak(100);
    combo.registerBreak(100);
    expect(combo.snapshot.combo).toBe(2);
    expect(combo.snapshot.longestCombo).toBe(2);
  });

  it('uses a forgiving inactivity window before reset', () => {
    const combo = new ComboModel(2.2);
    combo.registerBreak(100);
    expect(combo.update(2.0)).toBe(false);
    expect(combo.snapshot.combo).toBe(1);
    expect(combo.update(0.21)).toBe(true);
    expect(combo.snapshot.combo).toBe(0);
  });

  it('keeps a live combo from expiring immediately after an armored contact', () => {
    const combo = new ComboModel(2.2);
    combo.registerBreak(100);
    combo.update(1.8);
    combo.registerContact();
    expect(combo.snapshot.secondsRemaining).toBeCloseTo(0.9);
    expect(combo.update(0.8)).toBe(false);
    expect(combo.snapshot.combo).toBe(1);
  });

  it('steps score multiplier at readable combo milestones', () => {
    const combo = new ComboModel();
    const rewards = Array.from({ length: 5 }, () => combo.registerBreak(100));
    expect(rewards[0].multiplier).toBe(1);
    expect(rewards[3].multiplier).toBe(1);
    expect(rewards[4].multiplier).toBe(1.25);
    expect(combo.snapshot.score).toBe(525);
  });
});
