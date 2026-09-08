import { describe, expect, it } from 'vitest';
import { CameraFeedback } from '../src/presentation/CameraFeedback';

function measurePeak(camera: CameraFeedback, frames = 30): number {
  let peak = 0;
  for (let index = 0; index < frames; index += 1) {
    const offset = camera.update(1 / 60);
    peak = Math.max(peak, Math.hypot(offset.x, offset.y));
  }
  return peak;
}

describe('CameraFeedback', () => {
  it('produces a readable but bounded Overdrive entry punch and settles to zero', () => {
    const camera = new CameraFeedback();
    camera.kick('overdrive-enter', { x: 20, y: 20 }, { x: 150, y: 250 });

    const peak = measurePeak(camera);
    expect(peak).toBeGreaterThan(3);
    expect(peak).toBeLessThanOrEqual(6.000001);

    const settled = camera.update(1);
    expect(settled.x).toBeCloseTo(0, 8);
    expect(settled.y).toBeCloseTo(0, 8);
  });

  it('keeps Chain materially stronger than Break without turning either into continuous shake', () => {
    const breakCamera = new CameraFeedback();
    const chainCamera = new CameraFeedback();
    breakCamera.kick('break');
    chainCamera.kick('chain');

    const breakPeak = measurePeak(breakCamera, 12);
    const chainPeak = measurePeak(chainCamera, 16);

    expect(breakPeak).toBeGreaterThan(0.8);
    expect(chainPeak).toBeGreaterThan(breakPeak * 1.35);
    expect(chainPeak).toBeLessThanOrEqual(6.000001);
  });

  it('heavily reduces camera displacement when reduced motion is enabled', () => {
    const full = new CameraFeedback();
    const reduced = new CameraFeedback();
    reduced.setReducedMotion(true);

    full.kick('chain');
    reduced.kick('chain');

    const fullPeak = measurePeak(full, 16);
    const reducedPeak = measurePeak(reduced, 16);

    expect(reducedPeak).toBeLessThan(fullPeak * 0.3);
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
