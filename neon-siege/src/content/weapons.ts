export type WeaponId = 'pistol' | 'smg' | 'shotgun' | 'railgun';

export interface WeaponDefinition {
  id: WeaponId;
  name: string;
  role: string;
  cooldown: number;
  damage: number;
  projectileSpeed: number;
  pellets: number;
  spreadRadians: number;
  knockback: number;
  pierce: number;
  projectileLength: number;
  projectileWidth: number;
}

export const WEAPONS: readonly WeaponDefinition[] = [
  {
    id: 'pistol',
    name: 'PISTOL',
    role: 'BALANCED',
    cooldown: 0.2,
    damage: 24,
    projectileSpeed: 680,
    pellets: 1,
    spreadRadians: 0,
    knockback: 105,
    pierce: 1,
    projectileLength: 18,
    projectileWidth: 4,
  },
  {
    id: 'smg',
    name: 'SMG',
    role: 'SUPPRESS',
    cooldown: 0.075,
    damage: 10,
    projectileSpeed: 760,
    pellets: 1,
    spreadRadians: 0.025,
    knockback: 42,
    pierce: 1,
    projectileLength: 13,
    projectileWidth: 3,
  },
  {
    id: 'shotgun',
    name: 'SHOTGUN',
    role: 'BREACH',
    cooldown: 0.58,
    damage: 9,
    projectileSpeed: 570,
    pellets: 6,
    spreadRadians: 0.19,
    knockback: 185,
    pierce: 1,
    projectileLength: 10,
    projectileWidth: 4,
  },
  {
    id: 'railgun',
    name: 'RAILGUN',
    role: 'PIERCE',
    cooldown: 0.9,
    damage: 72,
    projectileSpeed: 1050,
    pellets: 1,
    spreadRadians: 0,
    knockback: 88,
    pierce: 4,
    projectileLength: 32,
    projectileWidth: 5,
  },
] as const;

export const weaponAt = (index: number) => WEAPONS[Math.max(0, Math.min(WEAPONS.length - 1, index))];
