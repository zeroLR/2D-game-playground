import { describe, expect, it } from "vitest";
import { World } from "../src/game/world";
import { TileMap } from "../src/game/map/tilemap";
import { Tile } from "../src/game/map/tiles";
import {
  spawnGoblin,
  spawnOrc,
  spawnRat,
  spawnTroll,
} from "../src/game/entities/factories";
import { wanderStep } from "../src/game/systems/ai";
import { MessageLog } from "../src/ui/hud";
import type { Rng } from "../src/game/rng";

/** Build an all-floor map of given size for wander tests. */
function openMap(w = 5, h = 5): TileMap {
  const map = new TileMap(w, h, Tile.Floor);
  return map;
}

/** A deterministic RNG that yields the given numbers in order, then repeats the last. */
function scriptedRng(values: number[]): Rng {
  let i = 0;
  return () => {
    const v = values[Math.min(i, values.length - 1)];
    i++;
    return v;
  };
}

// ---------------------------------------------------------------------------
// Enemy factories
// ---------------------------------------------------------------------------

describe("enemy factories", () => {
  it("spawnRat sets the low-tier stat block", () => {
    const world = new World();
    const id = spawnRat(world, 3, 4);
    const c = world.get(id)!;
    expect(c.renderable?.sprite).toBe("rat");
    expect(c.health).toEqual({ hp: 3, max: 3 });
    expect(c.stats).toEqual({ str: 0, def: 0 });
    expect(c.combat?.damageDice).toEqual([1, 2]);
    expect(c.xpReward).toBe(1);
    expect(c.ai).toEqual({ kind: "hostile", hasSeenPlayer: false });
    expect(c.blocker).toBe(true);
    expect(c.position).toEqual({ x: 3, y: 4 });
  });

  it("spawnGoblin still matches its original stat block", () => {
    const world = new World();
    const id = spawnGoblin(world, 0, 0);
    const c = world.get(id)!;
    expect(c.renderable?.sprite).toBe("goblin");
    expect(c.health).toEqual({ hp: 5, max: 5 });
    expect(c.stats).toEqual({ str: 0, def: 0 });
    expect(c.combat?.damageDice).toEqual([1, 3]);
    expect(c.xpReward).toBe(3);
  });

  it("spawnOrc is a mid-tier threat", () => {
    const world = new World();
    const id = spawnOrc(world, 0, 0);
    const c = world.get(id)!;
    expect(c.renderable?.sprite).toBe("orc");
    expect(c.health).toEqual({ hp: 9, max: 9 });
    expect(c.stats).toEqual({ str: 2, def: 1 });
    expect(c.combat?.damageDice).toEqual([1, 4]);
    expect(c.xpReward).toBe(6);
  });

  it("spawnTroll is the boss tier", () => {
    const world = new World();
    const id = spawnTroll(world, 0, 0);
    const c = world.get(id)!;
    expect(c.renderable?.sprite).toBe("troll");
    expect(c.health).toEqual({ hp: 18, max: 18 });
    expect(c.stats).toEqual({ str: 4, def: 2 });
    expect(c.combat?.damageDice).toEqual([2, 4]);
    expect(c.xpReward).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Wander behavior
// ---------------------------------------------------------------------------

describe("wanderStep", () => {
  it("idles (returns null) when the idle roll hits", () => {
    const world = new World();
    const map = openMap();
    const log = new MessageLog();
    const id = spawnRat(world, 2, 2);
    // rng() < 0.5 → idle
    const step = wanderStep(world, map, id, scriptedRng([0.1]), log);
    expect(step).toBeNull();
    expect(world.get(id)!.position).toEqual({ x: 2, y: 2 });
  });

  it("moves one tile when the idle roll misses and a direction is open", () => {
    const world = new World();
    const map = openMap();
    const log = new MessageLog();
    const id = spawnRat(world, 2, 2);
    // First rng() ≥ 0.5 → don't idle.
    // Second rng() = 0 → randInt picks index 0 → direction [-1, -1].
    const step = wanderStep(world, map, id, scriptedRng([0.9, 0]), log);
    expect(step).toEqual([-1, -1]);
    expect(world.get(id)!.position).toEqual({ x: 1, y: 1 });
  });

  it("does not move when the chosen direction is blocked by a wall", () => {
    const world = new World();
    const map = new TileMap(5, 5, Tile.Floor);
    // Surround (0,0) so index 0 direction (-1,-1) walks into an out-of-bounds wall.
    const log = new MessageLog();
    const id = spawnRat(world, 0, 0);
    const step = wanderStep(world, map, id, scriptedRng([0.9, 0]), log);
    expect(step).toBeNull();
    expect(world.get(id)!.position).toEqual({ x: 0, y: 0 });
  });

  it("does not move when blocked by another entity", () => {
    const world = new World();
    const map = openMap();
    const log = new MessageLog();
    const id = spawnRat(world, 2, 2);
    spawnGoblin(world, 1, 1); // blocker at (1, 1)
    // direction index 0 → [-1, -1] which would step onto the goblin
    const step = wanderStep(world, map, id, scriptedRng([0.9, 0]), log);
    expect(step).toBeNull();
    expect(world.get(id)!.position).toEqual({ x: 2, y: 2 });
  });
});
