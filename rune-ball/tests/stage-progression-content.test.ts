import { describe, expect, it } from 'vitest';
import { getStage } from '../src/content/StageCatalog';

describe('P9.4 stage progression content', () => {
  it('teaches Vortex first and rewards Split from Shattered Gate', () => {
    const stage = getStage('shattered-gate');

    expect(stage.contentStatus).toBe('authored');
    expect(stage.featuredRune).toBe('vortex');
    expect(stage.rewardRune).toBe('split');
    expect(stage.requiresClear).toBeUndefined();
    expect(stage.encounterSequence?.encounters).toHaveLength(4);
    expect(stage.encounterSequence?.encounters.at(-1)?.kind).toBe('boss');
  });

  it('authors Prism Wake as the Split teaching stage and rewards Chain', () => {
    const stage = getStage('prism-wake');

    expect(stage.contentStatus).toBe('authored');
    expect(stage.requiresClear).toEqual(['shattered-gate']);
    expect(stage.featuredRune).toBe('split');
    expect(stage.rewardRune).toBe('chain');
    expect(stage.encounterSequence?.encounters.map((encounter) => encounter.kind)).toEqual([
      'formation',
      'formation',
      'elite',
      'boss',
    ]);
    expect(stage.encounterSequence?.encounters[1]).toMatchObject({
      id: 'prism-crosscurrent',
      modifiers: [{ kind: 'drift-field', direction: 'counterclockwise' }],
    });
  });

  it('keeps Null Cathedral unavailable until its Chain content is authored', () => {
    const stage = getStage('null-cathedral');

    expect(stage.contentStatus).toBe('coming-soon');
    expect(stage.requiresClear).toEqual(['prism-wake']);
    expect(stage.featuredRune).toBe('chain');
    expect(stage.rewardRune).toBeUndefined();
    expect(stage.encounterSequence).toBeUndefined();
  });
});
