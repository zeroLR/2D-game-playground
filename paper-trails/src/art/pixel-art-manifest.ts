export const PAGE_LOGICAL_TILE_SIZE = 32;
export const PAGE_PIXEL_SIZE = PAGE_LOGICAL_TILE_SIZE * 3;

export const PAGE_ART_FAMILIES = [
  'forest-path',
  'ruined-gate',
  'stone-bridge',
  'crossroads',
  'shrine-seal',
  'hidden-grove',
] as const;

export type PageArtFamily = (typeof PAGE_ART_FAMILIES)[number];

export interface PageArtDefinition {
  readonly id: PageArtFamily;
  readonly label: string;
  readonly source: string;
}

export const PAGE_ART_MANIFEST: Readonly<Record<PageArtFamily, PageArtDefinition>> = {
  'forest-path': { id: 'forest-path', label: 'Forest Path', source: 'art/pages/forest-path.png' },
  'ruined-gate': { id: 'ruined-gate', label: 'Ruined Gate', source: 'art/pages/ruined-gate.png' },
  'stone-bridge': { id: 'stone-bridge', label: 'Stone Bridge', source: 'art/pages/stone-bridge.png' },
  crossroads: { id: 'crossroads', label: 'Crossroads', source: 'art/pages/crossroads.png' },
  'shrine-seal': { id: 'shrine-seal', label: 'Shrine Seal', source: 'art/pages/shrine-seal.png' },
  'hidden-grove': { id: 'hidden-grove', label: 'Hidden Grove', source: 'art/pages/hidden-grove.png' },
};

export const TRAVELER_FRAME_WIDTH = 32;
export const TRAVELER_FRAME_HEIGHT = 48;
export const TRAVELER_FRAME_COUNT = 17;
export const TRAVELER_SHEET_SOURCE = 'art/traveler/traveler-sheet.png';

export const TRAVELER_ANIMATIONS = {
  idle: [0, 1],
  walkSouth: [2, 3, 4, 5],
  walkEast: [6, 7, 8, 9],
  walkNorth: [10, 11, 12, 13],
  arrival: [14, 15, 16],
} as const;

export type TravelerFacing = 'north' | 'east' | 'south' | 'west';

export function isPageArtFamily(value: string): value is PageArtFamily {
  return (PAGE_ART_FAMILIES as readonly string[]).includes(value);
}
