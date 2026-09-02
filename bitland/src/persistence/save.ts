import type { CodexState } from '../simulation/codex/codex';
import type { SynthesisState } from '../simulation/synthesis/synthesis';
import type { Inventory } from '../simulation/world/resources';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'bitland.save.v1';

export type BitlandSave = {
  version: 1;
  inventory: Inventory;
  synthesis: SynthesisState;
  codex: CodexState;
};

export function createSave(inventory: Inventory, synthesis: SynthesisState, codex: CodexState): BitlandSave {
  return {
    version: SAVE_VERSION,
    inventory: { ...inventory },
    synthesis: {
      discoveriesByPair: Object.fromEntries(
        Object.entries(synthesis.discoveriesByPair).map(([key, values]) => [key, values.map(value => ({ ...value, traits: [...value.traits] }))]),
      ),
      lastDiscovery: synthesis.lastDiscovery ? { ...synthesis.lastDiscovery, traits: [...synthesis.lastDiscovery.traits] } : null,
    },
    codex: { entries: codex.entries.map(entry => ({ ...entry, inputs: [...entry.inputs], traits: [...entry.traits] })) },
  };
}

export function serializeSave(save: BitlandSave): string {
  return JSON.stringify(save);
}

export function parseSave(raw: string | null): BitlandSave | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<BitlandSave>;
    if (parsed.version !== SAVE_VERSION || !parsed.inventory || !parsed.synthesis || !parsed.codex) return null;
    return parsed as BitlandSave;
  } catch {
    return null;
  }
}
