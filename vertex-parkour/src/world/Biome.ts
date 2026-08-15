export type BiomeId = 'teal-ruins' | 'amber-district' | 'violet-zone' | 'pale-heights';

export const STARTING_BIOME: BiomeId = 'teal-ruins';

export const BIOME_SEQUENCE: readonly BiomeId[] = ['teal-ruins', 'amber-district', 'violet-zone', 'pale-heights'];

export function nextBiome(current: BiomeId): BiomeId {
  const index = BIOME_SEQUENCE.indexOf(current);
  return BIOME_SEQUENCE[Math.min(BIOME_SEQUENCE.length - 1, index + 1)];
}
