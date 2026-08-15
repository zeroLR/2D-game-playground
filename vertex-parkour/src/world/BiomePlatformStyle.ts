import type { BiomeId } from './Biome';

export type PlatformSilhouette = 'ruin-slab' | 'industrial-deck' | 'night-slab' | 'pale-slab';

export function platformSilhouetteForBiome(biome: BiomeId): PlatformSilhouette {
  if (biome === 'amber-district') return 'industrial-deck';
  if (biome === 'violet-zone') return 'night-slab';
  if (biome === 'pale-heights') return 'pale-slab';
  return 'ruin-slab';
}
