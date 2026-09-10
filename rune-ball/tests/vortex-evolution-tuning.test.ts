import { describe, expect, it } from 'vitest';
import { getVortexCastProfile } from '../src/progression/VortexEvolutionTuning';

describe('VortexEvolutionTuning', () => {
  it('keeps Orbit meaningfully longer-lived than the Gravity branch', () => {
    const gravityT1 = getVortexCastProfile('gravity-well', 1);
    const gravityT2 = getVortexCastProfile('gravity-well', 2);
    const orbitT1 = getVortexCastProfile('orbit', 1);
    const orbitT2 = getVortexCastProfile('orbit', 2);

    expect(orbitT1.mode).toBe('orbit');
    expect(orbitT2.mode).toBe('orbit');
    expect(orbitT1.durationSeconds).toBeGreaterThan(gravityT1.durationSeconds * 1.5);
    expect(orbitT2.durationSeconds).toBeGreaterThan(gravityT2.durationSeconds * 1.75);
    expect(orbitT2.durationSeconds).toBeGreaterThan(orbitT1.durationSeconds);
  });
});
