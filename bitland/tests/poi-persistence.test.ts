import { describe, expect, it } from 'vitest';
import { createKnowledgeSave, parseKnowledgeSave, serializeKnowledgeSave } from '../src/persistence/save';
import { createCodexState } from '../src/simulation/codex/codex';
import { createSynthesisState } from '../src/simulation/synthesis/synthesis';
import { createPoiObservationState } from '../src/simulation/world/poi';

describe('POI observation persistence', () => {
  it('round-trips scanned POI ids', () => {
    const observations = createPoiObservationState(['region::poi']);
    const save = createKnowledgeSave(createSynthesisState(), createCodexState(), undefined, undefined, undefined, undefined, observations);
    const parsed = parseKnowledgeSave(serializeKnowledgeSave(save));
    expect(parsed?.poiObservations?.scannedPoiIds).toEqual(['region::poi']);
  });

  it('loads old v1 saves with neutral POI observation state', () => {
    const raw = JSON.stringify({ version: 1, synthesis: createSynthesisState(), codex: createCodexState() });
    const parsed = parseKnowledgeSave(raw);
    expect(parsed?.poiObservations?.scannedPoiIds).toEqual([]);
  });
});
