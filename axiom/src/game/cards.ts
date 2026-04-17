import { type Rng, shuffle } from "./rng";
import type { World, EntityId } from "./world";

export type Rarity = "common" | "uncommon" | "rare";

export type CardEffect =
  | { kind: "damageAdd"; value: number }
  | { kind: "periodMul"; value: number }      // < 1 = faster fire
  | { kind: "projectileSpeedMul"; value: number }
  | { kind: "projectilesAdd"; value: number }
  | { kind: "pierceAdd"; value: number }
  | { kind: "critAdd"; value: number }         // 0..1
  | { kind: "maxHpAdd"; value: number }
  | { kind: "speedMul"; value: number };

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
  }
}
