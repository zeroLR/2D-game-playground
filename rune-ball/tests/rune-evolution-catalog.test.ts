import { describe, expect, it } from 'vitest';
import {
  RUNE_BASE_DEFINITIONS,
  RUNE_TREE_ORDER,
  SPLIT_EVOLUTION_PATHS,
  SPLIT_TIER_ONE_THRESHOLD,
  SPLIT_TIER_TWO_THRESHOLD,
  VORTEX_EVOLUTION_PATHS,
  VORTEX_TIER_ONE_THRESHOLD,
  VORTEX_TIER_TWO_THRESHOLD,
  getSplitEvolutionStageName,
  getVortexEvolutionStageName,
} from '../src/progression/RuneEvolutionCatalog';

describe('RuneEvolutionCatalog', () => {
  it('keeps Vortex and Split authored while Chain remains the next future tree', () => {
    expect(RUNE_TREE_ORDER).toEqual(['vortex', 'split', 'chain']);
    expect(RUNE_BASE_DEFINITIONS.vortex.evolutionStatus).toBe('authored');
    expect(RUNE_BASE_DEFINITIONS.split.evolutionStatus).toBe('authored');
    expect(RUNE_BASE_DEFINITIONS.chain.evolutionStatus).toBe('future');
  });

  it('uses deliberate 3 then 6 qualified-use thresholds for authored Rune trees', () => {
    expect(VORTEX_TIER_ONE_THRESHOLD).toBe(3);
    expect(VORTEX_TIER_TWO_THRESHOLD).toBe(6);
    expect(SPLIT_TIER_ONE_THRESHOLD).toBe(3);
    expect(SPLIT_TIER_TWO_THRESHOLD).toBe(6);
    for (const path of Object.values(VORTEX_EVOLUTION_PATHS)) {
      expect(path.tierOne.threshold).toBe(3);
      expect(path.tierTwo.threshold).toBe(6);
    }
    for (const path of Object.values(SPLIT_EVOLUTION_PATHS)) {
      expect(path.tierOne.threshold).toBe(3);
      expect(path.tierTwo.threshold).toBe(6);
    }
  });

  it('maps runtime stage names from the same catalog shown in the Rune Tree', () => {
    expect(getVortexEvolutionStageName('gravity-well', 2)).toBe('SINGULARITY');
    expect(getVortexEvolutionStageName('orbit', 2)).toBe('EVENT HORIZON');
    expect(getSplitEvolutionStageName('prism', 0)).toBe('SPLIT');
    expect(getSplitEvolutionStageName('prism', 1)).toBe('REFRACTION');
    expect(getSplitEvolutionStageName('prism', 2)).toBe('AURORA PRISM');
    expect(getSplitEvolutionStageName('lance', 1)).toBe('CONVERGENCE');
    expect(getSplitEvolutionStageName('lance', 2)).toBe('VOID LANCE');
  });

  it('keeps Split branches behaviorally opposed rather than stat-only variants', () => {
    expect(SPLIT_EVOLUTION_PATHS.prism.identity).toBe('COVERAGE / SPREAD');
    expect(SPLIT_EVOLUTION_PATHS.lance.identity).toBe('FOCUS / PIERCE');
    expect(SPLIT_EVOLUTION_PATHS.prism.tierTwo.playPattern).toContain('sweep');
    expect(SPLIT_EVOLUTION_PATHS.lance.tierTwo.playPattern).toContain('pierce');
  });
});
