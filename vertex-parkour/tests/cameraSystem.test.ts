import { describe, expect, it } from 'vitest';
import { CameraSystem } from '../src/systems/CameraSystem';

describe('CameraSystem', () => {
  it('stays still while the player remains inside the vertical safe zone', () => {
    const camera = new CameraSystem();
    expect(camera.update(500, 1 / 60)).toBe(0);
  });

  it('follows upward progress through the upper dead zone', () => {
    const camera = new CameraSystem();
    const first = camera.update(250, 1 / 60);
    const second = camera.update(230, 1 / 60);
    expect(first).toBeGreaterThan(0);
    expect(second).toBeGreaterThan(first);
  });

  it('does not chase ordinary small downward movement inside the safe zone', () => {
    const camera = new CameraSystem();
    for (let i = 0; i < 30; i += 1) camera.update(250, 1 / 60);
    const before = camera.getOffset();
    const after = camera.update(400 - before, 1 / 60);
    expect(after).toBeGreaterThanOrEqual(before - 0.5);
  });

  it('follows downward once the player falls below the rescue zone', () => {
    const camera = new CameraSystem();
    for (let i = 0; i < 45; i += 1) camera.update(220, 1 / 60);
    const before = camera.getOffset();
    let after = before;
    for (let i = 0; i < 30; i += 1) after = camera.update(700 - before, 1 / 60);
    expect(after).toBeLessThan(before);
  });

  it('limits downward camera velocity so recovery does not snap', () => {
    const camera = new CameraSystem();
    for (let i = 0; i < 45; i += 1) camera.update(220, 1 / 60);
    const before = camera.getOffset();
    const after = camera.update(1200, 0.033);
    expect(before - after).toBeLessThanOrEqual(260 * 0.033 + 0.01);
  });

  it('resets offset and velocity for a new run', () => {
    const camera = new CameraSystem();
    camera.update(200, 0.1);
    camera.reset();
    expect(camera.getOffset()).toBe(0);
  });
});
