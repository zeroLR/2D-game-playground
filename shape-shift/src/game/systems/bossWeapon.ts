import { spawnEnemyShot } from "../entities";
import type { Rng } from "../rng";
import type { EntityId, World } from "../world";

const FAN_SPREAD = 0.22;

export function updateBossWeapon(
  world: World,
  avatarId: EntityId,
  rng: Rng,
  dt: number,
): void {
  const avatar = world.get(avatarId);
  if (!avatar?.pos) return;
  const ax = avatar.pos.x;
  const ay = avatar.pos.y;

  for (const [, c] of world.with("enemy", "weapon", "pos", "hp")) {
    if (c.enemy!.kind !== "boss") continue;
    if (c.hp!.value <= 0) continue;
    const w = c.weapon!;
    w.cooldown -= dt;
    if (w.cooldown > 0) continue;

    const dx = ax - c.pos!.x;
    const dy = ay - c.pos!.y;
    const baseAngle = Math.atan2(dy, dx);
    const n = Math.max(1, w.projectiles);
    const startAngle = baseAngle - FAN_SPREAD * (n - 1) / 2;
    for (let i = 0; i < n; i++) {
      const a = startAngle + FAN_SPREAD * i;
      const vx = Math.cos(a) * w.projectileSpeed;
      const vy = Math.sin(a) * w.projectileSpeed;
      const crit = rng() < w.crit;
      spawnEnemyShot(world, c.pos!.x, c.pos!.y, vx, vy, w.damage, crit);
    }
    w.cooldown = w.period;
  }
}
