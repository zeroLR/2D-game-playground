import "./style.css";
import { Application, Container, Graphics } from "pixi.js";

import { createRng, pickSeed, type Rng } from "./game/rng";

// Internal play-field resolution. 9:16 portrait. CSS letterboxes to any viewport.
const PLAY_W = 360;
const PLAY_H = 640;

interface Game {
  seed: number;
  rng: Rng;
  avatar: Graphics;
  // target position the avatar is steering toward (in play-field coordinates).
  targetX: number;
  targetY: number;
  // current avatar position (kept separately so we can ease toward target).
  x: number;
  y: number;
}

const AVATAR_SPEED = 360; // play-field pixels per second
const AVATAR_SIZE = 18;

function makeAvatar(): Graphics {
  const g = new Graphics();
  // Equilateral triangle pointing up, centered at (0, 0).
  const r = AVATAR_SIZE;
  const h = r * Math.sqrt(3) / 2;
  g.moveTo(0, -h * 0.66);
  g.lineTo(r * 0.5, h * 0.33);
  g.lineTo(-r * 0.5, h * 0.33);
  g.closePath();
  g.fill({ color: 0x111111 });
  return g;
}

function startRun(world: Container): Game {
  const seed = pickSeed();
  const rng = createRng(seed);
  // eslint-disable-next-line no-console
  console.log(`[shape-shift] run seed = ${seed}`);

  const seedLabel = document.getElementById("seed-label");
  if (seedLabel) seedLabel.textContent = `seed: ${seed}`;

  world.removeChildren();
  const avatar = makeAvatar();
  const startX = PLAY_W / 2;
  const startY = PLAY_H * 0.75;
  avatar.position.set(startX, startY);
  world.addChild(avatar);

  return {
    seed,
    rng,
    avatar,
    targetX: startX,
    targetY: startY,
    x: startX,
    y: startY,
  };
}

function step(game: Game, dtSeconds: number): void {
  const dx = game.targetX - game.x;
  const dy = game.targetY - game.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return;
  const maxStep = AVATAR_SPEED * dtSeconds;
  const nx = dx / dist;
  const ny = dy / dist;
  const moveDist = Math.min(maxStep, dist);
  game.x += nx * moveDist;
  game.y += ny * moveDist;
  game.avatar.position.set(game.x, game.y);
}

function fitCanvasToContainer(app: Application, container: HTMLElement): void {
  const { clientWidth: cw, clientHeight: ch } = container;
  if (cw === 0 || ch === 0) return;
  // Letterbox: scale = min(cw / PLAY_W, ch / PLAY_H). Canvas CSS size stretches;
  // internal renderer stays at PLAY_W × PLAY_H so gameplay coords are stable.
  const scale = Math.min(cw / PLAY_W, ch / PLAY_H);
  const displayW = Math.floor(PLAY_W * scale);
  const displayH = Math.floor(PLAY_H * scale);
  const canvas = app.canvas;
  canvas.style.width = `${displayW}px`;
  canvas.style.height = `${displayH}px`;
}

function clientToPlay(app: Application, clientX: number, clientY: number): { x: number; y: number } {
  const rect = app.canvas.getBoundingClientRect();
  const px = ((clientX - rect.left) / rect.width) * PLAY_W;
  const py = ((clientY - rect.top) / rect.height) * PLAY_H;
  return {
    x: Math.max(0, Math.min(PLAY_W, px)),
    y: Math.max(0, Math.min(PLAY_H, py)),
  };
}

async function boot(): Promise<void> {
  const container = document.getElementById("game");
  if (!container) throw new Error("#game element missing");

  const app = new Application();
  await app.init({
    width: PLAY_W,
    height: PLAY_H,
    background: 0xffffff,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });
  container.appendChild(app.canvas);

  const world = new Container();
  app.stage.addChild(world);

  let game = startRun(world);
  fitCanvasToContainer(app, container);

  window.addEventListener("resize", () => fitCanvasToContainer(app, container));

  // Touch / pointer drag: while pressed, avatar target follows the pointer.
  let tracking = false;
  const onDown = (ev: PointerEvent) => {
    tracking = true;
    app.canvas.setPointerCapture?.(ev.pointerId);
    const p = clientToPlay(app, ev.clientX, ev.clientY);
    game.targetX = p.x;
    game.targetY = p.y;
  };
  const onMove = (ev: PointerEvent) => {
    if (!tracking) return;
    const p = clientToPlay(app, ev.clientX, ev.clientY);
    game.targetX = p.x;
    game.targetY = p.y;
  };
  const onUp = (ev: PointerEvent) => {
    tracking = false;
    app.canvas.releasePointerCapture?.(ev.pointerId);
  };
  app.canvas.addEventListener("pointerdown", onDown);
  app.canvas.addEventListener("pointermove", onMove);
  app.canvas.addEventListener("pointerup", onUp);
  app.canvas.addEventListener("pointercancel", onUp);

  // Keyboard fallback for desktop smoke-testing.
  window.addEventListener("keydown", (ev) => {
    const STEP = 24;
    if (ev.key === "ArrowUp") game.targetY = Math.max(0, game.y - STEP);
    else if (ev.key === "ArrowDown") game.targetY = Math.min(PLAY_H, game.y + STEP);
    else if (ev.key === "ArrowLeft") game.targetX = Math.max(0, game.x - STEP);
    else if (ev.key === "ArrowRight") game.targetX = Math.min(PLAY_W, game.x + STEP);
    else if (ev.key === "r" || ev.key === "R") game = startRun(world);
  });

  document.getElementById("btn-restart")?.addEventListener("click", () => {
    game = startRun(world);
  });

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS / 1000;
    step(game, dt);
  });
}

boot().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[shape-shift] boot failed:", err);
});
