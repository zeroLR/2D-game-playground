export const PAPER_TRAILS_PROGRESS_KEY = 'paper-trails.progress.v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressSaveV1 {
  readonly version: 1;
  readonly completedLevelIds: readonly string[];
}

export function createEmptyProgress(): ProgressSaveV1 {
  return { version: 1, completedLevelIds: [] };
}

export function loadProgress(storage: StorageLike | null | undefined): ProgressSaveV1 {
  if (!storage) return createEmptyProgress();
  try {
    const raw = storage.getItem(PAPER_TRAILS_PROGRESS_KEY);
    if (!raw) return createEmptyProgress();
    return parseProgress(raw);
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(storage: StorageLike | null | undefined, progress: ProgressSaveV1): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PAPER_TRAILS_PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function markLevelCompleted(progress: ProgressSaveV1, levelId: string): ProgressSaveV1 {
  if (progress.completedLevelIds.includes(levelId)) return progress;
  return {
    version: 1,
    completedLevelIds: [...progress.completedLevelIds, levelId].sort(),
  };
}

export function parseProgress(raw: string): ProgressSaveV1 {
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.completedLevelIds)) {
    return createEmptyProgress();
  }
  const ids = [...new Set(value.completedLevelIds.filter((item): item is string => typeof item === 'string' && item.length > 0))].sort();
  return { version: 1, completedLevelIds: ids };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
