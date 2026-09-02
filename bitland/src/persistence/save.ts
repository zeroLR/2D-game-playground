import type { CodexState } from '../simulation/codex/codex';
import type { SynthesisState } from '../simulation/synthesis/synthesis';
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
};

export function createKnowledgeSave(
  synthesis: SynthesisState,
  codex: CodexState,
  regions: RegionState = createRegionState(),
  pressure: WorldPressure = createWorldPressure(),
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
    } as BitlandKnowledgeSave;
  } catch {
    return null;
  }
}
