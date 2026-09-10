import { describe, expect, it } from 'vitest';
import { calculateArenaLayout } from '../src/presentation/ArenaLayout';

describe('ArenaLayout', () => {
  it.each([
    [390, 844],
    [375, 667],
    [320, 568],
  ])('keeps telemetry and Rune HUD outside collision bounds at %ix%i', (width, height) => {
    const layout = calculateArenaLayout(width, height);

    expect(layout.scoreY).toBeLessThan(layout.bounds.top);
    expect(layout.flowBarY).toBeLessThan(layout.bounds.top);
    expect(layout.runeBarY).toBeGreaterThan(layout.bounds.bottom);
    expect(layout.runeGuideY).toBeGreaterThan(layout.bounds.bottom);
    expect(layout.bounds.left).toBeGreaterThanOrEqual(0);
    expect(layout.bounds.right).toBeLessThanOrEqual(width);
    expect(layout.bounds.top).toBeGreaterThan(0);
    expect(layout.bounds.bottom).toBeLessThan(height);
  });

  it('preserves a useful collision surface on a short phone', () => {
    const layout = calculateArenaLayout(320, 568);
    expect(layout.bounds.right - layout.bounds.left).toBeGreaterThan(260);
    expect(layout.bounds.bottom - layout.bounds.top).toBeGreaterThan(360);
  });
});
