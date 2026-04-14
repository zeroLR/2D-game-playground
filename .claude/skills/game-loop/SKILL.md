---
name: game-loop
description: |
  Use this skill when designing, implementing, or debugging the main loop of a 2D web game — particularly turn-based roguelikes where the "loop" is really an action queue, but also real-time games needing fixed timestep, interpolation, pause/resume, or frame-pacing fixes. Covers requestAnimationFrame patterns, accumulator/fixed-step, turn scheduling, and separating simulation from rendering.

  TRIGGER when: user mentions "game loop", "update/render", "delta time", "fixed timestep", "frame rate drop", "stuttering", "requestAnimationFrame", "turn order", "action queue", "speed system", "schedule enemies", or is adding the first tick function to a game project.

  DO NOT TRIGGER when: the issue is rendering performance (use game-perf), asset loading, input handling without a loop question (use game-systems), or UI-only work with no simulation.
---

# game-loop

The loop is the spine of the game. Mistakes here produce bugs that look like physics/AI/animation bugs but aren't. Get it right once, then forget about it.

## Decide the loop *shape* first

Ask the user (or infer) which pattern fits:

1. **Pure real-time, variable timestep** — simple, but physics is frame-rate dependent. Only acceptable for UI-ish games.
2. **Real-time, fixed timestep with accumulator** — the standard. Deterministic simulation, smooth rendering via interpolation. Use for platformers, shooters, bullet-hell.
3. **Turn-based, instant** — sim only advances when the player acts. Use for classic roguelikes (NetHack, DCSS).
4. **Turn-based with speed system** — entities have speeds; a scheduler picks who acts next. Use for modern roguelikes (Brogue, ToME).
5. **Hybrid** — real-time with turn-based pauses (Into the Breach style) or ATB (Final Fantasy).

For a **2D roguelike**, default to **#4 (speed-based scheduler)** unless the user specifically wants simpler.

## Pattern A — Fixed timestep with accumulator (real-time)

The Gaffer-on-Games pattern. Accept this as boilerplate:

```ts
// src/game/loop.ts
const FIXED_DT = 1 / 60;      // simulation tick = 16.67ms
const MAX_FRAME = 0.25;       // clamp to avoid spiral-of-death

export function startLoop(update: (dt: number) => void, render: (alpha: number) => void) {
  let last = performance.now() / 1000;
  let acc = 0;
  let running = true;

  function frame(now: number) {
    if (!running) return;
    const t = now / 1000;
    let frame = t - last;
    if (frame > MAX_FRAME) frame = MAX_FRAME;
    last = t;
    acc += frame;

    while (acc >= FIXED_DT) {
      update(FIXED_DT);
      acc -= FIXED_DT;
    }
    render(acc / FIXED_DT);   // alpha in [0,1) for interpolation
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    stop() { running = false; },
  };
}
```

**Never** use `setInterval` for the loop. **Never** read `Date.now()` — use `performance.now()`. **Always** clamp the frame delta or a tab switch will spiral.

### Interpolation

Store `prevX, prevY` before each update tick; in render, draw at `lerp(prev, curr, alpha)`. This removes stutter at 144Hz without running the sim faster.

## Pattern B — Turn-based speed scheduler (roguelike)

Each entity has `energy` that accumulates by its `speed` each tick. When `energy >= 100`, the entity acts and pays its action's cost.

```ts
// src/game/turn/scheduler.ts
interface Actor {
  id: string;
  speed: number;       // 100 = normal, 200 = twice as fast
  energy: number;
  act(): number;       // returns action cost (usually 100)
  isAlive(): boolean;
}

export class Scheduler {
  private actors: Actor[] = [];

  add(a: Actor) { this.actors.push(a); }
  remove(id: string) { this.actors = this.actors.filter(a => a.id !== id); }

  // Advance until the next actor can act. Returns that actor.
  next(): Actor | null {
    if (this.actors.length === 0) return null;
    while (true) {
      this.actors = this.actors.filter(a => a.isAlive());
      if (this.actors.length === 0) return null;
      for (const a of this.actors) a.energy += a.speed;
      const ready = this.actors
        .filter(a => a.energy >= 100)
        .sort((x, y) => y.energy - x.energy);
      if (ready.length > 0) return ready[0];
    }
  }
}
```

Main loop becomes: *wait for input → player acts → run scheduler until player is next → render*. Rendering happens between turns, not every frame, so you can still use `requestAnimationFrame` for smooth animations *between* logical turns (the "animation layer" is separate from the "sim layer").

### Animation layer for turn-based games

The sim is instant, but player feedback isn't. Maintain an animation queue:

```ts
// src/game/animations.ts
type Anim = { duration: number; elapsed: number; tick(p: number): void; done?(): void };
const queue: Anim[] = [];

export function enqueue(a: Anim) { queue.push(a); }
export function isAnimating() { return queue.length > 0; }

export function updateAnims(dt: number) {
  for (const a of queue) {
    a.elapsed += dt;
    const p = Math.min(1, a.elapsed / a.duration);
    a.tick(p);
    if (p >= 1) a.done?.();
  }
  while (queue.length && queue[0].elapsed >= queue[0].duration) queue.shift();
}
```

Input is ignored while `isAnimating()` is true (or queued up — choose and document it).

## Common pitfalls

- **Tab switch spiral**: without clamping, `frame` can be 30s after a tab wakes up, causing 1800 sim ticks in one frame. Clamp to `0.25`.
- **Floating-point drift in accumulator**: use `>=` not `>`, and don't compare to exact zero.
- **Input in render phase**: input must be sampled in the sim tick, otherwise a 30Hz update with 144Hz render drops inputs.
- **Mixing real time and turn time**: pick one authoritative clock per layer. The sim uses turns; the animation layer uses `dt`. Don't cross the streams.
- **Rendering inside update**: never. Update mutates state; render reads state. This separation enables replay, save/load, and headless tests.

## Debugging checklist

When the user says "the game feels bad":

1. Is `dt` clamped? (open devtools → hide tab 10s → return)
2. Is sim running at fixed rate? (log `updateCount` per second; should equal ~60)
3. Is render interpolating? (force monitor to 144Hz; look for stutter)
4. For turn-based: does the scheduler advance deterministically given a fixed seed? (unit test it)
5. Is input sampled at sim rate, not frame rate?

## Hand-off

- Input handling, FOV recomputation per turn, save/load → **game-systems**
- "Sim update is slow (>5ms)" or "GC pauses during play" → **game-perf**
