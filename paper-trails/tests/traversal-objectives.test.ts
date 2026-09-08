import { describe, expect, it } from 'vitest';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../src/domain/demo-level';
import {
  createObjectiveProgress,
  resolveObjectiveArrival,
  resolveObjectiveTraversal,
} from '../src/domain/objectives';
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

describe('P4.1.1 objective semantics', () => {
  it('keeps the exit locked before treasure, then completes after explicitly returning to it', () => {
    const world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
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

  it('ignores an exit crossed on the way to the relic because only the selected destination resolves', () => {
    let world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    world = rotatePage(world, DEMO_DEFINITION_REGISTRY, 'p7');
    const graph = buildAdjacencyGraph(world, DEMO_DEFINITION_REGISTRY);
    const path = shortestPath(graph, world.travelerPageId, 'p9');
    expect(path).toEqual(['p7', 'p4', 'p1', 'p2', 'p3', 'p6', 'p9']);

    const pages = path!.map((pageId) => world.pages.find((page) => page.id === pageId)!);
    const resolution = resolveObjectiveTraversal(createObjectiveProgress(), pages);
    expect(resolution.event).toBe('treasure-collected');
    expect(resolution.progress.treasureCollected).toBe(true);
    expect(resolution.progress.completed).toBe(false);
  });

  it('does not complete when an open exit is only an intermediate Page', () => {
    const world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    const p9 = world.pages.find((page) => page.id === 'p9')!;
    const p6 = world.pages.find((page) => page.id === 'p6')!;
    const p3 = world.pages.find((page) => page.id === 'p3')!;
    const p2 = world.pages.find((page) => page.id === 'p2')!;
    const withRelic = { treasureCollected: true, completed: false } as const;

    const resolution = resolveObjectiveTraversal(withRelic, [p9, p6, p3, p2]);
    expect(resolution.event).toBe('none');
    expect(resolution.progress.completed).toBe(false);
  });
});
