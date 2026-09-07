import { describe, expect, it } from 'vitest';
import { classifyDirectionalSwipe, directionVector } from '../src/input/SwipeClassifier';

describe('classifyDirectionalSwipe', () => {
  it('ignores movement below the minimum distance', () => {
    expect(classifyDirectionalSwipe({ x: 10, y: 10 }, { x: 24, y: 18 })).toBeNull();
  });

  it.each([
    [{ x: 0, y: 0 }, { x: 80, y: 18 }, 'right'],
    [{ x: 80, y: 0 }, { x: 0, y: 16 }, 'left'],
    [{ x: 0, y: 80 }, { x: 18, y: 0 }, 'up'],
    [{ x: 0, y: 0 }, { x: 20, y: 90 }, 'down'],
  ] as const)('maps a forgiving diagonal gesture to %s', (start, end, direction) => {
    expect(classifyDirectionalSwipe(start, end)?.direction).toBe(direction);
  });

  it('returns a normalized raw gesture vector for later rune/input arbitration', () => {
    const intent = classifyDirectionalSwipe({ x: 0, y: 0 }, { x: 30, y: 40 });
    expect(intent).not.toBeNull();
    expect(intent?.distance).toBeCloseTo(50);
    expect(intent?.vector.x).toBeCloseTo(0.6);
    expect(intent?.vector.y).toBeCloseTo(0.8);
  });
});

describe('directionVector', () => {
  it('returns canonical unit intent vectors', () => {
    expect(directionVector('up')).toEqual({ x: 0, y: -1 });
    expect(directionVector('down')).toEqual({ x: 0, y: 1 });
    expect(directionVector('left')).toEqual({ x: -1, y: 0 });
    expect(directionVector('right')).toEqual({ x: 1, y: 0 });
  });
});
