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

  it('keeps the initial target ring away from the central interaction lane', () => {
    const system = new TargetSystem(bounds, 8);
    const targets = system.snapshot;
    const center = { x: (bounds.left + bounds.right) / 2, y: (bounds.top + bounds.bottom) / 2 };
    const clearRadius = Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top) * 0.30;
    const sideThreshold = (bounds.right - bounds.left) * 0.30;

    for (const target of targets) {
      expect(Math.hypot(target.position.x - center.x, target.position.y - center.y)).toBeGreaterThan(clearRadius);
    }

    const sideAnchored = targets.filter((target) =>
      target.position.x <= bounds.left + sideThreshold
      || target.position.x >= bounds.right - sideThreshold,
    );
    expect(sideAnchored).toHaveLength(8);
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

  it('finds a useful target inside the reflected forward cone', () => {
    const system = new TargetSystem(bounds, 8);
    const origin = { x: bounds.left + 18, y: (bounds.top + bounds.bottom) / 2 };
    const target = system.findReboundTarget(origin, { x: 1, y: 0 });

    expect(target).not.toBeNull();
    expect(target!.position.x).toBeGreaterThan(origin.x);
  });

  it('biases delayed respawn toward the current chase direction without spawning under the ball', () => {
    const system = new TargetSystem(bounds, 1);
    const initial = system.snapshot[0];
    system.hit(initial.id);

    const origin = { x: 150, y: 250 };
    expect(system.update(0.24, { origin, velocity: { x: 1, y: 0 } })).toHaveLength(1);
    const spawned = system.snapshot[0];

    expect(spawned.position.x).toBeGreaterThan(origin.x);
    expect(Math.hypot(spawned.position.x - origin.x, spawned.position.y - origin.y)).toBeGreaterThanOrEqual(88);
  });

  it('ramps toward a higher desired density without deleting targets when density drops again', () => {
    const system = new TargetSystem(bounds, 8);
    system.setDesiredCount(11);

    expect(system.update(0)).toHaveLength(1);
    expect(system.update(0.24)).toHaveLength(1);
    expect(system.update(0.24)).toHaveLength(1);
    expect(system.snapshot).toHaveLength(11);

    system.setDesiredCount(8);
    expect(system.update(1)).toHaveLength(0);
    expect(system.snapshot).toHaveLength(11);
  });

  it('pulls targets toward a Vortex center while keeping them inside the arena', () => {
    const system = new TargetSystem(bounds, 8);
    const center = { x: 150, y: 250 };
    const before = system.snapshot;
    const candidate = before
      .filter((target) => Math.hypot(target.position.x - center.x, target.position.y - center.y) < 210)
      .sort((left, right) => Math.hypot(left.position.x - center.x, left.position.y - center.y) - Math.hypot(right.position.x - center.x, right.position.y - center.y))[0];
    expect(candidate).toBeDefined();

    const beforeDistance = Math.hypot(candidate.position.x - center.x, candidate.position.y - center.y);
    const affected = system.applyVortex(center, 210, 0.2);
    const after = system.snapshot.find((target) => target.id === candidate.id)!;
    const afterDistance = Math.hypot(after.position.x - center.x, after.position.y - center.y);

    expect(affected).toContain(candidate.id);
    expect(afterDistance).toBeLessThan(beforeDistance);
    expect(after.position.x).toBeGreaterThanOrEqual(bounds.left + after.radius);
    expect(after.position.y).toBeLessThanOrEqual(bounds.bottom - after.radius);
  });

  it('returns nearest chain targets while respecting exclusions and limits', () => {
    const system = new TargetSystem(bounds, 8);
    const origin = system.snapshot[3];
    const nearby = system.nearbyTargetIds(origin.position, 240, new Set([origin.id]), 3);

    expect(nearby.length).toBeGreaterThan(0);
    expect(nearby.length).toBeLessThanOrEqual(3);
    expect(nearby).not.toContain(origin.id);
  });
});
