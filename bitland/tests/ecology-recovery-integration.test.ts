import { describe, expect, it } from 'vitest';
import { createEnemy, createPlayerCombatState, tickCombat } from '../src/simulation/combat/combat';
import { applyResourceRecovery } from '../src/simulation/ecology/feedback';
import { clearWorldAdvanceSignal } from '../src/simulation/ecology/worldAdvanceSignal';
import { createEcologyState } from '../src/simulation/ecology/worldTick';
import { createInventory, gatherNode, type ResourceNode } from '../src/simulation/world/resources';

describe('ecology recovery integration', () => {
  it('makes recovered resource nodes harvestable again', () => {
    clearWorldAdvanceSignal();
    const inventory = createInventory();
    const node: ResourceNode = { id: 'life', resource: 'LIFE', amount: 2, x: 0, depleted: false };
    expect(gatherNode(node, inventory)).toBe(true);
    expect(node).toMatchObject({ amount: 0, capacity: 2, depleted: true });

    const ecology = createEcologyState();
    ecology.tickIndex = 1;
    ecology.resourceShift.LIFE = 1;
    applyResourceRecovery([node], ecology);

    expect(gatherNode(node, inventory)).toBe(true);
    expect(inventory.LIFE).toBe(4);
    clearWorldAdvanceSignal();
  });

  it('repopulates a defeated creature on the simulation frame after world advance', () => {
    clearWorldAdvanceSignal();
    const enemy = createEnemy('crawler', 240, { resource: 'LIFE', amount: 1 });
    enemy.alive = false;
    enemy.hp = 0;
    enemy.x = 410;
    enemy.loot.amount = 0;

    const ecology = createEcologyState();
    ecology.tickIndex = 1;
    ecology.lastSignature = 7;
    applyResourceRecovery([], ecology);
    tickCombat(createPlayerCombatState(), [enemy], 0.016);

    expect(enemy).toMatchObject({ alive: true, hp: 3, x: 240, loot: { resource: 'LIFE', amount: 1 } });
    clearWorldAdvanceSignal();
  });
});
