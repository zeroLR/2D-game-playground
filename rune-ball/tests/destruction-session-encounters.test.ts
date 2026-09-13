import { describe, expect, it } from 'vitest';
import { DestructionSession } from '../src/game/DestructionSession';
import type { EncounterSequenceDefinition } from '../src/game/EncounterDirector';
import type { ArenaBounds } from '../src/game/BallModel';

const BOUNDS: ArenaBounds = { left: 0, right: 320, top: 0, bottom: 560 };

const SEQUENCE: EncounterSequenceDefinition = {
  intermissionSeconds: 0.5,
  encounters: [
    {
      id: 'opening',
      title: 'OPENING VECTOR',
      objective: 'Clear the formation.',
      targets: [
        { kind: 'crystal', anchor: { x: 0.25, y: 0.25 } },
        { kind: 'armored', anchor: { x: 0.75, y: 0.75 } },
      ],
    },
  ],
};

describe('DestructionSession authored encounters', () => {
  it('materializes the first authored formation before play begins', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: SEQUENCE });

    expect(session.snapshot.targets).toHaveLength(2);
    expect(session.snapshot.targets.map((target) => target.kind)).toEqual(['crystal', 'armored']);
    expect(session.snapshot.encounter).toMatchObject({
      phase: 'active',
      index: 0,
      total: 1,
      currentId: 'opening',
      currentTitle: 'OPENING VECTOR',
    });
  });

  it('publishes startup causality events on the first simulation update', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: SEQUENCE });
    const events = session.update(0);

    expect(events[0]).toMatchObject({
      type: 'encounter-started',
      encounterId: 'opening',
      index: 0,
      total: 1,
      title: 'OPENING VECTOR',
    });
    expect(events.filter((event) => event.type === 'target-spawn')).toHaveLength(2);
    expect(session.update(0).some((event) => event.type === 'encounter-started')).toBe(false);
  });

  it('keeps legacy endless target behavior when no encounter sequence is supplied', () => {
    const session = new DestructionSession(BOUNDS);

    expect(session.snapshot.encounter).toBeNull();
    expect(session.snapshot.targets).toHaveLength(8);
  });
});
