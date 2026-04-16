---
name: game-scaffold
description: |
  Use this skill when starting a new 2D web game project, especially roguelikes, or when deciding on a tech stack and project structure for browser-based games. Reads docs/concept.md to get the Chosen Genre and loads the matching genre skill. Covers tech stack selection (Phaser, PixiJS, Kaboom.js, rot.js, raw Canvas/WebGL), folder layout, Vite/TypeScript setup, asset pipeline, and initial hooks for lint/typecheck/test.

  TRIGGER when: user says "start/new/scaffold a game", "new roguelike", "which game engine/library", "setup a web game project", "browser game boilerplate", or opens an empty repo intending to build a 2D game; also trigger when package.json is absent but user discusses a 2D game idea.

  DO NOT TRIGGER when: working inside an existing game project that already has a game loop or scenes — use game-loop or game-systems instead; user is building a non-game web app; user is working on 3D (Three.js/Babylon.js) without 2D fallback.
---

# game-scaffold

Systematic kickoff for 2D web games. The goal is to make the early decisions **explicit and reversible** instead of silently locking the project into a stack.

## Phase 0 — Read the concept

Before touching code, read `docs/concept.md`. If it does not exist, **stop and hand off to `game-concept`** — concept and worldview must be locked before tech. If it exists and names a **Chosen Genre**, load the matching `game-<genre>` skill: it will inject the recommended stack and override the matrix below. If the genre named has no matching skill, fall through to the matrix.

## Phase 1 — Tech stack decision matrix

Use this only when no genre skill has injected a default. Otherwise the genre skill wins.

| Need | Recommended | Notes |
|---|---|---|
| ASCII grid, turn-based | **rot.js** + Canvas | FOV, pathfinding, map gen built-in |
| Pixel-art sprites, tile grid | **Phaser 3** or **PixiJS** + custom logic | Phaser = batteries-included; Pixi = just rendering |
| Minimal, jam-friendly | **Kaboom.js / KAPLAY** | Fastest time-to-playable |
| Custom engine, learning | **Raw Canvas 2D** | Best for understanding fundamentals |
| Heavy particles / shaders | **PixiJS** (WebGL) | Phaser also works |
| Lots of entities (>2k) | **PixiJS** or **Phaser** (WebGL) | Avoid Canvas 2D for this |

Genre skills inject the default. If none exists for the chosen genre, ask the user which row of this matrix fits the verbs from `docs/concept.md`.

Record the choice and *why* in `docs/concept.md` — future-you will want to know.

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
│   │   ├── loop.ts             # see game-loop
│   │   ├── scenes/             # MainMenu, Play, GameOver
│   │   ├── systems/            # input, render, turn, ...
│   │   ├── entities/           # factories
│   │   ├── world/              # map / level / encounter data
│   │   └── rng.ts              # seeded RNG (critical for procgen and replay)
│   ├── assets/                 # imported assets (Vite-processed)
│   └── ui/                     # HUD, menus
└── tests/
```

Commands to bootstrap:

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm i pixi.js          # add rot-js, phaser, kaboom, howler, etc. per the chosen stack
npm i -D vitest @types/node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

`tsconfig.json` must have `"strict": true` — strict TS catches the silent bugs hiding in `undefined`.

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

Rationale: typecheck on every edit is cheap and catches 80% of the "silent bugs" that quietly break sim or render; the full test run on Stop confirms nothing regressed before handing back.

Adjust the `tail` values if output gets noisy. Add ESLint to the PostToolUse chain once the project has real rules.

## Phase 5 — Minimum playable loop

Before adding content, prove the pipeline end-to-end:

1. Black canvas fills viewport
2. A player marker (sprite or `@` glyph) renders at a known position
3. Arrow keys / WASD move the marker one step per press (or apply velocity, if real-time)
4. Seed printed to console
5. Press `r` to restart with a new seed

If any of these is broken, nothing downstream matters. This is your smoke test — keep it green.

## Hand-off

Once the scaffold is alive, the next skills take over:
- The loaded **`game-<genre>`** skill — drives which loop pattern, which systems, and which spec sections to fill in.
- **game-loop** — formalize the update/render loop (the genre skill names the pattern).
- **game-systems** — input mapping, scene stack, save/load, plus any genre-required systems (FOV, dungeon gen, event bus, ECS).
- **game-perf** — only when you measure a real problem.
