import { describe, expect, it } from 'vitest';
import { WorldState } from '../src/world/WorldState';

function addMovingPale(world: WorldState, phase: number) {
  return world.addSpawn({
    type: 'platform',
    x: 180,
    y: -900,
    width: 64,
    motion: { axis: 'x', amplitude: 20, speed: 0.3, phase, originX: 180 },
  }, null, 'pale-heights');
}

describe('Pale collapsing ice', () => {
  it('marks only a sparse subset of moving Pale floes as collapsible', () => {
    const world = new WorldState();
    const platforms = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((phase) => addMovingPale(world, phase));
    const collapsible = platforms.filter((entity) => entity.type === 'platform' && entity.collapsible);
    expect(collapsible.length).toBeGreaterThan(0);
    expect(collapsible.length).toBeLessThan(platforms.length);
  });

  it('never marks stable Pale shelves or non-Pale platforms collapsible', () => {
    const world = new WorldState();
    const paleShelf = world.addSpawn({ type: 'platform', x: 180, y: -900, width: 112 }, null, 'pale-heights');
    const violetMoving = world.addSpawn({ type: 'platform', x: 180, y: -980, width: 64, motion: { axis: 'x', amplitude: 20, speed: 0.3, phase: 0.2, originX: 180 } }, null, 'violet-zone');
    expect(paleShelf.type === 'platform' && paleShelf.collapsible).toBe(false);
    expect(violetMoving.type === 'platform' && violetMoving.collapsible).toBe(false);
  });

  it('transitions stable -> cracking -> broken after landing trigger', () => {
    const world = new WorldState();
    let platform = addMovingPale(world, 0.1);
    for (let phase = 0.2; platform.type === 'platform' && !platform.collapsible && phase < 2; phase += 0.1) platform = addMovingPale(world, phase);
    expect(platform.type).toBe('platform');
    if (platform.type !== 'platform') return;
    expect(platform.collapsible).toBe(true);
    world.triggerPlatformCollapse(platform.id, 1);
    expect(platform.collapseState).toBe('cracking');
    world.updatePlatformCollapse(0.6);
    expect(platform.collapseState).toBe('cracking');
    world.updatePlatformCollapse(0.4);
    expect(platform.collapseState).toBe('broken');
  });
});
