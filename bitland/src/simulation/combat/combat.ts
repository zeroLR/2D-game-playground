import type { Inventory, RootResource } from '../world/resources';

export type PlayerCombatState = {
  hp: number;
  maxHp: number;
  invulnerableRemaining: number;
  attackCooldownRemaining: number;
};

export type EnemyState = {
  id: string;
  x: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  contactCooldownRemaining: number;
  loot: { resource: RootResource; amount: number };
};

export function createPlayerCombatState(): PlayerCombatState {
  return { hp: 5, maxHp: 5, invulnerableRemaining: 0, attackCooldownRemaining: 0 };
}

export function createEnemy(id: string, x: number, loot: EnemyState['loot']): EnemyState {
  return { id, x, hp: 3, maxHp: 3, alive: true, contactCooldownRemaining: 0, loot };
}

export function tickCombat(player: PlayerCombatState, enemies: EnemyState[], dt: number): void {
  player.invulnerableRemaining = Math.max(0, player.invulnerableRemaining - dt);
  player.attackCooldownRemaining = Math.max(0, player.attackCooldownRemaining - dt);
  for (const enemy of enemies) enemy.contactCooldownRemaining = Math.max(0, enemy.contactCooldownRemaining - dt);
}

export function startDodgeInvulnerability(player: PlayerCombatState): void {
  player.invulnerableRemaining = Math.max(player.invulnerableRemaining, 0.22);
}

export function attackEnemy(player: PlayerCombatState, enemy: EnemyState, distance: number): boolean {
  if (!enemy.alive || player.attackCooldownRemaining > 0 || distance > 58) return false;
  player.attackCooldownRemaining = 0.28;
  enemy.hp = Math.max(0, enemy.hp - 1);
  if (enemy.hp === 0) enemy.alive = false;
  return true;
}

export function enemyContactHit(player: PlayerCombatState, enemy: EnemyState, distance: number, guarding: boolean): boolean {
  if (!enemy.alive || distance > 36 || enemy.contactCooldownRemaining > 0 || player.invulnerableRemaining > 0) return false;
  enemy.contactCooldownRemaining = 0.8;
  player.hp = Math.max(0, player.hp - (guarding ? 0 : 1));
  player.invulnerableRemaining = guarding ? 0.18 : 0.55;
  return true;
}

export function grantEnemyLoot(enemy: EnemyState, inventory: Inventory): boolean {
  if (enemy.alive || enemy.loot.amount <= 0) return false;
  inventory[enemy.loot.resource] += enemy.loot.amount;
  enemy.loot.amount = 0;
  return true;
}
