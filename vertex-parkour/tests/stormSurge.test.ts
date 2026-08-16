import { describe, expect, it } from 'vitest';
import { applyStormSurgeVelocity, stormSurgeFrame } from '../src/world/StormSurge';

describe('StormSurge', () => {
  it('is exclusive to Storm Crown', () => {
    expect(stormSurgeFrame(4, 'pale-heights').forceX).toBe(0);
    expect(stormSurgeFrame(4, 'storm-crown').phase).toBe('active');
  });

  it('telegraphs before applying lateral force', () => {
    const warning = stormSurgeFrame(3, 'storm-crown');
    expect(warning.phase).toBe('warning');
    expect(warning.intensity).toBeGreaterThan(0);
    expect(warning.forceX).toBe(0);
    expect(stormSurgeFrame(4, 'storm-crown').forceX).toBeGreaterThan(0);
  });

  it('alternates direction every cycle', () => {
    expect(stormSurgeFrame(4, 'storm-crown').direction).toBe(1);
    expect(stormSurgeFrame(10, 'storm-crown').direction).toBe(-1);
  });

  it('pushes velocity while active and clamps extreme momentum', () => {
    const frame = stormSurgeFrame(4, 'storm-crown');
    expect(applyStormSurgeVelocity(0, frame, 0.5)).toBeGreaterThan(100);
    expect(applyStormSurgeVelocity(610, frame, 1)).toBe(620);
  });
});
