import { describe, expect, it } from 'vitest';
import { EncounterDirector, pacingPhaseFor } from '../src/world/EncounterDirector';

function seeded(values: number[]) { let index = 0; return () => values[index++ % values.length]; }

describe('EncounterDirector', () => {
  it('progresses from warmup to flow to pressure', () => {
    expect(pacingPhaseFor(0)).toBe('warmup'); expect(pacingPhaseFor(3)).toBe('warmup'); expect(pacingPhaseFor(4)).toBe('flow'); expect(pacingPhaseFor(9)).toBe('flow'); expect(pacingPhaseFor(10)).toBe('pressure');
  });
  it('never emits the same core encounter three times in a row', () => {
    const director = new EncounterDirector(); const sequence = Array.from({ length: 30 }, () => director.next(() => 0));
    for (let i = 2; i < sequence.length; i += 1) expect(sequence[i] === sequence[i - 1] && sequence[i] === sequence[i - 2]).toBe(false);
  });
  it('is deterministic when driven by the same random stream', () => {
    const a = new EncounterDirector(); const b = new EncounterDirector(); const values = [0.1, 0.7, 0.35, 0.92, 0.5]; const randomA = seeded(values); const randomB = seeded(values);
    expect(Array.from({ length: 20 }, () => a.next(randomA))).toEqual(Array.from({ length: 20 }, () => b.next(randomB)));
  });
  it('uses a more traversal-forward opening deck in Amber', () => {
    expect(new EncounterDirector().next(() => 0.2, 'teal-ruins')).toBe('recovery');
    expect(new EncounterDirector().next(() => 0.2, 'amber-district')).toBe('dash-chain');
  });
  it('shifts Violet toward constrained edge and wall routing', () => {
    expect(new EncounterDirector().next(() => 0.65, 'amber-district')).toBe('edge-read');
    expect(new EncounterDirector().next(() => 0.65, 'violet-zone')).toBe('wall-rescue');
  });
  it('opens Pale Heights around aerial timing and moving windows', () => {
    expect(new EncounterDirector().next(() => 0.85, 'violet-zone')).toBe('wall-rescue');
    expect(new EncounterDirector().next(() => 0.85, 'pale-heights')).toBe('moving-window');
  });
  it('makes Storm Crown a mixed mastery deck instead of inheriting Pale specialization', () => {
    // Pale warmup weights total 13: at 0.48 the roll lands in edge-read.
    // Storm warmup weights total 16: the same roll remains in edge-read, so use
    // a boundary that demonstrates the actual distribution difference instead.
    expect(new EncounterDirector().next(() => 0.4, 'pale-heights')).toBe('dash-chain');
    expect(new EncounterDirector().next(() => 0.4, 'storm-crown')).toBe('edge-read');
  });
  it('reset returns the director to warmup', () => {
    const director = new EncounterDirector(); for (let i = 0; i < 12; i += 1) director.next(() => 0.5);
    expect(director.getPhase()).toBe('pressure'); director.reset(); expect(director.getPhase()).toBe('warmup');
  });
});
