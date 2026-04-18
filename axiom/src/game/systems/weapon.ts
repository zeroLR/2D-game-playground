import { spawnOrbitShard, spawnProjectile } from "../entities";
import type { Rng } from "../rng";
import { computeSynergyBonuses } from "../synergies";
import type { EntityId, World } from "../world";

const FAN_SPREAD = 0.25;

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

  // Synergy bonuses (Desperate/Kinetic/Stillness) apply per-shot, never mutate
  // the base WeaponState, so conditions that later stop holding revert cleanly.
  const velMag = c.vel ? Math.hypot(c.vel.x, c.vel.y) : 0;
  const bonus = c.avatar
    ? computeSynergyBonuses(c.avatar.synergies, c.avatar, velMag)
    : { damageMul: 1, periodMul: 1, critAdd: 0 };
  const effPeriod = Math.max(0.05, w.period * bonus.periodMul);
  const effDamage = w.damage * bonus.damageMul;
  const effCrit = Math.min(1, w.crit + bonus.critAdd);
  const effWeapon = { ...w, damage: effDamage, period: effPeriod, crit: effCrit };

  const target = world.get(targetId)!;
  const dx = target.pos!.x - c.pos.x;
  const dy = target.pos!.y - c.pos.y;
  const baseAngle = Math.atan2(dy, dx);
  const n = Math.max(1, w.projectiles);

  if (w.mode === "faceBeam") {
    const dirs = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    const speed = w.projectileSpeed * 1.35;
    for (let k = 0; k < n; k++) {
      const spread = (k - (n - 1) / 2) * 0.08;
      for (const d of dirs) {
        const a = d + spread;
        const vx = Math.cos(a) * speed;
        const vy = Math.sin(a) * speed;
        const crit = rng() < effCrit;
        spawnProjectile(world, c.pos.x, c.pos.y, vx, vy, effWeapon, crit, 0.24);
      }
    }
    w.cooldown = effPeriod;
    return;
  }

  if (w.mode === "orbitShard") {
    const base = w.orbitAngle ?? baseAngle;
    const step = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const a = base + i * step;
      const crit = rng() < effCrit;
      spawnOrbitShard(world, avatarId, a, effWeapon, crit);
    }
    w.orbitAngle = base + 0.55;
    w.cooldown = effPeriod;
    return;
  }

  const startAngle = baseAngle - FAN_SPREAD * (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const a = startAngle + FAN_SPREAD * i;
    const vx = Math.cos(a) * w.projectileSpeed;
    const vy = Math.sin(a) * w.projectileSpeed;
    const crit = rng() < effCrit;
    spawnProjectile(world, c.pos.x, c.pos.y, vx, vy, effWeapon, crit);
  }
  w.cooldown = effPeriod;
}
