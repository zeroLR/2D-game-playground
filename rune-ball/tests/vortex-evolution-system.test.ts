import { describe, expect, it } from 'vitest';
import { VortexEvolutionSystem } from '../src/progression/VortexEvolutionSystem';

describe('VortexEvolutionSystem', () => {
  it('starts at base Vortex and advances at three and six qualified uses', () => {
    const system = new VortexEvolutionSystem('gravity-well');

    expect(system.snapshot).toMatchObject({ stage: 0, qualifiedUses: 0, nextThreshold: 3, stageName: 'VORTEX' });
    expect(system.registerQualifiedUse().evolved).toBe(false);
    expect(system.registerQualifiedUse().evolved).toBe(false);

    const tierOne = system.registerQualifiedUse();
    expect(tierOne.evolved).toBe(true);
    expect(tierOne.snapshot).toMatchObject({ stage: 1, qualifiedUses: 3, nextThreshold: 6, stageName: 'GRAVITY WELL' });

    system.registerQualifiedUse();
    system.registerQualifiedUse();
    const tierTwo = system.registerQualifiedUse();
    expect(tierTwo.evolved).toBe(true);
    expect(tierTwo.snapshot).toMatchObject({ stage: 2, qualifiedUses: 6, nextThreshold: null, stageName: 'SINGULARITY' });
  });

  it('maps the alternate path to Orbit and Event Horizon', () => {
    const system = new VortexEvolutionSystem('orbit');
    for (let index = 0; index < 3; index += 1) system.registerQualifiedUse();
    expect(system.snapshot.stageName).toBe('ORBIT');
    for (let index = 0; index < 3; index += 1) system.registerQualifiedUse();
    expect(system.snapshot.stageName).toBe('EVENT HORIZON');
  });

  it('caps progress after the final evolution', () => {
    const system = new VortexEvolutionSystem('gravity-well');
    for (let index = 0; index < 12; index += 1) system.registerQualifiedUse();
    expect(system.snapshot).toMatchObject({ stage: 2, qualifiedUses: 6, progressToNext: 1 });
  });
});
