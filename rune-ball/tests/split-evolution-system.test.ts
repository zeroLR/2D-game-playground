import { describe, expect, it } from 'vitest';
import { SplitEvolutionSystem } from '../src/progression/SplitEvolutionSystem';

describe('SplitEvolutionSystem', () => {
  it('auto-evolves Prism at 3 and 6 qualified Split uses', () => {
    const system = new SplitEvolutionSystem('prism');
    expect(system.snapshot.stageName).toBe('SPLIT');
    for (let index = 0; index < 2; index += 1) expect(system.registerQualifiedUse().evolved).toBe(false);
    expect(system.registerQualifiedUse().snapshot).toMatchObject({ stage: 1, stageName: 'REFRACTION', qualifiedUses: 3 });
    for (let index = 0; index < 2; index += 1) system.registerQualifiedUse();
    expect(system.registerQualifiedUse().snapshot).toMatchObject({ stage: 2, stageName: 'AURORA PRISM', qualifiedUses: 6, nextThreshold: null });
  });

  it('uses the selected Lance path without changing the progression contract', () => {
    const system = new SplitEvolutionSystem('lance');
    for (let index = 0; index < 3; index += 1) system.registerQualifiedUse();
    expect(system.snapshot).toMatchObject({ path: 'lance', stage: 1, stageName: 'CONVERGENCE' });
  });
});
