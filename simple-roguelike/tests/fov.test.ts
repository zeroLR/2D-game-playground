import { describe, expect, it } from "vitest";
import { newVisibility, recomputeFov } from "../src/game/systems/fov";
import { Tile } from "../src/game/map/tiles";
import { TileMap } from "../src/game/map/tilemap";

/** Build a small arena: Floor interior surrounded by Wall border. */
function arena(width: number, height: number): TileMap {
  const map = new TileMap(width, height, Tile.Wall);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      map.set(x, y, Tile.Floor);
    }
  }
  return map;
}

describe("recomputeFov", () => {
  it("player sees their own tile", () => {
    const map = arena(9, 9);
    const vis = newVisibility();
    recomputeFov(map, { x: 4, y: 4 }, 6, vis);
    expect(vis.visible.has(4 * map.width + 4)).toBe(true);
  });

  it("walls block sight past them", () => {
    const map = arena(11, 5);
    // Drop a vertical wall at x=6, fully spanning the room height
    for (let y = 1; y < 4; y++) map.set(6, y, Tile.Wall);
    const vis = newVisibility();
    recomputeFov(map, { x: 2, y: 2 }, 8, vis);
    const idx = (x: number, y: number) => y * map.width + x;
    // Near side is visible
    expect(vis.visible.has(idx(5, 2))).toBe(true);
    // Wall itself is visible (shadowcasting reveals the blocker)
    expect(vis.visible.has(idx(6, 2))).toBe(true);
    // Far side is NOT visible
    expect(vis.visible.has(idx(8, 2))).toBe(false);
    expect(vis.visible.has(idx(9, 2))).toBe(false);
  });

  it("seen set accumulates across recomputes (memory)", () => {
    const map = arena(9, 9);
    const vis = newVisibility();
    recomputeFov(map, { x: 2, y: 2 }, 4, vis);
    const firstSeen = new Set(vis.seen);
    // Step to the far corner — new visible set, but the first batch should
    // still live in `seen`.
    recomputeFov(map, { x: 6, y: 6 }, 4, vis);
    for (const i of firstSeen) {
      expect(vis.seen.has(i)).toBe(true);
    }
  });

  it("visible set resets between recomputes", () => {
    const map = arena(9, 9);
    const vis = newVisibility();
    recomputeFov(map, { x: 2, y: 2 }, 3, vis);
    const oldSize = vis.visible.size;
    expect(oldSize).toBeGreaterThan(0);
    recomputeFov(map, { x: 6, y: 6 }, 3, vis);
    // The previous center tile is 4 away diagonally — outside radius 3 — so
    // it must have dropped out of `visible`.
    expect(vis.visible.has(2 * map.width + 2)).toBe(false);
  });
});
