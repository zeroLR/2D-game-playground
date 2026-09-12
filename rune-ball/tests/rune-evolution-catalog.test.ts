import { describe, expect, it } from 'vitest';
import {
  CHAIN_EVOLUTION_PATHS,
  CHAIN_TIER_ONE_THRESHOLD,
  CHAIN_TIER_TWO_THRESHOLD,
  RUNE_BASE_DEFINITIONS,
  RUNE_TREE_ORDER,
  SPLIT_EVOLUTION_PATHS,
  SPLIT_TIER_ONE_THRESHOLD,
  SPLIT_TIER_TWO_THRESHOLD,
  VORTEX_EVOLUTION_PATHS,
  VORTEX_TIER_ONE_THRESHOLD,
  VORTEX_TIER_TWO_THRESHOLD,
  getChainEvolutionStageName,
  getSplitEvolutionStageName,
  getVortexEvolutionStageName,
} from '../src/progression/RuneEvolutionCatalog';

describe('RuneEvolutionCatalog', () => {
  it('marks all three Rune trees as authored', () => {
    expect(RUNE_TREE_ORDER).toEqual(['vortex', 'split', 'chain']);
    expect(RUNE_BASE_DEFINITIONS.vortex.evolutionStatus).toBe('authored');
    expect(RUNE_BASE_DEFINITIONS.split.evolutionStatus).toBe('authored');
    expect(RUNE_BASE_DEFINITIONS.chain.evolutionStatus).toBe('authored');
  });

  it('uses deliberate 3 then 6 qualified-use thresholds for authored Rune trees', () => {
    expect(VORTEX_TIER_ONE_THRESHOLD).toBe(3);
    expect(VORTEX_TIER_TWO_THRESHOLD).toBe(6);
    expect(SPLIT_TIER_ONE_THRESHOLD).toBe(3);
    expect(SPLIT_TIER_TWO_THRESHOLD).toBe(6);
    expect(CHAIN_TIER_ONE_THRESHOLD).toBe(3);
    expect(CHAIN_TIER_TWO_THRESHOLD).toBe(6);
    for (const paths of [VORTEX_EVOLUTION_PATHS, SPLIT_EVOLUTION_PATHS, CHAIN_EVOLUTION_PATHS]) {
      for (const path of Object.values(paths)) {
        expect(path.tierOne.threshold).toBe(3);
        expect(path.tierTwo.threshold).toBe(6);
      }
    }
  });

  it('maps runtime stage names from the same catalog shown in the Rune Tree', () => {
    expect(getVortexEvolutionStageName('gravity-well', 2)).toBe('SINGULARITY');
    expect(getVortexEvolutionStageName('orbit', 2)).toBe('EVENT HORIZON');
    expect(getSplitEvolutionStageName('prism', 1)).toBe('REFRACTION');
    expect(getSplitEvolutionStageName('lance', 2)).toBe('VOID LANCE');
    expect(getChainEvolutionStageName('relay', 0)).toBe('CHAIN');
    expect(getChainEvolutionStageName('relay', 2)).toBe('ARC WEB');
    expect(getChainEvolutionStageName('detonation', 1)).toBe('FUSE');
    expect(getChainEvolutionStageName('detonation', 2)).toBe('CRITICAL MASS');
  });

  it('keeps authored branches behaviorally opposed rather than stat-only variants', () => {
    expect(SPLIT_EVOLUTION_PATHS.prism.identity).toBe('COVERAGE / SPREAD');
    expect(SPLIT_EVOLUTION_PATHS.lance.identity).toBe('FOCUS / PIERCE');
    expect(CHAIN_EVOLUTION_PATHS.relay.identity).toBe('NETWORK / SPREAD');
    expect(CHAIN_EVOLUTION_PATHS.detonation.identity).toBe('TERMINAL / CASH-OUT');
    expect(CHAIN_EVOLUTION_PATHS.relay.tierTwo.playPattern).toContain('network');
    expect(CHAIN_EVOLUTION_PATHS.detonation.tierTwo.playPattern).toContain('cash out');
  });
});
