import { describe, expect, it } from 'vitest';
import { createPoiObservationState, createRegionPoi, isPoiScanned, poiKindForBiome, scanPoi } from '../src/simulation/world/poi';
import { createRegionState, generateNextRegion } from '../src/simulation/world/regions';
import { createWorldPressure } from '../src/simulation/world/pressure';

describe('biome region POIs', () => {
  it('maps each biome to a distinct curiosity landmark', () => {
    expect(poiKindForBiome('DATA_FIELD')).toBe('MEMORY_BLOOM');
    expect(poiKindForBiome('CRYSTAL_NODE')).toBe('SIGNAL_SPIRE');
    expect(poiKindForBiome('CORRUPTION_FIELD')).toBe('FRACTURE_WELL');
  });

  it('reproduces the same POI from canonical region inputs', () => {
    const a = createRegionPoi('region-1', 'CRYSTAL_NODE', 1920, 640, 123456);
    const b = createRegionPoi('region-1', 'CRYSTAL_NODE', 1920, 640, 123456);
    expect(a).toEqual(b);
    expect(a.x).toBeGreaterThan(1920);
    expect(a.x).toBeLessThan(2560);
  });

  it('stores a canonical POI when a region is generated', () => {
    const regions = createRegionState();
    const region = generateNextRegion(regions, 'world', { codexCount: 0, activeTraits: [], pressure: createWorldPressure() });
    if (!region) throw new Error('expected region');
    expect(region.poi?.id).toBe(`${region.id}::poi`);
    expect(region.poi?.kind).toBe(poiKindForBiome(region.biome));
  });

  it('records first scan once and keeps it queryable', () => {
    const poi = createRegionPoi('region-1', 'DATA_FIELD', 1920, 640, 99);
    const state = createPoiObservationState();
    expect(scanPoi(state, poi)).toBe(true);
    expect(scanPoi(state, poi)).toBe(false);
    expect(isPoiScanned(state, poi.id)).toBe(true);
  });
});
