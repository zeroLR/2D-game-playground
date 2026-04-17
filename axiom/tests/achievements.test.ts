import { describe, expect, it } from "vitest";
import { defaultAchievementState } from "../src/game/data/types";
import { unlockAchievement, ACHIEVEMENTS } from "../src/game/achievements";

describe("achievements", () => {
  it("unlockAchievement returns true on first unlock", () => {
    const state = defaultAchievementState();
    expect(unlockAchievement(state, "firstBossKill")).toBe(true);
    expect(state.firstBossKill.unlocked).toBe(true);
    expect(state.firstBossKill.unlockedAt).toBeGreaterThan(0);
  });

  it("unlockAchievement returns false on repeated unlock", () => {
    const state = defaultAchievementState();
    unlockAchievement(state, "firstBossKill");
    expect(unlockAchievement(state, "firstBossKill")).toBe(false);
  });

  it("default state has all achievements locked", () => {
    const state = defaultAchievementState();
    for (const def of ACHIEVEMENTS) {
      expect(state[def.id].unlocked).toBe(false);
    }
  });
});
