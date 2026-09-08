import { describe, expect, it } from 'vitest';
import {
  P5_DEFINITION_REGISTRY,
  P5_LEVELS,
  firstIncompleteLevelIndex,
  levelAt,
  validateP5LevelSet,
} from '../src/content/p5-levels';
import {
  buildAdjacencyGraph,
  reachablePages,
  resetLevel,
  rotatePage,
  swapPages,
} from '../src/domain/world';

function reachable(levelIndex: number, mutate?: (world: ReturnType<typeof resetLevel>) => ReturnType<typeof resetLevel>) {
  const entry = levelAt(levelIndex);
  let world = resetLevel(entry.level, P5_DEFINITION_REGISTRY);
  if (mutate) world = mutate(world);
  const graph = buildAdjacencyGraph(world, P5_DEFINITION_REGISTRY);
  return reachablePages(graph, world.travelerPageId);
}

describe('P5 authored level catalog', () => {
  it('contains ten valid 3x3 levels with a single goal each', () => {
    expect(P5_LEVELS).toHaveLength(10);
    expect(validateP5LevelSet()).toEqual([]);
  });

  it('resumes from the first incomplete level', () => {
    expect(firstIncompleteLevelIndex([])).toBe(0);
    expect(firstIncompleteLevelIndex(['paper-trails-p5-l1', 'paper-trails-p5-l2'])).toBe(2);
    expect(firstIncompleteLevelIndex(P5_LEVELS.map((entry) => entry.level.id))).toBe(9);
  });

  it('L1 teaches a single rotate', () => {
    expect(reachable(0).has('p1')).toBe(false);
    expect(reachable(0, (world) => rotatePage(world, P5_DEFINITION_REGISTRY, 'p7')).has('p1')).toBe(true);
  });

  it('L2 requires matching two orientations', () => {
    expect(reachable(1, (world) => rotatePage(world, P5_DEFINITION_REGISTRY, 'p7')).has('p1')).toBe(false);
    expect(reachable(1, (world) => {
      let next = rotatePage(world, P5_DEFINITION_REGISTRY, 'p7');
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4');
      return next;
    }).has('p1')).toBe(true);
  });

  it('L3 is solvable by swap with rotation disabled by level rules', () => {
    expect(P5_LEVELS[2]?.allowRotate).toBe(false);
    expect(reachable(2).has('p1')).toBe(false);
    expect(reachable(2, (world) => swapPages(world, P5_DEFINITION_REGISTRY, 'p4', 'p5')).has('p1')).toBe(true);
  });

  it('L4 requires both turn and exchange in the intended short solution', () => {
    expect(reachable(3, (world) => rotatePage(world, P5_DEFINITION_REGISTRY, 'p7')).has('p1')).toBe(false);
    expect(reachable(3, (world) => {
      let next = rotatePage(world, P5_DEFINITION_REGISTRY, 'p7');
      next = swapPages(next, P5_DEFINITION_REGISTRY, 'p4', 'p5');
      return next;
    }).has('p1')).toBe(true);
  });

  it('L5 starts with a working exit but moving the corner can open the optional relic route', () => {
    expect(reachable(4).has('p1')).toBe(true);
    expect(reachable(4).has('p9')).toBe(false);
    const detour = reachable(4, (world) => {
      let next = swapPages(world, P5_DEFINITION_REGISTRY, 'p4', 'p6');
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4', 2);
      return next;
    });
    expect(detour.has('p1')).toBe(false);
    expect(detour.has('p9')).toBe(true);
  });

  it('L6 supports two distinct routes into the same goal', () => {
    const leftRoute = reachable(5, (world) => rotatePage(world, P5_DEFINITION_REGISTRY, 'p4', 3));
    const topRoute = reachable(5, (world) => rotatePage(world, P5_DEFINITION_REGISTRY, 'p2', 3));
    expect(leftRoute.has('p1')).toBe(true);
    expect(topRoute.has('p1')).toBe(true);
  });

  it('L7 exposes both the sealed goal and relic so state, not connectivity, is the lesson', () => {
    const set = reachable(6);
    expect(set.has('p2')).toBe(true);
    expect(set.has('p9')).toBe(true);
    expect(P5_LEVELS[6]?.relicPolicy).toBe('required');
  });

  it('L8 requires destroying the existing upper route to open the lower goal route', () => {
    const initial = reachable(7);
    expect(initial.has('p1')).toBe(true);
    expect(initial.has('p9')).toBe(false);
    const goalRoute = reachable(7, (world) => {
      let next = swapPages(world, P5_DEFINITION_REGISTRY, 'p4', 'p6');
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4', 2);
      return next;
    });
    expect(goalRoute.has('p1')).toBe(false);
    expect(goalRoute.has('p9')).toBe(true);
  });

  it('L9 requires a relic detour and a second reconfiguration back to the exit', () => {
    const relicRoute = reachable(8, (world) => {
      let next = swapPages(world, P5_DEFINITION_REGISTRY, 'p4', 'p6');
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4', 2);
      return next;
    });
    expect(relicRoute.has('p9')).toBe(true);
    expect(relicRoute.has('p1')).toBe(false);

    const restored = reachable(8, (world) => {
      let next = swapPages(world, P5_DEFINITION_REGISTRY, 'p4', 'p6');
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4', 2);
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p4', 2);
      next = swapPages(next, P5_DEFINITION_REGISTRY, 'p4', 'p6');
      return next;
    });
    expect(restored.has('p1')).toBe(true);
  });

  it('L10 uses all six art families and supports relic then goal mastery sequence', () => {
    expect(new Set(P5_LEVELS[9]?.level.pages.map((page) => page.definitionId))).toEqual(new Set([
      'forest-path',
      'ruined-gate',
      'stone-bridge',
      'crossroads',
      'shrine-seal',
      'hidden-grove',
    ]));

    const relicRoute = reachable(9, (world) => {
      let next = rotatePage(world, P5_DEFINITION_REGISTRY, 'p8', 3);
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p6', 2);
      return next;
    });
    expect(relicRoute.has('p9')).toBe(true);

    const goalRoute = reachable(9, (world) => {
      let next = rotatePage(world, P5_DEFINITION_REGISTRY, 'p8', 3);
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p6', 2);
      next = rotatePage(next, P5_DEFINITION_REGISTRY, 'p6', 2);
      next = swapPages(next, P5_DEFINITION_REGISTRY, 'p6', 'p4');
      return next;
    });
    expect(goalRoute.has('p1')).toBe(true);
  });
});
