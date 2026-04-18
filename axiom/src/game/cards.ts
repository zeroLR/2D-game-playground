import { type Rng, shuffle } from "./rng";
import type { EntityId, SynergyId, World } from "./world";

export type Rarity = "common" | "uncommon" | "rare";

export type CardEffect =
  | { kind: "damageAdd"; value: number }
  | { kind: "periodMul"; value: number }      // < 1 = faster fire
  | { kind: "projectileSpeedMul"; value: number }
  | { kind: "projectilesAdd"; value: number }
  | { kind: "pierceAdd"; value: number }
  | { kind: "critAdd"; value: number }         // 0..1
  | { kind: "maxHpAdd"; value: number }
  | { kind: "speedMul"; value: number }
  | { kind: "ricochetAdd"; value: number }
  | { kind: "chainAdd"; value: number }
  | { kind: "burnAdd"; dps: number; duration: number }
  | { kind: "slowAdd"; pct: number; duration: number }
  | { kind: "synergy"; id: SynergyId };

export interface Card {
  id: string;
  name: string;
  glyph: string;    // single-char symbol rendered as the art
  rarity: Rarity;
  text: string;
  effect: CardEffect;
}

export const POOL: readonly Card[] = [
  { id: "sharp",      name: "Sharp Edge",    glyph: "△", rarity: "common",   text: "+1 damage",              effect: { kind: "damageAdd", value: 1 } },
  { id: "rapid",      name: "Rapid Fire",    glyph: "⟫", rarity: "common",   text: "-20% fire interval",     effect: { kind: "periodMul", value: 0.8 } },
  { id: "velocity",   name: "Velocity",      glyph: "→", rarity: "common",   text: "+25% projectile speed",  effect: { kind: "projectileSpeedMul", value: 1.25 } },
  { id: "fork",       name: "Fork",          glyph: "⋔", rarity: "uncommon", text: "+1 projectile",          effect: { kind: "projectilesAdd", value: 1 } },
  { id: "pierce",     name: "Pierce",        glyph: "◇", rarity: "uncommon", text: "+1 pierce",              effect: { kind: "pierceAdd", value: 1 } },
  { id: "crit",       name: "Crit",          glyph: "✦", rarity: "uncommon", text: "+25% crit chance",       effect: { kind: "critAdd", value: 0.25 } },
  { id: "plating",    name: "Plating",       glyph: "▢", rarity: "common",   text: "+1 max HP",              effect: { kind: "maxHpAdd", value: 1 } },
  { id: "dash",       name: "Dash",          glyph: "≫", rarity: "common",   text: "+20% move speed",        effect: { kind: "speedMul", value: 1.2 } },
  { id: "overclock",  name: "Overclock",     glyph: "◎", rarity: "rare",     text: "-35% fire interval",     effect: { kind: "periodMul", value: 0.65 } },
  { id: "heavy",      name: "Heavy Rounds",  glyph: "■", rarity: "rare",     text: "+2 damage",              effect: { kind: "damageAdd", value: 2 } },
  { id: "rebound",    name: "Rebound",       glyph: "⇌", rarity: "uncommon", text: "+1 ricochet",            effect: { kind: "ricochetAdd", value: 1 } },
  { id: "ignite",     name: "Ignite",        glyph: "※", rarity: "rare",     text: "Burn 2 dps for 3s",      effect: { kind: "burnAdd", dps: 2, duration: 3 } },
  { id: "freeze",     name: "Freeze",        glyph: "❄", rarity: "uncommon", text: "Slow 35% for 2s",        effect: { kind: "slowAdd", pct: 0.35, duration: 2 } },
  { id: "arc",        name: "Arc",           glyph: "⌇", rarity: "rare",     text: "+1 chain",               effect: { kind: "chainAdd", value: 1 } },
  { id: "combustion", name: "Combustion",    glyph: "❂", rarity: "rare",     text: "Every 10 kills: AoE explosion", effect: { kind: "synergy", id: "combustion" } },
  { id: "desperate",  name: "Desperate",     glyph: "✖", rarity: "rare",     text: "While HP ≤ 2: ×2 damage",       effect: { kind: "synergy", id: "desperate" } },
  { id: "kinetic",    name: "Kinetic",       glyph: "↯", rarity: "uncommon", text: "While moving: +25% crit",       effect: { kind: "synergy", id: "kinetic" } },
  { id: "stillness",  name: "Stillness",     glyph: "◦", rarity: "uncommon", text: "While still: -25% fire interval", effect: { kind: "synergy", id: "stillness" } },
];

export function drawOffer(rng: Rng, count: number, pool: readonly Card[] = POOL): Card[] {
  return shuffle(rng, pool).slice(0, Math.min(count, pool.length));
}

export function applyCard(world: World, avatarId: EntityId, card: Card): void {
  const c = world.get(avatarId);
  if (!c || !c.avatar || !c.weapon) return;
  const e = card.effect;
  switch (e.kind) {
    case "damageAdd":          c.weapon.damage += e.value; break;
    case "periodMul":          c.weapon.period = Math.max(0.05, c.weapon.period * e.value); break;
    case "projectileSpeedMul": c.weapon.projectileSpeed *= e.value; break;
    case "projectilesAdd":     c.weapon.projectiles += e.value; break;
    case "pierceAdd":          c.weapon.pierce += e.value; break;
    case "critAdd":            c.weapon.crit = Math.min(1, c.weapon.crit + e.value); break;
    case "maxHpAdd":
      c.avatar.maxHp += e.value;
      c.avatar.hp = Math.min(c.avatar.maxHp, c.avatar.hp + e.value);
      break;
    case "speedMul":           c.avatar.speedMul *= e.value; break;
    case "ricochetAdd":        c.weapon.ricochet += e.value; break;
    case "chainAdd":           c.weapon.chain += e.value; break;
    case "burnAdd":
      // Stack burn DPS additively; extend duration to the longer of the two.
      c.weapon.burnDps += e.dps;
      c.weapon.burnDuration = Math.max(c.weapon.burnDuration, e.duration);
      break;
    case "slowAdd":
      c.weapon.slowPct = Math.min(0.9, c.weapon.slowPct + e.pct);
      c.weapon.slowDuration = Math.max(c.weapon.slowDuration, e.duration);
      break;
    case "synergy":
      if (!c.avatar.synergies) c.avatar.synergies = [];
      // Combustion starts at 0 kills; others carry no per-instance state.
      c.avatar.synergies.push(
        e.id === "combustion" ? { id: e.id, killCounter: 0 } : { id: e.id },
      );
      break;
  }
}
