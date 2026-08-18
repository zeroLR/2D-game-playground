import { describe, expect, it } from 'vitest';
import { applyRelic, createInitialState } from '../src/domain/gameState';
import { RELICS, RELIC_POOL, acquireRelic, availableRelics, createEmptyRelicInventory, hasRelic, relicsForTrigger } from '../src/domain/relics';

describe('relic domain', () => {
  it('starts empty and acquires relics without duplication', () => {
    const empty = createEmptyRelicInventory();
    const once = acquireRelic(empty, 'glass-anchor');
    const twice = acquireRelic(once, 'glass-anchor');
    expect(hasRelic(empty, 'glass-anchor')).toBe(false);
    expect(hasRelic(once, 'glass-anchor')).toBe(true);
    expect(twice).toBe(once);
  });

  it('filters acquisition pool by source and owned relics', () => {
    const empty = createEmptyRelicInventory();
    expect(availableRelics(empty, 'treasure')).toEqual(expect.arrayContaining(['glass-anchor', 'storm-lens']));
    const owned = acquireRelic(empty, 'glass-anchor');
    expect(availableRelics(owned, 'treasure')).not.toContain('glass-anchor');
  });

  it('indexes owned relics by gameplay trigger', () => {
    let inventory = createEmptyRelicInventory();
    inventory = acquireRelic(inventory, 'storm-lens');
    expect(relicsForTrigger(inventory, 'storm-force').map((relic) => relic.id)).toEqual(['storm-lens']);
    expect(relicsForTrigger(inventory, 'landing')).toEqual([]);
  });

  it('keeps prototype relics rule-oriented instead of raw stat bonuses', () => {
    expect(RELIC_POOL).toHaveLength(3);
    expect(new Set(RELIC_POOL.map((id) => RELICS[id].effect.kind)).size).toBe(3);
    expect(RELIC_POOL.every((id) => RELICS[id].effect.triggers.length > 0)).toBe(true);
  });

  it('stores relic inventory in run state independently from skills', () => {
    const initial = createInitialState();
    const next = applyRelic(initial, 'abyss-heart');
    expect(next.relics.has('abyss-heart')).toBe(true);
    expect(initial.relics.has('abyss-heart')).toBe(false);
    expect(next.skills).toEqual(initial.skills);
  });
});
