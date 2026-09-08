import { describe, expect, it } from 'vitest';
import {
  advanceTutorial,
  EXIT_GLYPH,
  newlyReachable,
  objectiveCopy,
  RELIC_GLYPH,
} from '../src/presentation/mechanic-legibility';

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

  it('uses the same relic and exit glyph semantics before and after collection', () => {
    expect(objectiveCopy(false, false)).toEqual({
      primary: `${RELIC_GLYPH} FIND THE RELIC`,
      secondary: `${EXIT_GLYPH} EXIT SEALED`,
      secondaryActive: false,
    });
    expect(objectiveCopy(true, false)).toEqual({
      primary: `✓ ${RELIC_GLYPH} RELIC RECOVERED`,
      secondary: `${EXIT_GLYPH} RETURN TO EXIT`,
      secondaryActive: true,
    });
    expect(objectiveCopy(true, true).secondary).toBe(`✓ ${EXIT_GLYPH} EXIT REACHED`);
  });

  it('identifies only newly opened reachable Pages for connection feedback', () => {
    expect(newlyReachable(new Set(['p7']), new Set(['p7', 'p4', 'p1']))).toEqual(['p4', 'p1']);
  });
});
