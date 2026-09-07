import { describe, expect, it, vi } from 'vitest';
import { FixedStepLoop } from '../src/game/FixedStepLoop';

describe('FixedStepLoop', () => {
  it('advances simulation using fixed-size updates', () => {
    const update = vi.fn();
    const render = vi.fn();
    const loop = new FixedStepLoop(update, render, { stepMs: 10, maxStepsPerFrame: 8 });

    expect(loop.tick(35)).toBe(3);
    expect(update).toHaveBeenCalledTimes(3);
    expect(update).toHaveBeenNthCalledWith(1, 0.01);
    expect(update).toHaveBeenNthCalledWith(2, 0.01);
    expect(update).toHaveBeenNthCalledWith(3, 0.01);
    expect(render).toHaveBeenLastCalledWith(0.5);
  });

  it('clamps a long frame to the configured catch-up budget', () => {
    const update = vi.fn();
    const loop = new FixedStepLoop(update, vi.fn(), { stepMs: 10, maxStepsPerFrame: 4 });

    expect(loop.tick(1000)).toBe(4);
    expect(update).toHaveBeenCalledTimes(4);
  });

  it('ignores negative and non-finite elapsed time', () => {
    const update = vi.fn();
    const render = vi.fn();
    const loop = new FixedStepLoop(update, render, { stepMs: 10 });

    expect(loop.tick(-10)).toBe(0);
    expect(loop.tick(Number.NaN)).toBe(0);
    expect(update).not.toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(2);
  });
});
