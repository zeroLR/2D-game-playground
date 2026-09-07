import { describe, expect, it } from 'vitest';
import { cellRect, computeBoardLayout, gridPositionAtPoint } from '../src/presentation/board-layout';

describe('mobile board layout', () => {
  it('keeps pages and controls comfortably above the 44 CSS px touch-target floor on a typical phone', () => {
    const layout = computeBoardLayout(390, 844);
    expect(layout.pageSize).toBeGreaterThanOrEqual(44);
    expect(layout.rotateButton.width).toBeGreaterThanOrEqual(44);
    expect(layout.rotateButton.height).toBeGreaterThanOrEqual(44);
    expect(layout.resetButton.height).toBeGreaterThanOrEqual(44);
    expect(layout.boardX).toBeGreaterThanOrEqual(0);
    expect(layout.boardX + layout.boardWidth).toBeLessThanOrEqual(390);
    expect(layout.resetButton.y + layout.resetButton.height).toBeLessThanOrEqual(844);
  });

  it('maps points inside page cells while rejecting gutters between pages', () => {
    const layout = computeBoardLayout(390, 844);
    const middle = cellRect(layout, { row: 1, column: 1 });
    expect(gridPositionAtPoint(layout, middle.x + middle.width / 2, middle.y + middle.height / 2)).toEqual({ row: 1, column: 1 });

    const first = cellRect(layout, { row: 0, column: 0 });
    expect(gridPositionAtPoint(layout, first.x + first.width + layout.gap / 2, first.y + first.height / 2)).toBeNull();
  });

  it('remains usable on a compact portrait viewport', () => {
    const layout = computeBoardLayout(320, 568);
    expect(layout.pageSize).toBeGreaterThanOrEqual(44);
    expect(layout.boardY).toBeGreaterThanOrEqual(100);
    expect(layout.feedbackY).toBeLessThanOrEqual(548);
  });
});
