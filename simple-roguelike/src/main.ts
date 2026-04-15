import "./style.css";
import { Application } from "pixi.js";

import { createRng, pickSeed } from "./game/rng";
import { generateLevel } from "./game/map/generate";
import { World } from "./game/world";
import { spawnGoblin, spawnPlayer } from "./game/entities/factories";
import { keyToAction, tapToAction, type Action } from "./game/systems/input";
import { newVisibility, recomputeFov } from "./game/systems/fov";
import { runTurn, type TurnOutcome } from "./game/turn";
import { Hud, MessageLog } from "./ui/hud";
import { buildTextures, TILE_SIZE } from "./render/textures";
import { Stage } from "./render/stage";

// Grid sized to fit portrait-phone viewports: 32×20 tiles at 16 px × ZOOM=2
// is 1024×640 internal pixels, which CSS scales down to fit < 400 px wide
// phones without losing the pixel-art look (see src/style.css).
const MAP_W = 32;
const MAP_H = 20;
const FOV_RADIUS = 8;
const ZOOM = 2;
const GOBLIN_COUNT = 5;

interface Game {
  seed: number;
  world: World;
  map: ReturnType<typeof generateLevel>["map"];
  vis: ReturnType<typeof newVisibility>;
  rng: ReturnType<typeof createRng>;
  log: MessageLog;
  status: "alive" | "dead" | "escaped";
}

async function main(): Promise<void> {
  const app = new Application();
  await app.init({
    width: MAP_W * TILE_SIZE * ZOOM,
    height: MAP_H * TILE_SIZE * ZOOM,
    background: "#000000",
    antialias: false,
    roundPixels: true,
    resolution: 1,
    autoDensity: true,
  });

  const gameRoot = document.getElementById("game");
  if (!gameRoot) throw new Error("Missing #game host element");
  gameRoot.appendChild(app.canvas);

  const statusEl = document.getElementById("status");
  const logEl = document.getElementById("log");
  if (!statusEl || !logEl) throw new Error("Missing HUD elements");
  const hud = new Hud(statusEl, logEl);

  const textures = buildTextures(app);
  const stage = new Stage(textures);
  stage.root.scale.set(ZOOM);
  app.stage.addChild(stage.root);

  // Everything that depends on the seed lives in `game`. Restart rebuilds it.
  let game = newGame(pickSeed(), stage);
  render(game, stage, hud);

  // One pathway for every input source: keyboard, tap, or on-screen button.
  const apply = (action: Action): void => {
    if (action.type === "restart") {
      // New seed — show it in the HUD and console like the skill requests.
      const next = (game.seed + 1) >>> 0;
      game = newGame(next, stage);
      render(game, stage, hud);
      return;
    }

    // Block further actions once the game is over.
    if (game.status !== "alive") return;

    const outcome: TurnOutcome = runTurn(
      {
        world: game.world,
        map: game.map,
        vis: game.vis,
        rng: game.rng,
        log: game.log,
        fovRadius: FOV_RADIUS,
      },
      action,
    );

    if (outcome === "dead") game.status = "dead";
    else if (outcome === "escaped") game.status = "escaped";

    render(game, stage, hud);
  };

  window.addEventListener("keydown", (e) => {
    const action = keyToAction(e);
    if (!action) return;
    e.preventDefault();
    apply(action);
  });

  // Tap / click the canvas — translate the pixel offset into a tile, then
  // take one 8-way step toward it. `pointerdown` covers mouse, pen, and touch
  // with a single listener, and `touch-action: none` in style.css kills the
  // browser's double-tap-zoom on phones.
  app.canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const rect = app.canvas.getBoundingClientRect();
    // rect.width/height are the CSS-scaled size; app.canvas.width/height are
    // the internal resolution. We map back into internal coords before dividing
    // by the tile size × zoom so CSS scaling stays transparent.
    const scaleX = app.canvas.width / rect.width;
    const scaleY = app.canvas.height / rect.height;
    const localX = (e.clientX - rect.left) * scaleX;
    const localY = (e.clientY - rect.top) * scaleY;
    const tileX = Math.floor(localX / (TILE_SIZE * ZOOM));
    const tileY = Math.floor(localY / (TILE_SIZE * ZOOM));

    const player = game.world.player();
    const pos = player?.[1].position;
    if (!pos) return;
    const action = tapToAction(tileX, tileY, pos.x, pos.y);
    if (action) apply(action);
  });

  // On-screen buttons — primary controls on mobile where there is no keyboard.
  const waitBtn = document.getElementById("btn-wait");
  const restartBtn = document.getElementById("btn-restart");
  waitBtn?.addEventListener("click", () => apply({ type: "wait" }));
  restartBtn?.addEventListener("click", () => apply({ type: "restart" }));
}

function newGame(seed: number, stage: Stage): Game {
  console.log(`[simple-roguelike] seed=${seed}`);
  const rng = createRng(seed);
  const world = new World();
  const { map, spawn, roomCenters } = generateLevel(rng, MAP_W, MAP_H);

  spawnPlayer(world, spawn.x, spawn.y);

  // Drop goblins in the rooms farthest from the player, up to GOBLIN_COUNT.
  const enemyRooms = roomCenters.slice(1, GOBLIN_COUNT + 1);
  for (const c of enemyRooms) spawnGoblin(world, c.x, c.y);

  const vis = newVisibility();
  recomputeFov(map, spawn, FOV_RADIUS, vis);

  const log = new MessageLog();
  log.push(`You awaken in an unfamiliar dungeon. (seed ${seed})`);

  stage.rebuild(map);

  return { seed, world, map, vis, rng, log, status: "alive" };
}

function render(game: Game, stage: Stage, hud: Hud): void {
  stage.redraw(game.world, game.vis);
  const player = game.world.player();
  const health = player?.[1].health;
  hud.render(
    {
      hp: health?.hp ?? 0,
      maxHp: health?.max ?? 0,
      seed: game.seed,
      status: game.status,
    },
    game.log,
  );
}

main().catch((err) => {
  console.error(err);
  const el = document.getElementById("status");
  if (el) el.textContent = `Error: ${(err as Error).message}`;
});
