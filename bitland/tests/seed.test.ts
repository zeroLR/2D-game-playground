import { describe, expect, it } from 'vitest';
import { canonicalPairKey, discoverySeed } from '../src/simulation/seed';

describe('Bitland deterministic synthesis identity', () => {
  it('treats synthesis pairs as unordered canonical identities', () => {
    expect(canonicalPairKey('matter', 'signal')).toBe('MATTER::SIGNAL');
    expect(canonicalPairKey('signal', 'matter')).toBe('MATTER::SIGNAL');
  });

  it('reproduces the same discovery seed for the same world and pair', () => {
    expect(discoverySeed('world-01', 'matter', 'signal', 0)).toBe(
      discoverySeed('world-01', 'signal', 'matter', 0),
    );
  });

  it('separates bounded discovery slots by index', () => {
    expect(discoverySeed('world-01', 'matter', 'signal', 0)).not.toBe(
      discoverySeed('world-01', 'matter', 'signal', 1),
    );
  });
});
