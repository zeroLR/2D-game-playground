import { describe, expect, it } from 'vitest';
import { applyEnemyRepopulation, attackEnemy, createEnemy, createPlayerCombatState, enemyContactHit, grantEnemyLoot, startDodgeInvulnerability, tickCombat } from '../src/simulation/combat/combat';
import { createInventory } from '../src/simulation/world/resources';

describe('combat foundation', () => {
  it('damages and defeats an enemy only inside attack range', () => {
    const player = createPlayerCombatState();
    const enemy = createEnemy('crawler', 0, { resource: 'LIFE', amount: 1 });
    expect(attackEnemy(player, enemy, 80)).toBe(false);
    expect(attackEnemy(player, enemy, 30)).toBe(true);
    tickCombat(player, [enemy], 0.3);
    attackEnemy(player, enemy, 30);
    tickCombat(player, [enemy], 0.3);
    attackEnemy(player, enemy, 30);
    expect(enemy.alive).toBe(false);
  });

  it('guard blocks contact damage and dodge grants invulnerability', () => {
    const player = createPlayerCombatState();
    const enemy = createEnemy('crawler', 0, { resource: 'LIFE', amount: 1 });
    expect(enemyContactHit(player, enemy, 20, true)).toBe(true);
    expect(player.hp).toBe(5);
    tickCombat(player, [enemy], 1);
    startDodgeInvulnerability(player);
    expect(enemyContactHit(player, enemy, 20, false)).toBe(false);
  });

  it('grants enemy loot only once', () => {
    const inventory = createInventory();
    const enemy = createEnemy('crawler', 0, { resource: 'LIFE', amount: 2 });
    enemy.alive = false;
    expect(grantEnemyLoot(enemy, inventory)).toBe(true);
    expect(inventory.LIFE).toBe(2);
    expect(grantEnemyLoot(enemy, inventory)).toBe(false);
  });

  it('repopulates defeated enemies from their spawn baseline when hostility is present', () => {
    const first = createEnemy('crawler-a', 120, { resource: 'LIFE', amount: 1 });
    const second = createEnemy('crawler-b', 260, { resource: 'ENERGY', amount: 1 });
    first.alive = false;
    first.hp = 0;
    first.x = 400;
    first.loot.amount = 0;
    second.alive = false;
    second.hp = 0;
    second.loot.amount = 0;

    const repopulated = applyEnemyRepopulation([first, second], 1, 0);
    expect(repopulated).toEqual(['crawler-a']);
    expect(first).toMatchObject({ alive: true, hp: 3, x: 120, loot: { resource: 'LIFE', amount: 1 } });
    expect(second.alive).toBe(false);
  });
});
