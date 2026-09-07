import { describe, expect, it } from 'vitest';
import {
  PAGE_ART_FAMILIES,
  PAGE_ART_MANIFEST,
  PAGE_LOGICAL_TILE_SIZE,
  PAGE_PIXEL_SIZE,
  TRAVELER_ANIMATIONS,
  TRAVELER_FRAME_COUNT,
  TRAVELER_FRAME_HEIGHT,
  TRAVELER_FRAME_WIDTH,
} from '../src/art/pixel-art-manifest';
import { DEMO_PAGE_DEFINITIONS } from '../src/domain/demo-level';

describe('P4 Page pixel-art contract', () => {
  it('ships exactly six authored Page families on the 32 px logical grid', () => {
    expect(PAGE_ART_FAMILIES).toHaveLength(6);
    expect(PAGE_LOGICAL_TILE_SIZE).toBe(32);
    expect(PAGE_PIXEL_SIZE).toBe(96);
    expect(PAGE_PIXEL_SIZE).toBe(PAGE_LOGICAL_TILE_SIZE * 3);
    expect(new Set(PAGE_ART_FAMILIES).size).toBe(6);
  });

  it('keeps every gameplay Page definition backed by a visual family', () => {
    const visualIds = new Set(PAGE_ART_FAMILIES);
    for (const definition of DEMO_PAGE_DEFINITIONS) {
      expect(visualIds.has(definition.id as (typeof PAGE_ART_FAMILIES)[number])).toBe(true);
      const art = PAGE_ART_MANIFEST[definition.id as (typeof PAGE_ART_FAMILIES)[number]];
      expect(art.source.endsWith('.png')).toBe(true);
      expect(art.label.length).toBeGreaterThan(0);
    }
  });
});

describe('P4 traveler sprite contract', () => {
  it('uses 32×48 frames and exposes all 17 authored frames exactly once', () => {
    expect(TRAVELER_FRAME_WIDTH).toBe(32);
    expect(TRAVELER_FRAME_HEIGHT).toBe(48);
    expect(TRAVELER_FRAME_COUNT).toBe(17);
    const authored = [
      ...TRAVELER_ANIMATIONS.idle,
      ...TRAVELER_ANIMATIONS.walkSouth,
      ...TRAVELER_ANIMATIONS.walkEast,
      ...TRAVELER_ANIMATIONS.walkNorth,
      ...TRAVELER_ANIMATIONS.arrival,
    ];
    expect(authored).toHaveLength(TRAVELER_FRAME_COUNT);
    expect([...new Set(authored)].sort((a, b) => a - b)).toEqual(Array.from({ length: 17 }, (_, index) => index));
  });
});
