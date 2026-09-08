import { readFile, stat } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const expectedBase = '/2D-game-playground/rune-ball/';

if (!html.includes(`${expectedBase}assets/`)) {
  throw new Error(`dist/index.html does not reference assets under ${expectedBase}`);
}

if (/\b(?:src|href)=["']\/assets\//.test(html)) {
  throw new Error('dist/index.html contains root-relative /assets references that will break on GitHub Pages.');
}

const requiredStems = [
  'bgm-claimed-by-void',
  'brick-hit',
  'brick-armored',
  'brick-break',
  'wall-hit',
  'heartbeat',
  'laser',
  'powerup-get',
  'level-complete',
];

for (const stem of requiredStems) {
  const oggUrl = new URL(`../dist/audio/${stem}.ogg`, import.meta.url);
  const mp3Url = new URL(`../dist/audio/${stem}.mp3`, import.meta.url);
  const ogg = await readFile(oggUrl);
  const mp3Stat = await stat(mp3Url);

  if (ogg.length < 4 || ogg.subarray(0, 4).toString('ascii') !== 'OggS') {
    throw new Error(`dist/audio/${stem}.ogg is missing or is not an Ogg container.`);
  }
  if (mp3Stat.size <= 0) {
    throw new Error(`dist/audio/${stem}.mp3 fallback is empty.`);
  }
}

console.info(`[Rune Ball] Verified production asset base: ${expectedBase}`);
console.info(`[Rune Ball] Verified ${requiredStems.length} OGG audio assets with MP3 fallbacks.`);
