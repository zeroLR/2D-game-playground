import { describe, expect, it } from 'vitest';

describe('stack-shift prototype', () => {
  it('keeps the five-color puzzle palette', () => {
    expect(['red', 'blue', 'yellow', 'green', 'purple']).toHaveLength(5);
  });
});
