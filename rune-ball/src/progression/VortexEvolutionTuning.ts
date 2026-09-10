import type { VortexEvolutionPath, VortexEvolutionStage } from './RuneEvolutionCatalog';

export interface VortexCastProfile {
  mode: 'pull' | 'orbit';
  radius: number;
  durationSeconds: number;
  pullPerSecond: number;
  orbitPerSecond: number;
  inwardPerSecond: number;
  collapseRadius: number;
}

export const BASE_VORTEX_PROFILE: VortexCastProfile = {
  mode: 'pull',
  radius: 210,
  durationSeconds: 0.65,
  pullPerSecond: 2.15,
  orbitPerSecond: 0,
  inwardPerSecond: 0,
  collapseRadius: 0,
};

export function getVortexCastProfile(
  path: VortexEvolutionPath,
  stage: VortexEvolutionStage,
): VortexCastProfile {
  if (stage === 0) return BASE_VORTEX_PROFILE;

  if (path === 'gravity-well') {
    if (stage === 1) {
      return {
        mode: 'pull',
        radius: 255,
        durationSeconds: 0.78,
        pullPerSecond: 3.1,
        orbitPerSecond: 0,
        inwardPerSecond: 0,
        collapseRadius: 0,
      };
    }
    return {
      mode: 'pull',
      radius: 290,
      durationSeconds: 0.96,
      pullPerSecond: 4.0,
      orbitPerSecond: 0,
      inwardPerSecond: 0,
      collapseRadius: 138,
    };
  }

  if (stage === 1) {
    return {
      mode: 'orbit',
      radius: 245,
      durationSeconds: 1.35,
      pullPerSecond: 0,
      orbitPerSecond: 1.05,
      inwardPerSecond: 0.48,
      collapseRadius: 0,
    };
  }

  return {
    mode: 'orbit',
    radius: 282,
    durationSeconds: 1.85,
    pullPerSecond: 0,
    orbitPerSecond: 1.48,
    inwardPerSecond: 0.62,
    collapseRadius: 0,
  };
}
