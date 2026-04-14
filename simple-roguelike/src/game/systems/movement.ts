import type { EntityId, World } from "../world";
import type { TileMap } from "../map/tilemap";
import type { Rng } from "../rng";
import { attack } from "./combat";
import type { MessageLog } from "../../ui/hud";

/**
 * Can the given tile be walked into? Adapted from game-systems skill
 * (.claude/skills/game-systems/SKILL.md:122-129).
 */
export function canWalk(world: World, map: TileMap, x: number, y: number): boolean {
  if (!map.inBounds(x, y)) return false;
  if (map.info(x, y).blocksMove) return false;
  if (world.blockerAt(x, y) !== undefined) return false;
  return true;
}

export type MoveResult =
  | { kind: "moved"; to: { x: number; y: number } }
  | { kind: "attacked"; target: EntityId; killed: boolean }
  | { kind: "blocked" };

/**
 * Try to move an entity by (dx, dy). On a wall or out-of-bounds this is a
 * no-op. If another blocker is in the way, attempt a bump-to-attack.
 */
export function tryMove(
  world: World,
  map: TileMap,
  id: EntityId,
  dx: number,
  dy: number,
  rng: Rng,
  log: MessageLog,
): MoveResult {
  const c = world.get(id);
  if (!c?.position) return { kind: "blocked" };
  const nx = c.position.x + dx;
  const ny = c.position.y + dy;

  if (!map.inBounds(nx, ny) || map.info(nx, ny).blocksMove) {
    return { kind: "blocked" };
  }

  const blocker = world.blockerAt(nx, ny);
  if (blocker !== undefined && blocker !== id) {
    const killed = attack(world, id, blocker, rng, log);
    return { kind: "attacked", target: blocker, killed };
  }

  c.position.x = nx;
  c.position.y = ny;
  return { kind: "moved", to: { x: nx, y: ny } };
}
