// Turn-based instant loop (game-loop pattern #3).
// The player's action drives everything: we accept input, resolve it, let
// every enemy take one step, recompute FOV, then return so the caller can
// re-render. Nothing ticks in the background.

import type { Rng } from "./rng";
import type { World } from "./world";
import type { TileMap } from "./map/tilemap";
import type { Action } from "./systems/input";
import type { Visibility } from "./systems/fov";
import type { MessageLog } from "../ui/hud";
import { recomputeFov } from "./systems/fov";
import { tryMove } from "./systems/movement";
import { enemiesAct } from "./systems/ai";
import { Tile } from "./map/tiles";

export interface TurnContext {
  world: World;
  map: TileMap;
  vis: Visibility;
  rng: Rng;
  log: MessageLog;
  fovRadius: number;
}

export type TurnOutcome = "ongoing" | "dead" | "escaped" | "noop";

/**
 * Apply one player action and advance the world one turn. Returns a high-level
 * outcome so `main.ts` knows whether to swap into a game-over state.
 */
export function runTurn(ctx: TurnContext, action: Action): TurnOutcome {
  if (action.type === "restart") return "noop"; // handled at the main-loop level
  const p = ctx.world.player();
  if (!p) return "dead";
  const [playerId, playerC] = p;
  if (!playerC.position || !playerC.health) return "dead";

  // 1. Player acts.
  let playerDidSomething = false;
  if (action.type === "move") {
    const res = tryMove(ctx.world, ctx.map, playerId, action.dx, action.dy, ctx.rng, ctx.log);
    if (res.kind !== "blocked") playerDidSomething = true;
  } else if (action.type === "wait") {
    playerDidSomething = true;
  }

  if (!playerDidSomething) return "ongoing";

  // 2. Did the player just step onto the stairs?
  const { x, y } = playerC.position;
  if (ctx.map.at(x, y) === Tile.Stairs) {
    ctx.log.push("You descend the stairs. Freedom!");
    return "escaped";
  }

  // 3. Did the player die to their own action? (Can't in v1, but keep the
  //    guard so movement → future traps behaves correctly.)
  if (playerC.health.hp <= 0) return "dead";

  // 4. Enemies act.
  enemiesAct(ctx.world, ctx.map, ctx.vis, ctx.rng, ctx.log);

  // 5. Did the player die from an enemy bump?
  if (playerC.health.hp <= 0) return "dead";

  // 6. Recompute FOV from the player's new position.
  recomputeFov(ctx.map, playerC.position, ctx.fovRadius, ctx.vis);

  return "ongoing";
}
