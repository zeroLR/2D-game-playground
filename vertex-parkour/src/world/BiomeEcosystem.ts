import type { BiomeId } from './Biome';
import type { WorldBand, WorldSpawn } from './WorldGenerator';

function primaryPlatformX(band: WorldBand): number {
  return band.spawns.find((spawn): spawn is Extract<WorldSpawn, { type: 'platform' }> => spawn.type === 'platform')?.x ?? 180;
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
