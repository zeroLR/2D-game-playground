import { describe, expect, it } from 'vitest';
import { createCodexState } from '../src/simulation/codex/codex';
import { createSynthesisState } from '../src/simulation/synthesis/synthesis';
import { createRegionState, generateNextRegion } from '../src/simulation/world/regions';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';

describe('region persistence', () => {
  it('restores the exact first-observed region instead of regenerating it', () => {
    const synthesis = createSynthesisState();
    const codex = createCodexState();
    const regions = createRegionState();
    const generated = generateNextRegion(regions, 'world', { codexCount: 3, activeTraits: ['HOT'] })!;

    const restored = parseKnowledgeSave(serializeKnowledgeSave(createKnowledgeSave(synthesis, codex, regions)));
    expect(restored?.regions?.generated[0]).toEqual(generated);
  });

  it('treats older knowledge saves without regions as an unexplored frontier', () => {
    const synthesis = createSynthesisState();
    const codex = createCodexState();
    const legacy = JSON.stringify({ version: 1, synthesis, codex });
    const restored = parseKnowledgeSave(legacy);
    expect(restored?.regions?.generated).toEqual([]);
  });
});
