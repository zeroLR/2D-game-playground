---
name: game-systems
description: |
  Use this skill when building the core gameplay systems of a 2D web game: input handling, scene/state stack, ECS vs OOP, grid-based collision, FOV and pathfinding, dungeon generation (BSP, cellular automata, drunkard's walk), turn/action resolution, event bus, save/load with localStorage or IndexedDB, and seeded RNG consumers. A menu of building blocks that sit between the loop and the rendered frame; the loaded genre skill says which ones you actually need.

  TRIGGER when: user mentions "ECS", "entity component", "scene manager", "state machine", "input mapping", "collision", "FOV / field of view", "line of sight", "pathfinding / A*", "dungeon generation", "map generation", "procgen", "save load", "turn resolution", "action system", "inventory", or is adding the first gameplay mechanic beyond moving a sprite.

  DO NOT TRIGGER when: the question is strictly about the frame loop (use game-loop), rendering performance (use game-perf), or initial project setup (use game-scaffold).
---

# game-systems

Most 2D games are mostly the *interaction* of small systems. This skill is a menu of proven patterns — pick the ones the loaded `game-<genre>` skill calls for (or the current task needs) and wire them through a single `World` object.

## Architecture: World + lightweight ECS

Avoid heavy ECS frameworks for jam-to-medium scope. A plain TypeScript "bag of components" is enough and debuggable:

```ts
// src/game/world.ts
export type EntityId = number;
export interface Components {
  position?: { x: number; y: number };
  renderable?: { glyph: string; color: string };
  blocker?: true;
  health?: { hp: number; max: number };
  ai?: { kind: "hostile" | "neutral" };
  inventory?: { items: EntityId[] };
  // ...
}

export class World {
  private next: EntityId = 1;
  readonly entities = new Map<EntityId, Components>();

  create(c: Components): EntityId {
    const id = this.next++;
    this.entities.set(id, c);
    return id;
  }
  remove(id: EntityId) { this.entities.delete(id); }
  get(id: EntityId) { return this.entities.get(id); }

  *with<K extends keyof Components>(...keys: K[]): Generator<[EntityId, Required<Pick<Components, K>>]> {
    outer: for (const [id, c] of this.entities) {
      for (const k of keys) if (c[k] === undefined) continue outer;
      yield [id, c as Required<Pick<Components, K>>];
    }
  }
}
```

Systems become pure functions: `move(world, scheduler, rng, input)`. Easy to test, easy to save/load (the `World.entities` map is serializable).

**Only reach for bitecs / miniplex if**: you measure >10k entities and iteration shows up in profiling.

## Scene stack

Not a single "current scene" — a **stack**. Push `Pause` on top of `Play` without losing state; pop to return.

```ts
// src/game/scenes/stack.ts
export interface Scene {
  enter?(): void;
  exit?(): void;
  update(dt: number): void;
  render(alpha: number): void;
  onInput?(ev: InputEvent): boolean;  // return true to consume
}

export class SceneStack {
  private stack: Scene[] = [];
  push(s: Scene) { this.stack[this.stack.length - 1]?.exit?.(); this.stack.push(s); s.enter?.(); }
  pop() { this.stack.pop()?.exit?.(); this.stack[this.stack.length - 1]?.enter?.(); }
  replace(s: Scene) { this.pop(); this.push(s); }
  top() { return this.stack[this.stack.length - 1]; }
  update(dt: number) { this.top()?.update(dt); }
  render(alpha: number) { for (const s of this.stack) s.render(alpha); }
  input(ev: InputEvent) {
    for (let i = this.stack.length - 1; i >= 0; i--) if (this.stack[i].onInput?.(ev)) return;
  }
}
```

`render` iterates the stack bottom-up so `Pause` can draw an overlay on top of the dimmed `Play`.

## Input → Action mapping

Never check `KeyboardEvent.key` inside gameplay code. Map raw events to **actions** in one place:

```ts
// src/game/systems/input.ts
export type Action =
  | { type: "move"; dx: -1 | 0 | 1; dy: -1 | 0 | 1 }
  | { type: "wait" }
  | { type: "pickup" }
  | { type: "inventory" }
  | { type: "quit" };

const bindings: Record<string, Action> = {
  ArrowUp:    { type: "move", dx: 0, dy: -1 },
  ArrowDown:  { type: "move", dx: 0, dy: 1 },
  ArrowLeft:  { type: "move", dx: -1, dy: 0 },
  ArrowRight: { type: "move", dx: 1, dy: 0 },
  ".":        { type: "wait" },
  g:          { type: "pickup" },
  i:          { type: "inventory" },
};

export function keyToAction(e: KeyboardEvent): Action | null {
  return bindings[e.key] ?? null;
}
```

Touch/gamepad go through the same `Action` type. Rebinding becomes editing one table.

## Grid collision

For tile-based games, collision is a lookup, not a physics step:

```ts
export function canWalk(world: World, map: TileMap, x: number, y: number): boolean {
  if (!map.inBounds(x, y) || map.at(x, y).blocksMove) return false;
  for (const [, c] of world.with("position", "blocker")) {
    if (c.position.x === x && c.position.y === y) return false;
  }
  return true;
}
```

Cache entity-by-tile in a `Map<string, EntityId[]>` once you have >500 actors; until then the linear scan is fine.

## FOV (field of view)

Use `rot.js`'s `ROT.FOV.PreciseShadowcasting` — don't write your own until you've shipped a game. Recompute only on the player's turn, not every frame:

```ts
import * as ROT from "rot-js";

const fov = new ROT.FOV.PreciseShadowcasting((x, y) => !map.at(x, y).blocksSight);
export function recomputeFov(player: {x:number;y:number}, radius: number, visible: Set<string>, seen: Set<string>) {
  visible.clear();
  fov.compute(player.x, player.y, radius, (x, y) => {
    const k = `${x},${y}`;
    visible.add(k);
    seen.add(k);
  });
}
```

Render tiles in three states: **visible** (full color), **seen** (dim, grayscale), **unseen** (black).

## Pathfinding

`ROT.Path.AStar` for enemy AI. Compute lazily and cache for 2–3 turns if the target hasn't moved. For dumber enemies, use **Dijkstra maps** (single-source flood fill toward player) — one computation serves every monster on the floor.

## Dungeon generation

Three algorithms cover most grid-based games that need procedural levels (roguelikes, dungeon crawlers, some tactics games):

1. **BSP (binary space partition)** — classic rooms + corridors. `rot.js` has `ROT.Map.Digger`. Good for traditional dungeons.
2. **Cellular automata** — organic caves. Start with random fill, smooth N passes (`live if neighbors in [4..8]`).
3. **Drunkard's walk** — carved tunnels in a solid block. Simple, great for tight caves.

Always generate with an injected RNG:

```ts
function generateLevel(rng: () => number, width: number, height: number): TileMap {
  ROT.RNG.setSeed(Math.floor(rng() * 2 ** 31));
  const digger = new ROT.Map.Digger(width, height);
  const map = new TileMap(width, height);
  digger.create((x, y, wall) => map.set(x, y, wall ? Tile.Wall : Tile.Floor));
  return map;
}
```

Always run a **connectivity check** (BFS from a floor tile) and regenerate if any floor is unreachable. This single guard eliminates 90% of "softlocked level" bugs.

## Save / load

Serialize the **entire `World` + scheduler state + RNG state**, not selective fields. Version it:

```ts
const SAVE_VERSION = 3;

export function save(world: World, scheduler: Scheduler, rngState: number) {
  const data = {
    v: SAVE_VERSION,
    entities: Array.from(world.entities.entries()),
    scheduler: scheduler.serialize(),
    rng: rngState,
  };
  localStorage.setItem("save", JSON.stringify(data));
}

export function load(world: World): { scheduler: SerializedScheduler; rng: number } | null {
  const raw = localStorage.getItem("save");
  if (!raw) return null;
  const data = JSON.parse(raw);
  if (data.v !== SAVE_VERSION) return null;  // migrate or discard
  world.entities.clear();
  for (const [id, c] of data.entities) world.entities.set(id, c);
  return { scheduler: data.scheduler, rng: data.rng };
}
```

For anything over ~1MB (big maps, many entities) switch to **IndexedDB** via `idb-keyval`. Never serialize `Function` or DOM references — keep components pure data.

## Event bus

Decouple systems with a typed event bus. Keep it tiny:

```ts
type EventMap = {
  entityKilled: { id: EntityId; by: EntityId | null };
  pickup:       { id: EntityId; item: EntityId };
  levelChanged: { depth: number };
};
type Handler<K extends keyof EventMap> = (e: EventMap[K]) => void;

class Bus {
  private h: { [K in keyof EventMap]?: Handler<K>[] } = {};
  on<K extends keyof EventMap>(k: K, fn: Handler<K>) { (this.h[k] ??= []).push(fn); }
  emit<K extends keyof EventMap>(k: K, e: EventMap[K]) { this.h[k]?.forEach(fn => fn(e)); }
}
```

Combat logs, achievements, sound triggers, analytics all hook here without touching combat code.

## Determinism checklist

For any seeded or replay-capable game (roguelikes, deckbuilders, daily puzzles, replays, share-the-seed features), **same seed = same run** is a feature, not a nice-to-have. Audit:

- [ ] All `Math.random()` calls replaced with injected RNG
- [ ] `Set`/`Map` iteration order doesn't drive gameplay decisions (or sort first)
- [ ] No `Date.now()` in sim
- [ ] Scheduler ties broken deterministically (sort by id, then energy)
- [ ] Save/load round-trip produces identical subsequent turns — test this

## Hand-off

- Frame pacing, accumulator, animation queue → **game-loop**
- Entity count or generation time is now a bottleneck → **game-perf**
