export const CODEX_PAGE_SIZE = 5;

export function codexPageCount(entryCount: number): number {
  return Math.max(1, Math.ceil(entryCount / CODEX_PAGE_SIZE));
}

export function clampCodexPage(page: number, entryCount: number): number {
  return Math.max(0, Math.min(page, codexPageCount(entryCount) - 1));
}

export function codexPageSlice<T>(entries: T[], page: number): T[] {
  const safePage = clampCodexPage(page, entries.length);
  const start = safePage * CODEX_PAGE_SIZE;
  return entries.slice(start, start + CODEX_PAGE_SIZE);
}
