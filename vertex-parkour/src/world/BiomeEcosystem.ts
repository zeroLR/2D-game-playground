import type { BiomeId } from './Biome';
import type { EncounterType, PlatformSpawn, WorldBand, WorldSpawn } from './WorldGenerator';

const FRAGMENTED_ENCOUNTERS = new Set<EncounterType>(['recovery', 'dash-chain', 'edge-read', 'wall-rescue', 'moving-window']);
const PALE_MOVING_ENCOUNTERS = new Set<EncounterType>(['recovery', 'dash-chain', 'edge-read', 'wall-rescue', 'moving-window']);
const PALE_SUPPRESSED_ENEMIES = new Set<WorldSpawn['type']>(['drone', 'interceptor']);

function primaryPlatformX(band: WorldBand): number {
  return band.spawns.find((spawn): spawn is Extract<WorldSpawn, { type: 'platform' }> => spawn.type === 'platform')?.x ?? 180;
}

function clampPlatformX(x: number, width: number): number {
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
    return layout.map(({ dx, dy, width }) => ({ type: 'platform', x: clampPlatformX(center + dx, width), y: platform.y + dy, width }));
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
    x: clampPlatformX(center + distance * direction, width),
    y: platform.y + dy,
    width,
  }));
}

function paleIceFloes(platform: PlatformSpawn, band: WorldBand): PlatformSpawn[] {
  const center = platform.x;
  const direction = center < 140 ? 1 : center > 220 ? -1 : band.index % 2 === 0 ? 1 : -1;
  const threeFloes = band.encounter === 'moving-window' || band.encounter === 'dash-chain' || band.index % 4 === 0;
  const layout = threeFloes
    ? [
        { offset: -34, dy: 4, width: 58, amplitude: 18, speed: 0.3 },
        { offset: 31, dy: -7, width: 66, amplitude: 24, speed: 0.36 },
        { offset: 88, dy: 6, width: 54, amplitude: 16, speed: 0.27 },
      ]
    : [
        { offset: -18, dy: -4, width: 72, amplitude: 20, speed: 0.28 },
        { offset: 54, dy: 7, width: 62, amplitude: 26, speed: 0.34 },
      ];

  return layout.map((entry, index) => {
    const rawX = center + entry.offset * direction;
    const x = clampPlatformX(rawX, entry.width);
    return {
      type: 'platform',
      x,
      y: platform.y + entry.dy,
      width: entry.width,
      motion: {
        axis: 'x',
        amplitude: entry.amplitude,
        speed: entry.speed,
        phase: band.index * 0.41 + index * 1.73,
        originX: x,
      },
    };
  });
}

function suppressPaleEnemies(spawns: WorldSpawn[], band: WorldBand): WorldSpawn[] {
  if (!PALE_MOVING_ENCOUNTERS.has(band.encounter)) return spawns;
  return spawns.filter((spawn) => !PALE_SUPPRESSED_ENEMIES.has(spawn.type));
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

  // Pale opens traversal back up: broader real colliders drift independently and
  // sit slightly off the lane/grid. They are intentionally larger than Violet
  // shards so the challenge is reading a moving landing surface, not precision.
  if (biome === 'pale-heights' && !band.rest && PALE_MOVING_ENCOUNTERS.has(band.encounter)) {
    const primaryIndex = spawns.findIndex((spawn) => spawn.type === 'platform' && !spawn.motion);
    if (primaryIndex >= 0) {
      const primary = spawns[primaryIndex] as PlatformSpawn;
      spawns = [
        ...spawns.slice(0, primaryIndex),
        ...paleIceFloes(primary, band),
        ...spawns.slice(primaryIndex + 1),
      ];
    }
    spawns = suppressPaleEnemies(spawns, band);
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
