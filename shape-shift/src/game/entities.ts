import {
  AVATAR_BASE_HP,
  AVATAR_RADIUS,
  AVATAR_START_X,
  AVATAR_START_Y,
  ENEMY_SPAWN_MARGIN,
  PLAY_H,
  PLAY_W,
  PROJECTILE_RADIUS,
  WEAPON_BASE_CRIT,
  WEAPON_BASE_DAMAGE,
  WEAPON_BASE_PIERCE,
  WEAPON_BASE_PERIOD,
  WEAPON_BASE_PROJECTILES,
  WEAPON_BASE_PROJECTILE_SPEED,
} from "./config";
import { type Rng } from "./rng";
import { type EnemyKind, type EntityId, type WeaponState, World } from "./world";

export function spawnAvatar(world: World): EntityId {
  return world.create({
    pos: { x: AVATAR_START_X, y: AVATAR_START_Y },
    vel: { x: 0, y: 0 },
    radius: AVATAR_RADIUS,
    team: "player",
    avatar: {
      hp: AVATAR_BASE_HP,
      maxHp: AVATAR_BASE_HP,
      speedMul: 1,
      iframes: 0,
      targetX: AVATAR_START_X,
      targetY: AVATAR_START_Y,
    },
    weapon: {
      period: WEAPON_BASE_PERIOD,
      damage: WEAPON_BASE_DAMAGE,
      projectileSpeed: WEAPON_BASE_PROJECTILE_SPEED,
      projectiles: WEAPON_BASE_PROJECTILES,
      pierce: WEAPON_BASE_PIERCE,
      crit: WEAPON_BASE_CRIT,
      cooldown: 0.2, // tiny grace before first shot
    },
  });
}

export interface EnemyStats {
  hp: number;
  maxSpeed: number;
  contactDamage: number;
  radius: number;
}

const ENEMY_STATS: Record<EnemyKind, EnemyStats> = {
  circle:  { hp: 2,  maxSpeed: 70,  contactDamage: 1, radius: 8 },
  square:  { hp: 3,  maxSpeed: 95,  contactDamage: 1, radius: 9 },
  star:    { hp: 6,  maxSpeed: 85,  contactDamage: 1, radius: 11 },
  boss:    { hp: 60, maxSpeed: 50,  contactDamage: 1, radius: 22 },
};

export function spawnEnemy(world: World, kind: EnemyKind, rng: Rng): EntityId {
  const stats = ENEMY_STATS[kind];
  // Bosses appear in the upper play-field, centered. Other enemies spawn on
  // the outer margin of one of the four edges.
  let x: number, y: number;
  if (kind === "boss") {
    x = PLAY_W / 2;
    y = PLAY_H * 0.15;
  } else {
    const edge = Math.floor(rng() * 4);
    if (edge === 0)        { x = rng() * PLAY_W; y = ENEMY_SPAWN_MARGIN; }
    else if (edge === 1)   { x = PLAY_W - ENEMY_SPAWN_MARGIN; y = rng() * PLAY_H; }
    else if (edge === 2)   { x = rng() * PLAY_W; y = PLAY_H - ENEMY_SPAWN_MARGIN; }
    else                   { x = ENEMY_SPAWN_MARGIN; y = rng() * PLAY_H; }
  }
  return world.create({
    pos: { x, y },
    vel: { x: 0, y: 0 },
    radius: stats.radius,
    team: "enemy",
    enemy: {
      kind,
      contactDamage: stats.contactDamage,
      maxSpeed: stats.maxSpeed,
      wobblePhase: rng() * Math.PI * 2,
    },
    hp: { value: stats.hp },
  });
}

export function spawnProjectile(
  world: World,
  x: number,
  y: number,
  vx: number,
  vy: number,
  weapon: WeaponState,
  crit: boolean,
): EntityId {
  return world.create({
    pos: { x, y },
    vel: { x: vx, y: vy },
    radius: PROJECTILE_RADIUS,
    team: "projectile",
    projectile: {
      damage: weapon.damage * (crit ? 2 : 1),
      crit,
      pierceRemaining: weapon.pierce,
      hitIds: new Set<EntityId>(),
      ttl: 1.6,
    },
  });
}
