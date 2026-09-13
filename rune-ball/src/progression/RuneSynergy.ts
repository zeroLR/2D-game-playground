import type { RuneKind } from '../rune/RuneTypes';

export type RuneSynergyKind = 'vortex-split' | 'vortex-chain' | 'split-chain' | 'triad';

export interface RuneSynergyContext {
  splitImpact: boolean;
  insideActiveVortex: boolean;
  chainTriggered: boolean;
  chainQualified: boolean;
  vortexSplitAlreadyRewarded: boolean;
}

export interface RuneSynergyResolution {
  kind: RuneSynergyKind;
  runes: readonly RuneKind[];
  marksVortexSplitWindow: boolean;
}

const VORTEX_SPLIT_RUNES = ['vortex', 'split'] as const satisfies readonly RuneKind[];
const VORTEX_CHAIN_RUNES = ['vortex', 'chain'] as const satisfies readonly RuneKind[];
const SPLIT_CHAIN_RUNES = ['split', 'chain'] as const satisfies readonly RuneKind[];
const TRIAD_RUNES = ['vortex', 'split', 'chain'] as const satisfies readonly RuneKind[];

export function resolveRuneSynergy(context: RuneSynergyContext): RuneSynergyResolution | null {
  if (context.chainTriggered && context.chainQualified) {
    if (context.splitImpact && context.insideActiveVortex) {
      return {
        kind: 'triad',
        runes: TRIAD_RUNES,
        marksVortexSplitWindow: true,
      };
    }

    if (context.splitImpact) {
      return {
        kind: 'split-chain',
        runes: SPLIT_CHAIN_RUNES,
        marksVortexSplitWindow: false,
      };
    }

    if (context.insideActiveVortex) {
      return {
        kind: 'vortex-chain',
        runes: VORTEX_CHAIN_RUNES,
        marksVortexSplitWindow: false,
      };
    }
  }

  if (context.splitImpact && context.insideActiveVortex && !context.vortexSplitAlreadyRewarded) {
    return {
      kind: 'vortex-split',
      runes: VORTEX_SPLIT_RUNES,
      marksVortexSplitWindow: true,
    };
  }

  return null;
}
