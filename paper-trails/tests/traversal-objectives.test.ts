import { describe, expect, it } from 'vitest';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../src/domain/demo-level';
import { createObjectiveProgress, resolveObjectiveArrival } from '../src/domain/objectives';
import {
  buildAdjacencyGraph,
  moveTravelerToPage,
  resetLevel,
  rotatePage,
  shortestPath,
} from '../src/domain/world';

describe('P3 traveler traversal', () => {
  it('opens the authored route with one rotation and follows the deterministic shortest path', () => {
    let world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    world = rotatePage(world, DEMO_DEFINITION_REGISTRY, 'p7');
    const graph = buildAdjacencyGraph(world, DEMO_DEFINITION_REGISTRY);
    const path = shortestPath(graph, world.travelerPageId, 'p9');

    expect(path).toEqual(['p7', 'p4', 'p1', 'p2', 'p3', 'p6', 'p9']);
    for (const pageId of path?.slice(1) ?? []) world = moveTravelerToPage(world, pageId);
    expect(world.travelerPageId).toBe('p9');
  });

  it('moves the traveler immutably and increments revision', () => {
    const world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    const moved = moveTravelerToPage(world, 'p4');
    expect(world.travelerPageId).toBe('p7');
    expect(moved.travelerPageId).toBe('p4');
    expect(moved.revision).toBe(world.revision + 1);
    expect(() => moveTravelerToPage(world, 'missing')).toThrow('Unknown page');
  });
});

describe('P3 objective loop', () => {
  it('keeps the exit locked before treasure, then completes after returning with treasure', () => {
    let world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    let progress = createObjectiveProgress();
    const goal = world.pages.find((page) => page.id === 'p3');
    const treasure = world.pages.find((page) => page.id === 'p9');
    expect(goal).toBeDefined();
    expect(treasure).toBeDefined();

    const locked = resolveObjectiveArrival(progress, goal!);
    expect(locked.event).toBe('goal-locked');
    expect(locked.progress.completed).toBe(false);

    const collected = resolveObjectiveArrival(progress, treasure!);
    progress = collected.progress;
    expect(collected.event).toBe('treasure-collected');
    expect(progress.treasureCollected).toBe(true);

    const completed = resolveObjectiveArrival(progress, goal!);
    expect(completed.event).toBe('completed');
    expect(completed.progress.completed).toBe(true);
  });
});
