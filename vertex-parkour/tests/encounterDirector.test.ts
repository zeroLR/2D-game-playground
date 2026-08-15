import { describe, expect, it } from 'vitest';
import { EncounterDirector, pacingPhaseFor } from '../src/world/EncounterDirector';

function seeded(values: number[]) { let index = 0; return () => values[index++ % values.length]; }

describe('EncounterDirector', () => {
  it('progresses from warmup to flow to pressure', () => {
    expect(pacingPhaseFor(0)).toBe('warmup');
    expect(pacingPhaseFor(3)).toBe('warmup');
    expect(pacingPhaseFor(4)).toBe('flow');
    expect(pacingPhaseFor(9)).toBe('flow');
    expect(pacingPhaseFor(10)).toBe('pressure');
    expect(pacingPhaseFor(50)).toBe('pressure');
  });
  it('never emits the same core encounter three times in a row', () => {
    const director = new EncounterDirector();
    const sequence = Array.from({ length: 30 }, () => director.next(() => 0));
    for (let i = 2; i < sequence.length; i += 1) expect(sequence[i] === sequence[i - 1] && sequence[i] === sequence[i - 2]).toBe(false);
  });
  it('is deterministic when driven by the same random stream', () => {
    const a = new EncounterDirector(); const b = new EncounterDirector();
    const values = [0.1, 0.7, 0.35, 0.92, 0.5]; const randomA = seeded(values); const randomB = seeded(values);
    expect(Array.from({ length: 20 }, () => a.next(randomA))).toEqual(Array.from({ length: 20 }, () => b.next(randomB)));
  });
  it('uses a more traversal-forward opening deck in Amber', () => {
    const teal = new EncounterDirector();
    const amber = new EncounterDirector();
    expect(teal.next(() => 0.2, 'teal-ruins')).toBe('recovery');
    expect(amber.next(() => 0.2, 'amber-district')).toBe('dash-chain');
  });
  it('shifts Violet toward constrained edge and wall routing', () => {
    const amber = new EncounterDirector();
    const violet = new EncounterDirector();
    expect(amber.next(() => 0.65, 'amber-district')).toBe('edge-read');
    expect(violet.next(() => 0.65, 'violet-zone')).toBe('wall-rescue');
  });
  it('opens Pale Heights around aerial timing and moving windows', () => {
    const violet = new EncounterDirector();
    const pale = new EncounterDirector();
    expect(violet.next(() => 0.85, 'violet-zone')).toBe('wall-rescue');
    expect(pale.next(() => 0.85, 'pale-heights')).toBe('moving-window');
  });
  it('reset returns the director to warmup', () => {
    const director = new EncounterDirector();
    for (let i = 0; i < 12; i += 1) director.next(() => 0.5);
    expect(director.getPhase()).toBe('pressure'); director.reset(); expect(director.getPhase()).toBe('warmup');
  });
});
