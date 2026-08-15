import type { BiomeId } from './Biome';
import type { EncounterType, PlatformSpawn, WorldBand, WorldSpawn } from './WorldGenerator';

const FRAGMENTED_ENCOUNTERS = new Set<EncounterType>(['recovery', 'dash-chain', 'edge-read', 'wall-rescue', 'moving-window']);

function primaryPlatformX(band: WorldBand): number {
  return band.spawns.find((spawn): spawn is Extract<WorldSpawn, { type: 'platform' }> => spawn.type === 'platform')?.x ?? 180;
}

function clampFragmentX(x: number, width: number): number {
  return Math.max(52 + width / 2, Math.min(308 - width / 2, x));
}

function fragmentPrimaryPlatform(platform: PlatformSpawn, band: WorldBand): PlatformSpawn[] {
  const center = platform.x;
  const direction = center < 140 ? 1 : center > 220 ? -1 : 0;
  const threePieces = band.index % 3 === 1;

  if (direction === 0) {
    const layout = threePieces
      ? [
          { dx: -50, dy: 3, width: 28 },
          { dx: 2, dy: -5, width: 32 },
          { dx: 53, dy: 4, width: 26 },
        ]
      : [
          { dx: -38, dy: -4, width: 36 },
          { dx: 39, dy: 5, width: 32 },
        ];
    return layout.map(({ dx, dy, width }) => ({ type: 'platform', x: clampFragmentX(center + dx, width), y: platform.y + dy, width }));
  }

  const offsets = threePieces
    ? [
        { distance: 0, dy: 4, width: 30 },
        { distance: 45, dy: -5, width: 32 },
        { distance: 91, dy: 3, width: 28 },
      ]
    : [
        { distance: 0, dy: -3, width: 36 },
        { distance: 54, dy: 5, width: 34 },
      ];
  return offsets.map(({ distance, dy, width }) => ({
    type: 'platform',
    x: clampFragmentX(center + distance * direction, width),
    y: platform.y + dy,
    width,
  }));
}

export function biomeSpawnsForBand(biome: BiomeId, band: WorldBand): WorldSpawn[] {
  let spawns = [...band.spawns];

  // Violet's ordinary traversal geometry is genuinely fragmented. The generated
  // primary landing platform is replaced by multiple independent colliders with
  // staggered X/Y positions. Choice, route, climax and rest exits stay intact so
  // decisions and recovery beats remain readable.
  if (biome === 'violet-zone' && !band.rest && FRAGMENTED_ENCOUNTERS.has(band.encounter)) {
    const primaryIndex = spawns.findIndex((spawn) => spawn.type === 'platform' && !spawn.motion);
    if (primaryIndex >= 0) {
      const primary = spawns[primaryIndex] as PlatformSpawn;
      spawns = [
        ...spawns.slice(0, primaryIndex),
        ...fragmentPrimaryPlatform(primary, band),
        ...spawns.slice(primaryIndex + 1),
      ];
    }
  }

  return [...spawns, ...biomeExtraSpawns(biome, band)];
}

export function biomeExtraSpawns(biome: BiomeId, band: WorldBand): WorldSpawn[] {
  if (biome !== 'violet-zone') return [];

  // Violet's ecosystem is built around local pursuit and unstable spatial denial.
  // Add these only to ordinary core packets so Route/Skill/Climax contracts remain untouched.
  if (band.encounter === 'wall-rescue' && band.encounterStep === 1) {
    const lane = primaryPlatformX(band);
    const hunterX = lane < 180 ? 278 : 82;
    return [{ type: 'interceptor', x: hunterX, y: band.y - 42, phase: band.index * 0.73 }];
  }

  if (band.encounter === 'edge-read' && band.encounterStep === 1) {
    return [{ type: 'pulse-gate', x: 180, y: band.y - 50, height: 108, phase: band.index * 0.61 }];
  }

  if (band.encounter === 'recovery' && band.encounterStep === 2 && band.index % 2 === 0) {
    const lane = primaryPlatformX(band);
    return [{ type: 'interceptor', x: lane === 180 ? 82 : 180, y: band.y - 40, phase: band.index * 0.47 }];
  }

  return [];
}
