import { describe, expect, it } from 'vitest';
import { applyWindVelocity, windAccelerationAt, windFieldForPlatform } from '../src/world/WindField';
import type { PlatformEntity } from '../src/world/WorldState';

function platform(overrides: Partial<PlatformEntity> = {}): PlatformEntity {
  return {
    id: 2,
    type: 'platform',
    x: 180,
    y: -900,
    width: 66,
    motion: { axis: 'x', amplitude: 20, speed: 0.3, phase: 1.2, originX: 180 },
    routeTheme: null,
    biomeTheme: 'pale-heights',
    ...overrides,
  };
}

describe('Pale Wind Fields', () => {
  it('only derives wind from moving Pale platforms', () => {
    expect(windFieldForPlatform(platform())).not.toBeNull();
    expect(windFieldForPlatform(platform({ biomeTheme: 'violet-zone' }))).toBeNull();
    expect(windFieldForPlatform(platform({ motion: undefined }))).toBeNull();
  });

  it('alternates wind direction across floes', () => {
    const a = windFieldForPlatform(platform({ id: 2, motion: { axis: 'x', amplitude: 20, speed: 0.3, phase: 0, originX: 180 } }));
    const b = windFieldForPlatform(platform({ id: 3, motion: { axis: 'x', amplitude: 20, speed: 0.3, phase: 0, originX: 180 } }));
    expect(a?.forceX).toBeGreaterThan(0);
    expect(b?.forceX).toBeLessThan(0);
  });

  it('only applies force while the player is inside the field', () => {
    const p = platform();
    const field = windFieldForPlatform(p)!;
    expect(windAccelerationAt([p], field.x, field.y)).not.toBe(0);
    expect(windAccelerationAt([p], field.x + field.halfWidth + 10, field.y)).toBe(0);
  });

  it('adds continuous horizontal velocity without exceeding the wind cap', () => {
    expect(applyWindVelocity(0, 200, 1 / 60)).toBeGreaterThan(0);
    expect(applyWindVelocity(420, 300, 0.033)).toBeLessThanOrEqual(430);
    expect(applyWindVelocity(-420, -300, 0.033)).toBeGreaterThanOrEqual(-430);
  });
});
