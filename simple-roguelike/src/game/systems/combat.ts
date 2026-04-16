import type { Components, EntityId, World } from "../world";
import type { Rng } from "../rng";
import { roll } from "../rng";
import type { MessageLog } from "../../ui/hud";

// ---------------------------------------------------------------------------
// Level-up helpers
// ---------------------------------------------------------------------------

/** XP required to advance from `level` to the next. */
export function xpForNextLevel(level: number): number {
  return level * 5; // lv1→2 = 5, lv2→3 = 10, …
}

/**
 * Award `amount` XP to an entity that has the `experience` component.
 * Handles multi-level-ups when the XP exceeds more than one threshold.
 */
export function gainXp(player: Components, amount: number, log: MessageLog): void {
  if (!player.experience || !player.stats || !player.health) return;
  player.experience.xp += amount;
  while (player.experience.xp >= xpForNextLevel(player.experience.level)) {
    player.experience.xp -= xpForNextLevel(player.experience.level);
    player.experience.level += 1;
    player.stats.str += 1;
    player.stats.def += 1;
    player.health.max += 3;
    player.health.hp = Math.min(player.health.max, player.health.hp + 3);
    log.push(`You feel stronger! (Lv ${player.experience.level})`);
  }
}

// ---------------------------------------------------------------------------
// Attack resolution
// ---------------------------------------------------------------------------

/**
 * Resolve an attack from `attacker` to `target`.
 *
 * Damage = max(1, diceRoll + attacker.STR − target.DEF).
 *
 * On kill the attacker receives XP if the target carries an `xpReward`.
 * Returns `true` if the target died as a result.
 */
export function attack(
  world: World,
  attacker: EntityId,
  target: EntityId,
  rng: Rng,
  log: MessageLog,
): boolean {
  const atkC = world.get(attacker);
  const tgtC = world.get(target);
  if (!atkC || !tgtC || !tgtC.health || !atkC.combat) return false;

  const [n, sides] = atkC.combat.damageDice;
  const raw = roll(rng, n, sides);
  const str = atkC.stats?.str ?? 0;
  const def = tgtC.stats?.def ?? 0;
  const dmg = Math.max(1, raw + str - def);
  tgtC.health.hp = Math.max(0, tgtC.health.hp - dmg);

  const atkName = atkC.name ?? "something";
  const tgtName = tgtC.name ?? "something";
  log.push(`${capitalize(atkName)} hits ${tgtName} for ${dmg}.`);

  if (tgtC.health.hp <= 0) {
    log.push(`${capitalize(tgtName)} dies.`);
    // Award XP to the attacker (if applicable).
    if (tgtC.xpReward && atkC.experience) {
      gainXp(atkC, tgtC.xpReward, log);
    }
    // Don't remove the player — main.ts handles the death overlay.
    if (!tgtC.player) world.remove(target);
    return true;
  }
  return false;
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
