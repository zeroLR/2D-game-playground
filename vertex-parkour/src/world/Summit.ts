import type { PlatformSpawn } from './WorldGenerator';

export const SUMMIT_GAP = 96;
export const SUMMIT_X = 180;
export const SUMMIT_WIDTH = 184;

export function buildSummitPlatform(approachY: number): PlatformSpawn {
  return { type: 'platform', x: SUMMIT_X, y: approachY - SUMMIT_GAP, width: SUMMIT_WIDTH };
}

export function isSummitLanding(landedPlatformId: number | null, summitPlatformId: number | null): boolean {
  return landedPlatformId !== null && summitPlatformId !== null && landedPlatformId === summitPlatformId;
}
