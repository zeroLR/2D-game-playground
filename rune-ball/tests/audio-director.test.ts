import { describe, expect, it } from 'vitest';
import { AudioDirector } from '../src/audio/AudioDirector';

describe('AudioDirector', () => {
  it('reports unavailable HTML audio and fails unlock safely outside the browser', async () => {
    const audio = new AudioDirector();

    expect(audio.debugState).toMatchObject({
      supported: false,
      initialized: false,
      state: 'unavailable',
      format: null,
    });
    await expect(audio.unlock()).resolves.toBe(false);
  });
});
