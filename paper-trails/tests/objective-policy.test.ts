import { describe, expect, it } from 'vitest';
import { P5_DEFINITION_REGISTRY, levelAt } from '../src/content/p5-levels';
import { createObjectiveProgress, resolveObjectiveTraversal } from '../src/domain/objectives';
import { resetLevel } from '../src/domain/world';

describe('P5 objective policy', () => {
  it('allows the L5 exit without collecting the optional relic', () => {
    const entry = levelAt(4);
    const world = resetLevel(entry.level, P5_DEFINITION_REGISTRY);
    const goal = world.pages.find((page) => page.state.objective === 'goal');
    expect(goal).toBeDefined();

    const resolution = resolveObjectiveTraversal(createObjectiveProgress(), [goal!], false);
    expect(resolution.event).toBe('completed');
    expect(resolution.progress.treasureCollected).toBe(false);
  });

  it('keeps the L9 exit sealed until the required relic is collected', () => {
    const entry = levelAt(8);
    const world = resetLevel(entry.level, P5_DEFINITION_REGISTRY);
    const goal = world.pages.find((page) => page.state.objective === 'goal');
    expect(goal).toBeDefined();

    const resolution = resolveObjectiveTraversal(createObjectiveProgress(), [goal!], true);
    expect(resolution.event).toBe('goal-locked');
  });
});
