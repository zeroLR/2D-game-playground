import { describe, expect, it } from 'vitest';
import { CODEX_PAGE_SIZE, clampCodexPage, codexPageCount, codexPageSlice } from '../src/ui/codexLayout';

describe('codex pagination', () => {
  it('keeps a bounded number of entries on screen', () => {
    expect(CODEX_PAGE_SIZE).toBe(5);
    expect(codexPageSlice([1, 2, 3, 4, 5, 6, 7], 0)).toEqual([1, 2, 3, 4, 5]);
    expect(codexPageSlice([1, 2, 3, 4, 5, 6, 7], 1)).toEqual([6, 7]);
  });

  it('clamps pages for empty and changing codex sizes', () => {
    expect(codexPageCount(0)).toBe(1);
    expect(codexPageCount(11)).toBe(3);
    expect(clampCodexPage(9, 6)).toBe(1);
    expect(clampCodexPage(-2, 6)).toBe(0);
  });
});
