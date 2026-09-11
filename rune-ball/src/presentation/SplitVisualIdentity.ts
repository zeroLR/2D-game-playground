import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';

export type SplitVisualStyle = 'echoes' | 'prism-wings' | 'lance';

export interface SplitVisualProfile {
  style: SplitVisualStyle;
  wingSpan: number;
  wingChord: number;
  wingLayers: number;
  lanceExtraLength: number;
  lanceHalfWidth: number;
}

export const BASE_SPLIT_VISUAL_PROFILE: SplitVisualProfile = {
  style: 'echoes',
  wingSpan: 0,
  wingChord: 0,
  wingLayers: 0,
  lanceExtraLength: 0,
  lanceHalfWidth: 0,
};

export function getSplitVisualProfile(
  path: SplitEvolutionPath,
  stage: SplitEvolutionStage,
): SplitVisualProfile {
  if (stage === 0) return BASE_SPLIT_VISUAL_PROFILE;

  if (path === 'prism') {
    return stage === 1
      ? {
          style: 'prism-wings',
          wingSpan: 88,
          wingChord: 44,
          wingLayers: 2,
          lanceExtraLength: 0,
          lanceHalfWidth: 0,
        }
      : {
          style: 'prism-wings',
          wingSpan: 118,
          wingChord: 56,
          wingLayers: 3,
          lanceExtraLength: 0,
          lanceHalfWidth: 0,
        };
  }

  return stage === 1
    ? {
        style: 'lance',
        wingSpan: 0,
        wingChord: 0,
        wingLayers: 0,
        lanceExtraLength: 30,
        lanceHalfWidth: 7,
      }
    : {
        style: 'lance',
        wingSpan: 0,
        wingChord: 0,
        wingLayers: 0,
        lanceExtraLength: 40,
        lanceHalfWidth: 9,
      };
}
