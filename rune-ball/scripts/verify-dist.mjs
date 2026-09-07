import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const expectedBase = '/2D-game-playground/rune-ball/';

if (!html.includes(`${expectedBase}assets/`)) {
  throw new Error(`dist/index.html does not reference assets under ${expectedBase}`);
}

if (/\b(?:src|href)=["']\/assets\//.test(html)) {
  throw new Error('dist/index.html contains root-relative /assets references that will break on GitHub Pages.');
}

console.info(`[Rune Ball] Verified production asset base: ${expectedBase}`);
