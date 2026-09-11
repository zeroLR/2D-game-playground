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
  it('defaults to Gravity + Prism while preserving old-profile compatibility', () => {
    expect(readPlayerProfile(null)).toEqual({ vortexPath: 'gravity-well', splitPath: 'prism' });
    const storage = memoryStorage();
    storage.setItem('rune-ball:profile:v1', JSON.stringify({ vortexPath: 'orbit' }));
    expect(readPlayerProfile(storage)).toEqual({ vortexPath: 'orbit', splitPath: 'prism' });
  });

  it('persists selected Vortex and Split evolution paths', () => {
    const storage = memoryStorage();
    writePlayerProfile(storage, { vortexPath: 'orbit', splitPath: 'lance' });
    expect(readPlayerProfile(storage)).toEqual({ vortexPath: 'orbit', splitPath: 'lance' });
  });

  it('falls back per-field when stored profile data is invalid', () => {
    const storage = memoryStorage();
    storage.setItem('rune-ball:profile:v1', JSON.stringify({ vortexPath: 'unknown', splitPath: 'unknown' }));
    expect(readPlayerProfile(storage)).toEqual({ vortexPath: 'gravity-well', splitPath: 'prism' });
  });
});
