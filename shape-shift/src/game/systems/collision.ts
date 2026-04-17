import { AVATAR_IFRAMES, HIT_FLASH_TIME } from "../config";
import type { EntityId, World } from "../world";

// Circle-circle collision. Enough for the visual language of the game.
// Scope: ~40 enemies × ~100 projectiles = 4000 checks/frame — negligible.

export interface CombatEvents {
  onEnemyKilled?: (id: EntityId) => void;
  onPlayerHit?: (amount: number) => void;
  onPlayerDied?: () => void;
}

export function updateCollisions(
  world: World,
  avatarId: EntityId,
  events: CombatEvents,
): void {
  // Projectile vs enemy.
  for (const [pid, pc] of world.with("projectile", "pos", "radius")) {
    const proj = pc.projectile!;
    if (proj.pierceRemaining < -1) { world.remove(pid); continue; }
    const pr = pc.radius!;
    const px = pc.pos!.x;
    const py = pc.pos!.y;
    for (const [eid, ec] of world.with("enemy", "pos", "radius", "hp")) {
      if (ec.hp!.value <= 0) continue;
      if (proj.hitIds.has(eid)) continue;
      const er = ec.radius!;
      const dx = ec.pos!.x - px;
      const dy = ec.pos!.y - py;
      const rr = (pr + er);
      if (dx * dx + dy * dy > rr * rr) continue;
      ec.hp!.value -= proj.damage;
      ec.flash = HIT_FLASH_TIME;
      proj.hitIds.add(eid);
      if (proj.pierceRemaining > 0) {
        proj.pierceRemaining -= 1;
      } else {
        world.remove(pid);
      }
      if (ec.hp!.value <= 0) {
        ec.dead = true;
        events.onEnemyKilled?.(eid);
      }
      break; // one hit per projectile step
    }
  }

  // Enemy vs avatar (contact damage).
  const avatar = world.get(avatarId);
  if (!avatar || !avatar.avatar || !avatar.pos) return;
  const a = avatar.avatar;
  if (a.hp <= 0) return;
  const ar = avatar.radius ?? 10;
  const ax = avatar.pos.x;
  const ay = avatar.pos.y;
  for (const [, ec] of world.with("enemy", "pos", "radius", "hp")) {
    if (ec.hp!.value <= 0) continue;
    const er = ec.radius!;
    const dx = ec.pos!.x - ax;
    const dy = ec.pos!.y - ay;
    const rr = ar + er;
    if (dx * dx + dy * dy > rr * rr) continue;
    if (a.iframes > 0) continue;
    const dmg = ec.enemy!.contactDamage;
    a.hp -= dmg;
    a.iframes = AVATAR_IFRAMES;
    avatar.flash = HIT_FLASH_TIME;
    events.onPlayerHit?.(dmg);
    if (a.hp <= 0) {
      a.hp = 0;
      events.onPlayerDied?.();
    }
    break;
  }
}

// Sweep dead enemies once per step.
export function removeDeadEnemies(world: World): void {
  for (const [id, c] of world.with("enemy")) {
    if (c.dead || (c.hp?.value ?? 1) <= 0) world.remove(id);
  }
}
