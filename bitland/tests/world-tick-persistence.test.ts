import { describe, expect, it } from 'vitest';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';
import { createCodexState } from '../src/simulation/codex/codex';
import { createEcologyState, runWorldTick } from '../src/simulation/ecology/worldTick';
import { createSynthesisState } from '../src/simulation/synthesis/synthesis';
import { createWorldPressure, recordCreatureDefeat } from '../src/simulation/world/pressure';
import { createRegionState } from '../src/simulation/world/regions';

describe('world tick persistence', () => {
  it('round-trips ecology state through the knowledge save', () => {
    const pressure = createWorldPressure();
    recordCreatureDefeat(pressure);
    const ecology = createEcologyState();
    runWorldTick(ecology, pressure, createRegionState(), 'world');

    const raw = serializeKnowledgeSave(createKnowledgeSave(
      createSynthesisState(),
      createCodexState(),
      createRegionState(),
      pressure,
      ecology,
    ));
    const parsed = parseKnowledgeSave(raw);
    expect(parsed?.ecology).toEqual(ecology);
  });

  it('loads older saves without ecology state at tick zero', () => {
    const legacy = createKnowledgeSave(createSynthesisState(), createCodexState());
    delete legacy.ecology;
    const parsed = parseKnowledgeSave(JSON.stringify(legacy));
    expect(parsed?.ecology?.tickIndex).toBe(0);
    expect(parsed?.ecology?.hostility).toBe(0);
  });
});
