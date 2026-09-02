import { describe, expect, it } from 'vitest';
import { createCodexState } from '../src/simulation/codex/codex';
import { createSynthesisState } from '../src/simulation/synthesis/synthesis';
import { createWorldPressure, recordGatherPressure, recordTraitUsage } from '../src/simulation/world/pressure';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';

describe('world pressure persistence', () => {
  it('round-trips aggregate pressure', () => {
    const pressure = createWorldPressure();
    recordGatherPressure(pressure, 'SIGNAL', 4);
    recordTraitUsage(pressure, ['CONDUCTIVE']);

    const parsed = parseKnowledgeSave(serializeKnowledgeSave(createKnowledgeSave(createSynthesisState(), createCodexState(), undefined, pressure)));
    expect(parsed?.pressure?.gathered.SIGNAL).toBe(4);
    expect(parsed?.pressure?.traitUsage.CONDUCTIVE).toBe(1);
  });

  it('loads older saves without pressure as a neutral state', () => {
    const raw = JSON.stringify({ version: 1, synthesis: createSynthesisState(), codex: createCodexState() });
    const parsed = parseKnowledgeSave(raw);
    expect(parsed?.pressure?.creatureDefeats).toBe(0);
    expect(parsed?.pressure?.gathered.MATTER).toBe(0);
  });
});
