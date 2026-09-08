import { describe, expect, it } from 'vitest';
import {
  gateOpeningProgress,
  gateVisualState,
  relicAnimationFrame,
  relicVisible,
} from '../src/presentation/world-object-state';

describe('P4.1.1 world-embedded objective state', () => {
  it('keeps the relic visible until it is intentionally collected', () => {
    expect(relicVisible(false)).toBe(true);
    expect(relicVisible(true)).toBe(false);
  });

  it('moves the gate from sealed through opening to open', () => {
    expect(gateVisualState(false, null)).toBe('sealed');
    expect(gateVisualState(true, 0)).toBe('opening');
    expect(gateVisualState(true, null)).toBe('open');
  });

  it('keeps pixel animation frames deterministic', () => {
    expect([0, 1, 2, 3, 4].map(relicAnimationFrame)).toEqual([0, 1, 2, 3, 0]);
    expect(gateOpeningProgress(0, 5)).toBe(0);
    expect(gateOpeningProgress(2, 5)).toBe(0.5);
    expect(gateOpeningProgress(4, 5)).toBe(1);
  });
});
