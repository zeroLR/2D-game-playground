import type { Discovery } from '../synthesis/synthesis';
import type { RootResource } from '../world/resources';

export type CodexEntry = {
  id: string;
  displayName: string;
  pairKey: string;
  inputs: [RootResource, RootResource];
  traits: string[];
  discoveryIndex: number;
  firstDiscoveredOrder: number;
};

export type CodexState = {
  entries: CodexEntry[];
};

export function createCodexState(): CodexState {
  return { entries: [] };
}

export function recordDiscovery(
  codex: CodexState,
  discovery: Discovery,
  inputs: [RootResource, RootResource],
): CodexEntry {
  const existing = codex.entries.find(entry => entry.id === discovery.id);
  if (existing) return existing;

  const entry: CodexEntry = {
    id: discovery.id,
    displayName: discovery.displayName,
    pairKey: discovery.pairKey,
    inputs: [...inputs].sort() as [RootResource, RootResource],
    traits: [...discovery.traits],
    discoveryIndex: discovery.discoveryIndex,
    firstDiscoveredOrder: codex.entries.length + 1,
  };
  codex.entries.push(entry);
  return entry;
}

export function entriesForPair(codex: CodexState, pairKey: string): CodexEntry[] {
  return codex.entries.filter(entry => entry.pairKey === pairKey).sort((a, b) => a.discoveryIndex - b.discoveryIndex);
}
