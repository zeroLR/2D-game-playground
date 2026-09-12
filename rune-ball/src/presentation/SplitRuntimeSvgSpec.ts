import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import splitBaseSvg from '../assets/runes/split-base.svg?raw';
import prismT1Svg from '../assets/runes/prism-t1.svg?raw';
import prismT2Svg from '../assets/runes/prism-t2.svg?raw';
import lanceT1Svg from '../assets/runes/lance-t1.svg?raw';
import lanceT2Svg from '../assets/runes/lance-t2.svg?raw';

export type SplitRuntimeGlyphKey = 'split-base' | 'prism-t1' | 'prism-t2' | 'lance-t1' | 'lance-t2';

export interface SplitMaterialProfile {
  glowEnabled: boolean;
  backGlowAlpha: number;
  backGlowBlur: number;
  auraAlpha: number;
  auraBlur: number;
  bodyAlpha: number;
  hotAlpha: number;
  hotScale: number;
}

export interface SplitRuntimeGlyphSpec {
  key: SplitRuntimeGlyphKey;
  pivotX: number;
  pivotY: number;
  scale: number;
  material: SplitMaterialProfile;
}

const BASE_MATERIAL: SplitMaterialProfile = {
  glowEnabled: false,
  backGlowAlpha: 0,
  backGlowBlur: 0,
  auraAlpha: 0,
  auraBlur: 0,
  bodyAlpha: 0.86,
  hotAlpha: 0,
  hotScale: 1,
};

const PRISM_T1_MATERIAL: SplitMaterialProfile = {
  glowEnabled: true,
  backGlowAlpha: 0.22,
  backGlowBlur: 14,
  auraAlpha: 0.28,
  auraBlur: 5,
  bodyAlpha: 0.96,
  hotAlpha: 0.16,
  hotScale: 1.01,
};

const PRISM_T2_MATERIAL: SplitMaterialProfile = {
  glowEnabled: true,
  backGlowAlpha: 0.30,
  backGlowBlur: 18,
  auraAlpha: 0.34,
  auraBlur: 6,
  bodyAlpha: 1,
  hotAlpha: 0.22,
  hotScale: 1.012,
};

const LANCE_T1_MATERIAL: SplitMaterialProfile = {
  glowEnabled: true,
  backGlowAlpha: 0.18,
  backGlowBlur: 10,
  auraAlpha: 0.25,
  auraBlur: 4,
  bodyAlpha: 0.98,
  hotAlpha: 0.24,
  hotScale: 1.006,
};

const LANCE_T2_MATERIAL: SplitMaterialProfile = {
  glowEnabled: true,
  backGlowAlpha: 0.25,
  backGlowBlur: 14,
  auraAlpha: 0.31,
  auraBlur: 5,
  bodyAlpha: 1,
  hotAlpha: 0.30,
  hotScale: 1.008,
};

const SPECS: Record<SplitRuntimeGlyphKey, SplitRuntimeGlyphSpec> = {
  'split-base': {
    key: 'split-base',
    pivotX: 32,
    pivotY: 32,
    scale: 1.68,
    material: BASE_MATERIAL,
  },
  'prism-t1': {
    key: 'prism-t1',
    pivotX: 32,
    pivotY: 32,
    scale: 2.90,
    material: PRISM_T1_MATERIAL,
  },
  'prism-t2': {
    key: 'prism-t2',
    pivotX: 32,
    pivotY: 32,
    scale: 3.47,
    material: PRISM_T2_MATERIAL,
  },
  'lance-t1': {
    key: 'lance-t1',
    pivotX: 32,
    pivotY: 45,
    scale: 2.55,
    material: LANCE_T1_MATERIAL,
  },
  'lance-t2': {
    key: 'lance-t2',
    pivotX: 32,
    pivotY: 46,
    scale: 3.40,
    material: LANCE_T2_MATERIAL,
  },
};

export const SPLIT_RUNTIME_SVG_BY_KEY: Record<SplitRuntimeGlyphKey, string> = {
  'split-base': splitBaseSvg,
  'prism-t1': prismT1Svg,
  'prism-t2': prismT2Svg,
  'lance-t1': lanceT1Svg,
  'lance-t2': lanceT2Svg,
};

export function getSplitRuntimeGlyphSpec(
  path: SplitEvolutionPath,
  stage: SplitEvolutionStage,
): SplitRuntimeGlyphSpec {
  if (stage === 0) return SPECS['split-base'];
  if (path === 'prism') return stage === 1 ? SPECS['prism-t1'] : SPECS['prism-t2'];
  return stage === 1 ? SPECS['lance-t1'] : SPECS['lance-t2'];
}

export function getSplitRuntimeGlyphSpecByKey(key: SplitRuntimeGlyphKey): SplitRuntimeGlyphSpec {
  return SPECS[key];
}

export function getSplitRuntimeSvgSource(key: SplitRuntimeGlyphKey): string {
  return SPLIT_RUNTIME_SVG_BY_KEY[key];
}
