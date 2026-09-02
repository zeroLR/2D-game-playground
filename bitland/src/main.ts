import { Application, Container, Graphics, Rectangle, Text } from 'pixi.js';
import { createKnowledgeSave, parseKnowledgeSave, SAVE_KEY, serializeKnowledgeSave } from './persistence/save';
import { createCodexState, recordDiscovery } from './simulation/codex/codex';
import { attackEnemy, createEnemy, createPlayerCombatState, enemyContactHit, grantEnemyLoot, startDodgeInvulnerability, tickCombat } from './simulation/combat/combat';
import { applyResourceRecovery, feedbackForEcology, regionStressLevel } from './simulation/ecology/feedback';
import { createEcologyState, runWorldTick } from './simulation/ecology/worldTick';
import { createCameraState, stepCamera } from './simulation/player/camera';
import { createLocomotionState, stepLocomotion } from './simulation/player/locomotion';
import { activeEffectSummary, locomotionConfigForEffects, resolveDiscoveryEffects } from './simulation/synthesis/effects';
import { availablePairs, createSynthesisState, synthesize, type Discovery } from './simulation/synthesis/synthesis';
import { createWorldPressure, recordCreatureDefeat, recordGatherPressure, recordTraitUsage } from './simulation/world/pressure';
import { BASE_WORLD_WIDTH, createRegionState, generateNextRegion, shouldRevealNextRegion, worldExtent, type RegionDescriptor } from './simulation/world/regions';
import { createInventory, gatherNode, pushObject, type ResourceNode, type PushableObject } from './simulation/world/resources';
import { createCodexModal, refreshCodexModal } from './ui/codexModal';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const BOOT_TIMEOUT_MS = 5000;
const GROUND_Y = 364;
const PLAYER_MIN_X = 18;
const INTERACT_RANGE = 72;
const SYNTH_X = 1666;
const WORLD_TICK_X = 1810;
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
  world.addChild(new Graphics().rect(0, 0, BASE_WORLD_WIDTH, LOGICAL_HEIGHT).fill(0x071314));
  const far = new Graphics();
  for (let x = 0; x < BASE_WORLD_WIDTH; x += 48) {
    const h = 60 + ((x / 48) % 5) * 18;
    far.rect(x, 270 - h, 34, h).fill(x < 640 ? 0x0c2a2b : x < 1280 ? 0x10263a : 0x30191f);
  }
  world.addChild(far);
  world.addChild(new Graphics().rect(0, 390, BASE_WORLD_WIDTH, 150).fill(0x102126).rect(0, 382, 640, 8).fill(0x6ecf78).rect(640, 382, 640, 8).fill(0x59d7ea).rect(1280, 382, 640, 8).fill(0xff7a59));
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

  const enemies = [createEnemy('crawler-a', 820, { resource: 'LIFE', amount: 1 }), createEnemy('crawler-b', 1510, { resource: 'ENERGY', amount: 1 })];
  const enemyViews = new Map<string, Container>();
  for (const enemy of enemies) {
    const view = new Container();
    view.addChild(new Graphics().poly([-22, 0, -10, -22, 10, -22, 22, 0]).fill(0x172b2c).stroke({ color: 0xffb36b, width: 2 }).circle(-8, -13, 3).fill(0xffb36b).circle(8, -13, 3).fill(0xffb36b));
    const hp = new Graphics(); hp.name = 'hp'; view.addChild(hp);
    view.position.set(enemy.x, 382); world.addChild(view); enemyViews.set(enemy.id, view);
  }

  const synthesisView = new Container(); synthesisView.position.set(SYNTH_X, 382);
  synthesisView.addChild(new Graphics().rect(-36, -90, 72, 90).fill(0x25171c).rect(-28, -82, 56, 74).stroke({ color: 0xff8b68, width: 3 }).poly([0, -68, 16, -38, -16, -38]).stroke({ color: 0xffa27e, width: 3 }));
  const resultOrb = new Graphics().circle(0, -108, 12).fill({ color: 0xb8fff4, alpha: 0.18 }).circle(0, -108, 12).stroke({ color: 0xb8fff4, width: 2, alpha: 0.35 }); resultOrb.visible = false;
  synthesisView.addChild(resultOrb); world.addChild(synthesisView);

  const tickTerminal = new Container(); tickTerminal.position.set(WORLD_TICK_X, 382);
  tickTerminal.addChild(new Graphics().rect(-30, -74, 60, 74).fill(0x0e2424).rect(-23, -66, 46, 54).stroke({ color: 0x7be6d6, width: 3 }).circle(0, -39, 10).stroke({ color: 0xffd58a, width: 3 }));
  const tickLabel = new Text({ text: 'TICK', style: { fill: 0x9adfd5, fontFamily: 'monospace', fontSize: 10, fontWeight: '700' } }); tickLabel.anchor.set(0.5); tickLabel.position.set(0, -20); tickTerminal.addChild(tickLabel); world.addChild(tickTerminal);

  const regionLayer = new Container();
  world.addChild(regionLayer);
  const anomalyLayer = new Container();
  world.addChild(anomalyLayer);
  return { world, nodeViews, crateView, enemies, enemyViews, resultOrb, regionLayer, anomalyLayer };
}

function regionPlatforms(region: RegionDescriptor): Platform[] {
  const offsets = [86, 260, 438];
  return region.platformHeights.map((y, index) => ({ x: region.startX + offsets[index], y, width: 116 }));
}

function renderRegion(layer: Container, region: RegionDescriptor): Platform[] {
  const view = new Container(); view.position.set(region.startX, 0);
  const palette = region.biome === 'DATA_FIELD'
    ? { bg: 0x081c1c, ground: 0x102824, accent: 0x6ecf78 }
    : region.biome === 'CRYSTAL_NODE'
      ? { bg: 0x0a1727, ground: 0x14273a, accent: 0x6be8ff }
      : { bg: 0x271217, ground: 0x321a20, accent: 0xff7a59 };
  view.addChild(new Graphics().rect(0, 0, region.width, LOGICAL_HEIGHT).fill(palette.bg).rect(0, 390, region.width, 150).fill(palette.ground).rect(0, 382, region.width, 8).fill(palette.accent));
  const skyline = new Graphics();
  for (let x = 24; x < region.width; x += 64) {
    const height = 48 + ((region.signature >>> ((x / 64) % 16)) % 5) * 18;
    skyline.rect(x, 280 - height, 38, height).fill({ color: palette.accent, alpha: 0.08 });
  }
  view.addChild(skyline);
  const platforms = regionPlatforms(region);
  const platformGraphics = new Graphics();
  for (const platform of platforms) {
    const localX = platform.x - region.startX;
    platformGraphics.rect(localX, platform.y + 18, platform.width, 18).fill(palette.ground).rect(localX, platform.y + 14, platform.width, 4).fill(palette.accent);
  }
  view.addChild(platformGraphics);
  const marker = new Text({ text: `REGION ${String(region.index + 1).padStart(2, '0')} // ${region.biome.replace('_', ' ')}`, style: { fill: palette.accent, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' } });
  marker.position.set(28, 216); view.addChild(marker);
  const recipe = new Text({ text: `RESOURCE ${region.resourceBias} · ENCOUNTER ${region.encounterPressure}`, style: { fill: palette.accent, fontFamily: 'monospace', fontSize: 10 } });
  recipe.position.set(28, 238); view.addChild(recipe);
  const influence = new Text({ text: `OBSERVED @ CODEX ${region.influence.codexCount} · ${region.influence.activeTraits.join(' + ') || 'NO ACTIVE TRAITS'}`, style: { fill: palette.accent, fontFamily: 'monospace', fontSize: 10 } });
  influence.alpha = 0.65; influence.position.set(28, 256); view.addChild(influence);
  layer.addChild(view);
  return platforms;
}

function renderEcologyAnomalies(layer: Container, regions: ReturnType<typeof createRegionState>, ecology: ReturnType<typeof createEcologyState>): void {
  layer.removeChildren();
  for (const region of regions.generated) {
    const level = regionStressLevel(ecology, region.id);
    if (level === 'CALM') continue;
    const stress = ecology.regionStress[region.id] ?? 0;
    const anomaly = new Container(); anomaly.position.set(region.startX, 0);
    anomaly.addChild(new Graphics().rect(0, 0, region.width, 382).fill({ color: 0xff5b6e, alpha: level === 'ANOMALOUS' ? 0.08 : 0.035 }));
    const label = new Text({ text: `${level} // STRESS ${stress}`, style: { fill: 0xff8b90, fontFamily: 'monospace', fontSize: 11, fontWeight: '700' } }); label.position.set(28, 278); anomaly.addChild(label);
    layer.addChild(anomaly);
  }
}

function makePlayer(): Container {
  const player = new Container();
  player.addChild(new Graphics().rect(-10, -16, 20, 24).fill(0x0c1517).rect(-8, -14, 16, 10).stroke({ color: 0xb8fff4, width: 2 }).rect(-4, -10, 3, 3).fill(0xb8fff4).rect(3, -10, 3, 3).fill(0xb8fff4).rect(-7, 8, 5, 10).fill(0x6ecf78).rect(2, 8, 5, 10).fill(0x6ecf78));
  return player;
}

type MobileInputState = { moveX: number; moveY: number; jumpPressed: boolean; attackPressed: boolean; guardHeld: boolean; dodgePressed: boolean; interactPressed: boolean; codexPressed: boolean };
type ActionName = 'JUMP' | 'ATK' | 'GUARD' | 'DODGE' | 'USE' | 'CODEX';

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
    const label = new Text({ text: name, style: { fill: color, fontFamily: 'monospace', fontSize: name === 'JUMP' ? 13 : name === 'CODEX' ? 9 : 10, fontWeight: '700' } }); label.anchor.set(0.5); button.addChild(label);
    button.on('pointerdown', () => { button.scale.set(0.9); press(); }); const up = () => { button.scale.set(1); release?.(); }; button.on('pointerup', up); button.on('pointerupoutside', up); button.on('pointercancel', up); hud.addChild(button);
  };
  makeButton('JUMP', 856, 421, 40, 0xb8fff4, () => { input.jumpPressed = true; });
  makeButton('USE', 780, 420, 34, 0x6ecf78, () => { input.interactPressed = true; });
  makeButton('ATK', 776, 490, 29, 0xffb36b, () => { input.attackPressed = true; });
  makeButton('GUARD', 846, 500, 27, 0x6be8ff, () => { input.guardHeld = true; }, () => { input.guardHeld = false; });
  makeButton('DODGE', 914, 474, 29, 0xd0a6ff, () => { input.dodgePressed = true; });
  makeButton('CODEX', 906, 74, 30, 0x9adfd5, () => { input.codexPressed = true; });
  return hud;
}

function makeStatusHud() {
  const hud = new Container(); hud.zIndex = 110;
  const title = new Text({ text: 'BITLAND // P3.2 ECOLOGICAL FEEDBACK', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 18 } }); title.position.set(24, 22); hud.addChild(title);
  const inventoryText = new Text({ text: '', style: { fill: 0xd8fff8, fontFamily: 'monospace', fontSize: 12 } }); inventoryText.position.set(24, 50); hud.addChild(inventoryText);
  const combatText = new Text({ text: '', style: { fill: 0xffd8aa, fontFamily: 'monospace', fontSize: 12 } }); combatText.position.set(24, 72); hud.addChild(combatText);
  const discoveryText = new Text({ text: 'DISCOVERY // none', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 12 } }); discoveryText.position.set(24, 94); hud.addChild(discoveryText);
  const activeText = new Text({ text: 'ACTIVE // none', style: { fill: 0xffd58a, fontFamily: 'monospace', fontSize: 11 } }); activeText.position.set(24, 114); hud.addChild(activeText);
  const codexCount = new Text({ text: 'CODEX // 0 discovered', style: { fill: 0x9adfd5, fontFamily: 'monospace', fontSize: 11 } }); codexCount.position.set(24, 134); hud.addChild(codexCount);
  const worldText = new Text({ text: 'WORLD // tick 0', style: { fill: 0xa9c8ff, fontFamily: 'monospace', fontSize: 11 } }); worldText.position.set(24, 154); hud.addChild(worldText);
  const prompt = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' } }); prompt.anchor.set(0.5); prompt.position.set(LOGICAL_WIDTH / 2, 180); hud.addChild(prompt);
  return { hud, inventoryText, combatText, discoveryText, activeText, codexCount, worldText, prompt };
}

function landOnPlatforms(previousY: number, locomotion: ReturnType<typeof createLocomotionState>, platforms: Platform[]): void {
  if (locomotion.vy < 0) return;
  for (const platform of platforms) if (locomotion.x >= platform.x - 8 && locomotion.x <= platform.x + platform.width + 8 && previousY <= platform.y && locomotion.y >= platform.y) { locomotion.y = platform.y; locomotion.vy = 0; locomotion.grounded = true; return; }
}

function discoveryLabel(discovery: Discovery): string {
  return `DISCOVERY // ${discovery.displayName}  [${discovery.traits.join(' + ')}]  #${discovery.discoveryIndex + 1}`;
}

async function bootstrap(): Promise<void> {
  console.info('[Bitland] renderer bootstrap started'); const app = new Application();
  try {
    await withTimeout(app.init({ width: LOGICAL_WIDTH, height: LOGICAL_HEIGHT, background: '#071314', antialias: false, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true }), BOOT_TIMEOUT_MS, 'PixiJS renderer initialization');
    host.replaceChildren(app.canvas); app.stage.sortableChildren = true; app.stage.eventMode = 'static'; app.stage.hitArea = app.screen;
    const { world, nodeViews, crateView, enemies, enemyViews, resultOrb, regionLayer, anomalyLayer } = makeWorld();
    const saved = parseKnowledgeSave(window.localStorage.getItem(SAVE_KEY));
    const player = makePlayer(), locomotion = createLocomotionState(180, GROUND_Y), camera = createCameraState(), inventory = createInventory(), combat = createPlayerCombatState();
    const synthesis = saved?.synthesis ?? createSynthesisState();
    const codex = saved?.codex ?? createCodexState();
    const regions = saved?.regions ?? createRegionState();
    const pressure = saved?.pressure ?? createWorldPressure();
    const ecology = saved?.ecology ?? createEcologyState();
    const platforms = [...PLATFORMS];
    for (const region of regions.generated) platforms.push(...renderRegion(regionLayer, region));
    renderEcologyAnomalies(anomalyLayer, regions, ecology);
    let observedWorldWidth = worldExtent(regions);
    let activeDiscovery: Discovery | null = synthesis.lastDiscovery;
    player.position.set(locomotion.x, locomotion.y); world.addChild(player); app.stage.addChild(world);
    const mobileInput: MobileInputState = { moveX: 0, moveY: 0, jumpPressed: false, attackPressed: false, guardHeld: false, dodgePressed: false, interactPressed: false, codexPressed: false };
    const mobileControls = makeMobileControls(mobileInput); app.stage.addChild(mobileControls);
    const status = makeStatusHud(); app.stage.addChild(status.hud);
    const codexModal = createCodexModal(); app.stage.addChild(codexModal.panel);
    const keys = new Set<string>();
    let keyboardJump = false, keyboardInteract = false, keyboardAttack = false, keyboardCodex = false, dodgeCooldown = 0, hitFlash = 0, attackFlash = 0, discoveryFlash = 0, codexOpen = false, codexPage = 0;
    const clearQueuedGameplayInput = () => { mobileInput.jumpPressed = false; mobileInput.attackPressed = false; mobileInput.guardHeld = false; mobileInput.dodgePressed = false; mobileInput.interactPressed = false; keyboardJump = false; keyboardInteract = false; keyboardAttack = false; keys.delete('KeyK'); keys.delete('ShiftLeft'); };
    const setCodexOpen = (open: boolean) => { codexOpen = open; codexModal.panel.visible = open; mobileControls.visible = !open; status.hud.visible = !open; if (open) { clearQueuedGameplayInput(); codexPage = refreshCodexModal(codexModal, codex, codexPage); } };
    codexModal.closeButton.on('pointerdown', () => setCodexOpen(false));
    codexModal.prevButton.on('pointerdown', () => { codexPage = refreshCodexModal(codexModal, codex, codexPage - 1); });
    codexModal.nextButton.on('pointerdown', () => { codexPage = refreshCodexModal(codexModal, codex, codexPage + 1); });
    window.addEventListener('keydown', e => { keys.add(e.code); if (e.code === 'Space' && !e.repeat) keyboardJump = true; if (e.code === 'KeyE' && !e.repeat) keyboardInteract = true; if (e.code === 'KeyJ' && !e.repeat) keyboardAttack = true; if ((e.code === 'KeyC' || e.code === 'Escape') && !e.repeat) keyboardCodex = true; if (e.code === 'Space') e.preventDefault(); });
    window.addEventListener('keyup', e => keys.delete(e.code));

    const persistKnowledge = () => window.localStorage.setItem(SAVE_KEY, serializeKnowledgeSave(createKnowledgeSave(synthesis, codex, regions, pressure, ecology)));
    if (synthesis.lastDiscovery) { status.discoveryText.text = discoveryLabel(synthesis.lastDiscovery); resultOrb.visible = true; }
    status.activeText.text = activeEffectSummary(activeDiscovery);
    status.codexCount.text = `CODEX // ${codex.entries.length} discovered`;
    status.worldText.text = `WORLD // TICK ${ecology.tickIndex} · HOSTILITY ${ecology.hostility} · ${regions.generated.length + 1} observed`;

    app.ticker.add(ticker => {
      if (mobileInput.codexPressed || keyboardCodex) { mobileInput.codexPressed = false; keyboardCodex = false; setCodexOpen(!codexOpen); }
      if (codexOpen) return;
      const dt = Math.min(ticker.deltaMS / 1000, 0.05); dodgeCooldown = Math.max(0, dodgeCooldown - dt); hitFlash = Math.max(0, hitFlash - dt); attackFlash = Math.max(0, attackFlash - dt); discoveryFlash = Math.max(0, discoveryFlash - dt); tickCombat(combat, enemies, dt);
      const effects = resolveDiscoveryEffects(activeDiscovery);
      const ecologyFeedback = feedbackForEcology(ecology, regions);
      const keyboardAxis = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0); const axis = Math.abs(mobileInput.moveX) > 0.01 ? mobileInput.moveX : keyboardAxis; const previousY = locomotion.y;
      const guarding = mobileInput.guardHeld || keys.has('KeyK');
      stepLocomotion(locomotion, { moveX: axis, jumpPressed: mobileInput.jumpPressed || keyboardJump, guardHeld: guarding }, dt, GROUND_Y, PLAYER_MIN_X, observedWorldWidth - 18, locomotionConfigForEffects(effects)); mobileInput.jumpPressed = false; keyboardJump = false; landOnPlatforms(previousY, locomotion, platforms);

      if (shouldRevealNextRegion(locomotion.x, regions)) {
        const region = generateNextRegion(regions, WORLD_SEED, { codexCount: codex.entries.length, activeTraits: activeDiscovery?.traits ?? [], pressure });
        if (region) { platforms.push(...renderRegion(regionLayer, region)); observedWorldWidth = worldExtent(regions); renderEcologyAnomalies(anomalyLayer, regions, ecology); status.worldText.text = `WORLD // ${region.biome.replace('_', ' ')} · RESOURCE ${region.resourceBias} · ENCOUNTER ${region.encounterPressure}`; persistKnowledge(); }
      }

      if ((mobileInput.dodgePressed || keys.has('ShiftLeft')) && dodgeCooldown <= 0 && Math.abs(axis) > 0.1) { locomotion.x = Math.max(PLAYER_MIN_X, Math.min(observedWorldWidth - 18, locomotion.x + Math.sign(axis) * 58 * effects.dodgeDistanceMultiplier)); locomotion.vx = Math.sign(axis) * 260; dodgeCooldown = 0.5; startDodgeInvulnerability(combat); } mobileInput.dodgePressed = false;

      const nearbyNode = RESOURCE_NODES.find(node => !node.depleted && Math.abs(node.x - locomotion.x) <= INTERACT_RANGE);
      const nearCrate = Math.abs(CRATE.x - locomotion.x) <= INTERACT_RANGE;
      const nearSynth = Math.abs(SYNTH_X - locomotion.x) <= INTERACT_RANGE + 10;
      const nearWorldTick = Math.abs(WORLD_TICK_X - locomotion.x) <= INTERACT_RANGE;
      const pair = availablePairs(inventory)[0];
      status.prompt.text = nearbyNode ? `USE · GATHER ${nearbyNode.resource}` : nearCrate ? `USE · PUSH OBJECT${effects.pushMultiplier !== 1 ? ` ×${effects.pushMultiplier.toFixed(2)}` : ''}` : nearSynth ? (pair ? `USE · SYNTH ${pair[0]} + ${pair[1]}` : 'SYNTHESIS · NEED 2 RESOURCE TYPES') : nearWorldTick ? `USE · ADVANCE WORLD TICK ${ecology.tickIndex + 1}` : '';

      if (mobileInput.interactPressed || keyboardInteract) {
        if (nearbyNode) {
          const gatheredAmount = nearbyNode.amount;
          if (gatherNode(nearbyNode, inventory)) { recordGatherPressure(pressure, nearbyNode.resource, gatheredAmount); const nodeView = nodeViews.get(nearbyNode.id); if (nodeView) nodeView.alpha = 0.12; persistKnowledge(); }
        } else if (nearCrate) pushObject(CRATE, locomotion.x, locomotion.facing, 34 * effects.pushMultiplier);
        else if (nearSynth && pair) {
          const discovery = synthesize(synthesis, inventory, WORLD_SEED, pair[0], pair[1]);
          if (discovery) { activeDiscovery = discovery; recordTraitUsage(pressure, discovery.traits); recordDiscovery(codex, discovery, pair); persistKnowledge(); status.discoveryText.text = discoveryLabel(discovery); status.activeText.text = activeEffectSummary(activeDiscovery); status.codexCount.text = `CODEX // ${codex.entries.length} discovered`; codexPage = refreshCodexModal(codexModal, codex, codexPage); resultOrb.visible = true; discoveryFlash = 0.5; }
        } else if (nearWorldTick) {
          const delta = runWorldTick(ecology, pressure, regions, WORLD_SEED);
          const recovered = applyResourceRecovery(RESOURCE_NODES, ecology);
          for (const node of RESOURCE_NODES) { const view = nodeViews.get(node.id); if (view) view.alpha = node.depleted ? 0.12 : 0.85; }
          renderEcologyAnomalies(anomalyLayer, regions, ecology);
          status.worldText.text = `WORLD // TICK ${delta.tickIndex} · HOSTILITY ${ecology.hostility} · RECOVER ${recovered.join('/') || 'NONE'}`;
          persistKnowledge();
        }
      }
      mobileInput.interactPressed = false; keyboardInteract = false; crateView.x = CRATE.x;

      if (mobileInput.attackPressed || keyboardAttack) {
        const target = enemies.filter(enemy => enemy.alive && Math.sign(enemy.x - locomotion.x) === locomotion.facing).sort((a, b) => Math.abs(a.x - locomotion.x) - Math.abs(b.x - locomotion.x))[0];
        if (target) { const wasAlive = target.alive; if (attackEnemy(combat, target, Math.abs(target.x - locomotion.x), { damageBonus: effects.attackDamageBonus, rangeBonus: effects.attackRangeBonus })) { attackFlash = 0.12; if (wasAlive && !target.alive) { recordCreatureDefeat(pressure); grantEnemyLoot(target, inventory); persistKnowledge(); } } }
      }
      mobileInput.attackPressed = false; keyboardAttack = false;

      for (const enemy of enemies) {
        const view = enemyViews.get(enemy.id); if (!view) continue; view.visible = enemy.alive; if (!enemy.alive) continue;
        const distance = Math.abs(enemy.x - locomotion.x); if (distance < 180) enemy.x += Math.sign(locomotion.x - enemy.x) * 34 * ecologyFeedback.enemySpeedMultiplier * dt; view.x = enemy.x;
        view.scale.set(1 + Math.min(ecology.hostility, 8) * 0.012);
        if (enemyContactHit(combat, enemy, distance, guarding)) hitFlash = 0.16;
        const hpView = view.getChildByName('hp'); if (hpView instanceof Graphics) hpView.clear().rect(-20, -34, 40, 4).fill(0x33191c).rect(-20, -34, 40 * (enemy.hp / enemy.maxHp), 4).fill(0xff7a59);
      }

      resultOrb.alpha = discoveryFlash > 0 ? 1 : 0.55; resultOrb.scale.set(discoveryFlash > 0 ? 1.35 : 1);
      status.inventoryText.text = `MAT ${inventory.MATTER}   ENG ${inventory.ENERGY}   LIFE ${inventory.LIFE}   SIG ${inventory.SIGNAL}`;
      status.combatText.text = `HP ${'■'.repeat(combat.hp)}${'□'.repeat(combat.maxHp - combat.hp)}   ATK / GUARD / DODGE`;
      player.position.set(locomotion.x, locomotion.y); player.scale.x = locomotion.facing; player.scale.y = attackFlash > 0 ? 1.1 : 1; player.alpha = hitFlash > 0 ? 0.35 : guarding ? 0.72 : 1;
      stepCamera(camera, locomotion.x, locomotion.vx, dt, { viewportWidth: LOGICAL_WIDTH, worldWidth: observedWorldWidth, deadZoneHalfWidth: 120, lookAheadDistance: 90, followSharpness: 8, lookAheadSharpness: 6 }); world.x = -Math.round(camera.x);
    });
    const resize = () => { const scale = Math.min(window.innerWidth / LOGICAL_WIDTH, window.innerHeight / LOGICAL_HEIGHT); app.canvas.style.width = `${Math.floor(LOGICAL_WIDTH * scale)}px`; app.canvas.style.height = `${Math.floor(LOGICAL_HEIGHT * scale)}px`; }; window.addEventListener('resize', resize); resize(); console.info('[Bitland] application bootstrap complete');
  } catch (error) { console.error('[Bitland] renderer bootstrap failed', error); host.dataset.bootstrapError = 'renderer'; host.innerHTML = '<section class="bootstrap-error"><strong>BITLAND BOOT FAILURE</strong><span>Unable to initialize the game renderer. Check the browser console for diagnostics.</span></section>'; }
}
void bootstrap();