import { isStageId, type StageId } from '../content/StageCatalog';
import type {
  ChainEvolutionPath,
  SplitEvolutionPath,
  VortexEvolutionPath,
} from '../progression/RuneEvolutionCatalog';

export interface PlayerProfile {
  vortexPath: VortexEvolutionPath;
  splitPath: SplitEvolutionPath;
  chainPath: ChainEvolutionPath;
  clearedStageIds: StageId[];
}

const PROFILE_STORAGE_KEY = 'rune-ball:profile:v1';
const DEFAULT_PROFILE: PlayerProfile = {
  vortexPath: 'gravity-well',
  splitPath: 'prism',
  chainPath: 'relay',
  clearedStageIds: [],
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

function parseClearedStages(value: unknown): StageId[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set<StageId>();
  for (const candidate of value) {
    if (isStageId(candidate)) unique.add(candidate);
  }
  return [...unique];
}

export function readPlayerProfile(storage: Storage | null): PlayerProfile {
  if (!storage) return { ...DEFAULT_PROFILE, clearedStageIds: [] };

  try {
    const raw = storage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE, clearedStageIds: [] };
    const parsed = JSON.parse(raw) as {
      vortexPath?: unknown;
      splitPath?: unknown;
      chainPath?: unknown;
      clearedStageIds?: unknown;
    };
    return {
      vortexPath: isVortexPath(parsed.vortexPath) ? parsed.vortexPath : DEFAULT_PROFILE.vortexPath,
      splitPath: isSplitPath(parsed.splitPath) ? parsed.splitPath : DEFAULT_PROFILE.splitPath,
      chainPath: isChainPath(parsed.chainPath) ? parsed.chainPath : DEFAULT_PROFILE.chainPath,
      clearedStageIds: parseClearedStages(parsed.clearedStageIds),
    };
  } catch {
    return { ...DEFAULT_PROFILE, clearedStageIds: [] };
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
