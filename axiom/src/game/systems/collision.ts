import { AVATAR_IFRAMES, HIT_FLASH_TIME } from "../config";
import { spawnEnemyAt } from "../entities";
import type { Rng } from "../rng";
import type { EntityId, World } from "../world";

export interface CombatEvents {
  onEnemyKilled?: (id: EntityId) => void;
  onPlayerHit?: (amount: number) => void;
  onPlayerDied?: () => void;
}

export function updateCollisions(
  world: World,
  avatarId: EntityId,
  events: CombatEvents,
  rng?: Rng,
): void {
  for (const [pid, pc] of world.with("projectile", "pos", "radius")) {
    if (pc.team === "enemy-shot") continue;
    const proj = pc.projectile!;
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

      // Hexagon shield: absorb the first hit without HP loss.
      if (ec.enemy!.shield !== undefined && ec.enemy!.shield > 0) {
        ec.enemy!.shield -= 1;
        ec.flash = HIT_FLASH_TIME;
        proj.hitIds.add(eid);
        if (proj.pierceRemaining > 0) {
          proj.pierceRemaining -= 1;
        } else {
          world.remove(pid);
        }
        break;
      }

      ec.hp!.value -= proj.damage;
      ec.flash = HIT_FLASH_TIME;
      proj.hitIds.add(eid);
      if (proj.pierceRemaining > 0) {
        proj.pierceRemaining -= 1;
      } else {
        world.remove(pid);
      }
      if (ec.hp!.value <= 0) {
        // Pentagon splits into small circles on death near its position.
        if (ec.enemy!.kind === "pentagon" && rng) {
          const count = 2 + Math.floor(rng() * 2); // 2-3
          for (let i = 0; i < count; i++) {
            spawnEnemyAt(world, "circle", rng, ec.pos!.x, ec.pos!.y);
          }
        }
        events.onEnemyKilled?.(eid);
      }
      break;
    }
  }

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

  for (const [sid, sc] of world.with("projectile", "pos", "radius")) {
    if (sc.team !== "enemy-shot") continue;
    if (a.iframes > 0) break;
    if (a.hp <= 0) break;
    const dx = sc.pos!.x - ax;
    const dy = sc.pos!.y - ay;
    const rr = ar + sc.radius!;
    if (dx * dx + dy * dy > rr * rr) continue;
    const dmg = sc.projectile!.damage;
    a.hp -= dmg;
    a.iframes = AVATAR_IFRAMES;
    avatar.flash = HIT_FLASH_TIME;
    events.onPlayerHit?.(dmg);
    world.remove(sid);
    if (a.hp <= 0) {
      a.hp = 0;
      events.onPlayerDied?.();
    }
    break;
  }
}

export function removeDeadEnemies(world: World): void {
  for (const [id, c] of world.with("enemy", "hp")) {
    if (c.hp!.value <= 0) world.remove(id);
  }
}
