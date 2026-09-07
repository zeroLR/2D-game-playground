import { describe, expect, it } from 'vitest';
import { withTimeout } from '../src/bootstrap/with-timeout';

describe('withTimeout', () => {
  it('returns a renderer result that resolves before the deadline', async () => {
    await expect(withTimeout(Promise.resolve('ready'), 50, 'renderer')).resolves.toBe('ready');
  });

  it('rejects stalled initialization with an observable timeout', async () => {
    const stalled = new Promise<never>(() => undefined);
    await expect(withTimeout(stalled, 1, 'renderer')).rejects.toThrow('renderer timed out after 1ms');
  });
});
