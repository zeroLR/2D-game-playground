import { consumeWorldAdvanceSignal } from '../ecology/worldAdvanceSignal';
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
  spawnX: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  contactCooldownRemaining: number;
  loot: { resource: RootResource; amount: number };
  lootAmount: number;
};

export type AttackModifiers = {
  damageBonus?: number;
  rangeBonus?: number;
};

export function createPlayerCombatState(): PlayerCombatState {
  return { hp: 5, maxHp: 5, invulnerableRemaining: 0, attackCooldownRemaining: 0 };
}

export function createEnemy(id: string, x: number, loot: EnemyState['loot']): EnemyState {
  return {
    id,
    x,
    spawnX: x,
    hp: 3,
    maxHp: 3,
    alive: true,
    contactCooldownRemaining: 0,
    loot: { ...loot },
    lootAmount: loot.amount,
  };
}

export function respawnEnemy(enemy: EnemyState): void {
  enemy.x = enemy.spawnX;
  enemy.hp = enemy.maxHp;
  enemy.alive = true;
  enemy.contactCooldownRemaining = 0;
  enemy.loot.amount = enemy.lootAmount;
}

export function applyEnemyRepopulation(enemies: EnemyState[], hostility: number, signature: number): string[] {
  const dead = enemies.filter(enemy => !enemy.alive).sort((a, b) => a.id.localeCompare(b.id));
  if (dead.length === 0 || hostility <= 0) return [];

  const count = Math.min(dead.length, 1 + Math.floor(Math.min(hostility, 8) / 4));
  const start = signature % dead.length;
  const repopulated: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const enemy = dead[(start + index) % dead.length];
    respawnEnemy(enemy);
    repopulated.push(enemy.id);
  }
  return repopulated;
}

export function tickCombat(player: PlayerCombatState, enemies: EnemyState[], dt: number): void {
  const worldAdvance = consumeWorldAdvanceSignal();
  if (worldAdvance) applyEnemyRepopulation(enemies, worldAdvance.hostility, worldAdvance.signature);

  player.invulnerableRemaining = Math.max(0, player.invulnerableRemaining - dt);
  player.attackCooldownRemaining = Math.max(0, player.attackCooldownRemaining - dt);
  for (const enemy of enemies) enemy.contactCooldownRemaining = Math.max(0, enemy.contactCooldownRemaining - dt);
}

export function startDodgeInvulnerability(player: PlayerCombatState): void {
  player.invulnerableRemaining = Math.max(player.invulnerableRemaining, 0.22);
}

export function attackEnemy(player: PlayerCombatState, enemy: EnemyState, distance: number, modifiers: AttackModifiers = {}): boolean {
  const range = 58 + Math.max(0, modifiers.rangeBonus ?? 0);
  if (!enemy.alive || player.attackCooldownRemaining > 0 || distance > range) return false;
  player.attackCooldownRemaining = 0.28;
  const damage = 1 + Math.max(0, Math.floor(modifiers.damageBonus ?? 0));
  enemy.hp = Math.max(0, enemy.hp - damage);
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
