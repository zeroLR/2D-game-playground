import type { BiomeId } from '../world/Biome';

export type BiomeTheme = {
  name: string;
  platformTint: number;
  ambient: number;
  ambientAlpha: number;
  mote: number;
};

const THEMES: Record<BiomeId, BiomeTheme> = {
  'teal-ruins': {
    name: 'TEAL RUINS',
    platformTint: 0xb7fff1,
    ambient: 0x123f46,
    ambientAlpha: 0.055,
    mote: 0x74d9ce,
  },
  'amber-district': {
    name: 'AMBER DISTRICT',
    platformTint: 0xffc979,
    ambient: 0x6b3517,
    ambientAlpha: 0.095,
    mote: 0xffb85c,
  },
  'violet-zone': {
    name: 'NIGHT / VIOLET ZONE',
    platformTint: 0xc3a6ff,
    ambient: 0x26194f,
    ambientAlpha: 0.105,
    mote: 0xb792ff,
  },
  'pale-heights': {
    name: 'PALE HEIGHTS',
    platformTint: 0xe8fbff,
    ambient: 0x31546a,
    ambientAlpha: 0.085,
    mote: 0xd7f6ff,
  },
};

export function getBiomeTheme(id: BiomeId): BiomeTheme { return THEMES[id]; }

export function mixTint(base: number, accent: number, accentWeight = 0.55): number {
  const weight = Math.max(0, Math.min(1, accentWeight));
  const mix = (shift: number) => Math.round(((base >> shift) & 0xff) * (1 - weight) + ((accent >> shift) & 0xff) * weight);
  return (mix(16) << 16) | (mix(8) << 8) | mix(0);
}
