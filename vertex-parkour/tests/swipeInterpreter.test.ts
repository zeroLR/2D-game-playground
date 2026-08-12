import { describe, expect, it } from 'vitest';
import { interpretKey, interpretSwipe } from '../src/input/SwipeInterpreter';

describe('swipe interpreter', () => {
  it('ignores gestures below the horizontal dead zone', () => {
    expect(interpretSwipe(23, 0, 0)).toBeNull();
    expect(interpretSwipe(40, 60, 0)).toBeNull();
  });

  it('maps short swipes to a free air nudge', () => {
    const command = interpretSwipe(40, 0, 0);
    expect(command?.type).toBe('air-nudge');
    if (command?.type === 'air-nudge') {
      expect(command.direction).toBe(1);
      expect(command.strength).toBeGreaterThanOrEqual(0.45);
      expect(command.strength).toBeLessThan(1);
    }
  });

  it('maps medium and long swipes to a strength-scaled dash', () => {
    const medium = interpretSwipe(70, 0, 0);
    const long = interpretSwipe(120, 0, 0);
    expect(medium?.type).toBe('dash');
    expect(long?.type).toBe('dash');
    if (medium?.type === 'dash' && long?.type === 'dash') {
      expect(medium.strength).toBeLessThan(long.strength);
      expect(long.strength).toBe(1);
    }
  });

  it('prioritizes wall jump when swiping away from a contacted wall', () => {
    expect(interpretSwipe(80, 0, -1)).toEqual({ type: 'wall-jump', direction: 1 });
    expect(interpretSwipe(-80, 0, 1)).toEqual({ type: 'wall-jump', direction: -1 });
  });

  it('preserves keyboard semantics through the same interpreter', () => {
    expect(interpretKey('ArrowLeft', 0, false)?.type).toBe('dash');
    expect(interpretKey('r', 0, true)).toEqual({ type: 'restart' });
    expect(interpretKey('r', 0, false)).toBeNull();
  });
});
