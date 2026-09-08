import { describe, expect, it } from 'vitest';
import { advanceTutorial, newlyReachable, objectiveCopy } from '../src/presentation/mechanic-legibility';

describe('P4.1 mechanic legibility guidance', () => {
  it('progresses from route opening to route choice to contextual GO without a hidden double-tap step', () => {
    let stage = advanceTutorial('rotate', 'opened-route');
    expect(stage).toBe('choose-route');

    stage = advanceTutorial(stage, 'selected-reachable');
    expect(stage).toBe('go');

    stage = advanceTutorial(stage, 'travel-started');
    expect(stage).toBe('complete');
    expect(advanceTutorial(stage, 'selected-reachable')).toBe('complete');
  });

  it('resets first-run guidance to the rotate cue', () => {
    expect(advanceTutorial('go', 'reset')).toBe('rotate');
  });

  it('keeps objective copy compact while making the return trip explicit', () => {
    expect(objectiveCopy(false, false)).toEqual({
      primary: '◆ FIND THE RELIC',
      secondary: '○ RETURN TO THE GATE',
      secondaryActive: false,
    });
    expect(objectiveCopy(true, false).secondary).toBe('◆ RETURN TO THE GATE');
    expect(objectiveCopy(true, true).primary).toBe('✓ CHAPTER COMPLETE');
  });

  it('identifies only newly opened reachable Pages for connection feedback', () => {
    expect(newlyReachable(new Set(['p7']), new Set(['p7', 'p4', 'p1']))).toEqual(['p4', 'p1']);
  });
});
