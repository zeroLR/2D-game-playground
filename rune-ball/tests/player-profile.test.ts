import { describe, expect, it } from 'vitest';
import { readPlayerProfile, writePlayerProfile } from '../src/profile/PlayerProfile';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => { data.set(key, value); },
  };
}

describe('PlayerProfile', () => {
  it('defaults to Gravity + Prism + Relay with no campaign clears while preserving old-profile compatibility', () => {
    expect(readPlayerProfile(null)).toEqual({
      vortexPath: 'gravity-well',
      splitPath: 'prism',
      chainPath: 'relay',
      clearedStageIds: [],
    });
    const storage = memoryStorage();
    storage.setItem('rune-ball:profile:v1', JSON.stringify({ vortexPath: 'orbit' }));
    expect(readPlayerProfile(storage)).toEqual({
      vortexPath: 'orbit',
      splitPath: 'prism',
      chainPath: 'relay',
      clearedStageIds: [],
    });
  });

  it('persists selected evolution paths and campaign clear state', () => {
    const storage = memoryStorage();
    writePlayerProfile(storage, {
      vortexPath: 'orbit',
      splitPath: 'lance',
      chainPath: 'detonation',
      clearedStageIds: ['shattered-gate', 'prism-wake'],
    });
    expect(readPlayerProfile(storage)).toEqual({
      vortexPath: 'orbit',
      splitPath: 'lance',
      chainPath: 'detonation',
      clearedStageIds: ['shattered-gate', 'prism-wake'],
    });
  });

  it('falls back per-field and filters invalid campaign stage ids', () => {
    const storage = memoryStorage();
    storage.setItem('rune-ball:profile:v1', JSON.stringify({
      vortexPath: 'unknown',
      splitPath: 'unknown',
      chainPath: 'unknown',
      clearedStageIds: ['shattered-gate', 'unknown', 'shattered-gate'],
    }));
    expect(readPlayerProfile(storage)).toEqual({
      vortexPath: 'gravity-well',
      splitPath: 'prism',
      chainPath: 'relay',
      clearedStageIds: ['shattered-gate'],
    });
  });
});
