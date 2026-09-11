import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import splitBaseSvg from '../assets/runes/split-base.svg?raw';
import prismT1Svg from '../assets/runes/prism-t1.svg?raw';
import prismT2Svg from '../assets/runes/prism-t2.svg?raw';
import lanceT1Svg from '../assets/runes/lance-t1.svg?raw';
import lanceT2Svg from '../assets/runes/lance-t2.svg?raw';

export type SplitRuntimeGlyphKey = 'split-base' | 'prism-t1' | 'prism-t2' | 'lance-t1' | 'lance-t2';

export interface SplitRuntimeGlyphSpec {
  key: SplitRuntimeGlyphKey;
  pivotX: number;
  pivotY: number;
  scale: number;
}

const SPECS: Record<SplitRuntimeGlyphKey, SplitRuntimeGlyphSpec> = {
  'split-base': { key: 'split-base', pivotX: 32, pivotY: 32, scale: 1.68 },
  'prism-t1': { key: 'prism-t1', pivotX: 32, pivotY: 32, scale: 2.90 },
  'prism-t2': { key: 'prism-t2', pivotX: 32, pivotY: 32, scale: 3.47 },
  'lance-t1': { key: 'lance-t1', pivotX: 32, pivotY: 45, scale: 2.55 },
  'lance-t2': { key: 'lance-t2', pivotX: 32, pivotY: 46, scale: 3.40 },
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

export function getSplitRuntimeSvgSource(key: SplitRuntimeGlyphKey): string {
  return SPLIT_RUNTIME_SVG_BY_KEY[key];
}
