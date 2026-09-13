import { describe, expect, it } from 'vitest';
import {
  EncounterDirector,
  type EncounterSequenceDefinition,
} from '../src/game/EncounterDirector';

const sequence: EncounterSequenceDefinition = {
  intermissionSeconds: 0.5,
  encounters: [
    {
      kind: 'formation',
      id: 'opening',
      title: 'OPENING VECTOR',
      objective: 'Break the opening formation.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.25, y: 0.3 } },
        { kind: 'crystal', anchor: { x: 0.75, y: 0.3 } },
      ],
    },
    {
      kind: 'boss',
      id: 'sentinel',
      title: 'FRACTURE SENTINEL',
      objective: 'Break the Sentinel.',
      boss: {
        id: 'fracture-sentinel',
        title: 'FRACTURE SENTINEL',
        coreAnchor: { x: 0.5, y: 0.42 },
        coreRadius: 30,
        phases: [
          {
            id: 'aegis-ring',
            title: 'AEGIS RING',
            objective: 'Break the Wards.',
            exposureSeconds: 3,
            wards: [{ kind: 'crystal', anchor: { x: 0.5, y: 0.25 } }],
          },
        ],
      },
    },
  ],
};

describe('EncounterDirector', () => {
  it('starts the first authored encounter and exposes its content metadata', () => {
    const director = new EncounterDirector(sequence);

    expect(director.snapshot.phase).toBe('idle');
    const directives = director.start();

    expect(directives).toHaveLength(1);
    expect(directives[0]).toMatchObject({
      type: 'encounter-start',
      index: 0,
      total: 2,
      encounter: { kind: 'formation', id: 'opening', title: 'OPENING VECTOR' },
    });
    expect(director.snapshot.currentKind).toBe('formation');
    expect(director.snapshot.currentObjective).toBe('Break the opening formation.');
  });

  it('uses objective completion rather than target count to advance encounters', () => {
    const director = new EncounterDirector(sequence);
    director.start();

    expect(director.update(1, false)).toEqual([]);
    expect(director.update(0, true)).toEqual([
      { type: 'encounter-clear', index: 0, total: 2, encounterId: 'opening' },
    ]);
    expect(director.snapshot.phase).toBe('intermission');

    expect(director.update(0.49, false)).toEqual([]);
    expect(director.update(0.01, false)).toMatchObject([
      { type: 'encounter-start', index: 1, total: 2, encounter: { kind: 'boss', id: 'sentinel' } },
    ]);
    expect(director.snapshot.phase).toBe('active');
    expect(director.snapshot.currentKind).toBe('boss');
  });

  it('emits stage clear only after the final encounter objective completes', () => {
    const director = new EncounterDirector(sequence);
    director.start();
    director.update(0, true);
    director.update(0.5, false);

    expect(director.update(0, true)).toEqual([
      { type: 'encounter-clear', index: 1, total: 2, encounterId: 'sentinel' },
      { type: 'stage-clear', total: 2 },
    ]);
    expect(director.snapshot.phase).toBe('complete');
    expect(director.update(10, true)).toEqual([]);
  });

  it('rejects empty authored sequences and empty formation encounters', () => {
    expect(() => new EncounterDirector({ intermissionSeconds: 0.5, encounters: [] })).toThrow();
    expect(() => new EncounterDirector({
      intermissionSeconds: 0.5,
      encounters: [{ kind: 'formation', id: 'empty', title: 'EMPTY', objective: 'None', targets: [] }],
    })).toThrow();
  });
});
