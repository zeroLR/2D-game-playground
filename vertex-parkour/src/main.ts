import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { createApplication } from './bootstrap';
import { applyDash, applyHit, createInitialState, tickState, type GameState } from './domain/gameState';
import {
  Palette,
  createCrystalVisual,
  createEnvironment,
  createHazardVisual,
  createPlatformVisual,
  redrawAbyss,
  redrawPlayer,
  setHazardDanger,
  updateEnvironment,
} from './presentation/visuals';

const LOGICAL_W = 360;
const LOGICAL_H = 720;

async function bootstrap() {
  const app = await createApplication(LOGICAL_W, LOGICAL_H);
  document.querySelector('#app')!.appendChild(app.canvas);

  const root = new Container();
  app.stage.addChild(root);

  const environment = createEnvironment(LOGICAL_W, LOGICAL_H);
  root.addChild(environment.sky, environment.far, environment.mid);

  const world = new Container();
  root.addChild(world);

  const particles = new Container();
  root.addChild(particles);

  const abyss = new Graphics();
  root.addChild(abyss);
  root.addChild(environment.foreground);

  const hud = new Container();
  root.addChild(hud);

  const player = new Graphics();
  world.addChild(player);

  const platforms: Array<{ view: Graphics; x: number; y: number; w: number }> = [];
  const hazards: Array<{ view: Graphics; x: number; y: number; r: number; hit: boolean }> = [];
  const crystals: Array<{ view: Graphics; x: number; y: number; taken: boolean }> = [];

  const title = new Text({
    text: 'VERTEX',
    style: new TextStyle({ fill: '#f3efe7', fontSize: 16, fontWeight: '600', letterSpacing: 6 }),
  });
  title.position.set(22, 20);
  hud.addChild(title);

  const flowLabel = new Text({
    text: 'FLOW',
    style: new TextStyle({ fill: '#a9c8c4', fontSize: 9, fontWeight: '600', letterSpacing: 2 }),
  });
  flowLabel.position.set(22, 50);
  hud.addChild(flowLabel);

  const flowText = new Text({
    text: '',
    style: new TextStyle({ fill: '#f0eadf', fontSize: 19, fontWeight: '600' }),
  });
  flowText.position.set(22, 61);
  hud.addChild(flowText);

  const scoreText = new Text({
    text: '',
    style: new TextStyle({ fill: '#789b99', fontSize: 10, letterSpacing: 0.6 }),
  });
  scoreText.position.set(22, 88);
  hud.addChild(scoreText);

  const hpText = new Text({
    text: '',
    style: new TextStyle({ fill: '#d8e7e2', fontSize: 13, letterSpacing: 4 }),
  });
  hpText.anchor.set(1, 0);
  hpText.position.set(LOGICAL_W - 22, 22);
  hud.addChild(hpText);

  const helpText = new Text({
    text: 'SWIPE  ·  DASH',
    style: new TextStyle({ fill: '#95b4b1', fontSize: 9, letterSpacing: 2.3 }),
  });
  helpText.anchor.set(0.5);
  helpText.position.set(LOGICAL_W / 2, LOGICAL_H - 22);
  hud.addChild(helpText);

  const overText = new Text({
    text: '',
    style: new TextStyle({ fill: '#fff7ee', fontSize: 21, fontWeight: '600', align: 'center', letterSpacing: 1 }),
  });
  overText.anchor.set(0.5);
  overText.position.set(LOGICAL_W / 2, LOGICAL_H / 2 - 20);
  hud.addChild(overText);

  let state: GameState = createInitialState();
  let worldOffset = 0;
  let lastSpawnY = 560;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let invulnerable = 0;
  let dashDirection: -1 | 0 | 1 = 0;
  let dashVisualTime = 0;
  let bandIndex = 0;

  function makePlatform(x: number, y: number, w: number) {
    const view = createPlatformVisual(w);
    view.position.set(x, y);
    world.addChild(view);
    platforms.push({ view, x, y, w });
  }

  function makeHazard(x: number, y: number) {
    const view = createHazardVisual();
    view.position.set(x, y);
    world.addChild(view);
    hazards.push({ view, x, y, r: 16, hit: false });
  }

  function makeCrystal(x: number, y: number) {
    const view = createCrystalVisual();
    view.position.set(x, y);
    world.addChild(view);
    crystals.push({ view, x, y, taken: false });
  }

  function spawnBand() {
    bandIndex += 1;

    // Every fourth band is deliberately sparse to create a visual rest beat.
    const restBand = bandIndex % 4 === 0;
    const spacing = restBand ? 122 + Math.random() * 18 : 92 + Math.random() * 24;
    lastSpawnY -= spacing;

    const lanes = [82, 180, 278] as const;
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    makePlatform(lane, lastSpawnY, restBand ? 68 + Math.random() * 20 : 74 + Math.random() * 38);

    if (!restBand && Math.random() < 0.4) {
      const hazardLanes = lanes.filter((x) => x !== lane);
      makeHazard(hazardLanes[Math.floor(Math.random() * hazardLanes.length)], lastSpawnY - 30);
    }

    // Crystals are less ubiquitous and no longer guaranteed to accompany threat bands.
    if (restBand ? Math.random() < 0.28 : Math.random() < 0.58) {
      makeCrystal(lane, lastSpawnY - 46);
    }
  }

  function seedWorld() {
    makePlatform(180, 602, 122);
    bandIndex = 0;
    for (let i = 0; i < 12; i += 1) spawnBand();
  }

  function reset() {
    state = createInitialState();
    worldOffset = 0;
    lastSpawnY = 560;
    invulnerable = 0;
    dashDirection = 0;
    dashVisualTime = 0;

    for (const p of platforms) p.view.destroy();
    for (const h of hazards) h.view.destroy();
    for (const c of crystals) c.view.destroy();
    platforms.length = 0;
    hazards.length = 0;
    crystals.length = 0;

    seedWorld();
    overText.text = '';
  }

  function dash(direction: -1 | 1) {
    const before = state.playerX;
    state = applyDash(state, direction);
    if (before === state.playerX) return;

    dashDirection = direction;
    dashVisualTime = 0.16;

    for (let i = 0; i < 7; i += 1) {
      const trail = new Graphics();
      const t = i / 7;
      trail.poly([-9, 7, 0, -12, 9, 7]).fill({ color: Palette.cream, alpha: 0.13 * (1 - t) });
      trail.poly([-14, 5, -4, 0, -2, 8]).fill({ color: Palette.teal, alpha: 0.18 * (1 - t) });
      trail.position.set(before + (state.playerX - before) * t, state.playerY + i * 0.8);
      particles.addChild(trail);
      setTimeout(() => trail.destroy(), 110 + i * 18);
    }
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'ArrowLeft') dash(-1);
    if (event.key === 'd' || event.key === 'ArrowRight') dash(1);
    if (event.key === 'r' && state.gameOver) reset();
  });

  app.canvas.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    if (state.gameOver) reset();
  });

  app.canvas.addEventListener('pointerup', (event) => {
    const dx = event.clientX - pointerStartX;
    const dy = event.clientY - pointerStartY;
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

  app.ticker.add((ticker) => {
    const dt = Math.min(0.033, ticker.deltaMS / 1000);

    if (!state.gameOver) {
      state = tickState(state, dt);
      worldOffset += state.speed * dt;
      invulnerable = Math.max(0, invulnerable - dt);
      dashVisualTime = Math.max(0, dashVisualTime - dt);
      if (dashVisualTime <= 0) dashDirection = 0;

      updateEnvironment(environment, worldOffset, state.elapsed, LOGICAL_H);

      for (const p of platforms) p.view.y = p.y + worldOffset;
      for (const h of hazards) {
        const screenY = h.y + worldOffset;
        h.view.y = screenY;
        h.view.rotation += dt * 0.36;
        const distance = Math.hypot(state.playerX - h.x, state.playerY - screenY);
        setHazardDanger(h.view, 1 - Math.min(1, distance / 150));
      }
      for (const c of crystals) {
        c.view.y = c.y + worldOffset + Math.sin(state.elapsed * 2.4 + c.x) * 3;
        c.view.rotation = Math.sin(state.elapsed * 1.3 + c.x) * 0.04;
      }

      while (lastSpawnY + worldOffset > -150) spawnBand();

      for (const crystal of crystals) {
        if (crystal.taken) continue;
        const screenY = crystal.y + worldOffset;
        if (Math.abs(state.playerX - crystal.x) < 24 && Math.abs(state.playerY - screenY) < 30) {
          crystal.taken = true;
          crystal.view.visible = false;
          state = { ...state, score: state.score + 250, flow: Math.min(12, state.flow + 1.4) };
        }
      }

      if (invulnerable <= 0) {
        for (const hazard of hazards) {
          const screenY = hazard.y + worldOffset;
          if (!hazard.hit && Math.hypot(state.playerX - hazard.x, state.playerY - screenY) < 25) {
            hazard.hit = true;
            invulnerable = 0.9;
            state = applyHit(state);
            break;
          }
        }
      }
    }

    redrawPlayer(player, state.playerX, state.playerY, state.elapsed, dashDirection);
    player.alpha = invulnerable > 0 && Math.floor(invulnerable * 12) % 2 === 0 ? 0.35 : 1;
    redrawAbyss(abyss, LOGICAL_W, LOGICAL_H, state.elapsed);

    flowText.text = `×${state.flow.toFixed(1)}`;
    scoreText.text = `${Math.floor(state.score).toLocaleString()}   ·   ${state.elapsed.toFixed(1)}s`;
    hpText.text = '◇'.repeat(state.hp);

    if (state.gameOver) {
      overText.text = `THE ABYSS CAUGHT YOU\n\n${Math.floor(state.score).toLocaleString()}\n\nTAP TO RETURN`;
    }
  });
}

void bootstrap();
