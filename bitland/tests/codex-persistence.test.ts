import { describe, expect, it } from 'vitest';
import { createCodexState, recordDiscovery } from '../src/simulation/codex/codex';
import { createInventory } from '../src/simulation/world/resources';
import { createSynthesisState, synthesize } from '../src/simulation/synthesis/synthesis';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';

describe('codex persistence', () => {
  it('records each discovery once', () => {
    const inventory = createInventory(); inventory.MATTER = 2; inventory.LIFE = 2;
    const synthesis = createSynthesisState();
    const discovery = synthesize(synthesis, inventory, 'world', 'MATTER', 'LIFE')!;
    const codex = createCodexState();
    recordDiscovery(codex, discovery, ['MATTER', 'LIFE']);
    recordDiscovery(codex, discovery, ['LIFE', 'MATTER']);
    expect(codex.entries).toHaveLength(1);
    expect(codex.entries[0].firstDiscoveredOrder).toBe(1);
  });

  it('round-trips synthesis knowledge and codex entries', () => {
    const inventory = createInventory(); inventory.ENERGY = 2; inventory.SIGNAL = 2;
    const synthesis = createSynthesisState();
    const discovery = synthesize(synthesis, inventory, 'world', 'ENERGY', 'SIGNAL')!;
    const codex = createCodexState(); recordDiscovery(codex, discovery, ['ENERGY', 'SIGNAL']);
    const parsed = parseKnowledgeSave(serializeKnowledgeSave(createKnowledgeSave(synthesis, codex)));
    expect(parsed?.codex.entries[0].id).toBe(discovery.id);
    expect(parsed?.synthesis.discoveriesByPair[discovery.pairKey]).toHaveLength(1);
  });

  it('rejects malformed or unsupported saves', () => {
    expect(parseKnowledgeSave('{bad')).toBeNull();
    expect(parseKnowledgeSave(JSON.stringify({ version: 999 }))).toBeNull();
  });
});
