import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BALANCE } from './content/balance';
import { createInitialGameState, type EnemyModel, type Facing, type ProjectileModel, type TowerModel, type TowerType } from './domain/models';
import { KeyboardInput } from './input/KeyboardInput';
import { CombatFeedback } from './presentation/CombatFeedback';
import { buildSpots, coreX, groundY, isTouchLayout } from './presentation/layout';
import { COLORS as C } from './presentation/theme';

interface Enemy extends EnemyModel { g: Graphics; flash: number; knockback: number; }
interface Tower extends TowerModel { g: Graphics; }
interface Bullet extends ProjectileModel { g: Graphics; direction: Facing; }

const app = new Application();
await app.init({ background: '#05070b', resizeTo: window, antialias: false });
document.querySelector('#app')!.appendChild(app.canvas);

const world = new Container();
const far = new Graphics();
const mid = new Graphics();
const ground = new Graphics();
const actors = new Container();
const fx = new Container();
const hud = new Container();
const alerts = new Container();
world.addChild(far, mid, ground, actors);
app.stage.addChild(world, fx, hud, alerts);

const core = new Graphics();
const player = new Graphics();
const coreTag = new Text({ text: 'DATA // CORE', style: new TextStyle({ fill: C.amber, fontSize: 10, fontWeight: '800', letterSpacing: 2 }) });
actors.addChild(core, player, coreTag);

const state = createInitialGameState();
state.credits = BALANCE.economy.startingCredits;
state.playerX = Math.max(110, app.renderer.width * 0.52);

const enemies: Enemy[] = [];
const towers: Tower[] = [];
const bullets: Bullet[] = [];
const buildPads = Array.from({ length: 4 }, () => {
  const g = new Graphics();
  ground.addChild(g);
  return g;
});

const feedback = new CombatFeedback(fx, world, app.ticker);
const input = new KeyboardInput({
  selectTower(index) { state.towerMode = index; },
  build() { tryBuild(); },
  restart() { if (state.gameOver) location.reload(); },
});

const gy = () => groundY(app.renderer.height);
const cx = () => coreX(app.renderer.width);
const spots = () => buildSpots(app.renderer.width);

function drawEnvironment() {
  const w = app.renderer.width;
  const h = app.renderer.height;
  const floor = gy();

  far.clear().rect(0, 0, w, h).fill(C.bg).rect(0, 0, w, floor).fill({ color: 0x07171d, alpha: 0.9 });
  const horizon = floor * 0.72;
  for (let i = 0; i < 12; i++) {
    const bw = 90 + ((i * 47) % 100);
    const bh = 110 + ((i * 83) % 190);
    const x = i * (w / 10.5) - 30;
    const y = horizon - bh;
    far.rect(x, y, bw, bh).fill(i % 3 === 0 ? 0x0b1820 : 0x09141b);
    if (i % 3 === 1) far.rect(x + bw * 0.42, y - 45, 8, 45).fill(0x13262d);
    for (let wy = y + 22; wy < horizon - 18; wy += 30) {
      if ((Math.floor(wy) + i) % 2 === 0) far.rect(x + 16, wy, 5, 9).fill({ color: C.cyan, alpha: 0.15 });
      if ((Math.floor(wy) + i) % 3 === 0) far.rect(x + bw - 25, wy + 7, 4, 7).fill({ color: C.pink, alpha: 0.12 });
    }
  }
  far.moveTo(0, horizon - 24).lineTo(w, horizon - 24).stroke({ color: 0x27424a, width: 3, alpha: 0.32 });
  far.moveTo(0, horizon - 19).lineTo(w, horizon - 19).stroke({ color: 0x121b22, width: 8, alpha: 0.9 });

  mid.clear();
  const blocks = [[0, .22, .2, .45], [.23, .33, .16, .34], [.43, .25, .18, .42], [.66, .31, .14, .36], [.82, .2, .18, .47]];
  blocks.forEach(([rx, ry, rw, rh], i) => {
    const x = rx * w; const y = ry * floor; const bw = rw * w; const bh = rh * floor;
    mid.rect(x, y, bw, bh).fill({ color: i % 2 ? 0x101820 : 0x0c131a, alpha: 0.96 });
    mid.rect(x + 12, y + 14, Math.max(28, bw * .36), 4).fill({ color: i % 2 ? C.amber : C.cyan, alpha: .22 });
    for (let wx = x + 24; wx < x + bw - 15; wx += 64) mid.rect(wx, y + 58 + ((wx / 7) % 75), 9, 25).fill({ color: C.cyan, alpha: .34 });
  });
  mid.moveTo(0, floor - 150).lineTo(w * .35, floor - 126).lineTo(w * .62, floor - 158).lineTo(w, floor - 132).stroke({ color: 0x27333a, width: 3, alpha: .72 });

  ground.clear().rect(0, floor - 5, w, h - floor + 5).fill(0x0a0d12).rect(0, floor - 5, w, 5).fill(0x26323b).rect(0, floor, w, 2).fill({ color: C.cyan, alpha: .48 });
  for (let x = 20; x < w; x += 150) {
    ground.poly([x, floor + 10, x + 95, floor + 10, x + 78, floor + 20, x + 8, floor + 20]).fill(0x151b22);
    ground.rect(x + 20, floor + 24, 46, 2).fill({ color: C.amber, alpha: .18 });
  }

  spots().forEach((x, i) => {
    const occupied = towers.some((t) => Math.abs(t.x - x) < 18);
    buildPads[i].clear().poly([x - 40, floor, x + 40, floor, x + 28, floor - 11, x - 28, floor - 11])
      .fill(occupied ? 0x1a2229 : 0x131a20).stroke({ color: occupied ? C.amber : C.cyanDim, width: 2, alpha: .7 });
    if (!occupied) buildPads[i].rect(x - 13, floor - 8, 26, 3).fill({ color: C.cyan, alpha: .55 });
  });

  drawCore();
  drawPlayer();
}

function drawCore() {
  const floor = gy(); const x = cx(); const energy = state.coreHp < 35 ? C.red : C.cyan;
  core.clear().poly([x - 56, floor, x - 45, floor - 117, x - 30, floor - 134, x + 31, floor - 134, x + 47, floor - 117, x + 58, floor])
    .fill(0x171e27).stroke({ color: 0x38434d, width: 3 }).rect(x - 36, floor - 120, 72, 7).fill(C.amber)
    .rect(x - 31, floor - 103, 62, 74).fill(0x091116).circle(x, floor - 67, 29).stroke({ color: energy, width: 7, alpha: .95 })
    .circle(x, floor - 67, 15).fill({ color: energy, alpha: .16 }).circle(x, floor - 67, 6).fill(energy)
    .rect(x - 25, floor - 20, 50, 4).fill({ color: energy, alpha: .36 });
  core.rect(x - 36, floor - 149, 72, 4).fill(0x222a31).rect(x - 36, floor - 149, 72 * state.coreHp / 100, 4).fill(energy);
  coreTag.position.set(x - 34, floor - 166);
}

function drawPlayer() {
  const y = state.playerY || gy(); const x = state.playerX; const d = state.facing;
  player.alpha = state.hitCooldown > 0 && Math.floor(state.hitCooldown * 18) % 2 === 0 ? .45 : 1;
  player.clear().poly([x - 12, y - 63, x + 12, y - 63, x + 22, y - 31, x + 14, y - 8, x - 18, y - 8, x - 25, y - 31]).fill(0x1d2530)
    .poly([x - 24, y - 31, x + 14, y - 28, x + 9, y - 10, x - 20, y - 8]).fill(C.pink)
    .poly([x - 11, y - 78, x + 8, y - 80, x + 14, y - 69, x + 7, y - 58, x - 12, y - 60, x - 17, y - 69]).fill(0xe3e9eb)
    .rect(x - 11, y - 71, 24, 5).fill(C.cyan).rect(d > 0 ? x + 7 : x - 15, y - 69, 7, 3).fill(C.pink)
    .rect(x - 15, y - 9, 9, 13).fill(0x313944).rect(x + 5, y - 9, 9, 13).fill(0x313944);
  if (d > 0) player.rect(x + 10, y - 43, 26, 6).fill(0x323d47).rect(x + 34, y - 42, 25, 4).fill(0x525d66).rect(x + 55, y - 41, 10, 2).fill(C.pink);
  else player.rect(x - 36, y - 43, 26, 6).fill(0x323d47).rect(x - 59, y - 42, 25, 4).fill(0x525d66).rect(x - 65, y - 41, 10, 2).fill(C.pink);
}

function spawnEnemy() {
  const floor = gy(); const g = new Graphics(); const heavy = state.wave >= 3 && Math.random() < .22;
  if (heavy) g.poly([-23, -52, 23, -52, 31, -15, 22, 0, -22, 0, -31, -15]).fill(0x28313a).rect(-18, -49, 36, 10).fill(C.pink).circle(-10, -34, 4).fill(C.red).circle(10, -34, 4).fill(C.red);
  else g.poly([-12, -44, 10, -44, 17, -36, 13, -25, -13, -25, -17, -35]).fill(0xd9e0e3).rect(-13, -38, 28, 5).fill(0x1a2027)
    .rect(-8, -37, 5, 4).fill(C.pink).rect(5, -37, 5, 4).fill(C.pink).poly([-15, -24, 15, -24, 19, -5, 10, 0, -10, 0, -19, -5]).fill(0x29323b);
  g.position.set(-45, floor); actors.addChild(g);
  enemies.push({ g, hp: heavy ? 80 : 38, speed: heavy ? 30 : 47 + state.wave * 2, x: -45, y: floor, attack: heavy ? 18 : 9, heavy, flash: 0, knockback: 0 });
  state.spawned++;
}

function shoot(x: number, y: number, damage = BALANCE.player.bulletDamage, speed = BALANCE.player.bulletSpeed, direction: Facing = 1) {
  const g = new Graphics().rect(-7, -2, 18, 4).fill(C.pink).rect(-4, -1, 12, 2).fill(C.white);
  g.position.set(x, y); if (direction < 0) g.scale.x = -1; fx.addChild(g);
  bullets.push({ g, x, y, vx: speed * direction, damage, direction });
  feedback.muzzle(x, y, direction);
}

function drawTower(g: Graphics, type: TowerType) {
  g.clear();
  if (type === 'turret') g.poly([-28, -8, 28, -8, 20, 0, -20, 0]).fill(0x161d24).rect(-19, -38, 38, 30).fill(0x25303a)
    .poly([-11, -47, 14, -47, 19, -38, -19, -38]).fill(C.cyan).rect(-38, -43, 34, 7).fill(0x48545f).rect(-53, -42, 18, 4).fill(0x707983);
  else g.poly([-29, -8, 29, -8, 20, 0, -20, 0]).fill(0x161d24).rect(-18, -31, 36, 23).fill(0x26313a)
    .moveTo(-20, -31).lineTo(0, -58).lineTo(20, -31).stroke({ color: C.cyan, width: 4 }).circle(0, -48, 11).stroke({ color: C.cyan, width: 5 }).circle(0, -48, 3).fill(C.white);
}

function tryBuild() {
  const types: TowerType[] = ['turret', 'tesla'];
  const costs = [BALANCE.tower.turretCost, BALANCE.tower.teslaCost];
  const type = types[state.towerMode]; const cost = costs[state.towerMode];
  if (state.credits < cost) return flashMessage('CREDITS // INSUFFICIENT', C.red);
  const free = spots().filter((x) => !towers.some((t) => Math.abs(t.x - x) < 20));
  const frontline = free.filter((x) => x < state.playerX - 16).sort((a, b) => Math.abs(a - state.playerX) - Math.abs(b - state.playerX));
  const fallback = [...free].sort((a, b) => Math.abs(a - state.playerX) - Math.abs(b - state.playerX));
  const spot = frontline[0] ?? fallback[0];
  if (spot === undefined) return flashMessage('GRID // OCCUPIED', C.amber);
  state.credits -= cost; const g = new Graphics(); drawTower(g, type); g.position.set(spot, gy()); actors.addChild(g);
  towers.push({ g, x: spot, y: gy(), type, cooldown: 0 });
  flashMessage(frontline[0] !== undefined ? 'FRONTLINE // ONLINE' : 'GRID // FALLBACK', C.cyan);
}

function flashMessage(message: string, color: number) {
  const t = new Text({ text: message, style: new TextStyle({ fill: color, fontSize: 14, fontWeight: '900', letterSpacing: 2 }) });
  t.anchor.set(.5); t.position.set(app.renderer.width / 2, 92); alerts.addChild(t); let life = 1.1;
  const fade = (ticker: typeof app.ticker) => { life -= ticker.deltaMS / 1000; t.alpha = Math.min(1, Math.max(0, life / .3)); t.position.x = app.renderer.width / 2; if (life <= 0) { t.destroy(); app.ticker.remove(fade); } };
  app.ticker.add(fade);
}

function nearestEnemyTo(x: number) { return [...enemies].sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0]; }

function updatePlayer(dt: number) {
  const a = input.actions; state.hitCooldown = Math.max(0, state.hitCooldown - dt);
  if (a.left) { state.playerX -= BALANCE.player.speed * dt; state.facing = -1; }
  if (a.right) { state.playerX += BALANCE.player.speed * dt; state.facing = 1; }
  state.playerX = Math.max(55, Math.min(cx() - 78, state.playerX));
  const floor = gy();
  if (a.jump && state.grounded) { state.vy = BALANCE.player.jumpVelocity; state.grounded = false; }
  if (!state.grounded) { state.vy += BALANCE.player.gravity * dt; state.playerY += state.vy * dt; if (state.playerY >= floor) { state.playerY = floor; state.vy = 0; state.grounded = true; } }
  else state.playerY = floor;
  if (a.fire && state.shootTimer <= 0) {
    const target = nearestEnemyTo(state.playerX); if (target) state.facing = target.x < state.playerX ? -1 : 1;
    shoot(state.playerX + state.facing * 62, state.playerY - 40, BALANCE.player.bulletDamage, BALANCE.player.bulletSpeed, state.facing);
    state.shootTimer = BALANCE.player.shootCooldown;
  }
  state.shootTimer -= dt;
}

function updateEnemies(dt: number) {
  const floor = gy();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.flash = Math.max(0, e.flash - dt); e.g.tint = e.flash > 0 ? C.white : 0xffffff;
    if (Math.abs(e.knockback) > .5) { e.x += e.knockback * dt; e.knockback *= Math.pow(.06, dt); }
    else e.x += e.speed * dt;
    const touching = Math.abs(e.x - state.playerX) < (e.heavy ? 38 : 28) && state.playerY > floor - 54;
    if (touching && state.hitCooldown <= 0) {
      state.playerHp = Math.max(0, state.playerHp - (e.heavy ? 22 : 12)); state.hitCooldown = BALANCE.player.hitInvulnerability;
      const dir: Facing = e.x < state.playerX ? 1 : -1; state.playerX += dir * (e.heavy ? 72 : 50); e.x -= dir * 14;
      feedback.playerHit(); flashMessage(e.heavy ? 'ARMOR // HEAVY IMPACT' : 'ARMOR // HIT', C.red);
    }
    if (e.x > cx() - 58) { state.coreHp -= e.attack * dt; e.x -= 8 * dt; }
    e.g.position.set(e.x, floor);
    if (e.hp <= 0) {
      feedback.death(e.x, floor - 26, e.heavy); state.credits += BALANCE.economy.killReward; state.killed++; e.g.destroy(); enemies.splice(i, 1);
    }
  }
}

function updateBullets(dt: number) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i]; b.x += b.vx * dt; b.g.position.x = b.x;
    if (Math.random() < .38) feedback.trail(b.x, b.y, b.direction);
    let hit = false;
    for (const e of enemies) {
      if (Math.abs(e.x - b.x) < (e.heavy ? 30 : 20) && Math.abs((e.y - 27) - b.y) < 38) {
        e.hp -= b.damage; e.flash = .08; e.knockback = b.direction * (e.heavy ? 65 : 120);
        feedback.hit(e.x, e.y - 28, b.damage, e.heavy); hit = true; break;
      }
    }
    if (hit || b.x > app.renderer.width + 40 || b.x < -40) { b.g.destroy(); bullets.splice(i, 1); }
  }
}

function updateTowers(dt: number) {
  for (const tower of towers) {
    tower.y = gy(); tower.g.position.y = tower.y; tower.cooldown -= dt;
    const primaryRange = tower.type === 'turret' ? BALANCE.tower.turretPrimaryRange : BALANCE.tower.teslaPrimaryRange;
    const emergencyRange = tower.type === 'turret' ? BALANCE.tower.turretEmergencyRange : BALANCE.tower.teslaEmergencyRange;
    const primary = enemies.filter((e) => e.x <= tower.x && tower.x - e.x <= primaryRange).sort((a, b) => b.x - a.x)[0];
    const emergency = enemies.filter((e) => e.x > tower.x && e.x - tower.x <= emergencyRange).sort((a, b) => a.x - b.x)[0];
    const target = primary ?? emergency; if (!target || tower.cooldown > 0) continue;
    const direction: Facing = target.x <= tower.x ? -1 : 1;
    if (tower.type === 'turret') { tower.g.scale.x = direction < 0 ? 1 : -1; shoot(tower.x + direction * 50, tower.y - 40, 17, 760, direction); tower.cooldown = direction < 0 ? .52 : .68; }
    else {
      const damage = direction < 0 ? 28 : 20; target.hp -= damage; target.flash = .08; feedback.hit(target.x, target.y - 28, damage, target.heavy);
      const arc = new Graphics().moveTo(tower.x, tower.y - 48).lineTo((tower.x + target.x) / 2, tower.y - 92).lineTo(target.x, target.y - 30).stroke({ color: C.cyan, width: 3, alpha: direction < 0 ? .9 : .62 });
      fx.addChild(arc); setTimeout(() => arc.destroy(), 90); tower.cooldown = direction < 0 ? .85 : 1.05;
    }
  }
}

function updateWave(dt: number) {
  state.spawnTimer -= dt;
  if (state.spawned < state.waveSize && state.spawnTimer <= 0) { spawnEnemy(); state.spawnTimer = Math.max(.42, 1.25 - state.wave * .08); }
  if (state.spawned >= state.waveSize && enemies.length === 0) { state.wave++; state.waveSize = Math.min(18, 7 + state.wave * 2); state.spawned = 0; state.killed = 0; state.credits += BALANCE.economy.waveReward; state.spawnTimer = 2; flashMessage(`WAVE ${state.wave} // INCOMING`, C.pink); }
  if (state.playerHp <= 0) { state.playerHp = 0; state.gameOver = true; flashMessage('OPERATOR // DOWN // PRESS R', C.red); }
  else if (state.coreHp <= 0) { state.coreHp = 0; state.gameOver = true; flashMessage('CORE // BREACHED // PRESS R', C.red); }
}

function panel(x: number, y: number, w: number, h: number) { return new Graphics().roundRect(x, y, w, h, 5).fill({ color: 0x0b1016, alpha: .86 }).stroke({ color: 0x313b45, width: 1, alpha: .8 }); }

function drawHud() {
  hud.removeChildren(); const w = app.renderer.width; const compact = isTouchLayout(); const margin = compact ? 10 : 18; const topH = compact ? 60 : 68;
  hud.addChild(panel(margin, margin, w - margin * 2, topH));
  const title = new Text({ text: compact ? 'NEON//SIEGE' : 'NEON // SIEGE', style: new TextStyle({ fill: C.white, fontSize: compact ? 16 : 22, fontWeight: '900', letterSpacing: 2 }) }); title.position.set(margin + 16, margin + 10); hud.addChild(title);
  const wave = new Text({ text: `W${state.wave}  HOSTILES ${Math.max(0, state.waveSize - state.killed)}`, style: new TextStyle({ fill: C.white, fontSize: compact ? 10 : 12, fontWeight: '800' }) }); wave.position.set(compact ? w * .38 : 250, margin + 10); hud.addChild(wave);
  const barX = compact ? w * .38 : 250; const barY = margin + 34; const barW = compact ? Math.max(100, w * .28) : 320;
  hud.addChild(new Graphics().roundRect(barX, barY, barW, 6, 3).fill(0x252d35).roundRect(barX, barY, barW * state.coreHp / 100, 6, 3).fill(state.coreHp < 35 ? C.red : C.cyan)
    .roundRect(barX, barY + 11, barW, 3, 2).fill(0x252d35).roundRect(barX, barY + 11, barW * state.playerHp / 100, 3, 2).fill(state.playerHp < 35 ? C.red : C.pink));
  const cash = new Text({ text: `$${Math.floor(state.credits)}`, style: new TextStyle({ fill: C.amber, fontSize: compact ? 16 : 20, fontWeight: '900' }) }); cash.anchor.set(1, 0); cash.position.set(w - margin - 15, margin + 10); hud.addChild(cash);
  if (!compact) { const y = app.renderer.height - 56; hud.addChild(panel(18, y, 565, 38)); const tower = state.towerMode === 0 ? '1 TURRET $120' : '2 TESLA $180'; const txt = new Text({ text: `${tower}    B BUILD FRONTLINE     A/D MOVE   SPACE JUMP   J FIRE`, style: new TextStyle({ fill: C.muted, fontSize: 11, fontWeight: '800' }) }); txt.position.set(32, y + 13); hud.addChild(txt); }
}

app.ticker.add((ticker) => {
  const dt = Math.min(.033, ticker.deltaMS / 1000);
  const frozen = feedback.update(dt);
  if (!state.gameOver && !frozen) { updatePlayer(dt); updateEnemies(dt); updateBullets(dt); updateTowers(dt); updateWave(dt); }
  drawEnvironment(); drawHud();
});

window.addEventListener('resize', () => { state.playerX = Math.min(state.playerX, cx() - 78); });
window.addEventListener('beforeunload', () => input.destroy());

drawEnvironment();
flashMessage('SECTOR 07 // LINK ESTABLISHED', C.cyan);
