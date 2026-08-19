import { describe, expect, it } from 'vitest';
import { CONTROL_HEIGHT, GAMEPLAY_HEIGHT, LOGICAL_HEIGHT, LOGICAL_WIDTH, fitPortraitViewport } from '../src/layout';

describe('mobile portrait shell', () => {
  it('keeps the 390x844 logical layout split', () => {
    expect(LOGICAL_WIDTH).toBe(390);
    expect(LOGICAL_HEIGHT).toBe(844);
    expect(GAMEPLAY_HEIGHT).toBe(560);
    expect(CONTROL_HEIGHT).toBe(284);
  });

  it('fits without cropping', () => {
    const fitted = fitPortraitViewport(1170, 2532);
    expect(fitted.width).toBeLessThanOrEqual(1170);
    expect(fitted.height).toBeLessThanOrEqual(2532);
    expect(fitted.width / fitted.height).toBeCloseTo(390 / 844, 5);
  });
});
