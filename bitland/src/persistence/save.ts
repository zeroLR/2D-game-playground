import type { CodexState } from '../simulation/codex/codex';
import type { SynthesisState } from '../simulation/synthesis/synthesis';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'bitland.knowledge.v1';

export type BitlandKnowledgeSave = {
  version: 1;
  synthesis: SynthesisState;
  codex: CodexState;
};

export function createKnowledgeSave(synthesis: SynthesisState, codex: CodexState): BitlandKnowledgeSave {
  return {
    version: SAVE_VERSION,
    synthesis: {
      discoveriesByPair: Object.fromEntries(
        Object.entries(synthesis.discoveriesByPair).map(([key, values]) => [key, values.map(value => ({ ...value, traits: [...value.traits] }))]),
      ),
      lastDiscovery: synthesis.lastDiscovery ? { ...synthesis.lastDiscovery, traits: [...synthesis.lastDiscovery.traits] } : null,
    },
    codex: { entries: codex.entries.map(entry => ({ ...entry, inputs: [...entry.inputs], traits: [...entry.traits] })) },
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
    return parsed as BitlandKnowledgeSave;
  } catch {
    return null;
  }
}
