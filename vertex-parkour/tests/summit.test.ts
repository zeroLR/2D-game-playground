import { describe, expect, it } from 'vitest';
import { buildSummitPlatform, isSummitLanding, SUMMIT_GAP, SUMMIT_WIDTH, SUMMIT_X } from '../src/world/Summit';

describe('Summit chapter exit', () => {
  it('places one wide stable summit above the authored approach', () => {
    const approachY = -1200;
    expect(buildSummitPlatform(approachY)).toEqual({
      type: 'platform',
      x: SUMMIT_X,
      y: approachY - SUMMIT_GAP,
      width: SUMMIT_WIDTH,
    });
    expect(SUMMIT_WIDTH).toBeGreaterThan(150);
  });

  it('only clears when the actual summit platform was landed on', () => {
    expect(isSummitLanding(42, 42)).toBe(true);
    expect(isSummitLanding(41, 42)).toBe(false);
    expect(isSummitLanding(null, 42)).toBe(false);
    expect(isSummitLanding(42, null)).toBe(false);
  });
});
