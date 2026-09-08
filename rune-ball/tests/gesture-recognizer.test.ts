import { describe, expect, it } from 'vitest';
import { classifyGesturePath, normalizeGesturePath, simplifyGesturePath } from '../src/input/GestureRecognizer';
import type { Point2D } from '../src/input/SwipeClassifier';

function circlePoints(clockwise = true): Point2D[] {
  const points: Point2D[] = [];
  const count = 32;
  for (let index = 0; index <= count; index += 1) {
    const t = (index / count) * Math.PI * 2 * (clockwise ? 1 : -1);
    points.push({ x: 140 + Math.cos(t) * 62, y: 180 + Math.sin(t) * 58 });
  }
  return points;
}

describe('GestureRecognizer', () => {
  it('keeps ordinary straight input classified as a directional swipe', () => {
    const intent = classifyGesturePath([
      { x: 20, y: 200 },
      { x: 70, y: 204 },
      { x: 145, y: 209 },
    ]);
    expect(intent).toEqual({ type: 'swipe', direction: 'right' });
  });

  it('recognizes clockwise and counter-clockwise circles as Vortex', () => {
    expect(classifyGesturePath(circlePoints(true))).toMatchObject({ type: 'rune', rune: 'vortex' });
    expect(classifyGesturePath(circlePoints(false))).toMatchObject({ type: 'rune', rune: 'vortex' });
  });

  it('recognizes a V gesture as Split in either drawing direction', () => {
    const path = [
      { x: 60, y: 90 },
      { x: 84, y: 142 },
      { x: 120, y: 214 },
      { x: 158, y: 140 },
      { x: 184, y: 92 },
    ];
    expect(classifyGesturePath(path)).toMatchObject({ type: 'rune', rune: 'split' });
    expect(classifyGesturePath([...path].reverse())).toMatchObject({ type: 'rune', rune: 'split' });
  });

  it('recognizes a Z gesture as Chain in either drawing direction', () => {
    const path = [
      { x: 55, y: 90 },
      { x: 184, y: 94 },
      { x: 62, y: 210 },
      { x: 188, y: 214 },
    ];
    expect(classifyGesturePath(path)).toMatchObject({ type: 'rune', rune: 'chain' });
    expect(classifyGesturePath([...path].reverse())).toMatchObject({ type: 'rune', rune: 'chain' });
  });

  it('returns non-blocking failed-rune intent for a deliberate unknown shape', () => {
    const intent = classifyGesturePath([
      { x: 40, y: 70 },
      { x: 42, y: 190 },
      { x: 130, y: 190 },
      { x: 180, y: 125 },
    ]);
    expect(intent.type).toBe('failed-rune');
  });

  it('normalizes and simplifies paths deterministically', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 20, y: 2 },
      { x: 40, y: 0 },
      { x: 60, y: 70 },
      { x: 80, y: 110 },
    ];
    const simplified = simplifyGesturePath(path, 6);
    const normalized = normalizeGesturePath(path, 12);
    expect(simplified.length).toBeGreaterThanOrEqual(3);
    expect(normalized).toHaveLength(12);
    expect(Math.min(...normalized.map((point) => point.x))).toBeCloseTo(0, 8);
    expect(Math.max(...normalized.map((point) => point.y))).toBeCloseTo(1, 8);
  });
});
