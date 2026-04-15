---
name: game-scaffold
description: |
  Use this skill when starting a new 2D web game project, especially roguelikes, or when deciding on a tech stack and project structure for browser-based games. Covers tech stack selection (Phaser, PixiJS, Kaboom.js, rot.js, raw Canvas/WebGL), folder layout, Vite/TypeScript setup, asset pipeline, and initial hooks for lint/typecheck/test.

  TRIGGER when: user says "start/new/scaffold a game", "new roguelike", "which game engine/library", "setup a web game project", "browser game boilerplate", or opens an empty repo intending to build a 2D game; also trigger when package.json is absent but user discusses a 2D game idea.

  DO NOT TRIGGER when: working inside an existing game project that already has a game loop or scenes — use game-loop or game-systems instead; user is building a non-game web app; user is working on 3D (Three.js/Babylon.js) without 2D fallback.
---

# game-scaffold

Systematic kickoff for 2D web games (with a roguelike bias). The goal is to make the early decisions **explicit and reversible** instead of silently locking the project into a stack.

## Phase 0 — Clarify the concept before picking tech

Do not pick a library until these are answered (ask the user if unknown). **Ask #1 first** — platform cascades into every decision below it, and adding mobile support late is expensive.

1. **Target platform** — desktop browser only, **mobile web (touch)**, or both? Also: portrait or landscape? Must work offline? PWA / installable?
   - This is question #1 because it dictates input model (keyboard vs. touch), viewport math (fixed vs. responsive, safe-area insets), performance budget (a 2019 Android is ~5× slower than a MacBook), asset resolution (devicePixelRatio ≥ 2 on phones), and UI affordances (44×44 px minimum tap target). Retrofitting these after the fact usually means rewriting the input layer and the layout.
   - **If mobile** is in scope, also jump to the "Mobile web games" callout in Phase 2 before scaffolding.
2. **Turn-based or real-time?** (roguelikes are usually turn-based, but "coffee-break roguelites" like *Brogue*/*Slay the Spire* vs *Nuclear Throne* differ drastically)
3. **Grid/tile-based or free movement?**
4. **Render target**: ASCII, pixel-art sprites, or vector/shader?
   - Warning: `ROT.Display` is not touch-aware — if the answer to #1 includes mobile, prefer PixiJS or raw Canvas so you can attach pointer events to the canvas yourself.
5. **Scope**: 7-day jam, month-long prototype, or long-term project?
6. **Procedural generation**: which layers? (map, items, enemies, narrative)

Write the answers into `docs/concept.md` as a one-page mini-GDD before touching code. The first line should be `Platform: <desktop | mobile | both> (<orientation>)` — make the commitment visible.

## Phase 1 — Tech stack decision matrix

| Need | Recommended | Notes |
|---|---|---|
| ASCII roguelike, turn-based | **rot.js** + Canvas | FOV, pathfinding, map gen built-in |
| Pixel-art sprites, tile grid | **Phaser 3** or **PixiJS** + custom logic | Phaser = batteries-included; Pixi = just rendering |
| Minimal, jam-friendly | **Kaboom.js / KAPLAY** | Fastest time-to-playable |
| Custom engine, learning | **Raw Canvas 2D** | Best for understanding fundamentals |
| Heavy particles / shaders | **PixiJS** (WebGL) | Phaser also works |
| Lots of entities (>2k) | **PixiJS** or **Phaser** (WebGL) | Avoid Canvas 2D for this |

**For a 2D roguelike, the default recommendation is: Vite + TypeScript + PixiJS + rot.js** (Pixi for rendering, rot.js for FOV/pathfinding/generation). Fall back to raw Canvas 2D if the user wants to learn internals, or Phaser if they want scene/physics/tweens out of the box.

Record the choice and *why* in `docs/concept.md` — future-you will want to know.

### Mobile web games — callout

If Phase 0 #1 answered "mobile" or "both", bake these in from day one. Each of them is cheap to set up now and painful to bolt on later:

- **Viewport meta** in `index.html`:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0d0d14" />
  ```
  `viewport-fit=cover` unlocks `env(safe-area-inset-*)` around the notch / home indicator.
- **Touch-friendly canvas CSS**:
  ```css
  canvas {
    display: block;
    width: 100%;
    max-width: min(100vw, 768px);
    height: auto;
    image-rendering: pixelated;
    touch-action: none;      /* kill pinch-zoom + double-tap-zoom on the play area */
    user-select: none;
  }
  body { overscroll-behavior: none; }  /* no pull-to-refresh mid-game */
  #app { padding-bottom: env(safe-area-inset-bottom); }
  ```
- **Pointer events, not touch events** — `pointerdown` / `pointermove` / `pointerup` handle mouse, pen, and touch with one code path. Translate client coordinates to tile coordinates via `canvas.getBoundingClientRect()` so CSS scaling is handled transparently.
- **Input duality** — keep keyboard bindings for desktop debugging, add on-screen buttons (Wait, Restart, maybe Inventory) so touch users can trigger actions that don't map to a tap-to-move. Button tap targets must be ≥ 44×44 CSS px.
- **Map / viewport size** — phones run ~360–420 CSS px wide. A 16 px tile × 32 cols = 512 internal px that scales down cleanly. Grids bigger than ~40 cols force unreadable tiles at phone width unless you add camera scrolling. Decide the grid dimensions with the phone viewport in mind.
- **Performance budget** — budget 8 ms/frame on a mid-tier Android, not 2 ms on your MacBook. Avoid allocations in the per-frame path from the start (see `game-perf` once you have numbers).
- **PWA / offline** — optional for v1. If desired, add `vite-plugin-pwa` so the game works after first load without network.

Test on a real phone (or at minimum Chrome DevTools device emulation with CPU throttling) **before** declaring the Phase 5 smoke test green. Emulation without throttling hides the performance cliff.

## Phase 2 — Scaffold

Use Vite (fast HMR, zero config for TS, easy deploy). Create this structure:

```
my-game/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .claude/settings.json       # hooks (see Phase 4)
├── docs/
│   └── concept.md
├── public/
│   └── assets/                 # static, not processed
├── src/
│   ├── main.ts                 # entry; boot + loop
│   ├── game/
│   │   ├── loop.ts             # (see game-loop skill)
│   │   ├── scenes/             # MainMenu, Play, GameOver
│   │   ├── systems/            # input, render, turn, fov...
│   │   ├── entities/           # factories
│   │   ├── map/                # generation, tiles
│   │   └── rng.ts              # seeded RNG (critical for roguelikes)
│   ├── assets/                 # imported assets (Vite-processed)
│   └── ui/                     # HUD, menus
└── tests/
```

Commands to bootstrap:

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm i pixi.js rot-js
npm i -D vitest @types/node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

`tsconfig.json` must have `"strict": true` — roguelike bugs hide in `undefined`.

## Phase 3 — Seeded RNG first

Before any gameplay code, create `src/game/rng.ts` with a **seedable** PRNG (mulberry32 or rot.js's `ROT.RNG`). Every random call in the game must go through this. Without it, runs are not reproducible and bugs become impossible to reproduce.

```ts
// src/game/rng.ts — mulberry32
export function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Log the seed at run start. Add a `?seed=123` URL param for debugging.

## Phase 4 — Hooks (`.claude/settings.json`)

Set up hooks so Claude Code catches regressions immediately when editing game code. Write to `.claude/settings.json` in the **game project** (not the skill repo):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npx tsc --noEmit 2>&1 | tail -20"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npx vitest run --reporter=dot 2>&1 | tail -30"
          }
        ]
      }
    ]
  }
}
```

Rationale: typecheck on every edit is cheap and catches 80% of roguelike "silent bugs"; the full test run on Stop confirms nothing regressed before handing back.

Adjust the `tail` values if output gets noisy. Add ESLint to the PostToolUse chain once the project has real rules.

## Phase 5 — Minimum playable loop

Before adding content, prove the pipeline end-to-end:

1. Black canvas fills viewport
2. `@` renders at (10, 10)
3. Arrow keys move `@` one tile per press
4. Seed printed to console
5. Press `r` to restart with new seed

If any of these is broken, nothing downstream matters. This is your smoke test — keep it green.

## Hand-off

Once the scaffold is alive, the next skills take over:
- **game-loop** — formalize the update/render loop (turn-based action queue for roguelikes)
- **game-systems** — FOV, dungeon gen, input mapping, save/load, ECS
- **game-perf** — only when you measure a real problem
