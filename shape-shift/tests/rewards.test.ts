import { describe, expect, it } from "vitest";
import { createRng } from "../src/game/rng";
import { KILL_POINTS, rollBossLoot, BOSS_WAVE_BONUS } from "../src/game/rewards";

describe("rewards", () => {
  it("every enemy kind has a positive point value", () => {
    for (const [kind, pts] of Object.entries(KILL_POINTS)) {
      expect(pts, `${kind} should award > 0 points`).toBeGreaterThan(0);
    }
  });

  it("boss awards the highest points", () => {
    const max = Math.max(...Object.values(KILL_POINTS));
    expect(KILL_POINTS.boss).toBe(max);
  });

  it("rollBossLoot always returns a valid drop", () => {
    const rng = createRng(123);
    for (let i = 0; i < 50; i++) {
      const drop = rollBossLoot(rng);
      expect(drop.kind).toBeDefined();
      expect(drop.label).toBeDefined();
      expect(typeof drop.value).toBe("number");
    }
  });

  it("BOSS_WAVE_BONUS is positive", () => {
    expect(BOSS_WAVE_BONUS).toBeGreaterThan(0);
  });
});
