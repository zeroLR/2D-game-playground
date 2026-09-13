import { describe, expect, it } from 'vitest';
import { DestructionSession } from '../src/game/DestructionSession';
import type { EncounterSequenceDefinition } from '../src/game/EncounterDirector';
import type { ArenaBounds } from '../src/game/BallModel';

const BOUNDS: ArenaBounds = { left: 0, right: 320, top: 0, bottom: 560 };

const SEQUENCE: EncounterSequenceDefinition = {
  intermissionSeconds: 0.5,
  encounters: [
    {
      kind: 'formation',
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

const DRIFT_SEQUENCE: EncounterSequenceDefinition = {
  intermissionSeconds: 0,
  encounters: [{
    kind: 'formation',
    id: 'drift',
    title: 'DRIFT FIELD',
    objective: 'Read the moving geometry.',
    modifiers: [{ kind: 'drift-field', direction: 'clockwise', turnsPerSecond: 0.02 }],
    targets: [{ kind: 'crystal', anchor: { x: 0.72, y: 0.52 } }],
  }],
};

const ELITE_SEQUENCE: EncounterSequenceDefinition = {
  intermissionSeconds: 0,
  encounters: [{
    kind: 'elite',
    id: 'warden',
    title: 'FRACTURE WARDEN',
    objective: 'Pierce the Warden with Rune energy.',
    elite: { title: 'FRACTURE WARDEN', trait: 'rune-ward' },
    targets: [
      { kind: 'crystal', role: 'elite', anchor: { x: 0.5, y: 0.5 } },
      { kind: 'crystal', anchor: { x: 0.24, y: 0.24 } },
    ],
  }],
};

const BOSS_SEQUENCE: EncounterSequenceDefinition = {
  intermissionSeconds: 0.5,
  encounters: [
    {
      kind: 'boss',
      id: 'sentinel',
      title: 'FRACTURE SENTINEL',
      objective: 'Break its Ward field, then strike the core.',
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
            wards: [
              { kind: 'crystal', anchor: { x: 0.3, y: 0.3 } },
              { kind: 'armored', anchor: { x: 0.7, y: 0.6 } },
            ],
          },
        ],
      },
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
      currentKind: 'formation',
      currentTitle: 'OPENING VECTOR',
    });
    expect(session.snapshot.boss).toBeNull();
  });

  it('publishes startup causality events on the first simulation update', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: SEQUENCE });
    const events = session.update(0);

    expect(events[0]).toMatchObject({
      type: 'encounter-started',
      encounterId: 'opening',
      encounterKind: 'formation',
      index: 0,
      total: 1,
      title: 'OPENING VECTOR',
    });
    expect(events.filter((event) => event.type === 'target-spawn')).toHaveLength(2);
    expect(session.update(0).some((event) => event.type === 'encounter-started')).toBe(false);
  });

  it('applies encounter-wide drift and publishes a world-space modifier signature', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: DRIFT_SEQUENCE });
    const before = session.snapshot.targets[0].position;

    const events = session.update(0.1);
    const after = session.snapshot.targets[0].position;

    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'encounter-modifier-started',
        kind: 'drift-field',
        direction: 'clockwise',
      }),
    ]));
    expect(session.snapshot.encounterRules).toMatchObject({
      modifierKinds: ['drift-field'],
      driftDirection: 'clockwise',
    });
    expect(after.x).not.toBeCloseTo(before.x);
    expect(after.y).not.toBeCloseTo(before.y);
  });

  it('materializes a stationary rune-ward Elite and blocks direct Ball damage', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: ELITE_SEQUENCE });
    const elite = session.snapshot.targets.find((target) => target.role === 'elite');
    expect(elite).toBeDefined();

    const events = session.update(0);
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'encounter-started', encounterKind: 'elite' }),
      expect.objectContaining({ type: 'elite-started', trait: 'rune-ward', targetId: elite?.id }),
      expect.objectContaining({ type: 'elite-hit-blocked', source: 'ball', targetId: elite?.id }),
    ]));
    expect(session.snapshot.targets.find((target) => target.id === elite?.id)?.hp).toBe(1);
    expect(session.snapshot.encounterRules).toMatchObject({ eliteTrait: 'rune-ward', eliteTargetId: elite?.id });
  });

  it('materializes Boss state and phase Wards through the same encounter boundary', () => {
    const session = new DestructionSession(BOUNDS, { encounterSequence: BOSS_SEQUENCE });

    expect(session.snapshot.encounter).toMatchObject({ currentKind: 'boss', currentId: 'sentinel' });
    expect(session.snapshot.boss).toMatchObject({
      id: 'fracture-sentinel',
      state: 'shielded',
      phaseNumber: 1,
      totalPhases: 1,
      phaseTitle: 'AEGIS RING',
    });
    expect(session.snapshot.targets).toHaveLength(2);

    const events = session.update(0);
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'encounter-started', encounterKind: 'boss' }),
      expect.objectContaining({ type: 'boss-phase-started', phaseId: 'aegis-ring', phaseIndex: 0 }),
    ]));
    expect(events.filter((event) => event.type === 'target-spawn')).toHaveLength(2);
  });

  it('keeps legacy endless target behavior when no encounter sequence is supplied', () => {
    const session = new DestructionSession(BOUNDS);

    expect(session.snapshot.encounter).toBeNull();
    expect(session.snapshot.encounterRules).toBeNull();
    expect(session.snapshot.boss).toBeNull();
    expect(session.snapshot.targets).toHaveLength(8);
  });
});
