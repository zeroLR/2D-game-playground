---
name: game-perf
description: |
  Use this skill when a 2D web game has a measurable performance problem — frame drops, stutter, long GC pauses, slow level generation, or memory growth — and needs profiling and targeted optimization. Covers Chrome DevTools Performance tab, stats.js, object pooling, sprite batching / texture atlases, minimizing allocations in hot loops, dirty-rect rendering, Web Workers for procgen, and Canvas vs WebGL trade-offs.

  TRIGGER when: user mentions "FPS drop", "lag", "stutter", "slow", "janky", "GC pause", "memory leak", "profiling", "optimization", "too many entities", "dungeon generation is slow", "frame spike", or attaches a profiler screenshot.

  DO NOT TRIGGER when: performance has not been measured (ask the user to profile first — do not guess); the issue is gameplay feel without a perf metric (use game-loop); early scaffolding before there is anything to measure (use game-scaffold).
---

# game-perf

**Rule zero: measure before optimizing.** If the user hasn't opened DevTools or added `stats.js`, refuse to guess. Ask them to capture a profile first, then come back.

## Step 1 — Instrument

Drop `stats.js` in during dev:

```ts
import Stats from "stats.js";
const stats = new Stats();
stats.showPanel(0);           // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);
function frame() {
  stats.begin();
  // ... loop body ...
  stats.end();
  requestAnimationFrame(frame);
}
```

Add coarse timers around suspects:

```ts
const t0 = performance.now();
generateLevel(...);
console.log("gen:", (performance.now() - t0).toFixed(1), "ms");
```

For the full picture, use **Chrome DevTools → Performance → Record** for ~5 seconds of gameplay. Look for:
- Long yellow scripting bars → JS is the bottleneck
- Tall purple rendering bars → layout/paint; DOM/CSS issue
- Green compositing spikes → too many layers or huge canvases
- Jagged memory sawtooth → allocation pressure → GC pauses

## Step 2 — Classify the bottleneck

| Symptom | Likely cause | Section below |
|---|---|---|
| 60 → 30 FPS under many enemies | Too much JS per frame | §3 Simulation |
| Regular 50–200ms spikes | GC pauses | §4 Allocations |
| Constant low FPS with few entities | Overdraw / many draw calls | §5 Rendering |
| Tab memory grows over minutes | Leaks | §6 Leaks |
| Level gen freezes the tab | Sync work on main thread | §7 Workers |

## Step 3 — Simulation bottleneck

Symptoms: scripting bar is long, fairly flat.

- **Profile-guided:** the top 3 functions in the flame chart own the fix. Start there. Don't optimize what isn't hot.
- **Spatial partitioning:** replace `O(n²)` entity-vs-entity scans with a grid hash (`Map<"x,y", Entity[]>`). For 1000 entities this is usually 10–50× faster than naive loops.
- **Dijkstra maps over per-entity A\***: compute one flow field from the player; every monster reads it in O(1). See game-systems.
- **Avoid `Array.filter` + spread in hot loops:** they allocate. Use plain `for` loops and mutate.
- **Cache FOV/pathfinding results** between turns where the target hasn't moved.
- **Fixed-point math** is almost never worth it in JS; `Math.hypot` is — replace `Math.sqrt(dx*dx+dy*dy)` only if profiling says so. `dx*dx+dy*dy` compared against `r*r` is usually best.

## Step 4 — Allocations and GC pauses

Symptoms: regular spikes, sawtooth memory.

- **Object pooling** for short-lived objects (particles, projectiles, damage numbers):

  ```ts
  class Pool<T> {
    private free: T[] = [];
    constructor(private factory: () => T, private reset: (t: T) => void) {}
    acquire(): T { return this.free.pop() ?? this.factory(); }
    release(t: T) { this.reset(t); this.free.push(t); }
  }
  ```

- **Preallocate arrays** used per-frame; reuse them with `.length = 0` instead of `[]`.
- **Stop creating vectors:** replace `{x, y}` returns with out-parameters or two separate locals.
- **Avoid closures inside hot loops** — they capture scope and allocate.
- **Don't use `forEach` on hot paths** — plain `for` is measurably faster and doesn't allocate callbacks.
- **Strings concatenated every frame** (HUD text) → only update when the value changes.

After each change, re-record Performance and confirm the spikes are gone. Pooling that doesn't reduce GC is just complexity.

## Step 5 — Rendering bottleneck

Symptoms: scripting is fine, rendering/compositing bars dominate.

- **Texture atlas / spritesheet**: one `<img>` → many sprites, one GPU upload. PixiJS, Phaser, and `TexturePacker` all support this.
- **Batch draw calls** (PixiJS does this automatically *if* you use the same `BaseTexture`). Mixing textures breaks the batch — keep related sprites on the same atlas.
- **Layer separation + dirty rects (Canvas 2D only):**
  - Static background on layer A (draw once)
  - Dynamic entities on layer B (clear + redraw)
  - HUD on layer C (update only on change)
- **Don't resize the canvas every frame.** Resize on window event only.
- **`ctx.imageSmoothingEnabled = false`** for pixel art — correctness *and* speed.
- **Avoid `ctx.save()`/`ctx.restore()` per-sprite**; hoist transforms where possible.
- **CSS transforms for shake/flash** beat canvas redraw.
- **Hide off-screen entities from render**, but keep them in the sim. A simple culling check before draw is almost free and can double FPS in large maps.

## Step 6 — Memory leaks

Use DevTools → Memory → **Heap snapshot**, take two (one after scene A, one after leaving it and GCing), compare deltas.

Common culprits:
- Event listeners added on scene entry, never removed on exit (`scene.exit()` must unsubscribe from the bus)
- Closures capturing entire `World` references
- Caches with no eviction
- Detached DOM nodes from old UI
- `Map` / `Set` keyed on entity IDs, never cleared when entity dies

Rule: every `.on(...)` paired with `.off(...)`; every `pool.acquire()` with `pool.release()`; every `create(entity)` with `world.remove(id)`.

## Step 7 — Move heavy work off the main thread

If dungeon generation, pathfinding recomputation, or save serialization takes >16ms, it causes a visible hitch. Options:

1. **Time-slice** across frames (generator function yielding every 5ms):

   ```ts
   function* generateSliced() {
     for (const step of steps) {
       yield doStep(step);
     }
   }
   ```

2. **Web Worker** for anything pure (procgen is perfect — pass a seed in, get a serialized map out):

   ```ts
   // worker.ts
   self.onmessage = (e) => {
     const map = generateLevel(e.data.seed, e.data.w, e.data.h);
     self.postMessage(map);  // structured-cloneable
   };
   ```

   On the main thread show a spinner / fade, then swap in the level.

3. **`requestIdleCallback`** for non-urgent background work (preloading next level's atlas).

## Step 8 — Verify and lock in

After each fix, record Performance again and compare. Keep a `perf.md` in the game repo logging:

```
2026-04-14  GC pauses 180ms → 12ms  | pooled particles, preallocated hit array
2026-04-17  FPS 32 → 58 (100 mobs)  | switched A* to Dijkstra map
```

Without this log, regressions slip in silently over months.

## Anti-patterns to avoid

- Optimizing before measuring
- "Micro-opts" (`x|0` vs `Math.floor`) when the flame chart points elsewhere
- Rewriting to WebGL when Canvas 2D wasn't actually the bottleneck
- Adding an ECS library hoping it's faster — data layout matters, the framework rarely does
- Believing `console.log` is free — it isn't; strip it from hot paths before measuring
- Testing perf in dev mode; always re-run with `vite build && vite preview` before judging

## Hand-off

- Problem turned out to be an architectural flaw in the loop → **game-loop**
- Problem is the scheduler or generation algorithm itself → **game-systems**
