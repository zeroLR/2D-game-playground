import { describe, expect, it } from 'vitest';
import { CampaignProgression } from '../src/progression/CampaignProgression';

describe('CampaignProgression', () => {
  it('starts with Vortex and only Shattered Gate available', () => {
    const progression = new CampaignProgression();

    expect(progression.snapshot.unlockedRunes).toEqual(['vortex']);
    expect(progression.snapshot.continueStageId).toBe('shattered-gate');
    expect(progression.stageState('shattered-gate')).toBe('available');
    expect(progression.stageState('prism-wake')).toBe('locked');
    expect(progression.stageState('null-cathedral')).toBe('coming-soon');
  });

  it('clearing Shattered Gate unlocks Split and Prism Wake', () => {
    const progression = new CampaignProgression();
    const result = progression.completeStage('shattered-gate');

    expect(result.newlyCleared).toBe(true);
    expect(result.unlockedRune).toBe('split');
    expect(result.nextStageId).toBe('prism-wake');
    expect(result.snapshot.unlockedRunes).toEqual(['vortex', 'split']);
    expect(result.snapshot.continueStageId).toBe('prism-wake');
    expect(progression.stageState('shattered-gate')).toBe('cleared');
    expect(progression.stageState('prism-wake')).toBe('available');
  });

  it('clearing Prism Wake unlocks Chain without pretending Null Cathedral is authored', () => {
    const progression = new CampaignProgression(['shattered-gate']);
    const result = progression.completeStage('prism-wake');

    expect(result.unlockedRune).toBe('chain');
    expect(result.nextStageId).toBeNull();
    expect(result.snapshot.unlockedRunes).toEqual(['vortex', 'split', 'chain']);
    expect(result.snapshot.continueStageId).toBe('prism-wake');
    expect(progression.stageState('null-cathedral')).toBe('coming-soon');
  });

  it('does not emit duplicate Rune rewards on replay clears', () => {
    const progression = new CampaignProgression(['shattered-gate']);
    const result = progression.completeStage('shattered-gate');

    expect(result.newlyCleared).toBe(false);
    expect(result.unlockedRune).toBeNull();
    expect(result.snapshot.unlockedRunes).toEqual(['vortex', 'split']);
  });

  it('rejects completion of a locked stage', () => {
    const progression = new CampaignProgression();
    expect(() => progression.completeStage('prism-wake')).toThrow(/cannot be completed/);
  });
});
