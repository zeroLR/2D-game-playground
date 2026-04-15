# simple-roguelike

A small turn-based roguelike built with Vite + TypeScript + PixiJS + rot-js. Deployed to GitHub Pages at https://zerolr.github.io/2D-game-playground/simple-roguelike/ by the repo-level workflow.

## Gameplay

Designed for both desktop and mobile web — tap or keyboard, same game.

**Mobile / touch:**
- Tap a tile on the map to take one step toward it (8-way). Tap an adjacent enemy to bump-attack.
- **Wait** button — burn a turn in place. **Restart** button — new seed.

**Desktop / keyboard:**
- Move with arrow keys or `hjkl` (diagonals: `yubn`).
- `.` waits a turn. `r` restarts with a new seed.
- Walk into enemies to bump-attack them.

Reach the stairs `>` to escape the dungeon. Append `?seed=123` to the URL to play a reproducible run.

## Structure

```
src/
├── main.ts            # boot: PIXI app, input handler, render loop
├── game/
│   ├── rng.ts         # seeded mulberry32
│   ├── world.ts       # bag-of-components ECS
│   ├── turn.ts        # pattern-3 turn loop (player → enemies → FOV → render)
│   ├── map/           # tiles, TileMap, Digger-based generate + BFS check
│   ├── systems/       # input, movement, combat, fov, ai
│   └── entities/      # spawnPlayer, spawnGoblin
├── render/
│   ├── textures.ts    # procedural 16×16 sprites via PIXI.Graphics
│   └── stage.ts       # PIXI containers for tile + entity layers
└── ui/hud.ts          # plain DOM status + message log
tests/                 # vitest: rng, generate, fov
```

## Scripts

```sh
npm ci           # install deps
npm run dev      # Vite dev server with HMR
npm test         # vitest (16 tests)
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve dist/ at the Pages base path
```

## Design notes

- Procedurally-drawn sprites (no external asset file) — edit `src/render/textures.ts` to retheme.
- Turn-based instant loop (game-loop pattern #3) — the sim only advances on a valid player action.
- Determinism: every random call routes through a single seeded RNG (`src/game/rng.ts`); the seed is logged at boot and displayed in the HUD.
- FOV uses rot-js's `PreciseShadowcasting`; tiles render in three states (visible / seen / unseen).
- Enemy AI uses `ROT.Path.AStar` — goblins stand still until they've seen the player once.
