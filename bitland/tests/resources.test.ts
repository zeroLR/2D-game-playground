import { describe, expect, it } from 'vitest';
import { createInventory, gatherNode, pushObject } from '../src/simulation/world/resources';

describe('resource interactions', () => {
  it('gathers a node once into inventory', () => {
    const inventory = createInventory();
    const node = { id: 'matter-1', resource: 'MATTER' as const, amount: 2, x: 100, depleted: false };
    expect(gatherNode(node, inventory)).toBe(true);
    expect(inventory.MATTER).toBe(2);
    expect(gatherNode(node, inventory)).toBe(false);
    expect(inventory.MATTER).toBe(2);
  });

  it('pushes only from the correct side and clamps bounds', () => {
    const crate = { id: 'crate-1', x: 200, minX: 160, maxX: 240 };
    pushObject(crate, 180, 1, 30);
    expect(crate.x).toBe(230);
    pushObject(crate, 250, 1, 30);
    expect(crate.x).toBe(230);
    pushObject(crate, 250, -1, 100);
    expect(crate.x).toBe(160);
  });
});
