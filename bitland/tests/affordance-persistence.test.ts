import { describe, expect, it } from 'vitest';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';
import { createCodexState } from '../src/simulation/codex/codex';
import { createEcologyState } from '../src/simulation/ecology/worldTick';
import { createSynthesisState } from '../src/simulation/synthesis/synthesis';
import { createAffordanceState } from '../src/simulation/world/affordances';
import { createWorldPressure } from '../src/simulation/world/pressure';
import { createRegionState } from '../src/simulation/world/regions';

describe('affordance persistence', () => {
  it('round-trips activated world affordances', () => {
    const save = createKnowledgeSave(
      createSynthesisState(),
      createCodexState(),
      createRegionState(),
      createWorldPressure(),
      createEcologyState(),
      createAffordanceState(['SIGNAL_RELAY', 'MASS_ANCHOR']),
    );
    const parsed = parseKnowledgeSave(serializeKnowledgeSave(save));
    expect(parsed?.affordances?.activated).toEqual(['SIGNAL_RELAY', 'MASS_ANCHOR']);
  });

  it('loads older saves without affordances as inactive', () => {
    const legacy = JSON.stringify({
      version: 1,
      synthesis: createSynthesisState(),
      codex: createCodexState(),
    });
    expect(parseKnowledgeSave(legacy)?.affordances?.activated).toEqual([]);
  });
});
