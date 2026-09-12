import { describe, expect, it } from 'vitest';
import type { TargetState } from '../src/game/TargetSystem';
import { getChainCastProfile, planChainPropagation } from '../src/progression/ChainEvolutionTuning';

function target(id: number, x: number, y: number): TargetState {
  return { id, kind: 'crystal', position: { x, y }, radius: 16, hp: 1, maxHp: 1 };
}

describe('ChainEvolutionTuning', () => {
  it('keeps Base Chain radial and capped at three secondaries', () => {
    const plan = planChainPropagation(
      { x: 0, y: 0 },
      [target(1, 40, 0), target(2, 80, 0), target(3, 120, 0), target(4, 140, 0)],
      new Set(),
      getChainCastProfile('relay', 0),
    );
    expect(plan.mode).toBe('base');
    expect(plan.routeTargetIds).toEqual([1, 2, 3]);
    expect(plan.qualificationCount).toBe(3);
  });

  it('lets Relay bridge farther than the Base radius through sequential targets', () => {
    const plan = planChainPropagation(
      { x: 0, y: 0 },
      [target(1, 120, 0), target(2, 240, 0), target(3, 360, 0), target(4, 480, 0)],
      new Set(),
      getChainCastProfile('relay', 1),
    );
    expect(plan.mode).toBe('relay');
    expect(plan.routeTargetIds).toEqual([1, 2, 3, 4]);
    expect(plan.links[1].from).toEqual({ x: 120, y: 0 });
  });

  it('adds limited lateral forks at Arc Web without making them continue the main route', () => {
    const plan = planChainPropagation(
      { x: 0, y: 0 },
      [
        target(1, 100, 0),
        target(2, 0, 90),
        target(3, 200, 0),
        target(4, 100, 85),
        target(5, 300, 0),
      ],
      new Set(),
      getChainCastProfile('relay', 2),
    );
    expect(plan.forkTargetIds.length).toBeGreaterThan(0);
    expect(plan.forkTargetIds.length).toBeLessThanOrEqual(2);
    expect(plan.links.some((link) => link.kind === 'fork')).toBe(true);
  });

  it('makes Detonation endpoint placement matter and scales Critical Mass with route length', () => {
    const t1 = planChainPropagation(
      { x: 0, y: 0 },
      [target(1, 100, 0), target(2, 200, 0), target(3, 300, 0), target(4, 365, 20)],
      new Set(),
      getChainCastProfile('detonation', 1),
    );
    const t2 = planChainPropagation(
      { x: 0, y: 0 },
      [target(1, 100, 0), target(2, 200, 0), target(3, 300, 0), target(4, 400, 0), target(5, 485, 20)],
      new Set(),
      getChainCastProfile('detonation', 2),
    );

    expect(t1.mode).toBe('detonation');
    expect(t1.terminalCenter).toEqual({ x: 300, y: 0 });
    expect(t1.terminalTargetIds).toContain(4);
    expect(t2.terminalRadius).toBeGreaterThan(t1.terminalRadius);
    expect(t2.qualificationCount).toBe(4);
  });
});
