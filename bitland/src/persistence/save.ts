import type { CodexState } from '../simulation/codex/codex';
import { cloneEcologyState, createEcologyState, type EcologyState } from '../simulation/ecology/worldTick';
import type { SynthesisState } from '../simulation/synthesis/synthesis';
import { cloneAffordanceState, createAffordanceState, type AffordanceState } from '../simulation/world/affordances';
import { cloneWorldPressure, createWorldPressure, type WorldPressure } from '../simulation/world/pressure';
import { createRegionState, type RegionState } from '../simulation/world/regions';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'bitland.knowledge.v1';

export type BitlandKnowledgeSave = {
  version: 1;
  synthesis: SynthesisState;
  codex: CodexState;
  regions?: RegionState;
  pressure?: WorldPressure;
  ecology?: EcologyState;
  affordances?: AffordanceState;
};

export function createKnowledgeSave(
  synthesis: SynthesisState,
  codex: CodexState,
  regions: RegionState = createRegionState(),
  pressure: WorldPressure = createWorldPressure(),
  ecology: EcologyState = createEcologyState(),
  affordances: AffordanceState = createAffordanceState(),
): BitlandKnowledgeSave {
  return {
    version: SAVE_VERSION,
    synthesis: {
      discoveriesByPair: Object.fromEntries(
        Object.entries(synthesis.discoveriesByPair).map(([key, values]) => [key, values.map(value => ({ ...value, traits: [...value.traits] }))]),
      ),
      lastDiscovery: synthesis.lastDiscovery ? { ...synthesis.lastDiscovery, traits: [...synthesis.lastDiscovery.traits] } : null,
    },
    codex: { entries: codex.entries.map(entry => ({ ...entry, inputs: [...entry.inputs], traits: [...entry.traits] })) },
    regions: createRegionState(regions.generated),
    pressure: cloneWorldPressure(pressure),
    ecology: cloneEcologyState(ecology),
    affordances: cloneAffordanceState(affordances),
  };
}

export function serializeKnowledgeSave(save: BitlandKnowledgeSave): string {
  return JSON.stringify(save);
}

export function parseKnowledgeSave(raw: string | null): BitlandKnowledgeSave | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<BitlandKnowledgeSave>;
    if (parsed.version !== SAVE_VERSION || !parsed.synthesis || !parsed.codex) return null;
    return {
      ...parsed,
      synthesis: parsed.synthesis,
      codex: parsed.codex,
      regions: createRegionState(parsed.regions?.generated ?? []),
      pressure: parsed.pressure ? cloneWorldPressure(parsed.pressure) : createWorldPressure(),
      ecology: parsed.ecology ? cloneEcologyState(parsed.ecology) : createEcologyState(),
      affordances: parsed.affordances ? cloneAffordanceState(parsed.affordances) : createAffordanceState(),
    } as BitlandKnowledgeSave;
  } catch {
    return null;
  }
}
