import { describe, expect, it } from 'vitest';
import { PointerPathSampler } from '../src/input/PointerPathSampler';

describe('PointerPathSampler', () => {
  it('drops tiny pointer jitter while preserving the gesture path', () => {
    const sampler = new PointerPathSampler();
    sampler.begin({ x: 10, y: 10 });
    sampler.add({ x: 12, y: 12 });
    sampler.add({ x: 20, y: 10 });
    sampler.add({ x: 30, y: 14 });

    expect(sampler.snapshot).toEqual([
      { x: 10, y: 10 },
      { x: 20, y: 10 },
      { x: 30, y: 14 },
    ]);
  });

  it('returns a finished path and resets for the next pointer gesture', () => {
    const sampler = new PointerPathSampler();
    sampler.begin({ x: 0, y: 0 });
    const path = sampler.finish({ x: 40, y: 0 });

    expect(path).toEqual([{ x: 0, y: 0 }, { x: 40, y: 0 }]);
    expect(sampler.snapshot).toEqual([]);
  });
});
