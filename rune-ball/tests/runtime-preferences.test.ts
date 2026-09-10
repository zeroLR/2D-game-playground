import { describe, expect, it } from 'vitest';
import {
  readRuntimePreferences,
  RUNTIME_PREFERENCES_KEY,
  writeRuntimePreferences,
  type PreferenceStorage,
} from '../src/preferences/RuntimePreferences';

class MemoryStorage implements PreferenceStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('RuntimePreferences', () => {
  it('defaults sound on and follows the system reduced-motion preference', () => {
    expect(readRuntimePreferences(null, false)).toEqual({ soundEnabled: true, reducedMotion: false });
    expect(readRuntimePreferences(null, true)).toEqual({ soundEnabled: true, reducedMotion: true });
  });

  it('persists explicit player choices over system defaults', () => {
    const storage = new MemoryStorage();
    expect(writeRuntimePreferences(storage, { soundEnabled: false, reducedMotion: false })).toBe(true);
    expect(readRuntimePreferences(storage, true)).toEqual({ soundEnabled: false, reducedMotion: false });
  });

  it('falls back safely when stored data is malformed', () => {
    const storage = new MemoryStorage();
    storage.setItem(RUNTIME_PREFERENCES_KEY, '{bad-json');
    expect(readRuntimePreferences(storage, true)).toEqual({ soundEnabled: true, reducedMotion: true });
  });

  it('fills missing stored fields from platform defaults', () => {
    const storage = new MemoryStorage();
    storage.setItem(RUNTIME_PREFERENCES_KEY, JSON.stringify({ soundEnabled: false }));
    expect(readRuntimePreferences(storage, true)).toEqual({ soundEnabled: false, reducedMotion: true });
  });
});
