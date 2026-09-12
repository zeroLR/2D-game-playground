import { describe, expect, it } from 'vitest';
import { ChainEvolutionSystem } from '../src/progression/ChainEvolutionSystem';

describe('ChainEvolutionSystem', () => {
  it('evolves only after qualified uses at 3 and 6', () => {
    const evolution = new ChainEvolutionSystem('relay');
    expect(evolution.snapshot).toMatchObject({ stage: 0, qualifiedUses: 0, nextThreshold: 3 });

    evolution.registerQualifiedUse();
    evolution.registerQualifiedUse();
    expect(evolution.snapshot.stage).toBe(0);

    const tierOne = evolution.registerQualifiedUse();
    expect(tierOne.evolved).toBe(true);
    expect(tierOne.snapshot).toMatchObject({ stage: 1, qualifiedUses: 3, nextThreshold: 6, stageName: 'RELAY' });

    evolution.registerQualifiedUse();
    evolution.registerQualifiedUse();
    const tierTwo = evolution.registerQualifiedUse();
    expect(tierTwo.evolved).toBe(true);
    expect(tierTwo.snapshot).toMatchObject({ stage: 2, qualifiedUses: 6, nextThreshold: null, stageName: 'ARC WEB' });
  });

  it('preserves the configured Detonation path', () => {
    const evolution = new ChainEvolutionSystem('detonation');
    for (let index = 0; index < 3; index += 1) evolution.registerQualifiedUse();
    expect(evolution.snapshot).toMatchObject({ path: 'detonation', stage: 1, stageName: 'FUSE' });
  });
});
