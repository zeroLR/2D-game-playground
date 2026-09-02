import { describe, expect, it } from 'vitest';
import { availablePairs, createSynthesisState, MAX_NOVEL_DISCOVERIES_PER_PAIR, synthesize } from '../src/simulation/synthesis/synthesis';
import { createInventory } from '../src/simulation/world/resources';

describe('synthesis', () => {
  it('lists only pairs backed by available resources', () => {
    const inventory = createInventory();
    inventory.MATTER = 1;
    inventory.SIGNAL = 1;
    expect(availablePairs(inventory)).toEqual([['MATTER', 'SIGNAL']]);
  });

  it('is order-independent and deterministic for a world seed', () => {
    const aInventory = createInventory();
    const bInventory = createInventory();
    aInventory.MATTER = aInventory.LIFE = 1;
    bInventory.MATTER = bInventory.LIFE = 1;
    const a = synthesize(createSynthesisState(), aInventory, 'bitland-alpha', 'MATTER', 'LIFE');
    const b = synthesize(createSynthesisState(), bInventory, 'bitland-alpha', 'LIFE', 'MATTER');
    expect(a?.pairKey).toBe(b?.pairKey);
    expect(a?.traits).toEqual(b?.traits);
  });

  it('caps novel discoveries and reuses the canonical pool afterward', () => {
    const inventory = createInventory();
    inventory.MATTER = 10;
    inventory.ENERGY = 10;
    const state = createSynthesisState();
    const results = Array.from({ length: MAX_NOVEL_DISCOVERIES_PER_PAIR + 2 }, () => synthesize(state, inventory, 'bitland-alpha', 'MATTER', 'ENERGY'));
    expect(state.discoveriesByPair['ENERGY::MATTER']).toHaveLength(MAX_NOVEL_DISCOVERIES_PER_PAIR);
    expect(results.every(Boolean)).toBe(true);
  });

  it('consumes one unit of each input', () => {
    const inventory = createInventory();
    inventory.LIFE = 2;
    inventory.SIGNAL = 1;
    const result = synthesize(createSynthesisState(), inventory, 'bitland-alpha', 'LIFE', 'SIGNAL');
    expect(result).not.toBeNull();
    expect(inventory.LIFE).toBe(1);
    expect(inventory.SIGNAL).toBe(0);
  });
});
