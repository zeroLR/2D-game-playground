// ── Achievement definitions & tracking ──────────────────────────────────────

import type { AchievementId, AchievementState } from "./data/types";

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  glyph: string;
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: "firstBossKill",
    name: "Shape Slayer",
    description: "Defeat a boss for the first time.",
    glyph: "⚔",
  },
  {
    id: "firstPrimalSkill",
    name: "Awakened",
    description: "Obtain your first Primal Skill.",
    glyph: "✧",
  },
  {
    id: "noPowerNormalClear",
    name: "Minimalist",
    description: "Clear any normal-mode stage without picking a single card.",
    glyph: "○",
  },
  {
    id: "noPowerSurvival16",
    name: "Purist",
    description: "Survive 16 waves in survival mode without picking any cards.",
    glyph: "◉",
  },
];

/** Unlock an achievement if it hasn't been unlocked yet. Returns true if newly unlocked. */
export function unlockAchievement(state: AchievementState, id: AchievementId): boolean {
  if (state[id].unlocked) return false;
  state[id] = { unlocked: true, unlockedAt: Date.now() };
  return true;
}
