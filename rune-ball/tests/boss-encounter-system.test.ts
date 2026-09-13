import { describe, expect, it } from 'vitest';
import { BossEncounterSystem, type BossDefinition } from '../src/game/BossEncounterSystem';
import type { ArenaBounds } from '../src/game/BallModel';

const bounds: ArenaBounds = { left: 0, right: 300, top: 0, bottom: 500 };

const boss: BossDefinition = {
  id: 'fracture-sentinel',
  title: 'FRACTURE SENTINEL',
  coreAnchor: { x: 0.5, y: 0.42 },
  coreRadius: 30,
  phases: [
    {
      id: 'aegis-ring',
      title: 'AEGIS RING',
      objective: 'Break the Ward ring to expose the core.',
      exposureSeconds: 3,
      wards: [
        { kind: 'crystal', anchor: { x: 0.3, y: 0.3 } },
        { kind: 'crystal', anchor: { x: 0.7, y: 0.3 } },
      ],
    },
    {
      id: 'relay-lock',
      title: 'RELAY LOCK',
      objective: 'Break the relay Wards and strike the core.',
      exposureSeconds: 2,
      wards: [
        { kind: 'armored', anchor: { x: 0.4, y: 0.55 } },
        { kind: 'crystal', anchor: { x: 0.6, y: 0.55 } },
      ],
    },
  ],
};

describe('BossEncounterSystem', () => {
  it('starts shielded on the first authored phase and exposes core geometry', () => {
    const system = new BossEncounterSystem(bounds, boss);

    expect(system.snapshot.state).toBe('idle');
    expect(system.start()).toMatchObject([
      { type: 'boss-phase-start', phaseIndex: 0, total: 2, phase: { id: 'aegis-ring' } },
    ]);
    expect(system.snapshot.state).toBe('shielded');
    expect(system.snapshot.phaseTitle).toBe('AEGIS RING');
    expect(system.collidesWithCore(system.snapshot.corePosition, 18)).toBe(true);
  });

  it('opens a finite exposure window only after all Wards are gone', () => {
    const system = new BossEncounterSystem(bounds, boss);
    system.start();

    expect(system.update(1, 1)).toEqual([]);
    expect(system.update(0, 0)).toEqual([
      { type: 'boss-exposed', phaseIndex: 0, total: 2, duration: 3 },
    ]);
    expect(system.snapshot.state).toBe('exposed');
    expect(system.snapshot.exposureSecondsRemaining).toBe(3);
  });

  it('rearms the same phase when the exposure window expires', () => {
    const system = new BossEncounterSystem(bounds, boss);
    system.start();
    system.update(0, 0);

    expect(system.update(2.9, 0)).toEqual([]);
    expect(system.update(0.1, 0)).toMatchObject([
      { type: 'boss-rearmed', phaseIndex: 0, total: 2, phase: { id: 'aegis-ring' } },
    ]);
    expect(system.snapshot.state).toBe('shielded');
  });

  it('blocks core contact while shielded and advances exactly one phase when exposed', () => {
    const system = new BossEncounterSystem(bounds, boss);
    system.start();

    expect(system.hitCore()).toEqual([
      { type: 'boss-core-blocked', phaseIndex: 0, total: 2 },
    ]);

    system.update(0, 0);
    expect(system.hitCore()).toMatchObject([
      { type: 'boss-core-hit', phaseIndex: 0, total: 2 },
      { type: 'boss-phase-start', phaseIndex: 1, total: 2, phase: { id: 'relay-lock' } },
    ]);
    expect(system.snapshot.state).toBe('shielded');
    expect(system.snapshot.phaseNumber).toBe(2);
  });

  it('defeats the Boss only after the final exposed core hit', () => {
    const system = new BossEncounterSystem(bounds, boss);
    system.start();
    system.update(0, 0);
    system.hitCore();
    system.update(0, 0);

    expect(system.hitCore()).toEqual([
      { type: 'boss-core-hit', phaseIndex: 1, total: 2 },
      { type: 'boss-defeated', phases: 2 },
    ]);
    expect(system.snapshot.state).toBe('defeated');
    expect(system.update(10, 0)).toEqual([]);
  });

  it('rejects definitions that cannot create a protection-payoff loop', () => {
    expect(() => new BossEncounterSystem(bounds, { ...boss, phases: [] })).toThrow();
    expect(() => new BossEncounterSystem(bounds, {
      ...boss,
      phases: [{ ...boss.phases[0], wards: [] }],
    })).toThrow();
  });
});
