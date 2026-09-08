import { describe, expect, it } from 'vitest';
import { CameraFeedback } from '../src/presentation/CameraFeedback';

describe('CameraFeedback', () => {
  it('produces a bounded transient offset and settles to zero', () => {
    const camera = new CameraFeedback();
    camera.kick('overdrive-enter', { x: 20, y: 20 }, { x: 150, y: 250 });

    let peak = 0;
    for (let index = 0; index < 30; index += 1) {
      const offset = camera.update(1 / 60);
      peak = Math.max(peak, Math.hypot(offset.x, offset.y));
      expect(Math.hypot(offset.x, offset.y)).toBeLessThanOrEqual(6.000001);
    }

    expect(peak).toBeGreaterThan(0.5);
    const settled = camera.update(1);
    expect(settled.x).toBeCloseTo(0, 8);
    expect(settled.y).toBeCloseTo(0, 8);
  });

  it('heavily reduces camera displacement when reduced motion is enabled', () => {
    const full = new CameraFeedback();
    const reduced = new CameraFeedback();
    reduced.setReducedMotion(true);

    full.kick('chain');
    reduced.kick('chain');

    const fullOffset = full.update(1 / 60);
    const reducedOffset = reduced.update(1 / 60);

    expect(Math.hypot(reducedOffset.x, reducedOffset.y)).toBeLessThan(Math.hypot(fullOffset.x, fullOffset.y) * 0.3);
  });

  it('caps overlapping impulses instead of allowing runaway displacement', () => {
    const camera = new CameraFeedback();
    for (let index = 0; index < 20; index += 1) camera.kick('overdrive-enter');

    for (let index = 0; index < 20; index += 1) {
      const offset = camera.update(1 / 120);
      expect(Math.hypot(offset.x, offset.y)).toBeLessThanOrEqual(6.000001);
    }
  });
});
