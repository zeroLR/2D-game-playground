import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';

const app = new Application();
await app.init({
  background: '#080a0f',
  resizeTo: window,
  antialias: false,
});

document.querySelector('#app')!.appendChild(app.canvas);

const COLORS = {
  bg: 0x080a0f,
  panel: 0x11141b,
  panel2: 0x1a1e27,
  cyan: 0x37e6d4,
  pink: 0xff2c7d,
  yellow: 0xffc928,
  white: 0xf3f5f7,
  muted: 0x77808f,
  red: 0xff4f61,
};

const world = new Container();
const fx = new Container();
const hud = new Container();
app.stage.addChild(world, fx, hud);

const titleStyle = new TextStyle({ fill: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: 2 });
const smallStyle = new TextStyle({ fill: COLORS.white, fontSize: 12, fontWeight: '700' });
const tinyStyle = new TextStyle({ fill: COLORS.muted, fontSize: 10, fontWeight: '600' });

const state = {
  playerX: 720,
  playerY: 0,
  vy: 0,
  grounded: true,
  hp: 100,
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

const groundY = () => app.renderer.height - 110;
const coreX = () => app.renderer.width - 170;

const keys = new Set<string>();
window.addEventListener('keydown', (e) => {
  keys.add(e.code);
  if (['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code)) e.preventDefault();
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

const backdrop = new Graphics();
world.addChild(backdrop);
const skyline = new Graphics();
world.addChild(skyline);

const core = new Graphics();
world.addChild(core);

const player = new Graphics();
world.addChild(player);

const buildPads: Graphics[] = [];
for (let i = 0; i < 4; i++) {
  const pad = new Graphics();
  buildPads.push(pad);
  world.addChild(pad);
}

function drawScene() {
  const w = app.renderer.width;
  const h = app.renderer.height;
  const gy = groundY();

  backdrop.clear()
    .rect(0, 0, w, h).fill(COLORS.bg)
    .rect(0, 0, w, h * 0.58).fill({ color: 0x0b2229, alpha: 0.72 })
    .rect(0, h * 0.58, w, h * 0.22).fill({ color: 0x10272b, alpha: 0.9 });

  skyline.clear();
  const buildings = [
    [0, 120, 170, 360], [150, 210, 120, 270], [260, 150, 190, 330],
    [440, 235, 120, 245], [550, 90, 230, 390], [760, 180, 160, 300],
    [900, 130, 200, 350], [1080, 220, 120, 260], [1180, 110, 230, 370],
  ];
  for (const [x,y,bw,bh] of buildings) {
    skyline.rect(x, y, bw, bh).fill({ color: 0x0e161d, alpha: 0.95 });
    for (let wx = x + 16; wx < x + bw - 8; wx += 28) {
      for (let wy = y + 18; wy < y + bh - 10; wy += 28) {
        if ((wx + wy) % 3 === 0) skyline.rect(wx, wy, 7, 13).fill({ color: COLORS.cyan, alpha: 0.45 });
        if ((wx + wy) % 5 === 0) skyline.rect(wx + 8, wy, 5, 9).fill({ color: COLORS.pink, alpha: 0.38 });
      }
    }
  }
  skyline.rect(0, gy, w, h - gy).fill(0x101318);
  skyline.rect(0, gy, w, 5).fill(COLORS.pink);
  skyline.rect(0, gy + 8, w, 3).fill({ color: COLORS.cyan, alpha: 0.65 });
  skyline.moveTo(0, gy - 38).lineTo(w, gy - 38).stroke({ color: 0x24454f, width: 2, alpha: 0.5 });

  for (let i = 0; i < buildPads.length; i++) {
    const x = 280 + i * 150;
    buildPads[i].clear()
      .roundRect(x - 38, gy - 8, 76, 12, 4).fill(0x222833)
      .rect(x - 26, gy - 16, 52, 4).fill({ color: COLORS.cyan, alpha: 0.5 });
  }

  core.clear()
    .roundRect(coreX() - 55, gy - 120, 110, 120, 8).fill(0x202630)
    .roundRect(coreX() - 34, gy - 82, 68, 60, 12).fill(0x0c171b)
    .circle(coreX(), gy - 52, 22).fill(COLORS.cyan)
    .circle(coreX(), gy - 52, 12).fill(0x09242b)
    .rect(coreX() - 46, gy - 112, 92, 10).fill(COLORS.yellow);

  drawPlayer();
}

function drawPlayer() {
  const gy = groundY();
  const y = state.playerY || gy;
  player.clear()
    .circle(state.playerX, y - 45, 12).fill(COLORS.white)
    .rect(state.playerX - 9, y - 34, 18, 28).fill(0x22252c)
    .polygon([state.playerX - 12, y - 31, state.playerX + 16, y - 28, state.playerX + 11, y - 8, state.playerX - 14, y - 6]).fill(COLORS.pink)
    .rect(state.playerX - 22, y - 29, 15, 5).fill(COLORS.cyan)
    .rect(state.playerX + 6, y - 25, 29, 6).fill(0x444b56)
    .rect(state.playerX + 29, y - 24, 10, 3).fill(COLORS.pink)
    .rect(state.playerX - 10, y - 8, 7, 17).fill(0x3f434c)
    .rect(state.playerX + 4, y - 8, 7, 17).fill(0x3f434c);
}

function spawnEnemy() {
  const gy = groundY();
  const g = new Graphics();
  const elite = state.wave >= 3 && Math.random() < 0.22;
  g.circle(0, -28, elite ? 15 : 11).fill(0xe7e7ea)
    .rect(elite ? -16 : -12, -18, elite ? 32 : 24, elite ? 30 : 23).fill(0x292c33)
    .rect(elite ? -14 : -10, -13, elite ? 28 : 20, 6).fill(COLORS.pink)
    .circle(-4, -28, 3).fill(COLORS.pink)
    .circle(5, -28, 3).fill(COLORS.pink);
  g.position.set(-30, gy);
  world.addChild(g);
  enemies.push({ g, hp: elite ? 80 : 38, speed: elite ? 30 : 47 + state.wave * 2, x: -30, y: gy, attack: elite ? 18 : 9 });
  state.spawned++;
}

function shoot(x: number, y: number, damage = 22, speed = 640) {
  const g = new Graphics().rect(-5, -2, 12, 4).fill(COLORS.pink);
  g.position.set(x, y);
  fx.addChild(g);
  bullets.push({ g, x, y, vx: speed, damage });
}

function tryBuild() {
  const types: Tower['type'][] = ['turret', 'tesla'];
  const costs = [120, 180];
  const type = types[state.towerMode];
  const cost = costs[state.towerMode];
  if (state.credits < cost) return flashMessage('INSUFFICIENT CREDITS', COLORS.red);

  const spots = [280, 430, 580, 730];
  const spot = spots.find((x) => !towers.some((t) => Math.abs(t.x - x) < 20));
  if (!spot) return flashMessage('ALL NODES OCCUPIED', COLORS.yellow);
  state.credits -= cost;
  const g = new Graphics();
  const gy = groundY();
  if (type === 'turret') {
    g.rect(-17, -29, 34, 26).fill(0x2d333d)
      .rect(-9, -39, 27, 10).fill(COLORS.cyan)
      .rect(13, -36, 30, 5).fill(0x4b525d)
      .rect(-11, -3, 22, 6).fill(COLORS.yellow);
  } else {
    g.rect(-15, -27, 30, 24).fill(0x262b34)
      .circle(0, -34, 11).fill(COLORS.cyan)
      .circle(0, -34, 5).fill(0x11161d)
      .rect(-18, -3, 36, 5).fill(COLORS.pink);
  }
  g.position.set(spot, gy);
  world.addChild(g);
  towers.push({ g, x: spot, y: gy, type, cooldown: 0 });
  flashMessage(type === 'turret' ? 'AUTO TURRET ONLINE' : 'TESLA NODE ONLINE', COLORS.cyan);
}

function flashMessage(message: string, color: number) {
  const t = new Text({ text: message, style: new TextStyle({ fill: color, fontSize: 18, fontWeight: '900', letterSpacing: 2 }) });
  t.anchor.set(0.5);
  t.position.set(app.renderer.width / 2, 95);
  hud.addChild(t);
  let life = 1.3;
  app.ticker.add(function fade(ticker) {
    life -= ticker.deltaMS / 1000;
    t.alpha = Math.max(0, life / 0.4);
    if (life <= 0) { hud.removeChild(t); app.ticker.remove(fade); }
  });
}

function updatePlayer(dt: number) {
  const speed = 260;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) state.playerX -= speed * dt;
  if (keys.has('KeyD') || keys.has('ArrowRight')) state.playerX += speed * dt;
  state.playerX = Math.max(70, Math.min(coreX() - 90, state.playerX));

  const gy = groundY();
  if ((keys.has('KeyW') || keys.has('ArrowUp') || keys.has('Space')) && state.grounded) {
    state.vy = -420;
    state.grounded = false;
  }
  if (!state.grounded) {
    state.vy += 980 * dt;
    state.playerY += state.vy * dt;
    if (state.playerY >= gy) { state.playerY = gy; state.vy = 0; state.grounded = true; }
  } else state.playerY = gy;

  if ((keys.has('KeyJ') || keys.has('KeyK')) && state.shootTimer <= 0) {
    shoot(state.playerX + 36, state.playerY - 24, 24);
    state.shootTimer = 0.16;
  }
  state.shootTimer -= dt;
  drawPlayer();
}

function updateEnemies(dt: number) {
  const gy = groundY();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.x += e.speed * dt;
    e.g.position.x = e.x;
    e.g.position.y = gy;
    if (e.x > coreX() - 65) {
      state.coreHp -= e.attack * dt;
      e.x -= 8 * dt;
    }
    if (e.hp <= 0) {
      state.credits += 28;
      state.killed++;
      e.g.destroy();
      enemies.splice(i, 1);
    }
  }
}

function updateBullets(dt: number) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.g.position.x = b.x;
    let hit = false;
    for (const e of enemies) {
      if (Math.abs(e.x - b.x) < 18 && Math.abs((e.y - 22) - b.y) < 34) {
        e.hp -= b.damage;
        hit = true;
        break;
      }
    }
    if (hit || b.x > app.renderer.width + 40) {
      b.g.destroy();
      bullets.splice(i, 1);
    }
  }
}

function updateTowers(dt: number) {
  for (const tower of towers) {
    tower.cooldown -= dt;
    const target = enemies.find((e) => e.x > tower.x && e.x - tower.x < (tower.type === 'turret' ? 360 : 230));
    if (!target || tower.cooldown > 0) continue;
    if (tower.type === 'turret') {
      shoot(tower.x + 38, tower.y - 34, 17, 760);
      tower.cooldown = 0.52;
    } else {
      target.hp -= 28;
      const arc = new Graphics();
      arc.moveTo(tower.x, tower.y - 34)
        .lineTo((tower.x + target.x) / 2, tower.y - 82)
        .lineTo(target.x, target.y - 24)
        .stroke({ color: COLORS.cyan, width: 3, alpha: 0.9 });
      fx.addChild(arc);
      setTimeout(() => arc.destroy(), 90);
      tower.cooldown = 0.85;
    }
  }
}

function updateWave(dt: number) {
  if (state.gameOver) return;
  state.spawnTimer -= dt;
  if (state.spawned < state.waveSize && state.spawnTimer <= 0) {
    spawnEnemy();
    state.spawnTimer = Math.max(0.42, 1.25 - state.wave * 0.08);
  }
  if (state.spawned >= state.waveSize && enemies.length === 0) {
    state.wave++;
    state.waveSize = Math.min(18, 7 + state.wave * 2);
    state.spawned = 0;
    state.killed = 0;
    state.credits += 100;
    state.spawnTimer = 2.0;
    flashMessage(`WAVE ${state.wave} // INCOMING`, COLORS.pink);
  }
  if (state.coreHp <= 0) {
    state.coreHp = 0;
    state.gameOver = true;
    flashMessage('CORE BREACHED // PRESS R', COLORS.red);
  }
}

function panel(x: number, y: number, w: number, h: number) {
  return new Graphics().roundRect(x, y, w, h, 6).fill({ color: COLORS.panel, alpha: 0.92 }).stroke({ color: 0x353a46, width: 1 });
}

function drawHud() {
  hud.removeChildren();
  const w = app.renderer.width;

  const top = panel(18, 16, w - 36, 58);
  hud.addChild(top);
  const title = new Text({ text: 'NEON SIEGE', style: titleStyle });
  title.position.set(34, 28);
  hud.addChild(title);

  const wave = new Text({ text: `WAVE ${state.wave}  //  HOSTILES ${Math.max(0, state.waveSize - state.killed)}`, style: smallStyle });
  wave.position.set(230, 28);
  hud.addChild(wave);

  const coreLabel = new Text({ text: 'CORE', style: tinyStyle });
  coreLabel.position.set(230, 49);
  hud.addChild(coreLabel);
  const coreBar = new Graphics().roundRect(270, 50, 240, 8, 4).fill(0x272c34)
    .roundRect(270, 50, 240 * (state.coreHp / 100), 8, 4).fill(state.coreHp > 30 ? COLORS.cyan : COLORS.red);
  hud.addChild(coreBar);

  const cash = new Text({ text: `$ ${Math.floor(state.credits)}`, style: new TextStyle({ fill: COLORS.white, fontSize: 22, fontWeight: '900' }) });
  cash.anchor.set(1, 0);
  cash.position.set(w - 36, 28);
  hud.addChild(cash);

  const build = panel(18, app.renderer.height - 92, 480, 74);
  hud.addChild(build);
  const buildTitle = new Text({ text: 'BUILD TOWER', style: new TextStyle({ fill: COLORS.pink, fontSize: 13, fontWeight: '900', letterSpacing: 1 }) });
  buildTitle.position.set(30, app.renderer.height - 82);
  hud.addChild(buildTitle);

  const options = [
    ['1', 'AUTO TURRET', '$120', COLORS.cyan],
    ['2', 'TESLA NODE', '$180', COLORS.pink],
  ] as const;
  options.forEach(([key,name,cost,color], i) => {
    const x = 31 + i * 190;
    const selected = state.towerMode === i;
    const box = new Graphics().roundRect(x, app.renderer.height - 58, 178, 31, 4)
      .fill(selected ? 0x253039 : COLORS.panel2)
      .stroke({ color: selected ? color : 0x434955, width: selected ? 2 : 1 });
    hud.addChild(box);
    const t = new Text({ text: `${key}  ${name}  ${cost}`, style: new TextStyle({ fill: COLORS.white, fontSize: 11, fontWeight: '800' }) });
    t.position.set(x + 9, app.renderer.height - 50);
    hud.addChild(t);
  });

  const controls = panel(w - 390, app.renderer.height - 92, 372, 74);
  hud.addChild(controls);
  const c = new Text({ text: 'A/D MOVE   W/SPACE JUMP   J SHOOT   B BUILD', style: new TextStyle({ fill: COLORS.white, fontSize: 11, fontWeight: '700' }) });
  c.position.set(w - 374, app.renderer.height - 62);
  hud.addChild(c);
  const hint = new Text({ text: 'Protect the CORE. Rotate between gunplay and infrastructure.', style: tinyStyle });
  hint.position.set(w - 374, app.renderer.height - 40);
  hud.addChild(hint);
}

app.ticker.add((ticker) => {
  const dt = Math.min(0.033, ticker.deltaMS / 1000);
  if (!state.gameOver) {
    updatePlayer(dt);
    updateEnemies(dt);
    updateBullets(dt);
    updateTowers(dt);
    updateWave(dt);
  }
  drawScene();
  drawHud();
});

window.addEventListener('resize', drawScene);
drawScene();
flashMessage('SYSTEM ONLINE // DEFEND THE CORE', COLORS.cyan);
