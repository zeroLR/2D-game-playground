import { describe, expect, it } from 'vitest';
import { createWorldPressure, recordCreatureDefeat, recordGatherPressure, recordTraitUsage, traitUsageCount } from '../src/simulation/world/pressure';

describe('world pressure', () => {
  it('tracks gathered resources and creature defeats', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'MATTER', 2);
    recordGatherPressure(pressure, 'MATTER', 1);
    recordCreatureDefeat(pressure);
    expect(pressure.gathered.MATTER).toBe(3);
    expect(pressure.creatureDefeats).toBe(1);
  });

  it('counts each trait once per synthesis use', () => {
    const pressure = createWorldPressure();
    recordTraitUsage(pressure, ['HOT', 'HOT', 'CONDUCTIVE']);
    expect(pressure.traitUsage.HOT).toBe(1);
    expect(traitUsageCount(pressure, ['HOT', 'CONDUCTIVE'])).toBe(2);
  });
});
