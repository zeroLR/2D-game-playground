// ── Persistent data models ──────────────────────────────────────────────────
// All types stored in IndexedDB. Kept in a single file so every store shares
// one import path and one schema version constant.

/** Global schema version — bump when store shapes change. */
export const SCHEMA_VERSION = 1;

// ── Player Profile ──────────────────────────────────────────────────────────

/** Player‐level persistent state (points, unlocks, lifetime stats). */
export interface PlayerProfile {
  /** Spendable currency earned from runs. */
  points: number;
  /** IDs of unlocked avatar skins (cosmetic). */
  ownedSkins: string[];
  /** Currently selected skin ID. */
  activeSkin: string;
  /** Lifetime stats. */
  stats: PlayerStats;
}

export interface PlayerStats {
  totalRuns: number;
  totalKills: number;
  totalBossKills: number;
  bestSurvivalWave: number;
  normalCleared: boolean[];  // indexed 0..2 for 3 stages
}

export function defaultPlayerProfile(): PlayerProfile {
  return {
    points: 0,
    ownedSkins: ["triangle"],
    activeSkin: "triangle",
    stats: {
      totalRuns: 0,
      totalKills: 0,
      totalBossKills: 0,
      bestSurvivalWave: 0,
      normalCleared: [false, false, false],
    },
  };
}

// ── Equipment ───────────────────────────────────────────────────────────────

/** A purchasable enhancement card that can be equipped before a run. */
export interface EquipmentCard {
  id: string;
  name: string;
  glyph: string;
  text: string;
  /** Effect applied at run start (same shape as in-run Card effects). */
  effectKind: string;
  effectValue: number;
}

export interface EquipmentLoadout {
  /** Max number of equippable card slots (starts at 3, expandable). */
  maxSlots: number;
  /** IDs of cards currently equipped (length ≤ maxSlots). */
  equipped: string[];
  /** IDs of all owned equipment cards. */
  ownedCards: string[];
}

export function defaultEquipmentLoadout(): EquipmentLoadout {
  return { maxSlots: 3, equipped: [], ownedCards: [] };
}

// ── Skill Tree ──────────────────────────────────────────────────────────────

export type PrimalSkillId = "timeStop" | "shadowClone";

export interface SkillLevel {
  unlocked: boolean;
  /** Upgrade level (0 = base, each level improves duration / cooldown). */
  level: number;
}

export interface SkillTreeState {
  /** Primal skill core currency — dropped by bosses. */
  cores: number;
  /** Bonus points earned from duplicate skill draws (can upgrade skills). */
  skillPoints: number;
  skills: Record<PrimalSkillId, SkillLevel>;
}

export function defaultSkillTreeState(): SkillTreeState {
  return {
    cores: 0,
    skillPoints: 0,
    skills: {
      timeStop: { unlocked: false, level: 0 },
      shadowClone: { unlocked: false, level: 0 },
    },
  };
}

// ── Achievements ────────────────────────────────────────────────────────────

export type AchievementId =
  | "firstBossKill"
  | "firstPrimalSkill"
  | "noPowerNormalClear"
  | "noPowerSurvival16";

export interface AchievementEntry {
  unlocked: boolean;
  unlockedAt: number | null;  // timestamp ms
}

export type AchievementState = Record<AchievementId, AchievementEntry>;

export function defaultAchievementState(): AchievementState {
  return {
    firstBossKill:       { unlocked: false, unlockedAt: null },
    firstPrimalSkill:    { unlocked: false, unlockedAt: null },
    noPowerNormalClear:  { unlocked: false, unlockedAt: null },
    noPowerSurvival16:   { unlocked: false, unlockedAt: null },
  };
}

// ── Shop Unlocks ────────────────────────────────────────────────────────────

export interface ShopUnlocks {
  /** IDs of items the player has purchased. */
  purchased: string[];
}

export function defaultShopUnlocks(): ShopUnlocks {
  return { purchased: [] };
}

// ── Settings ────────────────────────────────────────────────────────────────

export interface GameSettings {
  muted: boolean;
}

export function defaultGameSettings(): GameSettings {
  return { muted: false };
}

// ── Aggregate save blob (for export / import) ───────────────────────────────

export interface SaveData {
  version: number;
  profile: PlayerProfile;
  equipment: EquipmentLoadout;
  skillTree: SkillTreeState;
  achievements: AchievementState;
  shop: ShopUnlocks;
  settings: GameSettings;
}
