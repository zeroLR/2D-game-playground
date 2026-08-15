import { describe, expect, it } from 'vitest';
import { WIND_ACCELERATION, applyWindVelocity, windAccelerationAt, windFieldForPlatform } from '../src/world/WindField';
import type { PlatformEntity } from '../src/world/WorldState';

function platform(overrides: Partial<PlatformEntity> = {}): PlatformEntity {
  return {
    id: 9,
    type: 'platform',
    x: 205,
    y: -900,
    width: 66,
    motion: { axis: 'x', amplitude: 20, speed: 0.3, phase: 1.2, originX: 180 },
    routeTheme: null,
    biomeTheme: 'pale-heights',
    ...overrides,
  };
}

describe('Pale Wind Fields', () => {
  it('creates sparse corridors instead of attaching wind to every floe', () => {
    expect(windFieldForPlatform(platform({ id: 9 }))).not.toBeNull();
    expect(windFieldForPlatform(platform({ id: 10 }))).toBeNull();
    expect(windFieldForPlatform(platform({ id: 11 }))).toBeNull();
    expect(windFieldForPlatform(platform({ biomeTheme: 'violet-zone' }))).toBeNull();
    expect(windFieldForPlatform(platform({ motion: undefined }))).toBeNull();
  });

  it('anchors the wind corridor in world space instead of following platform motion', () => {
    const field = windFieldForPlatform(platform({ x: 246, y: -900 }))!;
    expect(field.x).toBe(180);
    expect(field.y).toBe(-968);
    expect(field.halfWidth).toBeGreaterThan(120);
  });

  it('alternates corridor direction by vertical region rather than floe movement', () => {
    const a = windFieldForPlatform(platform({ y: -900 }))!;
    const b = windFieldForPlatform(platform({ y: -1160 }))!;
    expect(Math.sign(a.forceX)).not.toBe(Math.sign(b.forceX));
    expect(Math.abs(a.forceX)).toBe(WIND_ACCELERATION);
  });

  it('only applies force while the player is inside the fixed corridor', () => {
    const p = platform();
    const field = windFieldForPlatform(p)!;
    expect(windAccelerationAt([p], field.x, field.y)).toBe(field.forceX);
    expect(windAccelerationAt([p], field.x, field.y + field.halfHeight + 10)).toBe(0);
  });

  it('produces a material horizontal displacement while preserving a capped escape speed', () => {
    let velocity = 0;
    for (let i = 0; i < 18; i += 1) velocity = applyWindVelocity(velocity, WIND_ACCELERATION, 1 / 60);
    expect(velocity).toBeGreaterThan(280);
    expect(applyWindVelocity(450, WIND_ACCELERATION, 0.033)).toBeLessThanOrEqual(460);
    expect(applyWindVelocity(-450, -WIND_ACCELERATION, 0.033)).toBeGreaterThanOrEqual(-460);
  });
});
