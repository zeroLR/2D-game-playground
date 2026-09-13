import { describe, expect, it } from 'vitest';
import { resolveRuneSynergy } from '../src/progression/RuneSynergy';

describe('RuneSynergy', () => {
  it('recognizes one Vortex to Split handoff per Split cast window', () => {
    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: true,
      chainTriggered: false,
      chainQualified: false,
      vortexSplitAlreadyRewarded: false,
    })).toMatchObject({ kind: 'vortex-split', marksVortexSplitWindow: true });

    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: true,
      chainTriggered: false,
      chainQualified: false,
      vortexSplitAlreadyRewarded: true,
    })).toBeNull();
  });

  it('requires a qualified Chain route before rewarding Chain pair synergies', () => {
    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: false,
      chainTriggered: true,
      chainQualified: false,
      vortexSplitAlreadyRewarded: false,
    })).toBeNull();

    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: false,
      chainTriggered: true,
      chainQualified: true,
      vortexSplitAlreadyRewarded: false,
    })).toMatchObject({ kind: 'split-chain', runes: ['split', 'chain'] });
  });

  it('recognizes Vortex to Chain when a qualified route starts inside the active field', () => {
    expect(resolveRuneSynergy({
      splitImpact: false,
      insideActiveVortex: true,
      chainTriggered: true,
      chainQualified: true,
      vortexSplitAlreadyRewarded: false,
    })).toMatchObject({ kind: 'vortex-chain', runes: ['vortex', 'chain'] });
  });

  it('collapses a qualified three-Rune handoff into one Triad event', () => {
    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: true,
      chainTriggered: true,
      chainQualified: true,
      vortexSplitAlreadyRewarded: false,
    })).toEqual({
      kind: 'triad',
      runes: ['vortex', 'split', 'chain'],
      marksVortexSplitWindow: true,
    });
  });

  it('allows a later Triad to supersede an earlier Vortex to Split reward in the same Split cast', () => {
    expect(resolveRuneSynergy({
      splitImpact: true,
      insideActiveVortex: true,
      chainTriggered: true,
      chainQualified: true,
      vortexSplitAlreadyRewarded: true,
    })).toMatchObject({ kind: 'triad' });
  });
});
