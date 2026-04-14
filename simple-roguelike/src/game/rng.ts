// Seeded RNG. Mulberry32 — from game-scaffold skill.
// Every random decision in the game MUST go through this so that a given seed
// produces an identical run. That is how roguelike bugs become reproducible.

export type Rng = () => number;

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick the seed from `?seed=123` in the URL, or generate a fresh one from
 * `Date.now()` if absent / invalid. Returns a positive 32-bit integer.
 */
export function pickSeed(search = typeof location !== "undefined" ? location.search : ""): number {
  const params = new URLSearchParams(search);
  const raw = params.get("seed");
  if (raw !== null) {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n)) return n >>> 0;
  }
  return (Date.now() & 0x7fffffff) >>> 0;
}

/** Integer in [lo, hi] inclusive. */
export function randInt(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Roll `n` dice of `sides` sides (e.g. `roll(rng, 1, 6)` = 1d6). */
export function roll(rng: Rng, n: number, sides: number): number {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += randInt(rng, 1, sides);
  return sum;
}
