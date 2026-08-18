import { describe, expect, it } from 'vitest';
import { createRelicOffering, relicSourceForEncounter } from '../src/domain/RelicAcquisition';
import { acquireRelic, createEmptyRelicInventory } from '../src/domain/relics';

describe('relic acquisition', () => {
  it('maps completed reward encounters to Relic sources', () => {
    expect(relicSourceForEncounter('elite')).toBe('elite');
    expect(relicSourceForEncounter('treasure')).toBe('treasure');
    expect(relicSourceForEncounter('climax')).toBe('special');
    expect(relicSourceForEncounter('dash-chain')).toBeNull();
  });

  it('offers source-compatible unowned Relics', () => {
    const empty = createEmptyRelicInventory();
    expect(createRelicOffering(empty, 'elite')).toEqual(['glass-anchor', 'abyss-heart']);
    expect(createRelicOffering(empty, 'treasure')).toEqual(['glass-anchor', 'storm-lens']);
    expect(createRelicOffering(empty, 'special')).toEqual(['abyss-heart', 'storm-lens']);
  });

  it('removes owned Relics from later offerings', () => {
    const owned = acquireRelic(createEmptyRelicInventory(), 'glass-anchor');
    expect(createRelicOffering(owned, 'treasure')).toEqual(['storm-lens']);
  });
});
