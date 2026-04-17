import { spawnProjectile } from "../entities";
import type { Rng } from "../rng";
import type { EntityId, World } from "../world";

// Auto-fire system: avatar's weapon cooldown ticks down; when ≤ 0, fire at
// the closest living enemy. If `weapon.projectiles > 1`, fan the shots with
// a small spread angle.

const FAN_SPREAD = 0.25; // radians between adjacent projectiles in a fan

function closestEnemy(world: World, x: number, y: number): EntityId | null {
  let bestId: EntityId | null = null;
  let bestDist = Infinity;
  for (const [id, c] of world.with("enemy", "pos", "hp")) {
    if ((c.hp!.value) <= 0) continue;
    const dx = c.pos!.x - x;
    const dy = c.pos!.y - y;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      bestId = id;
    }
  }
  return bestId;
}

export function updateWeapon(
  world: World,
  avatarId: EntityId,
  rng: Rng,
  dt: number,
): void {
  const c = world.get(avatarId);
  if (!c || !c.weapon || !c.pos) return;
  const w = c.weapon;
  w.cooldown -= dt;
  if (w.cooldown > 0) return;

  const targetId = closestEnemy(world, c.pos.x, c.pos.y);
  if (targetId === null) {
    // No target: don't overcharge cooldown forever.
    if (w.cooldown < -0.5) w.cooldown = 0;
    return;
  }
  const target = world.get(targetId)!;
  const dx = target.pos!.x - c.pos.x;
  const dy = target.pos!.y - c.pos.y;
  const baseAngle = Math.atan2(dy, dx);
  const n = Math.max(1, w.projectiles);
  const startAngle = baseAngle - FAN_SPREAD * (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const a = startAngle + FAN_SPREAD * i;
    const vx = Math.cos(a) * w.projectileSpeed;
    const vy = Math.sin(a) * w.projectileSpeed;
    const crit = rng() < w.crit;
    spawnProjectile(world, avatarId, c.pos.x, c.pos.y, vx, vy, w, crit);
  }
  w.cooldown = w.period;
}
