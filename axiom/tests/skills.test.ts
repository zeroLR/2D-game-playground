import { describe, expect, it } from "vitest";
import { createRng } from "../src/game/rng";
import { defaultSkillTreeState } from "../src/game/data/types";
import {
  drawPrimalSkill,
  skillDuration,
  skillCooldown,
  upgradeCost,
  PRIMAL_SKILLS,
  createActiveSkillStates,
  activateSkill,
  tickSkillState,
} from "../src/game/skills";

describe("primal skills", () => {
  it("draws a new skill when none are unlocked", () => {
    const state = defaultSkillTreeState();
    state.cores = 1;
    const rng = createRng(42);
    const result = drawPrimalSkill(state, rng);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("new");
    expect(state.cores).toBe(0);
    // One skill should now be unlocked
    const unlocked = Object.values(state.skills).filter((s) => s.unlocked);
    expect(unlocked).toHaveLength(1);
  });

  it("returns null when no cores", () => {
    const state = defaultSkillTreeState();
    const rng = createRng(1);
    expect(drawPrimalSkill(state, rng)).toBeNull();
  });

  it("converts duplicates to skill points", () => {
    const state = defaultSkillTreeState();
    state.cores = 10;
    state.skills.timeStop.unlocked = true;
    state.skills.shadowClone.unlocked = true;
    const rng = createRng(99);
    const result = drawPrimalSkill(state, rng);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("duplicate");
    if (result!.type === "duplicate") {
      expect(result!.pointsAwarded).toBeGreaterThan(0);
    }
    expect(state.skillPoints).toBeGreaterThan(0);
  });

  it("duration increases and cooldown decreases with level", () => {
    const def = PRIMAL_SKILLS.timeStop;
    const dur0 = skillDuration(def, 0);
    const dur5 = skillDuration(def, 5);
    expect(dur5).toBeGreaterThan(dur0);
    const cd0 = skillCooldown(def, 0);
    const cd5 = skillCooldown(def, 5);
    expect(cd5).toBeLessThan(cd0);
  });

  it("upgrade cost increases with level", () => {
    expect(upgradeCost(1)).toBeGreaterThan(upgradeCost(0));
    expect(upgradeCost(5)).toBeGreaterThan(upgradeCost(1));
  });
});

describe("active skill state", () => {
  it("creates states only for unlocked skills", () => {
    const tree = defaultSkillTreeState();
    expect(createActiveSkillStates(tree)).toHaveLength(0);
    tree.skills.timeStop.unlocked = true;
    expect(createActiveSkillStates(tree)).toHaveLength(1);
  });

  it("activateSkill starts the active timer", () => {
    const tree = defaultSkillTreeState();
    tree.skills.timeStop.unlocked = true;
    const [state] = createActiveSkillStates(tree);
    expect(activateSkill(state!)).toBe(true);
    expect(state!.active).toBeGreaterThan(0);
    // Can't activate again while active
    expect(activateSkill(state!)).toBe(false);
  });

  it("tickSkillState transitions from active to cooldown", () => {
    const tree = defaultSkillTreeState();
    tree.skills.timeStop.unlocked = true;
    const [state] = createActiveSkillStates(tree);
    activateSkill(state!);
    // Tick through entire duration
    for (let i = 0; i < 600; i++) tickSkillState(state!, 1 / 60);
    expect(state!.active).toBe(0);
    expect(state!.cooldown).toBeGreaterThan(0);
  });
});
