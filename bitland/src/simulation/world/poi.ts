export type BiomePoiKind = 'MEMORY_BLOOM' | 'SIGNAL_SPIRE' | 'FRACTURE_WELL';

export type RegionPoi = {
  id: string;
  kind: BiomePoiKind;
  x: number;
  clue: string;
};

export type PoiObservationState = {
  scannedPoiIds: string[];
};

type PoiBiome = 'DATA_FIELD' | 'CRYSTAL_NODE' | 'CORRUPTION_FIELD';

const POI_LABELS: Record<BiomePoiKind, string> = {
  MEMORY_BLOOM: 'MEMORY BLOOM',
  SIGNAL_SPIRE: 'SIGNAL SPIRE',
  FRACTURE_WELL: 'FRACTURE WELL',
};

const POI_CLUES: Record<BiomePoiKind, string[]> = {
  MEMORY_BLOOM: [
    'LIFE PATTERNS ARE REWRITING OLD DATA ROOTS',
    'THE BLOOM STORES TRACES OF PREVIOUS WORLD STATES',
    'ORGANIC SIGNALS ARE GROWING THROUGH STATIC MATTER',
  ],
  SIGNAL_SPIRE: [
    'THE SPIRE IS LISTENING BEYOND THE OBSERVED FRONTIER',
    'SIGNAL DENSITY RISES WHERE THE WORLD HAS NOT BEEN READ',
    'THE SPIRE REPEATS A PATTERN THAT DOES NOT BELONG TO THIS REGION',
  ],
  FRACTURE_WELL: [
    'THE WELL IS LEAKING PRESSURE FROM AN UNSTABLE WORLD LAYER',
    'CORRUPTED GEOMETRY IS CONSUMING OLD RESOURCE PATTERNS',
    'THE FRACTURE DEEPENS WHEN THE WORLD IS FORCED TO CHANGE',
  ],
};

export function poiKindForBiome(biome: PoiBiome): BiomePoiKind {
  if (biome === 'DATA_FIELD') return 'MEMORY_BLOOM';
  if (biome === 'CRYSTAL_NODE') return 'SIGNAL_SPIRE';
  return 'FRACTURE_WELL';
}

export function createRegionPoi(regionId: string, biome: PoiBiome, startX: number, width: number, signature: number): RegionPoi {
  const kind = poiKindForBiome(biome);
  const localOffset = 380 + ((signature >>> 13) % 121);
  const x = startX + Math.min(width - 96, localOffset);
  const clues = POI_CLUES[kind];
  return {
    id: `${regionId}::poi`,
    kind,
    x,
    clue: clues[(signature >>> 19) % clues.length],
  };
}

export function poiLabel(kind: BiomePoiKind): string {
  return POI_LABELS[kind];
}

export function createPoiObservationState(scannedPoiIds: string[] = []): PoiObservationState {
  return { scannedPoiIds: [...new Set(scannedPoiIds)] };
}

export function clonePoiObservationState(state: PoiObservationState): PoiObservationState {
  return createPoiObservationState(state.scannedPoiIds);
}

export function isPoiScanned(state: PoiObservationState, poiId: string): boolean {
  return state.scannedPoiIds.includes(poiId);
}

export function scanPoi(state: PoiObservationState, poi: RegionPoi): boolean {
  if (isPoiScanned(state, poi.id)) return false;
  state.scannedPoiIds.push(poi.id);
  return true;
}
