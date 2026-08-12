import { describe, expect, it } from 'vitest';
import { WorldState } from '../src/world/WorldState';

describe('WorldState', () => {
  it('assigns stable entity ids and keeps gameplay state data-only', () => {
    const world = new WorldState();
    const platform = world.addSpawn({ type: 'platform', x: 180, y: 500, width: 90 });
    const drone = world.addSpawn({ type: 'drone', x: 82, y: 440, phase: 1.2 });
    expect(platform.id).toBe(1);
    expect(drone.id).toBe(2);
    expect(world.platforms[0]).toMatchObject({ type: 'platform', x: 180, y: 500, width: 90 });
    expect(world.drones[0]).toMatchObject({ type: 'drone', destroyed: false, phase: 1.2 });
    expect('view' in world.platforms[0]).toBe(false);
    expect('view' in world.drones[0]).toBe(false);
  });

  it('resets ids and entity collections on clear', () => {
    const world = new WorldState();
    world.addSpawn({ type: 'hazard', x: 82, y: 400 });
    world.clear();
    expect(world.all()).toEqual([]);
    expect(world.addSpawn({ type: 'crystal', x: 180, y: 350 }).id).toBe(1);
  });
});
