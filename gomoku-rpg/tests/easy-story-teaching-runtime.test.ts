import { describe, expect, it } from 'vitest';
import { easyStoryRuntimeRules } from '../src/story/easy-teaching-runtime';

describe('Easy Story teaching runtime', () => {
  it('keeps E1-1 pure Gomoku', () => {
    expect(easyStoryRuntimeRules('E1-1')).toEqual({
      playerSkillsEnabled: false,
      cpuSkillsEnabled: false,
      cpuForcedTacticsEnabled: false,
      manaVisible: false,
      skillsVisible: false,
    });
  });

  it('introduces forced defense before RPG resources', () => {
    const rules = easyStoryRuntimeRules('E1-2');
    expect(rules.cpuForcedTacticsEnabled).toBe(true);
    expect(rules.manaVisible).toBe(false);
    expect(rules.skillsVisible).toBe(false);
  });

  it('reveals Mana before skills', () => {
    const rules = easyStoryRuntimeRules('E1-3');
    expect(rules.manaVisible).toBe(true);
    expect(rules.playerSkillsEnabled).toBe(false);
    expect(rules.skillsVisible).toBe(false);
  });

  it('unlocks the full runtime from the Blink lesson onward', () => {
    for (const id of ['E1-4', 'E1-5', 'E1-BOSS'] as const) {
      expect(easyStoryRuntimeRules(id)).toMatchObject({
        playerSkillsEnabled: true,
        cpuSkillsEnabled: true,
        manaVisible: true,
        skillsVisible: true,
      });
    }
  });
});
