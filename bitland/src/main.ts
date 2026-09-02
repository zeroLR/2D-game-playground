import { Application, Container, Graphics, Rectangle, Text } from 'pixi.js';
import { attackEnemy, createEnemy, createPlayerCombatState, enemyContactHit, grantEnemyLoot, startDodgeInvulnerability, tickCombat } from './simulation/combat/combat';
import { createCameraState, stepCamera } from './simulation/player/camera';
import { createLocomotionState, stepLocomotion } from './simulation/player/locomotion';
import { availablePairs, createSynthesisState, synthesize, type Discovery } from './simulation/synthesis/synthesis';
import { createInventory, gatherNode, pushObject, type ResourceNode, type PushableObject } from './simulation/world/resources';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const WORLD_WIDTH = 1920;
const BOOT_TIMEOUT_MS = 5000;
const GROUND_Y = 364;
const PLAYER_MIN_X = 18;
const PLAYER_MAX_X = WORLD_WIDTH - 18;
const INTERACT_RANGE = 72;
const SYNTH_X = 1666;
const WORLD_SEED = 'bitland-alpha';

type Platform = { x: number; y: number; width: number };
const PLATFORMS: Platform[] = [
  { x: 510, y: 310, width: 150 },
  { x: 760, y: 278, width: 130 },
  { x: 1120, y: 325, width: 180 },
  { x: 1420, y: 292, width: 150 },
];
const RESOURCE_NODES: ResourceNode[] = [
  { id: 'matter-1', resource: 'MATTER', amount: 2, x: 340, depleted: false },
  { id: 'life-1', resource: 'LIFE', amount: 2, x: 610, depleted: false },
  { id: 'signal-1', resource: 'SIGNAL', amount: 2, x: 980, depleted: false },
  { id: 'energy-1', resource: 'ENERGY', amount: 2, x: 1370, depleted: false },
];
const CRATE: PushableObject = { id: 'matter-crate', x: 1180, minX: 1070, maxX: 1280 };

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('Missing #app');
const host: HTMLElement = hostElement;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => window.setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs))]);
}

function makeWorld() {
  const world = new Container();
  world.addChild(new Graphics().rect(0, 0, WORLD_WIDTH, LOGICAL_HEIGHT).fill(0x071314));
  const far = new Graphics();
  for (let x = 0; x < WORLD_WIDTH; x += 48) {
    const h = 60 + ((x / 48) % 5) * 18;
    far.rect(x, 270 - h, 34, h).fill(x < 640 ? 0x0c2a2b : x < 1280 ? 0x10263a : 0x30191f);
  }
  world.addChild(far);
  world.addChild(new Graphics().rect(0, 390, WORLD_WIDTH, 150).fill(0x102126).rect(0, 382, 640, 8).fill(0x6ecf78).rect(640, 382, 640, 8).fill(0x59d7ea).rect(1280, 382, 640, 8).fill(0xff7a59));
  const platformGraphics = new Graphics();
  for (const platform of PLATFORMS) platformGraphics.rect(platform.x, platform.y + 18, platform.width, 18).fill(0x102126).rect(platform.x, platform.y + 14, platform.width, 4).fill(0xb8fff4);
  world.addChild(platformGraphics);

  const resourceColors = { MATTER: 0xa9c8b0, ENERGY: 0xffc56b, LIFE: 0x6ecf78, SIGNAL: 0x6be8ff } as const;
  const nodeViews = new Map<string, Graphics>();
  for (const node of RESOURCE_NODES) {
    const view = new Graphics().poly([0, 0, 13, -28, 27, 0]).fill({ color: resourceColors[node.resource], alpha: 0.85 }).circle(13, -13, 5).fill(0x071314);
    view.position.set(node.x, 382); world.addChild(view); nodeViews.set(node.id, view);
  }

  const crateView = new Graphics().rect(-20, -32, 40, 32).fill(0x26342f).rect(-16, -28, 32, 24).stroke({ color: 0xa9c8b0, width: 3 });
  crateView.position.set(CRATE.x, 382); world.addChild(crateView);

  const enemies = [
    createEnemy('crawler-a', 820, { resource: 'LIFE', amount: 1 }),
    createEnemy('crawler-b', 1510, { resource: 'ENERGY', amount: 1 }),
  ];
  const enemyViews = new Map<string, Container>();
  for (const enemy of enemies) {
    const view = new Container();
    view.addChild(new Graphics().poly([-22, 0, -10, -22, 10, -22, 22, 0]).fill(0x172b2c).stroke({ color: 0xffb36b, width: 2 }).circle(-8, -13, 3).fill(0xffb36b).circle(8, -13, 3).fill(0xffb36b));
    const hp = new Graphics(); hp.name = 'hp'; view.addChild(hp);
    view.position.set(enemy.x, 382); world.addChild(view); enemyViews.set(enemy.id, view);
  }

  const synthesisView = new Container();
  synthesisView.position.set(SYNTH_X, 382);
  synthesisView.addChild(new Graphics().rect(-36, -90, 72, 90).fill(0x25171c).rect(-28, -82, 56, 74).stroke({ color: 0xff8b68, width: 3 }).poly([0, -68, 16, -38, -16, -38]).stroke({ color: 0xffa27e, width: 3 }));
  const resultOrb = new Graphics().circle(0, -108, 12).fill({ color: 0xb8fff4, alpha: 0.18 }).circle(0, -108, 12).stroke({ color: 0xb8fff4, width: 2, alpha: 0.35 });
  resultOrb.visible = false;
  synthesisView.addChild(resultOrb);
  world.addChild(synthesisView);

  return { world, nodeViews, crateView, enemies, enemyViews, resultOrb };
}

function makePlayer(): Container {
  const player = new Container();
  player.addChild(new Graphics().rect(-10, -16, 20, 24).fill(0x0c1517).rect(-8, -14, 16, 10).stroke({ color: 0xb8fff4, width: 2 }).rect(-4, -10, 3, 3).fill(0xb8fff4).rect(3, -10, 3, 3).fill(0xb8fff4).rect(-7, 8, 5, 10).fill(0x6ecf78).rect(2, 8, 5, 10).fill(0x6ecf78));
  return player;
}

type MobileInputState = { moveX: number; moveY: number; jumpPressed: boolean; attackPressed: boolean; guardHeld: boolean; dodgePressed: boolean; interactPressed: boolean };
type ActionName = 'JUMP' | 'ATK' | 'GUARD' | 'DODGE' | 'USE';

function makeMobileControls(input: MobileInputState): Container {
  const hud = new Container(); hud.zIndex = 100; hud.sortableChildren = true;
  const padRadius = 62, knobRadius = 25;
  const defaultCenter = { x: 104, y: LOGICAL_HEIGHT - 96 }, activeCenter = { ...defaultCenter };
  const padBase = new Graphics().circle(0, 0, padRadius).fill({ color: 0x071314, alpha: 0.5 }).circle(0, 0, padRadius).stroke({ color: 0x7be6d6, width: 2, alpha: 0.55 });
  padBase.position.set(defaultCenter.x, defaultCenter.y); padBase.eventMode = 'none'; padBase.zIndex = 1; hud.addChild(padBase);
  const knob = new Graphics().circle(0, 0, knobRadius).fill({ color: 0x6ecf78, alpha: 0.28 }).circle(0, 0, knobRadius).stroke({ color: 0xb8fff4, width: 2, alpha: 0.8 });
  knob.position.set(defaultCenter.x, defaultCenter.y); knob.eventMode = 'none'; knob.zIndex = 2; hud.addChild(knob);
  const activationZone = new Graphics().rect(0, LOGICAL_HEIGHT * 0.42, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.58).fill({ color: 0x000000, alpha: 0.001 });
  activationZone.eventMode = 'static'; activationZone.hitArea = new Rectangle(0, LOGICAL_HEIGHT * 0.42, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.58); activationZone.zIndex = 10; hud.addChild(activationZone);
  let padPointerId: number | null = null;
  const setPadCenter = (x: number, y: number) => { activeCenter.x = Math.max(padRadius + 12, Math.min(LOGICAL_WIDTH * 0.5 - padRadius - 12, x)); activeCenter.y = Math.max(LOGICAL_HEIGHT * 0.42 + padRadius + 12, Math.min(LOGICAL_HEIGHT - padRadius - 12, y)); padBase.position.set(activeCenter.x, activeCenter.y); knob.position.set(activeCenter.x, activeCenter.y); };
  const updatePad = (x: number, y: number) => { const dx = x - activeCenter.x, dy = y - activeCenter.y, distance = Math.hypot(dx, dy), clamped = Math.min(distance, padRadius), nx = distance ? dx / distance : 0, ny = distance ? dy / distance : 0; knob.position.set(activeCenter.x + nx * clamped, activeCenter.y + ny * clamped); input.moveX = Math.abs(dx / padRadius) < 0.16 ? 0 : Math.max(-1, Math.min(1, dx / padRadius)); input.moveY = Math.abs(dy / padRadius) < 0.16 ? 0 : Math.max(-1, Math.min(1, dy / padRadius)); };
  const resetPad = () => { padPointerId = null; Object.assign(activeCenter, defaultCenter); padBase.position.set(defaultCenter.x, defaultCenter.y); knob.position.set(defaultCenter.x, defaultCenter.y); input.moveX = 0; input.moveY = 0; };
  activationZone.on('pointerdown', e => { if (padPointerId !== null) return; padPointerId = e.pointerId; setPadCenter(e.global.x, e.global.y); });
  activationZone.on('pointermove', e => { if (padPointerId === e.pointerId) updatePad(e.global.x, e.global.y); });
  for (const eventName of ['pointerup', 'pointerupoutside', 'pointercancel'] as const) activationZone.on(eventName, e => { if (padPointerId === e.pointerId) resetPad(); });

  const makeButton = (name: ActionName, x: number, y: number, radius: number, color: number, press: () => void, release?: () => void) => {
    const button = new Container(); button.position.set(x, y); button.eventMode = 'static'; button.zIndex = 20;
    const ring = new Graphics().circle(0, 0, radius).fill({ color: 0x071314, alpha: 0.52 }).circle(0, 0, radius).stroke({ color, width: 2, alpha: 0.72 }); button.addChild(ring);
    const label = new Text({ text: name, style: { fill: color, fontFamily: 'monospace', fontSize: name === 'JUMP' ? 13 : 10, fontWeight: '700' } }); label.anchor.set(0.5); button.addChild(label);
    button.on('pointerdown', () => { button.scale.set(0.9); press(); }); const up = () => { button.scale.set(1); release?.(); }; button.on('pointerup', up); button.on('pointerupoutside', up); button.on('pointercancel', up); hud.addChild(button);
  };
  makeButton('JUMP', 856, 421, 40, 0xb8fff4, () => { input.jumpPressed = true; });
  makeButton('USE', 780, 420, 34, 0x6ecf78, () => { input.interactPressed = true; });
  makeButton('ATK', 776, 490, 29, 0xffb36b, () => { input.attackPressed = true; });
  makeButton('GUARD', 846, 500, 27, 0x6be8ff, () => { input.guardHeld = true; }, () => { input.guardHeld = false; });
  makeButton('DODGE', 914, 474, 29, 0xd0a6ff, () => { input.dodgePressed = true; });
  return hud;
}

function makeStatusHud() {
  const hud = new Container(); hud.zIndex = 110;
  const title = new Text({ text: 'BITLAND // P1.1 SYNTHESIS NODE', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 18 } }); title.position.set(24, 22); hud.addChild(title);
  const inventoryText = new Text({ text: '', style: { fill: 0xd8fff8, fontFamily: 'monospace', fontSize: 12 } }); inventoryText.position.set(24, 50); hud.addChild(inventoryText);
  const combatText = new Text({ text: '', style: { fill: 0xffd8aa, fontFamily: 'monospace', fontSize: 12 } }); combatText.position.set(24, 72); hud.addChild(combatText);
  const discoveryText = new Text({ text: 'DISCOVERY // none', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 12 } }); discoveryText.position.set(24, 94); hud.addChild(discoveryText);
  const prompt = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' } }); prompt.anchor.set(0.5); prompt.position.set(LOGICAL_WIDTH / 2, 124); hud.addChild(prompt);
  return { hud, inventoryText, combatText, discoveryText, prompt };
}

function landOnPlatforms(previousY: number, locomotion: ReturnType<typeof createLocomotionState>): void {
  if (locomotion.vy < 0) return;
  for (const platform of PLATFORMS) if (locomotion.x >= platform.x - 8 && locomotion.x <= platform.x + platform.width + 8 && previousY <= platform.y && locomotion.y >= platform.y) { locomotion.y = platform.y; locomotion.vy = 0; locomotion.grounded = true; return; }
}

function discoveryLabel(discovery: Discovery): string {
  return `DISCOVERY // ${discovery.displayName}  [${discovery.traits.join(' + ')}]  #${discovery.discoveryIndex + 1}`;
}

async function bootstrap(): Promise<void> {
  console.info('[Bitland] renderer bootstrap started'); const app = new Application();
  try {
    await withTimeout(app.init({ width: LOGICAL_WIDTH, height: LOGICAL_HEIGHT, background: '#071314', antialias: false, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true }), BOOT_TIMEOUT_MS, 'PixiJS renderer initialization');
    host.replaceChildren(app.canvas); app.stage.sortableChildren = true; app.stage.eventMode = 'static'; app.stage.hitArea = app.screen;
    const { world, nodeViews, crateView, enemies, enemyViews, resultOrb } = makeWorld();
    const player = makePlayer(), locomotion = createLocomotionState(180, GROUND_Y), camera = createCameraState(), inventory = createInventory(), combat = createPlayerCombatState(), synthesis = createSynthesisState();
    player.position.set(locomotion.x, locomotion.y); world.addChild(player); app.stage.addChild(world);
    const mobileInput: MobileInputState = { moveX: 0, moveY: 0, jumpPressed: false, attackPressed: false, guardHeld: false, dodgePressed: false, interactPressed: false }; app.stage.addChild(makeMobileControls(mobileInput));
    const status = makeStatusHud(); app.stage.addChild(status.hud);
    const keys = new Set<string>(); let keyboardJump = false, keyboardInteract = false, keyboardAttack = false, dodgeCooldown = 0, hitFlash = 0, attackFlash = 0, discoveryFlash = 0;
    window.addEventListener('keydown', e => { keys.add(e.code); if (e.code === 'Space' && !e.repeat) keyboardJump = true; if (e.code === 'KeyE' && !e.repeat) keyboardInteract = true; if (e.code === 'KeyJ' && !e.repeat) keyboardAttack = true; if (e.code === 'Space') e.preventDefault(); });
    window.addEventListener('keyup', e => keys.delete(e.code));

    app.ticker.add(ticker => {
      const dt = Math.min(ticker.deltaMS / 1000, 0.05); dodgeCooldown = Math.max(0, dodgeCooldown - dt); hitFlash = Math.max(0, hitFlash - dt); attackFlash = Math.max(0, attackFlash - dt); discoveryFlash = Math.max(0, discoveryFlash - dt); tickCombat(combat, enemies, dt);
      const keyboardAxis = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0); const axis = Math.abs(mobileInput.moveX) > 0.01 ? mobileInput.moveX : keyboardAxis; const previousY = locomotion.y;
      const guarding = mobileInput.guardHeld || keys.has('KeyK');
      stepLocomotion(locomotion, { moveX: axis, jumpPressed: mobileInput.jumpPressed || keyboardJump, guardHeld: guarding }, dt, GROUND_Y, PLAYER_MIN_X, PLAYER_MAX_X); mobileInput.jumpPressed = false; keyboardJump = false; landOnPlatforms(previousY, locomotion);

      if ((mobileInput.dodgePressed || keys.has('ShiftLeft')) && dodgeCooldown <= 0 && Math.abs(axis) > 0.1) { locomotion.x = Math.max(PLAYER_MIN_X, Math.min(PLAYER_MAX_X, locomotion.x + Math.sign(axis) * 58)); locomotion.vx = Math.sign(axis) * 260; dodgeCooldown = 0.5; startDodgeInvulnerability(combat); } mobileInput.dodgePressed = false;

      const nearbyNode = RESOURCE_NODES.find(node => !node.depleted && Math.abs(node.x - locomotion.x) <= INTERACT_RANGE);
      const nearCrate = Math.abs(CRATE.x - locomotion.x) <= INTERACT_RANGE;
      const nearSynth = Math.abs(SYNTH_X - locomotion.x) <= INTERACT_RANGE + 10;
      const pairs = availablePairs(inventory);
      const pair = pairs[0];
      status.prompt.text = nearbyNode ? `USE · GATHER ${nearbyNode.resource}` : nearCrate ? 'USE · PUSH OBJECT' : nearSynth ? (pair ? `USE · SYNTH ${pair[0]} + ${pair[1]}` : 'SYNTHESIS · NEED 2 RESOURCE TYPES') : '';

      if (mobileInput.interactPressed || keyboardInteract) {
        if (nearbyNode && gatherNode(nearbyNode, inventory)) nodeViews.get(nearbyNode.id)!.alpha = 0.12;
        else if (nearCrate) pushObject(CRATE, locomotion.x, locomotion.facing, 34);
        else if (nearSynth && pair) {
          const discovery = synthesize(synthesis, inventory, WORLD_SEED, pair[0], pair[1]);
          if (discovery) { status.discoveryText.text = discoveryLabel(discovery); resultOrb.visible = true; discoveryFlash = 0.5; }
        }
      }
      mobileInput.interactPressed = false; keyboardInteract = false; crateView.x = CRATE.x;

      if (mobileInput.attackPressed || keyboardAttack) {
        const target = enemies.filter(enemy => enemy.alive && Math.sign(enemy.x - locomotion.x) === locomotion.facing).sort((a, b) => Math.abs(a.x - locomotion.x) - Math.abs(b.x - locomotion.x))[0];
        if (target && attackEnemy(combat, target, Math.abs(target.x - locomotion.x))) { attackFlash = 0.12; if (!target.alive) grantEnemyLoot(target, inventory); }
      }
      mobileInput.attackPressed = false; keyboardAttack = false;

      for (const enemy of enemies) {
        const view = enemyViews.get(enemy.id)!; view.visible = enemy.alive; if (!enemy.alive) continue;
        const distance = Math.abs(enemy.x - locomotion.x);
        if (distance < 180) enemy.x += Math.sign(locomotion.x - enemy.x) * 34 * dt;
        view.x = enemy.x;
        if (enemyContactHit(combat, enemy, distance, guarding)) hitFlash = 0.16;
        const hpView = view.getChildByName('hp') as Graphics; hpView.clear().rect(-20, -34, 40, 4).fill(0x33191c).rect(-20, -34, 40 * (enemy.hp / enemy.maxHp), 4).fill(0xff7a59);
      }

      resultOrb.alpha = discoveryFlash > 0 ? 1 : 0.55;
      resultOrb.scale.set(discoveryFlash > 0 ? 1.35 : 1);
      status.inventoryText.text = `MAT ${inventory.MATTER}   ENG ${inventory.ENERGY}   LIFE ${inventory.LIFE}   SIG ${inventory.SIGNAL}`;
      status.combatText.text = `HP ${'■'.repeat(combat.hp)}${'□'.repeat(combat.maxHp - combat.hp)}   ATK / GUARD / DODGE`;
      player.position.set(locomotion.x, locomotion.y); player.scale.x = locomotion.facing; player.scale.y = attackFlash > 0 ? 1.1 : 1; player.alpha = hitFlash > 0 ? 0.35 : guarding ? 0.72 : 1;
      stepCamera(camera, locomotion.x, locomotion.vx, dt, { viewportWidth: LOGICAL_WIDTH, worldWidth: WORLD_WIDTH, deadZoneHalfWidth: 120, lookAheadDistance: 90, followSharpness: 8, lookAheadSharpness: 6 }); world.x = -Math.round(camera.x);
    });
    const resize = () => { const scale = Math.min(window.innerWidth / LOGICAL_WIDTH, window.innerHeight / LOGICAL_HEIGHT); app.canvas.style.width = `${Math.floor(LOGICAL_WIDTH * scale)}px`; app.canvas.style.height = `${Math.floor(LOGICAL_HEIGHT * scale)}px`; }; window.addEventListener('resize', resize); resize(); console.info('[Bitland] application bootstrap complete');
  } catch (error) { console.error('[Bitland] renderer bootstrap failed', error); host.dataset.bootstrapError = 'renderer'; host.innerHTML = '<section class="bootstrap-error"><strong>BITLAND BOOT FAILURE</strong><span>Unable to initialize the game renderer. Check the browser console for diagnostics.</span></section>'; }
}
void bootstrap();
