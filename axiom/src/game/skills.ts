// ── Primal skill definitions & runtime logic ────────────────────────────────
// Two special abilities that fundamentally alter gameplay. They are unlocked
// from Primal Cores (boss drops) and upgraded with skill points.

import type { PrimalSkillId, SkillTreeState } from "./data/types";
import type { Rng } from "./rng";

// ── Skill metadata ──────────────────────────────────────────────────────────

export interface PrimalSkillDef {
  id: PrimalSkillId;
  name: string;
  glyph: string;
  description: string;
  baseDuration: number;   // seconds
  baseCooldown: number;   // seconds
  /** Duration bonus per upgrade level. */
  durationPerLevel: number;
  /** Cooldown reduction per upgrade level. */
  cooldownPerLevel: number;
}

export const PRIMAL_SKILLS: Record<PrimalSkillId, PrimalSkillDef> = {
  timeStop: {
    id: "timeStop",
    name: "Time Stop",
    glyph: "⏱",
    description: "Slows all enemies and projectiles to near-zero speed.",
    baseDuration: 5,
    baseCooldown: 30,
    durationPerLevel: 0.8,
    cooldownPerLevel: 2,
  },
  shadowClone: {
    id: "shadowClone",
    name: "Shadow Clone",
    glyph: "👤",
    description: "Summons a clone that inherits part of your power.",
    baseDuration: 5,
    baseCooldown: 30,
    durationPerLevel: 0.5,
    cooldownPerLevel: 2,
  },
};

/** Upgrade cost in skill points for the next level. */
export function upgradeCost(currentLevel: number): number {
  return 20 + currentLevel * 15;
}

/** Effective duration (seconds) at the given level. */
export function skillDuration(def: PrimalSkillDef, level: number): number {
  return def.baseDuration + def.durationPerLevel * level;
}

/** Effective cooldown (seconds) at the given level. */
export function skillCooldown(def: PrimalSkillDef, level: number): number {
  return Math.max(5, def.baseCooldown - def.cooldownPerLevel * level);
}

// ── Draw / gacha ────────────────────────────────────────────────────────────

export type DrawResult =
  | { type: "new"; skillId: PrimalSkillId }
  | { type: "duplicate"; skillId: PrimalSkillId; pointsAwarded: number };

const SKILL_IDS: PrimalSkillId[] = ["timeStop", "shadowClone"];

/** Spend one core to draw a random primal skill. Returns null if 0 cores. */
export function drawPrimalSkill(state: SkillTreeState, rng: Rng): DrawResult | null {
  if (state.cores <= 0) return null;
  state.cores -= 1;

  const id = SKILL_IDS[Math.floor(rng() * SKILL_IDS.length)]!;
  if (!state.skills[id].unlocked) {
    state.skills[id].unlocked = true;
    return { type: "new", skillId: id };
  }
  // Duplicate → convert to skill points.
  const pts = 15;
  state.skillPoints += pts;
  return { type: "duplicate", skillId: id, pointsAwarded: pts };
}

// ── Runtime state (per-run, not persisted) ──────────────────────────────────

export interface ActiveSkillState {
  id: PrimalSkillId;
  /** Remaining cooldown (0 = ready). */
  cooldown: number;
  /** Remaining active duration (0 = inactive). */
  active: number;
  /** Cached stats. */
  duration: number;
  maxCooldown: number;
}

export function createActiveSkillStates(tree: SkillTreeState): ActiveSkillState[] {
  const result: ActiveSkillState[] = [];
  for (const id of SKILL_IDS) {
    const entry = tree.skills[id];
    if (!entry.unlocked) continue;
    const def = PRIMAL_SKILLS[id];
    result.push({
      id,
      cooldown: 0,
      active: 0,
      duration: skillDuration(def, entry.level),
      maxCooldown: skillCooldown(def, entry.level),
    });
  }
  return result;
}

/** Activate a skill if it's off cooldown. Returns true on success. */
export function activateSkill(state: ActiveSkillState): boolean {
  if (state.cooldown > 0 || state.active > 0) return false;
  state.active = state.duration;
  return true;
}

/** Tick skill timers. */
export function tickSkillState(state: ActiveSkillState, dt: number): void {
  if (state.active > 0) {
    state.active = Math.max(0, state.active - dt);
    if (state.active <= 0) {
      state.cooldown = state.maxCooldown;
    }
  } else if (state.cooldown > 0) {
    state.cooldown = Math.max(0, state.cooldown - dt);
  }
}

/** Shadow clone inherits this fraction of player weapon stats. */
export function cloneInheritRatio(level: number): number {
  return Math.min(1, 0.3 + level * 0.08);
}

/** Time-stop speed multiplier applied to enemies/enemy-shots. */
export function timeStopSpeedMul(_level: number): number {
  return 0.05; // near-zero; can be improved by level if desired later
}
