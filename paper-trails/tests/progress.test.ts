import { describe, expect, it } from 'vitest';
import {
  PAPER_TRAILS_PROGRESS_KEY,
  createEmptyProgress,
  loadProgress,
  markLevelCompleted,
  parseProgress,
  saveProgress,
  type StorageLike,
} from '../src/progression/progress';

class MemoryStorage implements StorageLike {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
}

describe('Paper Trails local progress', () => {
  it('persists unique completed level ids deterministically', () => {
    const storage = new MemoryStorage();
    let progress = createEmptyProgress();
    progress = markLevelCompleted(progress, 'chapter-b');
    progress = markLevelCompleted(progress, 'chapter-a');
    progress = markLevelCompleted(progress, 'chapter-b');

    expect(progress.completedLevelIds).toEqual(['chapter-a', 'chapter-b']);
    expect(saveProgress(storage, progress)).toBe(true);
    expect(loadProgress(storage)).toEqual(progress);
    expect(storage.getItem(PAPER_TRAILS_PROGRESS_KEY)).toContain('chapter-a');
  });

  it('falls back to an empty v1 save for malformed payloads', () => {
    expect(parseProgress('{}')).toEqual(createEmptyProgress());
    expect(loadProgress({ getItem: () => '{bad json', setItem: () => undefined })).toEqual(createEmptyProgress());
  });
});
