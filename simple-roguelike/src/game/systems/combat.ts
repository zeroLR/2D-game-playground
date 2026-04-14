import type { EntityId, World } from "../world";
import type { Rng } from "../rng";
import { roll } from "../rng";
import type { MessageLog } from "../../ui/hud";

/**
 * Resolve an attack from `attacker` to `target`. Rolls damage, applies it,
 * pushes a message, and removes the target if it died.
 *
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
  const dmg = roll(rng, n, sides);
  tgtC.health.hp = Math.max(0, tgtC.health.hp - dmg);

  const atkName = atkC.name ?? "something";
  const tgtName = tgtC.name ?? "something";
  log.push(`${capitalize(atkName)} hits ${tgtName} for ${dmg}.`);

  if (tgtC.health.hp <= 0) {
    log.push(`${capitalize(tgtName)} dies.`);
    // Don't remove the player — main.ts handles the death overlay.
    if (!tgtC.player) world.remove(target);
    return true;
  }
  return false;
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
