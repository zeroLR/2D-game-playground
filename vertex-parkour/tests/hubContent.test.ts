import { describe, expect, it } from 'vitest';
import { CHAPTER_ONE_BIOMES, HUB_NAV, RELIC_PREVIEWS, TALENT_NODES } from '../src/hub/HubContent';

describe('Game Hub content model', () => {
  it('exposes the complete product shell navigation', () => {
    expect(HUB_NAV.map((item) => item.id)).toEqual(['home', 'profile', 'talent', 'gate', 'relic', 'settings']);
  });

  it('presents the full Chapter 1 biome route in progression order', () => {
    expect(CHAPTER_ONE_BIOMES.map((biome) => biome.id)).toEqual(['teal', 'amber', 'violet', 'pale', 'crown']);
    expect(CHAPTER_ONE_BIOMES.at(-1)?.label).toBe('STORM CROWN');
  });

  it('keeps talent and relic shells populated without pretending persistence exists', () => {
    expect(TALENT_NODES.some((node) => node.state === 'locked')).toBe(true);
    expect(TALENT_NODES.some((node) => node.state === 'active')).toBe(true);
    expect(RELIC_PREVIEWS.length).toBeGreaterThanOrEqual(3);
  });
});
