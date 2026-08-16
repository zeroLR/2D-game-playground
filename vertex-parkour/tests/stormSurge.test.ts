import { describe, expect, it } from 'vitest';
import { applyStormSurgeVelocity, stormSurgeFrame } from '../src/world/StormSurge';

describe('StormSurge', () => {
  it('is exclusive to Storm Crown', () => {
    expect(stormSurgeFrame(6, 'pale-heights').forceX).toBe(0);
    expect(stormSurgeFrame(6, 'storm-crown').phase).toBe('active');
  });

  it('telegraphs before applying lateral force', () => {
    const warning = stormSurgeFrame(4, 'storm-crown');
    expect(warning.phase).toBe('warning');
    expect(warning.intensity).toBeGreaterThan(0);
    expect(warning.forceX).toBe(0);
    expect(stormSurgeFrame(5, 'storm-crown').forceX).toBeGreaterThan(0);
  });

  it('keeps the surge active across multiple jump decisions', () => {
    expect(stormSurgeFrame(5, 'storm-crown').phase).toBe('active');
    expect(stormSurgeFrame(7.8, 'storm-crown').phase).toBe('active');
    expect(stormSurgeFrame(8.5, 'storm-crown').phase).toBe('recovery');
  });

  it('alternates direction every longer cycle', () => {
    expect(stormSurgeFrame(6, 'storm-crown').direction).toBe(1);
    expect(stormSurgeFrame(16, 'storm-crown').direction).toBe(-1);
  });

  it('creates strong sustained displacement but preserves a velocity clamp', () => {
    const frame = stormSurgeFrame(6, 'storm-crown');
    expect(applyStormSurgeVelocity(0, frame, 0.5)).toBeGreaterThan(300);
    expect(applyStormSurgeVelocity(700, frame, 1)).toBe(720);
  });
});
