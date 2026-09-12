import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import splitBaseSvg from '../assets/runes/split-base.svg?raw';
import prismT1Svg from '../assets/runes/prism-t1.svg?raw';
import prismT2Svg from '../assets/runes/prism-t2.svg?raw';
import lanceT1Svg from '../assets/runes/lance-t1.svg?raw';
import lanceT2Svg from '../assets/runes/lance-t2.svg?raw';

export type SplitRuntimeGlyphKey = 'split-base' | 'prism-t1' | 'prism-t2' | 'lance-t1' | 'lance-t2';
export type SplitEnergyMotionKind = 'none' | 'prism-outward' | 'lance-forward';
export type SplitParticleEnvelopeKind = 'none' | 'prism-crystal' | 'lance-fleck';
export type SplitImpactKind = 'none' | 'prism-refraction' | 'lance-pierce';

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

export interface SplitEnergyMotionProfile {
  kind: SplitEnergyMotionKind;
  cycleSeconds: number;
  primaryAlpha: number;
  secondaryAlpha: number;
  secondaryPhase: number;
  travelStart: number;
  travelEnd: number;
}

export interface SplitParticleEnvelopeProfile {
  kind: SplitParticleEnvelopeKind;
  maxActive: number;
  emitInterval: number;
  lifetime: number;
  speed: number;
  spread: number;
  reach: number;
  alpha: number;
  size: number;
  tipSparkEvery: number;
}

export interface SplitImpactProfile {
  kind: SplitImpactKind;
  duration: number;
  hotRadius: number;
  ringRadius: number;
  streakLength: number;
  shardCount: number;
  shardSpeed: number;
  shardSpread: number;
  alpha: number;
  secondaryAlpha: number;
}

export interface SplitRuntimeGlyphSpec {
  key: SplitRuntimeGlyphKey;
  pivotX: number;
  pivotY: number;
  scale: number;
  material: SplitMaterialProfile;
  motion: SplitEnergyMotionProfile;
  particles: SplitParticleEnvelopeProfile;
  impact: SplitImpactProfile;
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

const BASE_MOTION: SplitEnergyMotionProfile = {
  kind: 'none',
  cycleSeconds: 1,
  primaryAlpha: 0,
  secondaryAlpha: 0,
  secondaryPhase: 0,
  travelStart: 0,
  travelEnd: 0,
};

const PRISM_T1_MOTION: SplitEnergyMotionProfile = {
  kind: 'prism-outward',
  cycleSeconds: 0.92,
  primaryAlpha: 0.52,
  secondaryAlpha: 0,
  secondaryPhase: 0,
  travelStart: 5,
  travelEnd: 24,
};

const PRISM_T2_MOTION: SplitEnergyMotionProfile = {
  kind: 'prism-outward',
  cycleSeconds: 0.76,
  primaryAlpha: 0.62,
  secondaryAlpha: 0.34,
  secondaryPhase: 0.46,
  travelStart: 4,
  travelEnd: 29,
};

const LANCE_T1_MOTION: SplitEnergyMotionProfile = {
  kind: 'lance-forward',
  cycleSeconds: 0.70,
  primaryAlpha: 0.68,
  secondaryAlpha: 0,
  secondaryPhase: 0,
  travelStart: 42,
  travelEnd: 10,
};

const LANCE_T2_MOTION: SplitEnergyMotionProfile = {
  kind: 'lance-forward',
  cycleSeconds: 0.56,
  primaryAlpha: 0.80,
  secondaryAlpha: 0.38,
  secondaryPhase: 0.38,
  travelStart: 43,
  travelEnd: 4,
};

const BASE_PARTICLES: SplitParticleEnvelopeProfile = {
  kind: 'none',
  maxActive: 0,
  emitInterval: 1,
  lifetime: 0,
  speed: 0,
  spread: 0,
  reach: 0,
  alpha: 0,
  size: 1,
  tipSparkEvery: 0,
};

const PRISM_T1_PARTICLES: SplitParticleEnvelopeProfile = {
  kind: 'prism-crystal',
  maxActive: 8,
  emitInterval: 0.095,
  lifetime: 0.36,
  speed: 18,
  spread: 18,
  reach: 23,
  alpha: 0.66,
  size: 0.82,
  tipSparkEvery: 0,
};

const PRISM_T2_PARTICLES: SplitParticleEnvelopeProfile = {
  kind: 'prism-crystal',
  maxActive: 12,
  emitInterval: 0.065,
  lifetime: 0.42,
  speed: 23,
  spread: 22,
  reach: 28,
  alpha: 0.76,
  size: 0.96,
  tipSparkEvery: 0,
};

const LANCE_T1_PARTICLES: SplitParticleEnvelopeProfile = {
  kind: 'lance-fleck',
  maxActive: 7,
  emitInterval: 0.085,
  lifetime: 0.28,
  speed: 24,
  spread: 7,
  reach: 30,
  alpha: 0.70,
  size: 0.80,
  tipSparkEvery: 4,
};

const LANCE_T2_PARTICLES: SplitParticleEnvelopeProfile = {
  kind: 'lance-fleck',
  maxActive: 10,
  emitInterval: 0.060,
  lifetime: 0.34,
  speed: 30,
  spread: 9,
  reach: 39,
  alpha: 0.80,
  size: 0.94,
  tipSparkEvery: 3,
};

const BASE_IMPACT: SplitImpactProfile = {
  kind: 'none',
  duration: 0,
  hotRadius: 0,
  ringRadius: 0,
  streakLength: 0,
  shardCount: 0,
  shardSpeed: 0,
  shardSpread: 0,
  alpha: 0,
  secondaryAlpha: 0,
};

const PRISM_T1_IMPACT: SplitImpactProfile = {
  kind: 'prism-refraction',
  duration: 0.22,
  hotRadius: 6,
  ringRadius: 20,
  streakLength: 28,
  shardCount: 4,
  shardSpeed: 90,
  shardSpread: 1.15,
  alpha: 0.78,
  secondaryAlpha: 0.22,
};

const PRISM_T2_IMPACT: SplitImpactProfile = {
  kind: 'prism-refraction',
  duration: 0.28,
  hotRadius: 8,
  ringRadius: 27,
  streakLength: 38,
  shardCount: 7,
  shardSpeed: 118,
  shardSpread: 1.35,
  alpha: 0.92,
  secondaryAlpha: 0.42,
};

const LANCE_T1_IMPACT: SplitImpactProfile = {
  kind: 'lance-pierce',
  duration: 0.18,
  hotRadius: 6.5,
  ringRadius: 13,
  streakLength: 54,
  shardCount: 3,
  shardSpeed: 145,
  shardSpread: 0.32,
  alpha: 0.88,
  secondaryAlpha: 0.24,
};

const LANCE_T2_IMPACT: SplitImpactProfile = {
  kind: 'lance-pierce',
  duration: 0.24,
  hotRadius: 8,
  ringRadius: 16,
  streakLength: 78,
  shardCount: 5,
  shardSpeed: 180,
  shardSpread: 0.38,
  alpha: 1,
  secondaryAlpha: 0.46,
};

const SPECS: Record<SplitRuntimeGlyphKey, SplitRuntimeGlyphSpec> = {
  'split-base': {
    key: 'split-base',
    pivotX: 32,
    pivotY: 32,
    scale: 1.68,
    material: BASE_MATERIAL,
    motion: BASE_MOTION,
    particles: BASE_PARTICLES,
    impact: BASE_IMPACT,
  },
  'prism-t1': {
    key: 'prism-t1',
    pivotX: 32,
    pivotY: 32,
    scale: 2.90,
    material: PRISM_T1_MATERIAL,
    motion: PRISM_T1_MOTION,
    particles: PRISM_T1_PARTICLES,
    impact: PRISM_T1_IMPACT,
  },
  'prism-t2': {
    key: 'prism-t2',
    pivotX: 32,
    pivotY: 32,
    scale: 3.47,
    material: PRISM_T2_MATERIAL,
    motion: PRISM_T2_MOTION,
    particles: PRISM_T2_PARTICLES,
    impact: PRISM_T2_IMPACT,
  },
  'lance-t1': {
    key: 'lance-t1',
    pivotX: 32,
    pivotY: 45,
    scale: 2.55,
    material: LANCE_T1_MATERIAL,
    motion: LANCE_T1_MOTION,
    particles: LANCE_T1_PARTICLES,
    impact: LANCE_T1_IMPACT,
  },
  'lance-t2': {
    key: 'lance-t2',
    pivotX: 32,
    pivotY: 46,
    scale: 3.40,
    material: LANCE_T2_MATERIAL,
    motion: LANCE_T2_MOTION,
    particles: LANCE_T2_PARTICLES,
    impact: LANCE_T2_IMPACT,
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
