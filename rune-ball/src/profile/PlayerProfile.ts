import type {
  ChainEvolutionPath,
  SplitEvolutionPath,
  VortexEvolutionPath,
} from '../progression/RuneEvolutionCatalog';

export interface PlayerProfile {
  vortexPath: VortexEvolutionPath;
  splitPath: SplitEvolutionPath;
  chainPath: ChainEvolutionPath;
}

const PROFILE_STORAGE_KEY = 'rune-ball:profile:v1';
const DEFAULT_PROFILE: PlayerProfile = {
  vortexPath: 'gravity-well',
  splitPath: 'prism',
  chainPath: 'relay',
};

function isVortexPath(value: unknown): value is VortexEvolutionPath {
  return value === 'gravity-well' || value === 'orbit';
}

function isSplitPath(value: unknown): value is SplitEvolutionPath {
  return value === 'prism' || value === 'lance';
}

function isChainPath(value: unknown): value is ChainEvolutionPath {
  return value === 'relay' || value === 'detonation';
}

export function readPlayerProfile(storage: Storage | null): PlayerProfile {
  if (!storage) return { ...DEFAULT_PROFILE };

  try {
    const raw = storage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as { vortexPath?: unknown; splitPath?: unknown; chainPath?: unknown };
    return {
      vortexPath: isVortexPath(parsed.vortexPath) ? parsed.vortexPath : DEFAULT_PROFILE.vortexPath,
      splitPath: isSplitPath(parsed.splitPath) ? parsed.splitPath : DEFAULT_PROFILE.splitPath,
      chainPath: isChainPath(parsed.chainPath) ? parsed.chainPath : DEFAULT_PROFILE.chainPath,
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
