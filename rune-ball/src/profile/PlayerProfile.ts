import type { VortexEvolutionPath } from '../progression/VortexEvolutionSystem';

export interface PlayerProfile {
  vortexPath: VortexEvolutionPath;
}

const PROFILE_STORAGE_KEY = 'rune-ball:profile:v1';
const DEFAULT_PROFILE: PlayerProfile = { vortexPath: 'gravity-well' };

function isVortexPath(value: unknown): value is VortexEvolutionPath {
  return value === 'gravity-well' || value === 'orbit';
}

export function readPlayerProfile(storage: Storage | null): PlayerProfile {
  if (!storage) return { ...DEFAULT_PROFILE };

  try {
    const raw = storage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as { vortexPath?: unknown };
    return {
      vortexPath: isVortexPath(parsed.vortexPath) ? parsed.vortexPath : DEFAULT_PROFILE.vortexPath,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function writePlayerProfile(storage: Storage | null, profile: PlayerProfile): void {
  if (!storage) return;
  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable in private/restricted browser contexts. Runtime remains usable.
  }
}
