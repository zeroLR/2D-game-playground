import * as ROT from "rot-js";
import type { TileMap } from "../map/tilemap";

/**
 * Field-of-view state. `visible` is the set of tiles currently lit; `seen` is
 * the accumulated "memory" set of every tile the player has ever seen.
 *
 * Both stores use `y * width + x` integer indices for cheap Set operations.
 */
export interface Visibility {
  visible: Set<number>;
  seen: Set<number>;
}

export function newVisibility(): Visibility {
  return { visible: new Set(), seen: new Set() };
}

/**
 * Recompute visibility for the player. Adapted from game-systems skill
 * (.claude/skills/game-systems/SKILL.md:140-149) but using integer indices
 * instead of string keys so the hot set lookups stay cheap.
 */
export function recomputeFov(
  map: TileMap,
  from: { x: number; y: number },
  radius: number,
  vis: Visibility,
): void {
  vis.visible.clear();
  const fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
    if (!map.inBounds(x, y)) return false;
    return !map.info(x, y).blocksSight;
  });
  fov.compute(from.x, from.y, radius, (x, y) => {
    if (!map.inBounds(x, y)) return;
    const i = y * map.width + x;
    vis.visible.add(i);
    vis.seen.add(i);
  });
}
