import { describe, expect, it } from 'vitest';
import { TargetSystem } from '../src/game/TargetSystem';
import type { ArenaBounds } from '../src/game/BallModel';

const bounds: ArenaBounds = { left: 0, right: 300, top: 0, bottom: 500 };

describe('TargetSystem', () => {
  it('starts with deterministic target density inside arena bounds', () => {
    const system = new TargetSystem(bounds, 8);
    const targets = system.snapshot;
    expect(targets).toHaveLength(8);
    expect(targets.filter((target) => target.kind === 'armored')).toHaveLength(2);
    for (const target of targets) {
      expect(target.position.x).toBeGreaterThanOrEqual(bounds.left + target.radius);
      expect(target.position.x).toBeLessThanOrEqual(bounds.right - target.radius);
      expect(target.position.y).toBeGreaterThanOrEqual(bounds.top + target.radius);
      expect(target.position.y).toBeLessThanOrEqual(bounds.bottom - target.radius);
    }
  });

  it('destroys a crystal in one hit and respawns after the authored delay', () => {
    const system = new TargetSystem(bounds, 4);
    const crystal = system.snapshot.find((target) => target.kind === 'crystal');
    expect(crystal).toBeDefined();

    const result = system.hit(crystal!.id);
    expect(result?.destroyed).toBe(true);
    expect(system.snapshot).toHaveLength(3);
    expect(system.update(0.1)).toHaveLength(0);
    expect(system.update(0.14)).toHaveLength(1);
    expect(system.snapshot).toHaveLength(4);
  });

  it('requires two hits to break an armored crystal', () => {
    const system = new TargetSystem(bounds, 4);
    const armored = system.snapshot.find((target) => target.kind === 'armored');
    expect(armored).toBeDefined();

    const first = system.hit(armored!.id);
    expect(first?.destroyed).toBe(false);
    expect(first?.armorBroken).toBe(true);
    expect(first?.target.hp).toBe(1);

    const second = system.hit(armored!.id);
    expect(second?.destroyed).toBe(true);
  });

  it('returns circle-overlap collision candidates', () => {
    const system = new TargetSystem(bounds, 1);
    const target = system.snapshot[0];
    expect(system.collidingTargetIds(target.position, 18)).toEqual([target.id]);
    expect(system.collidingTargetIds({ x: bounds.right, y: bounds.bottom }, 4)).toEqual([]);
  });
});
