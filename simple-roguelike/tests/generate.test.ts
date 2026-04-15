import { describe, expect, it } from "vitest";
import { createRng } from "../src/game/rng";
import { generateLevel } from "../src/game/map/generate";
import { Tile } from "../src/game/map/tiles";

describe("generateLevel", () => {
  it("same seed produces the same map", () => {
    const a = generateLevel(createRng(42), 32, 20);
    const b = generateLevel(createRng(42), 32, 20);
    const dumpA: Tile[] = [];
    const dumpB: Tile[] = [];
    for (const [, , t] of a.map.cells()) dumpA.push(t);
    for (const [, , t] of b.map.cells()) dumpB.push(t);
    expect(dumpA).toEqual(dumpB);
    expect(a.spawn).toEqual(b.spawn);
    expect(a.stairs).toEqual(b.stairs);
  });

  it("100 seeds all produce connected dungeons with reachable stairs", () => {
    for (let seed = 1; seed <= 100; seed++) {
      const { map, spawn, stairs } = generateLevel(createRng(seed), 32, 20);
      // Spawn and stairs must be floor/stairs tiles.
      expect(map.info(spawn.x, spawn.y).blocksMove).toBe(false);
      expect(map.info(stairs.x, stairs.y).blocksMove).toBe(false);
      // Stairs must be reachable from spawn — walk a BFS to prove it.
      expect(reachable(map, spawn, stairs)).toBe(true);
    }
  });

  it("places stairs away from spawn", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const { spawn, stairs } = generateLevel(createRng(seed), 32, 20);
      const manhattan = Math.abs(spawn.x - stairs.x) + Math.abs(spawn.y - stairs.y);
      expect(manhattan).toBeGreaterThan(5);
    }
  });
});

function reachable(
  map: import("../src/game/map/tilemap").TileMap,
  from: { x: number; y: number },
  to: { x: number; y: number },
): boolean {
  const seen = new Set<string>();
  const q: { x: number; y: number }[] = [from];
  seen.add(`${from.x},${from.y}`);
  const dirs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  while (q.length > 0) {
    const { x, y } = q.shift()!;
    if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (!map.inBounds(nx, ny)) continue;
      if (map.info(nx, ny).blocksMove) continue;
      const key = `${nx},${ny}`;
      if (seen.has(key)) continue;
      seen.add(key);
      q.push({ x: nx, y: ny });
    }
  }
  return false;
}
