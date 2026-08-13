import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';

const app = new Application();
await app.init({ background: '#05070b', resizeTo: window, antialias: false });
document.querySelector('#app')!.appendChild(app.canvas);

const C = {
  bg: 0x05070b,
  ink: 0x0a0e14,
  deep: 0x0c151c,
  steel: 0x202832,
  steel2: 0x303a46,
  cyan: 0x39e3d2,
  cyanDim: 0x174f50,
  pink: 0xff357f,
  amber: 0xf5b942,
  white: 0xeef4f6,
  muted: 0x78828d,
  red: 0xff5364,
};

const world = new Container();
const far = new Graphics();
const mid = new Graphics();
const ground = new Graphics();
const actors = new Container();
const fx = new Container();
const hud = new Container();
world.addChild(far, mid, ground, actors);
app.stage.addChild(world, fx, hud);

const core = new Graphics();
const player = new Graphics();
actors.addChild(core, player);

const coreTag = new Text({
  text: 'DATA // CORE',
  style: new TextStyle({ fill: C.amber, fontSize: 10, fontWeight: '800', letterSpacing: 2 }),
});
actors.addChild(coreTag);

const state = {
  playerX: 0,
  playerY: 0,
  vy: 0,
  grounded: true,
  credits: 300,
  coreHp: 100,
  wave: 1,
  killed: 0,
  spawned: 0,
  waveSize: 8,
  spawnTimer: 0,
  shootTimer: 0,
  towerMode: 0,
  gameOver: false,
};

const groundY = () => app.renderer.height - (isTouchLayout() ? 42 : 78);
const coreX = () => app.renderer.width - Math.max(110, app.renderer.width * 0.105);
const isTouchLayout = () => matchMedia('(pointer: coarse), (max-width: 1024px)').matches;

function buildSpots() {
  const w = app.renderer.width;
  const start = Math.max(190, w * 0.29);
  const end = Math.max(start + 180, coreX() - 175);
  return Array.from({ length: 4 }, (_, i) => start + ((end - start) * i) / 3);
}

state.playerX = Math.max(90, app.renderer.width * 0.16);

const keys = new Set<string>();
window.addEventListener('keydown', (e) => {
  keys.add(e.code);
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Digit1') state.towerMode = 0;
  if (e.code === 'Digit2') state.towerMode = 1;
  if (e.code === 'KeyB') tryBuild();
  if (e.code === 'KeyR' && state.gameOver) location.reload();
});
window.addEventListener('keyup', (e) => keys.delete(e.code));

interface Enemy {
  g: Graphics;
  hp: number;
  speed: number;
  x: number;
  y: number;
  attack: number;
  heavy: boolean;
}
interface Tower {
  g: Graphics;
  x: number;
  y: number;
  type: 'turret' | 'tesla';
  cooldown: number;
}
interface Bullet {
  g: Graphics;
  x: number;
  y: number;
  vx: number;
  damage: number;
}

const enemies: Enemy[] = [];
const towers: Tower[] = [];
const bullets: Bullet[] = [];
const buildPads = Array.from({ length: 4 }, () => {
  const g = new Graphics();
  ground.addChild(g);
  return g;
});

function drawEnvironment() {
  const w = app.renderer.width;
  const h = app.renderer.height;
  const gy = groundY();

  far.clear().rect(0, 0, w, h).fill(C.bg);
  far.rect(0, 0, w, gy).fill({ color: 0x07171d, alpha: 0.9 });

  const horizon = gy * 0.72;
  for (let i = 0; i < 12; i++) {
    const bw = 90 + ((i * 47) % 100);
    const bh = 110 + ((i * 83) % 190);
    const x = i * (w / 10.5) - 30;
    const y = horizon - bh;
    far.rect(x, y, bw, bh).fill(i % 3 === 0 ? 0x0b1820 : 0x09141b);
    if (i % 3 === 1) far.rect(x + bw * 0.42, y - 45, 8, 45).fill(0x13262d);
    for (let wy = y + 22; wy < horizon - 18; wy += 30) {
      if ((wy + i) % 2 === 0) far.rect(x + 16, wy, 5, 9).fill({ color: C.cyan, alpha: 0.15 });
      if ((wy + i) % 3 === 0) far.rect(x + bw - 25, wy + 7, 4, 7).fill({ color: C.pink, alpha: 0.12 });
    }
  }

  far.moveTo(0, horizon - 24).lineTo(w, horizon - 24).stroke({ color: 0x27424a, width: 3, alpha: 0.32 });
  far.moveTo(0, horizon - 19).lineTo(w, horizon - 19).stroke({ color: 0x121b22, width: 8, alpha: 0.9 });

  mid.clear();
  const blocks = [
    [0.00, 0.22, 0.20, 0.45], [0.23, 0.33, 0.16, 0.34], [0.43, 0.25, 0.18, 0.42],
    [0.66, 0.31, 0.14, 0.36], [0.82, 0.20, 0.18, 0.47],
  ];
  for (let i = 0; i < blocks.length; i++) {
    const [rx, ry, rw, rh] = blocks[i];
    const x = rx * w;
    const y = ry * gy;
    const bw = rw * w;
    const bh = rh * gy;
    mid.rect(x, y, bw, bh).fill({ color: i % 2 ? 0x101820 : 0x0c131a, alpha: 0.96 });
    mid.rect(x + 12, y + 14, Math.max(28, bw * 0.36), 4).fill({ color: i % 2 ? C.amber : C.cyan, alpha: 0.22 });
    for (let wx = x + 24; wx < x + bw - 15; wx += 64) {
      mid.rect(wx, y + 58 + ((wx / 7) % 75), 9, 25).fill({ color: C.cyan, alpha: 0.34 });
    }
  }

  // cables and rails break up the rectangular skyline
  mid.moveTo(0, gy - 150).lineTo(w * 0.35, gy - 126).lineTo(w * 0.62, gy - 158).lineTo(w, gy - 132)
    .stroke({ color: 0x27333a, width: 3, alpha: 0.72 });
  mid.moveTo(w * 0.12, 0).lineTo(w * 0.16, gy - 80).stroke({ color: 0x1e2930, width: 5, alpha: 0.4 });
  mid.moveTo(w * 0.78, 0).lineTo(w * 0.73, gy - 90).stroke({ color: 0x1e2930, width: 4, alpha: 0.35 });

  ground.clear();
  ground.rect(0, gy - 5, w, h - gy + 5).fill(0x0a0d12);
  ground.rect(0, gy - 5, w, 5).fill(0x26323b);
  ground.rect(0, gy, w, 2).fill({ color: C.cyan, alpha: 0.48 });
  for (let x = 20; x < w; x += 150) {
    ground.poly([x, gy + 10, x + 95, gy + 10, x + 78, gy + 20, x + 8, gy + 20]).fill(0x151b22);
    ground.rect(x + 20, gy + 24, 46, 2).fill({ color: C.amber, alpha: 0.18 });
  }

  const spots = buildSpots();
  buildPads.forEach((pad, i) => {
    const x = spots[i];
    const occupied = towers.some((t) => Math.abs(t.x - x) < 18);
    pad.clear()
      .poly([x - 40, gy, x + 40, gy, x + 28, gy - 11, x - 28, gy - 11])
      .fill(occupied ? 0x1a2229 : 0x131a20)
      .stroke({ color: occupied ? C.amber : C.cyanDim, width: 2, alpha: 0.7 });
    if (!occupied) pad.rect(x - 13, gy - 8, 26, 3).fill({ color: C.cyan, alpha: 0.55 });
  });

  drawCore();
  drawPlayer();
}

function drawCore() {
  const gy = groundY();
  const x = coreX();
  const danger = state.coreHp < 35;
  const energy = danger ? C.red : C.cyan;
  core.clear()
    .poly([x - 70, gy, x - 56, gy - 145, x - 37, gy - 166, x + 38, gy - 166, x + 58, gy - 145, x + 72, gy])
    .fill(0x171e27)
    .stroke({ color: 0x38434d, width: 3 })
    .rect(x - 45, gy - 149, 90, 8).fill(C.amber)
    .rect(x - 38, gy - 128, 76, 93).fill(0x091116)
    .circle(x, gy - 83, 36).stroke({ color: energy, width: 8, alpha: 0.95 })
    .circle(x, gy - 83, 19).fill({ color: energy, alpha: 0.16 })
    .circle(x, gy - 83, 7).fill(energy)
    .rect(x - 31, gy - 25, 62, 5).fill({ color: energy, alpha: 0.36 });

  const hpWidth = 88 * (state.coreHp / 100);
  core.rect(x - 44, gy - 184, 88, 5).fill(0x222a31).rect(x - 44, gy - 184, hpWidth, 5).fill(energy);
  coreTag.position.set(x - 42, gy - 202);
}

function drawPlayer() {
  const gy = groundY();
  const y = state.playerY || gy;
  const x = state.playerX;
  player.clear()
    // coat silhouette
    .poly([x - 12, y - 63, x + 12, y - 63, x + 22, y - 31, x + 14, y - 8, x - 18, y - 8, x - 25, y - 31])
    .fill(0x1d2530)
    .poly([x - 24, y - 31, x + 14, y - 28, x + 9, y - 10, x - 20, y - 8])
    .fill(C.pink)
    // head + visor
    .poly([x - 11, y - 78, x + 8, y - 80, x + 14, y - 69, x + 7, y - 58, x - 12, y - 60, x - 17, y - 69])
    .fill(0xe3e9eb)
    .rect(x - 11, y - 71, 24, 5).fill(C.cyan)
    .rect(x + 7, y - 69, 7, 3).fill(C.pink)
    // weapon arm / rifle
    .rect(x + 10, y - 43, 26, 6).fill(0x323d47)
    .rect(x + 34, y - 42, 25, 4).fill(0x525d66)
    .rect(x + 55, y - 41, 10, 2).fill(C.pink)
    .rect(x - 30, y - 42, 16, 5).fill(C.cyan)
    // legs
    .rect(x - 15, y - 9, 9, 13).fill(0x313944)
    .rect(x + 5, y - 9, 9, 13).fill(0x313944)
    .rect(x - 19, y + 2, 13, 4).fill(0x111820)
    .rect(x + 5, y + 2, 15, 4).fill(0x111820);
}

function spawnEnemy() {
  const gy = groundY();
  const g = new Graphics();
  const heavy = state.wave >= 3 && Math.random() < 0.22;
  if (heavy) {
    g.poly([-23, -52, 23, -52, 31, -15, 22, 0, -22, 0, -31, -15]).fill(0x28313a)
      .rect(-28, -37, 56, 9).fill(0x131920)
      .rect(-18, -49, 36, 10).fill(C.pink)
      .circle(-10, -34, 4).fill(C.red).circle(10, -34, 4).fill(C.red)
      .rect(-31, -14, 9, 17).fill(0x3b454e).rect(22, -14, 9, 17).fill(0x3b454e);
  } else {
    g.poly([-12, -44, 10, -44, 17, -36, 13, -25, -13, -25, -17, -35]).fill(0xd9e0e3)
      .rect(-13, -38, 28, 5).fill(0x1a2027)
      .rect(-8, -37, 5, 4).fill(C.pink).rect(5, -37, 5, 4).fill(C.pink)
      .poly([-15, -24, 15, -24, 19, -5, 10, 0, -10, 0, -19, -5]).fill(0x29323b)
      .rect(-13, -18, 26, 5).fill({ color: C.pink, alpha: 0.85 });
  }
  g.position.set(-45, gy);
  actors.addChild(g);
  enemies.push({ g, hp: heavy ? 80 : 38, speed: heavy ? 30 : 47 + state.wave * 2, x: -45, y: gy, attack: heavy ? 18 : 9, heavy });
  state.spawned++;
}

function shoot(x: number, y: number, damage = 22, speed = 640) {
  const g = new Graphics().rect(-7, -2, 18, 4).fill(C.pink).rect(-4, -1, 12, 2).fill(C.white);
  g.position.set(x, y);
  fx.addChild(g);
  bullets.push({ g, x, y, vx: speed, damage });
}

function drawTower(g: Graphics, type: Tower['type']) {
  g.clear();
  if (type === 'turret') {
    g.poly([-28, -8, 28, -8, 20, 0, -20, 0]).fill(0x161d24)
      .rect(-19, -38, 38, 30).fill(0x25303a)
      .poly([-14, -47, 11, -47, 19, -38, -19, -38]).fill(C.cyan)
      .rect(4, -43, 34, 7).fill(0x48545f)
      .rect(35, -42, 18, 4).fill(0x707983)
      .rect(-12, -17, 24, 4).fill(C.amber);
  } else {
    g.poly([-29, -8, 29, -8, 20, 0, -20, 0]).fill(0x161d24)
      .rect(-18, -31, 36, 23).fill(0x26313a)
      .moveTo(-20, -31).lineTo(0, -58).lineTo(20, -31).stroke({ color: C.cyan, width: 4 })
      .circle(0, -48, 11).stroke({ color: C.cyan, width: 5 })
      .circle(0, -48, 3).fill(C.white)
      .rect(-13, -16, 26, 4).fill(C.pink);
  }
}

function tryBuild() {
  const types: Tower['type'][] = ['turret', 'tesla'];
  const costs = [120, 180];
  const type = types[state.towerMode];
  const cost = costs[state.towerMode];
  if (state.credits < cost) return flashMessage('CREDITS // INSUFFICIENT', C.red);
  const spot = buildSpots().find((x) => !towers.some((t) => Math.abs(t.x - x) < 20));
  if (!spot) return flashMessage('GRID // OCCUPIED', C.amber);
  state.credits -= cost;
  const g = new Graphics();
  drawTower(g, type);
  g.position.set(spot, groundY());
  actors.addChild(g);
  towers.push({ g, x: spot, y: groundY(), type, cooldown: 0 });
  flashMessage(type === 'turret' ? 'TURRET // ONLINE' : 'TESLA // ONLINE', C.cyan);
}

function flashMessage(message: string, color: number) {
  const t = new Text({ text: message, style: new TextStyle({ fill: color, fontSize: 14, fontWeight: '900', letterSpacing: 2 }) });
  t.anchor.set(0.5);
  t.position.set(app.renderer.width / 2, 92);
  hud.addChild(t);
  let life = 1.1;
  app.ticker.add(function fade(ticker) {
    life -= ticker.deltaMS / 1000;
    t.alpha = Math.min(1, Math.max(0, life / 0.3));
    if (life <= 0) { t.destroy(); app.ticker.remove(fade); }
  });
}

function updatePlayer(dt: number) {
  const speed = 260;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) state.playerX -= speed * dt;
  if (keys.has('KeyD') || keys.has('ArrowRight')) state.playerX += speed * dt;
  state.playerX = Math.max(55, Math.min(coreX() - 95, state.playerX));
  const gy = groundY();
  if ((keys.has('KeyW') || keys.has('ArrowUp') || keys.has('Space')) && state.grounded) {
    state.vy = -420; state.grounded = false;
  }
  if (!state.grounded) {
    state.vy += 980 * dt; state.playerY += state.vy * dt;
    if (state.playerY >= gy) { state.playerY = gy; state.vy = 0; state.grounded = true; }
  } else state.playerY = gy;
  if ((keys.has('KeyJ') || keys.has('KeyK')) && state.shootTimer <= 0) {
    shoot(state.playerX + 62, state.playerY - 40, 24); state.shootTimer = 0.16;
  }
  state.shootTimer -= dt;
}

function updateEnemies(dt: number) {
  const gy = groundY();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.x += e.speed * dt; e.g.position.set(e.x, gy);
    if (e.x > coreX() - 72) { state.coreHp -= e.attack * dt; e.x -= 8 * dt; }
    if (e.hp <= 0) {
      state.credits += 28; state.killed++; e.g.destroy(); enemies.splice(i, 1);
    }
  }
}

function updateBullets(dt: number) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt; b.g.position.x = b.x;
    let hit = false;
    for (const e of enemies) {
      if (Math.abs(e.x - b.x) < (e.heavy ? 30 : 20) && Math.abs((e.y - 27) - b.y) < 38) { e.hp -= b.damage; hit = true; break; }
    }
    if (hit || b.x > app.renderer.width + 40) { b.g.destroy(); bullets.splice(i, 1); }
  }
}

function updateTowers(dt: number) {
  for (const tower of towers) {
    tower.y = groundY(); tower.g.position.y = tower.y; tower.cooldown -= dt;
    const target = enemies.find((e) => e.x > tower.x && e.x - tower.x < (tower.type === 'turret' ? 360 : 230));
    if (!target || tower.cooldown > 0) continue;
    if (tower.type === 'turret') {
      shoot(tower.x + 50, tower.y - 40, 17, 760); tower.cooldown = 0.52;
    } else {
      target.hp -= 28;
      const arc = new Graphics().moveTo(tower.x, tower.y - 48)
        .lineTo((tower.x + target.x) / 2, tower.y - 92)
        .lineTo(target.x, target.y - 30)
        .stroke({ color: C.cyan, width: 3, alpha: 0.9 });
      fx.addChild(arc); setTimeout(() => arc.destroy(), 90); tower.cooldown = 0.85;
    }
  }
}

function updateWave(dt: number) {
  if (state.gameOver) return;
  state.spawnTimer -= dt;
  if (state.spawned < state.waveSize && state.spawnTimer <= 0) {
    spawnEnemy(); state.spawnTimer = Math.max(0.42, 1.25 - state.wave * 0.08);
  }
  if (state.spawned >= state.waveSize && enemies.length === 0) {
    state.wave++; state.waveSize = Math.min(18, 7 + state.wave * 2); state.spawned = 0; state.killed = 0;
    state.credits += 100; state.spawnTimer = 2; flashMessage(`WAVE ${state.wave} // INCOMING`, C.pink);
  }
  if (state.coreHp <= 0) { state.coreHp = 0; state.gameOver = true; flashMessage('CORE // BREACHED // PRESS R', C.red); }
}

function panel(x: number, y: number, w: number, h: number) {
  return new Graphics().roundRect(x, y, w, h, 5).fill({ color: 0x0b1016, alpha: 0.86 }).stroke({ color: 0x313b45, width: 1, alpha: 0.8 });
}

function drawHud() {
  hud.removeChildren();
  const w = app.renderer.width;
  const compact = isTouchLayout();
  const margin = compact ? 10 : 18;
  const topH = compact ? 52 : 60;
  hud.addChild(panel(margin, margin, w - margin * 2, topH));

  const title = new Text({ text: compact ? 'NEON//SIEGE' : 'NEON // SIEGE', style: new TextStyle({ fill: C.white, fontSize: compact ? 16 : 22, fontWeight: '900', letterSpacing: 2 }) });
  title.position.set(margin + 16, margin + 10); hud.addChild(title);

  const wave = new Text({ text: `W${state.wave}  HOSTILES ${Math.max(0, state.waveSize - state.killed)}`, style: new TextStyle({ fill: C.white, fontSize: compact ? 10 : 12, fontWeight: '800' }) });
  wave.position.set(compact ? w * 0.38 : 250, margin + 10); hud.addChild(wave);

  const barX = compact ? w * 0.38 : 250;
  const barY = margin + 34;
  const barW = compact ? Math.max(100, w * 0.28) : 320;
  const hp = Math.max(0, state.coreHp / 100);
  const bar = new Graphics().roundRect(barX, barY, barW, 6, 3).fill(0x252d35)
    .roundRect(barX, barY, barW * hp, 6, 3).fill(state.coreHp < 35 ? C.red : C.cyan);
  hud.addChild(bar);

  const cash = new Text({ text: `$${Math.floor(state.credits)}`, style: new TextStyle({ fill: C.amber, fontSize: compact ? 16 : 20, fontWeight: '900' }) });
  cash.anchor.set(1, 0); cash.position.set(w - margin - 15, margin + 10); hud.addChild(cash);

  if (!compact) {
    const y = app.renderer.height - 56;
    const strip = panel(18, y, 510, 38); hud.addChild(strip);
    const tower = state.towerMode === 0 ? '1  TURRET $120' : '2  TESLA $180';
    const txt = new Text({ text: `${tower}    B BUILD     A/D MOVE   SPACE JUMP   J FIRE`, style: new TextStyle({ fill: C.muted, fontSize: 11, fontWeight: '800' }) });
    txt.position.set(32, y + 13); hud.addChild(txt);
  }
}

app.ticker.add((ticker) => {
  const dt = Math.min(0.033, ticker.deltaMS / 1000);
  if (!state.gameOver) {
    updatePlayer(dt); updateEnemies(dt); updateBullets(dt); updateTowers(dt); updateWave(dt);
  }
  drawEnvironment(); drawHud();
});

window.addEventListener('resize', () => {
  state.playerX = Math.min(state.playerX, coreX() - 95);
});

drawEnvironment();
flashMessage('SECTOR 07 // LINK ESTABLISHED', C.cyan);
