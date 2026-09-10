import { describe, expect, it } from 'vitest';
import { TargetSystem } from '../src/game/TargetSystem';

const BOUNDS = { left: 20, right: 380, top: 80, bottom: 640 };

describe('TargetSystem orbit field', () => {
  it('moves affected targets tangentially while drawing them inward', () => {
    const targets = new TargetSystem(BOUNDS, 1);
    const before = targets.snapshot[0].position;
    const center = { x: 200, y: 360 };
    const beforeDistance = Math.hypot(before.x - center.x, before.y - center.y);
    const beforeAngle = Math.atan2(before.y - center.y, before.x - center.x);

    const affected = targets.applyOrbit(center, 1000, 0.06, 0.025);
    const after = targets.snapshot[0].position;
    const afterDistance = Math.hypot(after.x - center.x, after.y - center.y);
    const afterAngle = Math.atan2(after.y - center.y, after.x - center.x);

    expect(affected).toHaveLength(1);
    expect(afterDistance).toBeLessThan(beforeDistance);
    expect(Math.abs(afterAngle - beforeAngle)).toBeGreaterThan(0.001);
  });
});
