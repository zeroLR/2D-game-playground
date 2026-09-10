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
  it('defaults to the Gravity path', () => {
    expect(readPlayerProfile(null)).toEqual({ vortexPath: 'gravity-well' });
  });

  it('persists a selected Vortex evolution path', () => {
    const storage = memoryStorage();
    writePlayerProfile(storage, { vortexPath: 'orbit' });
    expect(readPlayerProfile(storage)).toEqual({ vortexPath: 'orbit' });
  });

  it('falls back when stored profile data is invalid', () => {
    const storage = memoryStorage();
    storage.setItem('rune-ball:profile:v1', JSON.stringify({ vortexPath: 'unknown' }));
    expect(readPlayerProfile(storage)).toEqual({ vortexPath: 'gravity-well' });
  });
});
