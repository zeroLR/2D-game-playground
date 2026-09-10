import { describe, expect, it } from 'vitest';
import {
  RUNE_BASE_DEFINITIONS,
  RUNE_TREE_ORDER,
  VORTEX_EVOLUTION_PATHS,
  VORTEX_TIER_ONE_THRESHOLD,
  VORTEX_TIER_TWO_THRESHOLD,
  getVortexEvolutionStageName,
} from '../src/progression/RuneEvolutionCatalog';

describe('RuneEvolutionCatalog', () => {
  it('keeps the three base Runes visible while only Vortex has an authored tree', () => {
    expect(RUNE_TREE_ORDER).toEqual(['vortex', 'split', 'chain']);
    expect(RUNE_BASE_DEFINITIONS.vortex.evolutionStatus).toBe('authored');
    expect(RUNE_BASE_DEFINITIONS.split.evolutionStatus).toBe('future');
    expect(RUNE_BASE_DEFINITIONS.chain.evolutionStatus).toBe('future');
  });

  it('uses the same automatic evolution thresholds for both Vortex branches', () => {
    expect(VORTEX_TIER_ONE_THRESHOLD).toBe(3);
    expect(VORTEX_TIER_TWO_THRESHOLD).toBe(6);

    for (const path of Object.values(VORTEX_EVOLUTION_PATHS)) {
      expect(path.tierOne.threshold).toBe(VORTEX_TIER_ONE_THRESHOLD);
      expect(path.tierTwo.threshold).toBe(VORTEX_TIER_TWO_THRESHOLD);
    }
  });

  it('maps domain stage names from the same definitions shown in the Rune Tree', () => {
    expect(getVortexEvolutionStageName('gravity-well', 0)).toBe('VORTEX');
    expect(getVortexEvolutionStageName('gravity-well', 1)).toBe('GRAVITY WELL');
    expect(getVortexEvolutionStageName('gravity-well', 2)).toBe('SINGULARITY');
    expect(getVortexEvolutionStageName('orbit', 1)).toBe('ORBIT');
    expect(getVortexEvolutionStageName('orbit', 2)).toBe('EVENT HORIZON');
  });

  it('keeps each Vortex path mechanically descriptive rather than stat-only', () => {
    expect(VORTEX_EVOLUTION_PATHS['gravity-well'].identity).toBe('CLUSTER / COLLAPSE');
    expect(VORTEX_EVOLUTION_PATHS.orbit.identity).toBe('CAPTURE / CONTROL');
    expect(VORTEX_EVOLUTION_PATHS['gravity-well'].tierTwo.playPattern).toContain('collapse');
    expect(VORTEX_EVOLUTION_PATHS.orbit.tierTwo.playPattern).toContain('sustain');
  });
});
