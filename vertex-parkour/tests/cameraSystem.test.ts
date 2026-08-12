import { describe, expect, it } from 'vitest';
import { CameraSystem } from '../src/systems/CameraSystem';

describe('CameraSystem', () => {
  it('stays still while the player remains below the upward dead zone', () => {
    const camera = new CameraSystem();
    expect(camera.update(500, 1 / 60)).toBe(0);
  });

  it('follows upward progress without scrolling backward', () => {
    const camera = new CameraSystem();
    const first = camera.update(250, 1 / 60);
    const second = camera.update(500, 1 / 60);
    expect(first).toBeGreaterThan(0);
    expect(second).toBeGreaterThanOrEqual(first);
  });

  it('resets offset and velocity for a new run', () => {
    const camera = new CameraSystem();
    camera.update(200, 0.1);
    camera.reset();
    expect(camera.getOffset()).toBe(0);
  });
});
