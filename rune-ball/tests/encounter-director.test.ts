import { describe, expect, it } from 'vitest';
import {
  EncounterDirector,
  type EncounterSequenceDefinition,
} from '../src/game/EncounterDirector';

const sequence: EncounterSequenceDefinition = {
  intermissionSeconds: 0.5,
  encounters: [
    {
      id: 'opening',
      title: 'OPENING VECTOR',
      objective: 'Break the opening formation.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.25, y: 0.3 } },
        { kind: 'crystal', anchor: { x: 0.75, y: 0.3 } },
      ],
    },
    {
      id: 'relay',
      title: 'RELAY ARRAY',
      objective: 'Break the relay formation.',
      targets: [
        { kind: 'armored', anchor: { x: 0.5, y: 0.5 } },
      ],
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
      encounter: { id: 'opening', title: 'OPENING VECTOR' },
    });
    expect(director.snapshot.currentObjective).toBe('Break the opening formation.');
  });

  it('requires a clear, preserves a short intermission, then advances to the next encounter', () => {
    const director = new EncounterDirector(sequence);
    director.start();

    expect(director.update(1, 2)).toEqual([]);
    expect(director.update(0, 0)).toEqual([
      { type: 'encounter-clear', index: 0, total: 2, encounterId: 'opening' },
    ]);
    expect(director.snapshot.phase).toBe('intermission');

    expect(director.update(0.49, 0)).toEqual([]);
    expect(director.update(0.01, 0)).toMatchObject([
      { type: 'encounter-start', index: 1, total: 2, encounter: { id: 'relay' } },
    ]);
    expect(director.snapshot.phase).toBe('active');
  });

  it('emits stage clear only after the final encounter is empty', () => {
    const director = new EncounterDirector(sequence);
    director.start();
    director.update(0, 0);
    director.update(0.5, 0);

    expect(director.update(0, 0)).toEqual([
      { type: 'encounter-clear', index: 1, total: 2, encounterId: 'relay' },
      { type: 'stage-clear', total: 2 },
    ]);
    expect(director.snapshot.phase).toBe('complete');
    expect(director.update(10, 0)).toEqual([]);
  });

  it('rejects empty authored sequences and empty encounters', () => {
    expect(() => new EncounterDirector({ intermissionSeconds: 0.5, encounters: [] })).toThrow();
    expect(() => new EncounterDirector({
      intermissionSeconds: 0.5,
      encounters: [{ id: 'empty', title: 'EMPTY', objective: 'None', targets: [] }],
    })).toThrow();
  });
});
