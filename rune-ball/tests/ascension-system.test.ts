import { describe, expect, it } from 'vitest';
import { AscensionSystem } from '../src/progression/AscensionSystem';

describe('AscensionSystem', () => {
  it('charges only from successful Vortex activations', () => {
    const ascension = new AscensionSystem();

    ascension.registerRuneActivation('split');
    ascension.registerRuneActivation('chain');
    expect(ascension.snapshot.energy).toBe(0);

    ascension.registerRuneActivation('vortex');
    expect(ascension.snapshot.energy).toBe(25);
  });

  it('becomes ready after four Vortex activations', () => {
    const ascension = new AscensionSystem();

    for (let count = 0; count < 3; count += 1) {
      expect(ascension.registerRuneActivation('vortex')).toBe(false);
    }
    expect(ascension.snapshot.ready).toBe(false);

    expect(ascension.registerRuneActivation('vortex')).toBe(true);
    expect(ascension.snapshot.energy).toBe(100);
    expect(ascension.snapshot.ready).toBe(true);
  });

  it('holds at full energy until intentionally consumed', () => {
    const ascension = new AscensionSystem();
    for (let count = 0; count < 4; count += 1) ascension.registerRuneActivation('vortex');

    ascension.registerRuneActivation('vortex');
    expect(ascension.snapshot.energy).toBe(100);
    expect(ascension.consume()).toBe(true);
    expect(ascension.snapshot.energy).toBe(0);
    expect(ascension.snapshot.releases).toBe(1);
  });

  it('does not consume before ready and resets per run', () => {
    const ascension = new AscensionSystem();
    ascension.registerRuneActivation('vortex');
    expect(ascension.consume()).toBe(false);

    ascension.reset();
    expect(ascension.snapshot.energy).toBe(0);
    expect(ascension.snapshot.releases).toBe(0);
  });
});
