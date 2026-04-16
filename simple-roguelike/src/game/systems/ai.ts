import * as ROT from "rot-js";

import type { EntityId, World } from "../world";
import type { TileMap } from "../map/tilemap";
import type { Rng } from "../rng";
import { randInt } from "../rng";
import type { Visibility } from "./fov";
import { canWalk, tryMove } from "./movement";
import type { MessageLog } from "../../ui/hud";

/** 8-way neighbor offsets (no "stay put" — waiting is handled separately). */
const WANDER_DIRS: Array<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

/** Probability an idle enemy simply stays still on any given turn. */
const WANDER_IDLE_CHANCE = 0.5;

/**
 * Enemies that have never spotted the player loiter in place or drift one
 * tile at a time. Exported for unit tests. Returns the `[dx, dy]` actually
 * taken, or `null` if the enemy idled / the chosen direction was blocked.
 */
export function wanderStep(
  world: World,
  map: TileMap,
  id: EntityId,
  rng: Rng,
  log: MessageLog,
): [number, number] | null {
  const c = world.get(id);
  if (!c?.position) return null;

  // Half the time, just stand still so wandering feels organic rather than manic.
  if (rng() < WANDER_IDLE_CHANCE) return null;

  const [dx, dy] = WANDER_DIRS[randInt(rng, 0, WANDER_DIRS.length - 1)];
  const nx = c.position.x + dx;
  const ny = c.position.y + dy;
  if (!canWalk(world, map, nx, ny)) return null;

  tryMove(world, map, id, dx, dy, rng, log);
  return [dx, dy];
}

/**
 * Step every hostile one tile closer to the player via A*. Enemies who have
 * never seen the player wander around their room; once they've been in the
 * player's FOV even once, `hasSeenPlayer` flips true and they keep hunting.
 *
 * Uses `ROT.Path.AStar` with a passability callback that treats occupied
 * enemy tiles as blockers — except the goal tile (the player) so A* can
 * always land on it.
 */
export function enemiesAct(
  world: World,
  map: TileMap,
  vis: Visibility,
  rng: Rng,
  log: MessageLog,
): void {
  const p = world.player();
  if (!p) return;
  const [playerId, playerC] = p;
  if (!playerC.position) return;
  const pos = playerC.position;

  // Snapshot enemy ids up front — we may mutate the world during iteration.
  const enemies: EntityId[] = [];
  for (const [id] of world.with("ai", "position")) {
    if (id === playerId) continue;
    enemies.push(id);
  }

  for (const id of enemies) {
    const c = world.get(id);
    if (!c?.ai || !c.position) continue;

    const i = c.position.y * map.width + c.position.x;
    const canSeePlayer = vis.visible.has(i);
    if (canSeePlayer) c.ai.hasSeenPlayer = true;
    if (!c.ai.hasSeenPlayer) {
      // Idle exploration: drift around rather than standing still.
      wanderStep(world, map, id, rng, log);
      continue;
    }

    const astar = new ROT.Path.AStar(pos.x, pos.y, (x: number, y: number) => {
      if (!map.inBounds(x, y)) return false;
      if (map.info(x, y).blocksMove) return false;
      // The goal tile (player) is always "passable" so A* can reach it.
      if (x === pos.x && y === pos.y) return true;
      // Any other blocker (enemies, walls) prevents planning through.
      return world.blockerAt(x, y) === undefined;
    });

    const path: Array<[number, number]> = [];
    astar.compute(c.position.x, c.position.y, (x, y) => {
      path.push([x, y]);
    });

    // path[0] is the enemy's own tile; path[1] is the next step.
    if (path.length < 2) continue;
    const [nx, ny] = path[1];
    const dx = nx - c.position.x;
    const dy = ny - c.position.y;

    // If the next step is blocked right now (shouldn't happen since we just
    // ran A* with the same predicate, but defensive), fall back to waiting.
    if (!canWalk(world, map, nx, ny) && (nx !== pos.x || ny !== pos.y)) continue;

    tryMove(world, map, id, dx, dy, rng, log);
  }
}
