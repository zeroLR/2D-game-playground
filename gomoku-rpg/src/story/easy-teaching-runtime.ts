import type { StoryEncounterId } from './story-content';

export interface StoryTeachingRuntimeRules {
  playerSkillsEnabled: boolean;
  cpuSkillsEnabled: boolean;
  cpuForcedTacticsEnabled: boolean;
  manaVisible: boolean;
  skillsVisible: boolean;
}

const FULL_RULES: StoryTeachingRuntimeRules = {
  playerSkillsEnabled: true,
  cpuSkillsEnabled: true,
  cpuForcedTacticsEnabled: true,
  manaVisible: true,
  skillsVisible: true,
};

/**
 * Story difficulty is a teaching contract, not just an AI tier.
 * Early encounters progressively reveal systems so E1-1 remains pure Gomoku.
 */
export function easyStoryRuntimeRules(id: StoryEncounterId): StoryTeachingRuntimeRules {
  switch (id) {
    case 'E1-1':
      return {
        playerSkillsEnabled: false,
        cpuSkillsEnabled: false,
        cpuForcedTacticsEnabled: false,
        manaVisible: false,
        skillsVisible: false,
      };
    case 'E1-2':
      return {
        playerSkillsEnabled: false,
        cpuSkillsEnabled: false,
        cpuForcedTacticsEnabled: true,
        manaVisible: false,
        skillsVisible: false,
      };
    case 'E1-3':
      return {
        playerSkillsEnabled: false,
        cpuSkillsEnabled: false,
        cpuForcedTacticsEnabled: true,
        manaVisible: true,
        skillsVisible: false,
      };
    case 'E1-4':
    case 'E1-5':
    case 'E1-BOSS':
      return FULL_RULES;
  }
}

export const FREE_BATTLE_RUNTIME_RULES: StoryTeachingRuntimeRules = FULL_RULES;
