import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { applyDash, applyHit, createInitialState, tickState, type GameState } from './domain/gameState';

const LOGICAL_W = 360;
const LOGICAL_H = 720;
const app = new Application();
await app.init({
  width: LOGICAL_W,
  height: LOGICAL_H,
  background: '#10262a',
  antialias: true,
  resolution: Math.min(devicePixelRatio, 2),
  autoDensity: true,
});

document.querySelector('#app')!.appendChild(app.canvas);

const root = new Container();
app.stage.addChild(root);

const bg = new Graphics();
root.addChild(bg);

const world = new Container();
root.addChild(world);

const particles = new Container();
root.addChild(particles);

const hud = new Container();
root.addChild(hud);

const player = new Graphics();
world.addChild(player);

const abyss = new Graphics();
world.addChild(abyss);

const platforms: Array<{ view: Graphics; x: number; y: number; w: number }> = [];
const hazards: Array<{ view: Graphics; x: number; y: number; r: number; hit: boolean }> = [];
const crystals: Array<{ view: Graphics; x: number; y: number; taken: boolean }> = [];

const title = new Text({ text: 'VERTEX', style: new TextStyle({ fill: '#f3efe7', fontSize: 24, fontWeight: '700', letterSpacing: 7 }) });
title.position.set(20, 18);
hud.addChild(title);
const flowText = new Text({ text: '', style: new TextStyle({ fill: '#d7ece8', fontSize: 14, fontWeight: '600' }) });
flowText.position.set(20, 60);
hud.addChild(flowText);
const scoreText = new Text({ text: '', style: new TextStyle({ fill: '#9fc5c2', fontSize: 12 }) });
scoreText.position.set(20, 82);
hud.addChild(scoreText);
const helpText = new Text({ text: 'SWIPE / A D  ·  DASH', style: new TextStyle({ fill: '#9fc5c2', fontSize: 11, letterSpacing: 1 }) });
helpText.anchor.set(0.5);
helpText.position.set(LOGICAL_W / 2, LOGICAL_H - 24);
hud.addChild(helpText);
const overText = new Text({ text: '', style: new TextStyle({ fill: '#fff7ee', fontSize: 22, fontWeight: '700', align: 'center' }) });
overText.anchor.set(0.5);
overText.position.set(LOGICAL_W / 2, LOGICAL_H / 2);
hud.addChild(overText);

let state: GameState = createInitialState();
let worldOffset = 0;
let lastSpawnY = 560;
let pointerStartX = 0;
let pointerStartY = 0;
let invulnerable = 0;

function drawBackground() {
  bg.clear();
  bg.rect(0, 0, LOGICAL_W, LOGICAL_H).fill('#10262a');
  for (let i = 0; i < 8; i++) {
    const x = 18 + i * 51;
    const h = 160 + (i % 3) * 70;
    bg.rect(x, LOGICAL_H - h - 90, 34, h).fill({ color: '#17373a', alpha: 0.65 });
  }
  bg.rect(0, 0, 28, LOGICAL_H).fill({ color: '#0b171a', alpha: 0.9 });
  bg.rect(LOGICAL_W - 28, 0, 28, LOGICAL_H).fill({ color: '#0b171a', alpha: 0.9 });
}

drawBackground();

function makePlatform(x: number, y: number, w: number) {
  const g = new Graphics();
  g.roundRect(-w / 2, -5, w, 10, 3).fill('#24494b');
  g.rect(-w / 2 + 8, -2, w - 16, 2).fill('#82c7bd');
  g.position.set(x, y);
  world.addChild(g);
  platforms.push({ view: g, x, y, w });
}

function makeHazard(x: number, y: number) {
  const g = new Graphics();
  g.circle(0, 0, 14).fill('#253437');
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const x1 = Math.cos(a) * 15;
    const y1 = Math.sin(a) * 15;
    const x2 = Math.cos(a) * 22;
    const y2 = Math.sin(a) * 22;
    g.moveTo(x1, y1).lineTo(x2, y2).stroke({ width: 5, color: '#7e394c' });
  }
  g.circle(0, 0, 4).fill('#e86875');
  g.position.set(x, y);
  world.addChild(g);
  hazards.push({ view: g, x, y, r: 18, hit: false });
}

function makeCrystal(x: number, y: number) {
  const g = new Graphics();
  g.poly([0, -14, 10, 0, 0, 14, -10, 0]).fill('#85d8ce');
  g.poly([0, -8, 5, 0, 0, 8, -5, 0]).fill('#dff5eb');
  g.position.set(x, y);
  world.addChild(g);
  crystals.push({ view: g, x, y, taken: false });
}

function redrawPlayer() {
  player.clear();
  player.poly([-14, 12, 0, -17, 14, 12]).fill('#eee8da');
  player.poly([0, -17, 14, 12, 4, 10]).fill('#172a2d');
  player.circle(-4, -3, 2.3).fill('#10262a');
  player.roundRect(-8, 10, 16, 14, 5).fill('#263c3e');
  player.position.set(state.playerX, state.playerY);
}

function reset() {
  state = createInitialState();
  worldOffset = 0;
  lastSpawnY = 560;
  invulnerable = 0;
  for (const p of platforms) p.view.destroy();
  for (const h of hazards) h.view.destroy();
  for (const c of crystals) c.view.destroy();
  platforms.length = 0;
  hazards.length = 0;
  crystals.length = 0;
  seedWorld();
  overText.text = '';
}

function seedWorld() {
  makePlatform(180, 600, 120);
  for (let i = 0; i < 12; i++) spawnBand();
}

function spawnBand() {
  lastSpawnY -= 92 + Math.random() * 24;
  const lane = [82, 180, 278][Math.floor(Math.random() * 3)];
  makePlatform(lane, lastSpawnY, 70 + Math.random() * 34);
  if (Math.random() < 0.55) makeHazard([82, 180, 278].filter((x) => x !== lane)[Math.floor(Math.random() * 2)], lastSpawnY - 28);
  if (Math.random() < 0.75) makeCrystal(lane, lastSpawnY - 44);
}

function dash(direction: -1 | 1) {
  const before = state.playerX;
  state = applyDash(state, direction);
  if (before !== state.playerX) {
    for (let i = 0; i < 5; i++) {
      const p = new Graphics().circle(0, 0, 3 - i * 0.3).fill({ color: '#f4d78b', alpha: 0.7 - i * 0.1 });
      p.position.set(before + (state.playerX - before) * (i / 5), state.playerY + 8);
      particles.addChild(p);
      setTimeout(() => p.destroy(), 180);
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'ArrowLeft') dash(-1);
  if (e.key === 'd' || e.key === 'ArrowRight') dash(1);
  if (e.key === 'r' && state.gameOver) reset();
});
app.canvas.addEventListener('pointerdown', (e) => {
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  if (state.gameOver) reset();
});
app.canvas.addEventListener('pointerup', (e) => {
  const dx = e.clientX - pointerStartX;
  const dy = e.clientY - pointerStartY;
  if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy)) dash(dx < 0 ? -1 : 1);
});

function resize() {
  const scale = Math.min(innerWidth / LOGICAL_W, innerHeight / LOGICAL_H);
  app.canvas.style.width = `${LOGICAL_W * scale}px`;
  app.canvas.style.height = `${LOGICAL_H * scale}px`;
}
window.addEventListener('resize', resize);
resize();
seedWorld();
redrawPlayer();

app.ticker.add((ticker) => {
  const dt = Math.min(0.033, ticker.deltaMS / 1000);
  if (!state.gameOver) {
    state = tickState(state, dt);
    worldOffset += state.speed * dt;
    invulnerable = Math.max(0, invulnerable - dt);

    for (const p of platforms) p.view.y = p.y + worldOffset;
    for (const h of hazards) h.view.y = h.y + worldOffset;
    for (const c of crystals) c.view.y = c.y + worldOffset;

    while (lastSpawnY + worldOffset > -140) spawnBand();

    for (const c of crystals) {
      if (c.taken) continue;
      const sy = c.y + worldOffset;
      if (Math.abs(state.playerX - c.x) < 24 && Math.abs(state.playerY - sy) < 28) {
        c.taken = true;
        c.view.visible = false;
        state = { ...state, score: state.score + 250, flow: Math.min(12, state.flow + 1.4) };
      }
    }

    if (invulnerable <= 0) {
      for (const h of hazards) {
        const sy = h.y + worldOffset;
        if (!h.hit && Math.hypot(state.playerX - h.x, state.playerY - sy) < 28) {
          h.hit = true;
          invulnerable = 0.9;
          state = applyHit(state);
          break;
        }
      }
    }
  }

  redrawPlayer();
  player.alpha = invulnerable > 0 && Math.floor(invulnerable * 12) % 2 === 0 ? 0.35 : 1;

  abyss.clear();
  const pulse = 16 + Math.sin(state.elapsed * 4) * 7;
  abyss.rect(0, LOGICAL_H - 78, LOGICAL_W, 78).fill({ color: '#842d58', alpha: 0.62 });
  abyss.rect(0, LOGICAL_H - 58 - pulse, LOGICAL_W, 58 + pulse).fill({ color: '#bd3b66', alpha: 0.18 });

  flowText.text = `FLOW  ×${state.flow.toFixed(1)}   ${'◆'.repeat(state.hp)}`;
  scoreText.text = `${Math.floor(state.score).toLocaleString()}   ·   ${state.elapsed.toFixed(1)}s`;
  if (state.gameOver) overText.text = `THE ABYSS CAUGHT YOU\n\nSCORE ${Math.floor(state.score).toLocaleString()}\n\nTAP / R TO RESTART`;
});
