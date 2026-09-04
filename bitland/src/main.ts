import { Application, Container, Graphics, Rectangle, Text } from 'pixi.js';
import { createKnowledgeSave, parseKnowledgeSave, SAVE_KEY, serializeKnowledgeSave } from './persistence/save';
import { createCodexState, recordDiscovery } from './simulation/codex/codex';
import { attackEnemy, createEnemy, createPlayerCombatState, enemyContactHit, grantEnemyLoot, startDodgeInvulnerability, tickCombat } from './simulation/combat/combat';
import { createEcologyState } from './simulation/ecology/worldTick';
import { createCameraState, stepCamera } from './simulation/player/camera';
import { createLocomotionState, stepLocomotion } from './simulation/player/locomotion';
import { activeEffectSummary, locomotionConfigForEffects, resolveDiscoveryEffects } from './simulation/synthesis/effects';
import { createSynthesisState, synthesize, type Discovery } from './simulation/synthesis/synthesis';
import { activateAffordance, canActivateAffordance, createAffordanceState, isAffordanceActive } from './simulation/world/affordances';
import { createPoiObservationState, isPoiScanned, poiLabel, scanPoi, type PoiObservationState, type RegionPoi } from './simulation/world/poi';
import { createWorldPressure, recordCreatureDefeat, recordGatherPressure, recordTraitUsage } from './simulation/world/pressure';
import { BASE_WORLD_WIDTH, createRegionState, generateNextRegion, shouldRevealNextRegion, worldExtent, type RegionDescriptor } from './simulation/world/regions';
import { createInventory, gatherNode, type ResourceNode } from './simulation/world/resources';
import { createCodexModal, refreshCodexModal } from './ui/codexModal';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const BOOT_TIMEOUT_MS = 5000;
const GROUND_Y = 364;
const PLAYER_MIN_X = 18;
const INTERACT_RANGE = 76;
const POI_SCAN_RANGE = 96;
const LIFE_X = 540;
const SIGNAL_X = 930;
const SYNTH_X = 1260;
const RELAY_X = 1515;
const RIFT_X = 1615;
const LOCKED_MAX_X = RIFT_X - 24;
const WORLD_SEED = 'bitland-alpha';
const RESET_CONFIRM_MS = 3000;

type Platform = { x: number; y: number; width: number };
const PLATFORMS: Platform[] = [
  { x: 430, y: 314, width: 150 },
  { x: 770, y: 286, width: 138 },
  { x: 1120, y: 316, width: 138 },
];
const PHASE_BRIDGE: Platform = { x: RIFT_X - 18, y: 330, width: 255 };
const RESOURCE_NODES: ResourceNode[] = [
  { id: 'life-core', resource: 'LIFE', amount: 2, x: LIFE_X, depleted: false },
  { id: 'signal-core', resource: 'SIGNAL', amount: 2, x: SIGNAL_X, depleted: false },
];

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('Missing #app');
const host: HTMLElement = hostElement;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => window.setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs))]);
}

function makeWorld() {
  const world = new Container();
  world.addChild(new Graphics().rect(0, 0, BASE_WORLD_WIDTH, LOGICAL_HEIGHT).fill(0x071314));

  const skyline = new Graphics();
  for (let x = 0; x < BASE_WORLD_WIDTH; x += 52) {
    const height = 48 + ((x / 52) % 5) * 18;
    skyline.rect(x, 286 - height, 36, height).fill({ color: x < RIFT_X ? 0x5ccfb1 : 0x6be8ff, alpha: 0.09 });
  }
  world.addChild(skyline);
  world.addChild(new Graphics().rect(0, 390, BASE_WORLD_WIDTH, 150).fill(0x102126).rect(0, 382, BASE_WORLD_WIDTH, 8).fill(0x6ecf78));

  const platformGraphics = new Graphics();
  for (const platform of PLATFORMS) platformGraphics.rect(platform.x, platform.y + 18, platform.width, 18).fill(0x102126).rect(platform.x, platform.y + 14, platform.width, 4).fill(0xb8fff4);
  world.addChild(platformGraphics);

  const nodeViews = new Map<string, Graphics>();
  const resourceColors = { LIFE: 0x6ecf78, SIGNAL: 0x6be8ff } as const;
  for (const node of RESOURCE_NODES) {
    const view = new Graphics().poly([0, 0, 14, -32, 28, 0]).fill({ color: resourceColors[node.resource as 'LIFE' | 'SIGNAL'], alpha: 0.9 }).circle(14, -15, 5).fill(0x071314);
    view.position.set(node.x, 382); world.addChild(view); nodeViews.set(node.id, view);
  }

  const enemies = [createEnemy('crawler-a', 760, { resource: 'LIFE', amount: 1 })];
  const enemyViews = new Map<string, Container>();
  for (const enemy of enemies) {
    const view = new Container();
    view.addChild(new Graphics().poly([-22, 0, -10, -22, 10, -22, 22, 0]).fill(0x172b2c).stroke({ color: 0xffb36b, width: 2 }).circle(-8, -13, 3).fill(0xffb36b).circle(8, -13, 3).fill(0xffb36b));
    const hp = new Graphics(); hp.name = 'hp'; view.addChild(hp);
    view.position.set(enemy.x, 382); world.addChild(view); enemyViews.set(enemy.id, view);
  }

  const synthesisView = new Container(); synthesisView.position.set(SYNTH_X, 382);
  synthesisView.addChild(new Graphics().rect(-34, -82, 68, 82).fill(0x25171c).rect(-27, -74, 54, 66).stroke({ color: 0xff8b68, width: 3 }).poly([0, -62, 14, -38, -14, -38]).stroke({ color: 0xffa27e, width: 3 }));
  const synthLabel = new Text({ text: 'COMBINE', style: { fill: 0xffb39a, fontFamily: 'monospace', fontSize: 8, fontWeight: '700' } });
  synthLabel.anchor.set(0.5); synthLabel.position.set(0, -12); synthesisView.addChild(synthLabel);
  const resultOrb = new Graphics().circle(0, -102, 12).fill({ color: 0xb8fff4, alpha: 0.18 }).circle(0, -102, 12).stroke({ color: 0xb8fff4, width: 2, alpha: 0.35 });
  resultOrb.visible = false; synthesisView.addChild(resultOrb); world.addChild(synthesisView);

  const relayView = new Container(); relayView.position.set(RELAY_X, 382);
  relayView.addChild(new Graphics().rect(-24, -76, 48, 76).fill(0x0a2028).rect(-18, -68, 36, 54).stroke({ color: 0x6be8ff, width: 3 }).poly([-11, -41, 0, -56, 11, -41, 0, -26]).stroke({ color: 0x6be8ff, width: 2 }));
  world.addChild(relayView);

  const riftView = new Container(); riftView.position.set(RIFT_X, 0);
  const rift = new Graphics();
  rift.rect(-18, 140, 150, 250).fill({ color: 0x020607, alpha: 0.96 });
  for (let y = 160; y < 370; y += 34) rift.poly([-10, y, 18, y + 14, 4, y + 28, 28, y + 42]).stroke({ color: 0x6be8ff, width: 2, alpha: 0.42 });
  riftView.addChild(rift);
  const riftLabel = new Text({ text: 'PATH LOST', style: { fill: 0xa9c8ff, fontFamily: 'monospace', fontSize: 10, fontWeight: '700' } });
  riftLabel.anchor.set(0.5); riftLabel.position.set(54, 126); riftView.addChild(riftLabel);
  world.addChild(riftView);

  const distantTarget = new Container(); distantTarget.position.set(1790, 382);
  distantTarget.addChild(new Graphics().rect(-4, -118, 8, 118).fill(0x183f32).circle(0, -132, 20).fill({ color: 0x6ecf78, alpha: 0.22 }).stroke({ color: 0xb8ffc8, width: 3 }).circle(-34, -92, 10).stroke({ color: 0x8dffab, width: 2 }).circle(34, -92, 10).stroke({ color: 0x8dffab, width: 2 }));
  const targetTag = new Text({ text: '?', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 15, fontWeight: '700' } });
  targetTag.anchor.set(0.5); targetTag.position.set(0, -168); distantTarget.addChild(targetTag); world.addChild(distantTarget);

  const phaseBridgeView = new Graphics().rect(PHASE_BRIDGE.x, PHASE_BRIDGE.y + 18, PHASE_BRIDGE.width, 18).fill({ color: 0x163844, alpha: 0.92 }).rect(PHASE_BRIDGE.x, PHASE_BRIDGE.y + 14, PHASE_BRIDGE.width, 4).fill(0x6be8ff);
  phaseBridgeView.visible = false; world.addChild(phaseBridgeView);

  const regionLayer = new Container(); world.addChild(regionLayer);
  const poiLayer = new Container(); world.addChild(poiLayer);
  return { world, nodeViews, enemies, enemyViews, resultOrb, relayView, riftView, distantTarget, phaseBridgeView, regionLayer, poiLayer };
}

function regionPlatforms(region: RegionDescriptor): Platform[] {
  const offsets = [86, 260, 438];
  return region.platformHeights.map((y, index) => ({ x: region.startX + offsets[index], y, width: 116 }));
}

function renderRegion(layer: Container, region: RegionDescriptor): Platform[] {
  const view = new Container(); view.position.set(region.startX, 0);
  const accent = region.biome === 'DATA_FIELD' ? 0x6ecf78 : region.biome === 'CRYSTAL_NODE' ? 0x6be8ff : 0xff7a59;
  const ground = region.biome === 'DATA_FIELD' ? 0x102824 : region.biome === 'CRYSTAL_NODE' ? 0x14273a : 0x321a20;
  view.addChild(new Graphics().rect(0, 0, region.width, LOGICAL_HEIGHT).fill(0x081516).rect(0, 390, region.width, 150).fill(ground).rect(0, 382, region.width, 8).fill(accent));
  const platforms = regionPlatforms(region);
  const graphics = new Graphics();
  for (const platform of platforms) graphics.rect(platform.x - region.startX, platform.y + 18, platform.width, 18).fill(ground).rect(platform.x - region.startX, platform.y + 14, platform.width, 4).fill(accent);
  view.addChild(graphics); layer.addChild(view); return platforms;
}

function createPoiView(region: RegionDescriptor, observations: PoiObservationState): Container | null {
  if (!region.poi) return null;
  const poi = region.poi;
  const scanned = isPoiScanned(observations, poi.id);
  const view = new Container(); view.position.set(poi.x, 382);
  const graphic = new Graphics();
  if (poi.kind === 'MEMORY_BLOOM') graphic.rect(-5, -118, 10, 118).fill(0x183f32).circle(0, -126, 18).fill({ color: 0x6ecf78, alpha: 0.2 }).stroke({ color: 0xb8ffc8, width: 3 }).circle(-42, -94, 12).stroke({ color: 0x8dffab, width: 3 }).circle(42, -94, 12).stroke({ color: 0x8dffab, width: 3 });
  else if (poi.kind === 'SIGNAL_SPIRE') graphic.poly([0, -148, 30, -20, 12, 0, -12, 0, -30, -20]).fill({ color: 0x153b50, alpha: 0.9 }).stroke({ color: 0x6be8ff, width: 3 }).circle(0, -158, 12).stroke({ color: 0xb8f8ff, width: 3 });
  else graphic.circle(0, -24, 42).fill({ color: 0x3d111b, alpha: 0.88 }).stroke({ color: 0xff5b6e, width: 4 }).poly([-8, -138, 14, -98, -6, -76, 18, -48, 0, -20]).stroke({ color: 0xff5b6e, width: 4 });
  view.addChild(graphic);
  const label = new Text({ text: scanned ? poiLabel(poi.kind) : '?', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: scanned ? 10 : 15, fontWeight: '700' } });
  label.anchor.set(0.5); label.position.set(0, -176); view.addChild(label); return view;
}

function renderPoiLayer(layer: Container, regions: ReturnType<typeof createRegionState>, observations: PoiObservationState): void {
  layer.removeChildren();
  for (const region of regions.generated) { const view = createPoiView(region, observations); if (view) layer.addChild(view); }
}

function ensurePlatform(platforms: Platform[], platform: Platform): void {
  if (!platforms.some(existing => existing.x === platform.x && existing.y === platform.y && existing.width === platform.width)) platforms.push(platform);
}

function makePlayer(): Container {
  const player = new Container();
  player.addChild(new Graphics().rect(-10, -16, 20, 24).fill(0x0c1517).rect(-8, -14, 16, 10).stroke({ color: 0xb8fff4, width: 2 }).rect(-4, -10, 3, 3).fill(0xb8fff4).rect(3, -10, 3, 3).fill(0xb8fff4).rect(-7, 8, 5, 10).fill(0x6ecf78).rect(2, 8, 5, 10).fill(0x6ecf78));
  return player;
}

type MobileInputState = { moveX: number; jumpPressed: boolean; attackPressed: boolean; guardHeld: boolean; dodgePressed: boolean; interactPressed: boolean; codexPressed: boolean; debugPressed: boolean; resetPressed: boolean };
type ActionName = 'JUMP' | 'ATK' | 'GUARD' | 'DODGE' | 'USE' | 'CODEX' | 'DEBUG' | 'RESET';

function makeMobileControls(input: MobileInputState): Container {
  const hud = new Container(); hud.zIndex = 100; hud.sortableChildren = true;
  const padRadius = 62, knobRadius = 25; const center = { x: 104, y: LOGICAL_HEIGHT - 96 };
  const pad = new Graphics().circle(0, 0, padRadius).fill({ color: 0x071314, alpha: 0.5 }).circle(0, 0, padRadius).stroke({ color: 0x7be6d6, width: 2, alpha: 0.55 }); pad.position.set(center.x, center.y); hud.addChild(pad);
  const knob = new Graphics().circle(0, 0, knobRadius).fill({ color: 0x6ecf78, alpha: 0.28 }).circle(0, 0, knobRadius).stroke({ color: 0xb8fff4, width: 2, alpha: 0.8 }); knob.position.set(center.x, center.y); hud.addChild(knob);
  const zone = new Graphics().rect(0, LOGICAL_HEIGHT * 0.42, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.58).fill({ color: 0, alpha: 0.001 }); zone.eventMode = 'static'; zone.hitArea = new Rectangle(0, LOGICAL_HEIGHT * 0.42, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.58); hud.addChild(zone);
  let pointerId: number | null = null;
  zone.on('pointerdown', e => { if (pointerId !== null) return; pointerId = e.pointerId; });
  zone.on('pointermove', e => { if (pointerId !== e.pointerId) return; const dx = e.global.x - center.x; const dy = e.global.y - center.y; const d = Math.hypot(dx, dy); const n = d ? Math.min(d, padRadius) / d : 0; knob.position.set(center.x + dx * n, center.y + dy * n); input.moveX = Math.abs(dx / padRadius) < 0.16 ? 0 : Math.max(-1, Math.min(1, dx / padRadius)); });
  const resetPad = () => { pointerId = null; knob.position.set(center.x, center.y); input.moveX = 0; };
  for (const eventName of ['pointerup', 'pointerupoutside', 'pointercancel'] as const) zone.on(eventName, e => { if (pointerId === e.pointerId) resetPad(); });
  const makeButton = (name: ActionName, x: number, y: number, radius: number, color: number, press: () => void, release?: () => void) => { const button = new Container(); button.position.set(x, y); button.eventMode = 'static'; button.zIndex = 20; button.addChild(new Graphics().circle(0, 0, radius).fill({ color: 0x071314, alpha: 0.52 }).circle(0, 0, radius).stroke({ color, width: 2, alpha: 0.72 })); const compact = ['CODEX', 'DEBUG', 'RESET'].includes(name); const label = new Text({ text: name, style: { fill: color, fontFamily: 'monospace', fontSize: name === 'JUMP' ? 13 : compact ? 8 : 10, fontWeight: '700' } }); label.anchor.set(0.5); button.addChild(label); button.on('pointerdown', () => { button.scale.set(0.9); press(); }); const up = () => { button.scale.set(1); release?.(); }; button.on('pointerup', up); button.on('pointerupoutside', up); button.on('pointercancel', up); hud.addChild(button); };
  makeButton('JUMP', 856, 421, 40, 0xb8fff4, () => { input.jumpPressed = true; });
  makeButton('USE', 780, 420, 34, 0x6ecf78, () => { input.interactPressed = true; });
  makeButton('ATK', 776, 490, 29, 0xffb36b, () => { input.attackPressed = true; });
  makeButton('GUARD', 846, 500, 27, 0x6be8ff, () => { input.guardHeld = true; }, () => { input.guardHeld = false; });
  makeButton('DODGE', 914, 474, 29, 0xd0a6ff, () => { input.dodgePressed = true; });
  makeButton('RESET', 786, 74, 24, 0xff8b90, () => { input.resetPressed = true; });
  makeButton('DEBUG', 846, 74, 26, 0xa9c8ff, () => { input.debugPressed = true; });
  makeButton('CODEX', 906, 74, 30, 0x9adfd5, () => { input.codexPressed = true; });
  return hud;
}

function makeStatusHud() {
  const hud = new Container(); hud.zIndex = 110;
  const title = new Text({ text: 'BITLAND', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 17, fontWeight: '700' } }); title.position.set(24, 22); hud.addChild(title);
  const inventoryText = new Text({ text: '', style: { fill: 0xd8fff8, fontFamily: 'monospace', fontSize: 12 } }); inventoryText.position.set(24, 50); hud.addChild(inventoryText);
  const combatText = new Text({ text: '', style: { fill: 0xffd8aa, fontFamily: 'monospace', fontSize: 12 } }); combatText.position.set(24, 72); hud.addChild(combatText);
  const activeText = new Text({ text: 'ACTIVE // none', style: { fill: 0xffd58a, fontFamily: 'monospace', fontSize: 11 } }); activeText.position.set(24, 94); hud.addChild(activeText);
  const goalText = new Text({ text: 'GOAL // reach the unknown structure beyond the broken path', style: { fill: 0xa9c8ff, fontFamily: 'monospace', fontSize: 11, wordWrap: true, wordWrapWidth: 650 } }); goalText.position.set(24, 118); hud.addChild(goalText);
  const prompt = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' } }); prompt.anchor.set(0.5); prompt.position.set(LOGICAL_WIDTH / 2, 158); hud.addChild(prompt);
  const debugHud = new Container(); debugHud.zIndex = 109; debugHud.visible = false; debugHud.addChild(new Graphics().roundRect(18, 184, 330, 126, 8).fill({ color: 0x041011, alpha: 0.9 }).stroke({ color: 0x537b79, width: 1 })); const debugText = new Text({ text: '', style: { fill: 0xa9c8ff, fontFamily: 'monospace', fontSize: 9, lineHeight: 15 } }); debugText.position.set(30, 198); debugHud.addChild(debugText);
  return { hud, debugHud, inventoryText, combatText, activeText, goalText, prompt, debugText };
}

function landOnPlatforms(previousY: number, locomotion: ReturnType<typeof createLocomotionState>, platforms: Platform[]): void {
  if (locomotion.vy < 0) return;
  for (const platform of platforms) if (locomotion.x >= platform.x - 8 && locomotion.x <= platform.x + platform.width + 8 && previousY <= platform.y && locomotion.y >= platform.y) { locomotion.y = platform.y; locomotion.vy = 0; locomotion.grounded = true; return; }
}

function nearbyPoi(regions: ReturnType<typeof createRegionState>, playerX: number): RegionPoi | null {
  for (const region of regions.generated) if (region.poi && Math.abs(region.poi.x - playerX) <= POI_SCAN_RANGE) return region.poi;
  return null;
}

async function bootstrap(): Promise<void> {
  console.info('[Bitland] renderer bootstrap started'); const app = new Application();
  try {
    await withTimeout(app.init({ width: LOGICAL_WIDTH, height: LOGICAL_HEIGHT, background: '#071314', antialias: false, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true }), BOOT_TIMEOUT_MS, 'PixiJS renderer initialization');
    host.replaceChildren(app.canvas); app.stage.sortableChildren = true; app.stage.eventMode = 'static'; app.stage.hitArea = app.screen;
    const { world, nodeViews, enemies, enemyViews, resultOrb, relayView, riftView, distantTarget, phaseBridgeView, regionLayer, poiLayer } = makeWorld();
    const saved = parseKnowledgeSave(window.localStorage.getItem(SAVE_KEY));
    const player = makePlayer(), locomotion = createLocomotionState(180, GROUND_Y), camera = createCameraState(), inventory = createInventory(), combat = createPlayerCombatState();
    const synthesis = saved?.synthesis ?? createSynthesisState(); const codex = saved?.codex ?? createCodexState(); const regions = saved?.regions ?? createRegionState(); const pressure = saved?.pressure ?? createWorldPressure(); const ecology = saved?.ecology ?? createEcologyState(); const affordances = saved?.affordances ?? createAffordanceState(); const poiObservations = saved?.poiObservations ?? createPoiObservationState();
    const platforms = [...PLATFORMS]; for (const region of regions.generated) platforms.push(...renderRegion(regionLayer, region)); renderPoiLayer(poiLayer, regions, poiObservations);
    const relayActiveAtStart = isAffordanceActive(affordances, 'SIGNAL_RELAY'); if (relayActiveAtStart) ensurePlatform(platforms, PHASE_BRIDGE);
    let observedWorldWidth = worldExtent(regions); let activeDiscovery: Discovery | null = synthesis.lastDiscovery;
    player.position.set(locomotion.x, locomotion.y); world.addChild(player); app.stage.addChild(world);
    const mobileInput: MobileInputState = { moveX: 0, jumpPressed: false, attackPressed: false, guardHeld: false, dodgePressed: false, interactPressed: false, codexPressed: false, debugPressed: false, resetPressed: false };
    const mobileControls = makeMobileControls(mobileInput); app.stage.addChild(mobileControls); const status = makeStatusHud(); app.stage.addChild(status.debugHud); app.stage.addChild(status.hud); const codexModal = createCodexModal(); app.stage.addChild(codexModal.panel);
    const keys = new Set<string>(); let keyboardJump = false, keyboardInteract = false, keyboardAttack = false, keyboardCodex = false, dodgeCooldown = 0, codexOpen = false, codexPage = 0, debugOpen = false, resetConfirmUntil = 0;
    const setDebugOpen = (open: boolean) => { debugOpen = open; status.debugHud.visible = open && !codexOpen; };
    const setCodexOpen = (open: boolean) => { codexOpen = open; codexModal.panel.visible = open; mobileControls.visible = !open; status.hud.visible = !open; status.debugHud.visible = !open && debugOpen; if (open) codexPage = refreshCodexModal(codexModal, codex, codexPage); };
    codexModal.closeButton.on('pointerdown', () => setCodexOpen(false)); codexModal.prevButton.on('pointerdown', () => { codexPage = refreshCodexModal(codexModal, codex, codexPage - 1); }); codexModal.nextButton.on('pointerdown', () => { codexPage = refreshCodexModal(codexModal, codex, codexPage + 1); });
    window.addEventListener('keydown', e => { keys.add(e.code); if (e.code === 'Space' && !e.repeat) keyboardJump = true; if (e.code === 'KeyE' && !e.repeat) keyboardInteract = true; if (e.code === 'KeyJ' && !e.repeat) keyboardAttack = true; if ((e.code === 'KeyC' || e.code === 'Escape') && !e.repeat) keyboardCodex = true; if (e.code === 'F3' && !e.repeat) { setDebugOpen(!debugOpen); e.preventDefault(); } }); window.addEventListener('keyup', e => keys.delete(e.code));
    const persistKnowledge = () => window.localStorage.setItem(SAVE_KEY, serializeKnowledgeSave(createKnowledgeSave(synthesis, codex, regions, pressure, ecology, affordances, poiObservations)));

    const refreshGatePresentation = () => {
      const active = isAffordanceActive(affordances, 'SIGNAL_RELAY'); const ready = canActivateAffordance('SIGNAL_RELAY', activeDiscovery);
      relayView.alpha = active ? 1 : ready ? 1 : 0.32; relayView.scale.set(active || ready ? 1.08 : 1); riftView.visible = !active; phaseBridgeView.visible = active; distantTarget.alpha = active ? 0.35 : 1;
    };
    refreshGatePresentation();
    if (activeDiscovery) status.activeText.text = activeEffectSummary(activeDiscovery);

    app.ticker.add(ticker => {
      if (mobileInput.debugPressed) { mobileInput.debugPressed = false; setDebugOpen(!debugOpen); }
      if (mobileInput.resetPressed) { mobileInput.resetPressed = false; const now = Date.now(); if (now <= resetConfirmUntil) { window.localStorage.removeItem(SAVE_KEY); window.location.reload(); return; } resetConfirmUntil = now + RESET_CONFIRM_MS; status.goalText.text = 'RESET // tap RESET again within 3 seconds'; }
      if (mobileInput.codexPressed || keyboardCodex) { mobileInput.codexPressed = false; keyboardCodex = false; setCodexOpen(!codexOpen); } if (codexOpen) return;
      const dt = Math.min(ticker.deltaMS / 1000, 0.05); tickCombat(combat, enemies, dt); dodgeCooldown = Math.max(0, dodgeCooldown - dt);
      const effects = resolveDiscoveryEffects(activeDiscovery); const axis = Math.abs(mobileInput.moveX) > 0.01 ? mobileInput.moveX : ((keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)); const guarding = mobileInput.guardHeld || keys.has('KeyK'); const previousY = locomotion.y;
      const gateOpen = isAffordanceActive(affordances, 'SIGNAL_RELAY'); const movementMaxX = gateOpen ? observedWorldWidth - 18 : Math.min(LOCKED_MAX_X, observedWorldWidth - 18);
      stepLocomotion(locomotion, { moveX: axis, jumpPressed: mobileInput.jumpPressed || keyboardJump, guardHeld: guarding }, dt, GROUND_Y, PLAYER_MIN_X, movementMaxX, locomotionConfigForEffects(effects)); mobileInput.jumpPressed = false; keyboardJump = false; landOnPlatforms(previousY, locomotion, platforms);
      if (!gateOpen && locomotion.x >= LOCKED_MAX_X - 8) status.goalText.text = activeDiscovery?.traits.includes('CONDUCTIVE') ? 'THE RELAY IS REACTING // use it to restore the path' : 'THE PATH IS DEAD // find a way to carry SIGNAL across it';

      if (gateOpen && shouldRevealNextRegion(locomotion.x, regions)) { const region = generateNextRegion(regions, WORLD_SEED, { codexCount: codex.entries.length, activeTraits: activeDiscovery?.traits ?? [], pressure }); if (region) { platforms.push(...renderRegion(regionLayer, region)); observedWorldWidth = worldExtent(regions); renderPoiLayer(poiLayer, regions, poiObservations); status.goalText.text = `NEW REGION // ${region.biome.replace('_', ' ')} · reach the unknown structure`; persistKnowledge(); } }
      if ((mobileInput.dodgePressed || keys.has('ShiftLeft')) && dodgeCooldown <= 0 && Math.abs(axis) > 0.1) { locomotion.x = Math.max(PLAYER_MIN_X, Math.min(movementMaxX, locomotion.x + Math.sign(axis) * 58 * effects.dodgeDistanceMultiplier)); locomotion.vx = Math.sign(axis) * 260; dodgeCooldown = 0.5; startDodgeInvulnerability(combat); } mobileInput.dodgePressed = false;

      const nearbyNode = RESOURCE_NODES.find(node => !node.depleted && Math.abs(node.x - locomotion.x) <= INTERACT_RANGE); const nearSynth = Math.abs(SYNTH_X - locomotion.x) <= INTERACT_RANGE + 8; const nearRelay = Math.abs(RELAY_X - locomotion.x) <= INTERACT_RANGE; const poi = nearbyPoi(regions, locomotion.x); const relayReady = canActivateAffordance('SIGNAL_RELAY', activeDiscovery);
      status.prompt.text = nearbyNode ? `COLLECT ${nearbyNode.resource}` : nearSynth ? (inventory.LIFE > 0 && inventory.SIGNAL > 0 ? 'COMBINE LIFE + SIGNAL' : 'THE SYNTH NEEDS LIFE + SIGNAL') : nearRelay ? (gateOpen ? '' : relayReady ? 'RESTORE THE BROKEN PATH' : 'DORMANT RELAY · IT NEEDS CONDUCTIVE') : poi && !isPoiScanned(poiObservations, poi.id) ? 'OBSERVE THE STRUCTURE YOU REACHED' : '';

      if (mobileInput.interactPressed || keyboardInteract) {
        if (nearbyNode) { const amount = nearbyNode.amount; if (gatherNode(nearbyNode, inventory)) { recordGatherPressure(pressure, nearbyNode.resource, amount); const view = nodeViews.get(nearbyNode.id); if (view) view.alpha = 0.12; status.goalText.text = inventory.LIFE > 0 && inventory.SIGNAL > 0 ? 'YOU HAVE LIFE + SIGNAL // bring them to the synthesis node' : `COLLECTED ${nearbyNode.resource} // find the other signal component`; persistKnowledge(); } }
        else if (nearSynth && inventory.LIFE > 0 && inventory.SIGNAL > 0) { const discovery = synthesize(synthesis, inventory, WORLD_SEED, 'LIFE', 'SIGNAL'); if (discovery) { activeDiscovery = discovery; recordTraitUsage(pressure, discovery.traits); recordDiscovery(codex, discovery, ['LIFE', 'SIGNAL']); status.activeText.text = activeEffectSummary(activeDiscovery); codexPage = refreshCodexModal(codexModal, codex, codexPage); resultOrb.visible = true; refreshGatePresentation(); status.goalText.text = discovery.traits.includes('CONDUCTIVE') ? 'CONDUCTIVE DISCOVERY // the dead relay is responding' : `DISCOVERY // ${discovery.traits.join(' + ')} · keep investigating`; persistKnowledge(); } }
        else if (nearRelay && !gateOpen && relayReady) { if (activateAffordance(affordances, 'SIGNAL_RELAY', activeDiscovery) === 'ACTIVATED') { ensurePlatform(platforms, PHASE_BRIDGE); refreshGatePresentation(); status.goalText.text = 'PATH RESTORED // cross the rift and reach the unknown structure'; persistKnowledge(); } }
        else if (poi && !isPoiScanned(poiObservations, poi.id)) { if (scanPoi(poiObservations, poi)) { renderPoiLayer(poiLayer, regions, poiObservations); status.goalText.text = `${poiLabel(poi.kind)} // ${poi.clue}`; persistKnowledge(); } }
      }
      mobileInput.interactPressed = false; keyboardInteract = false;

      if (mobileInput.attackPressed || keyboardAttack) { const target = enemies.filter(enemy => enemy.alive && Math.sign(enemy.x - locomotion.x) === locomotion.facing).sort((a, b) => Math.abs(a.x - locomotion.x) - Math.abs(b.x - locomotion.x))[0]; if (target) { const wasAlive = target.alive; if (attackEnemy(combat, target, Math.abs(target.x - locomotion.x), { damageBonus: effects.attackDamageBonus, rangeBonus: effects.attackRangeBonus }) && wasAlive && !target.alive) { recordCreatureDefeat(pressure); grantEnemyLoot(target, inventory); persistKnowledge(); } } } mobileInput.attackPressed = false; keyboardAttack = false;
      for (const enemy of enemies) { const view = enemyViews.get(enemy.id); if (!view) continue; view.visible = enemy.alive; if (!enemy.alive) continue; const distance = Math.abs(enemy.x - locomotion.x); if (distance < 180) enemy.x += Math.sign(locomotion.x - enemy.x) * 34 * dt; view.x = enemy.x; enemyContactHit(combat, enemy, distance, guarding); const hp = view.getChildByName('hp'); if (hp instanceof Graphics) hp.clear().rect(-20, -34, 40, 4).fill(0x33191c).rect(-20, -34, 40 * (enemy.hp / enemy.maxHp), 4).fill(0xff7a59); }

      status.inventoryText.text = `LIFE ${inventory.LIFE}   SIGNAL ${inventory.SIGNAL}`; status.combatText.text = `HP ${'■'.repeat(combat.hp)}${'□'.repeat(combat.maxHp - combat.hp)}`; status.debugText.text = `GATE ${gateOpen ? 'OPEN' : 'LOCKED'}   REGIONS ${regions.generated.length}\nACTIVE ${activeDiscovery?.traits.join('+') || 'NONE'}\nPRESSURE LIFE ${pressure.gathered.LIFE} / SIGNAL ${pressure.gathered.SIGNAL}\nKILLS ${pressure.creatureDefeats}`;
      player.position.set(locomotion.x, locomotion.y); player.scale.x = locomotion.facing; player.alpha = guarding ? 0.72 : 1; stepCamera(camera, locomotion.x, locomotion.vx, dt, { viewportWidth: LOGICAL_WIDTH, worldWidth: observedWorldWidth, deadZoneHalfWidth: 120, lookAheadDistance: 90, followSharpness: 8, lookAheadSharpness: 6 }); world.x = -Math.round(camera.x);
    });
    const resize = () => { const scale = Math.min(window.innerWidth / LOGICAL_WIDTH, window.innerHeight / LOGICAL_HEIGHT); app.canvas.style.width = `${Math.floor(LOGICAL_WIDTH * scale)}px`; app.canvas.style.height = `${Math.floor(LOGICAL_HEIGHT * scale)}px`; }; window.addEventListener('resize', resize); resize(); console.info('[Bitland] application bootstrap complete');
  } catch (error) { console.error('[Bitland] renderer bootstrap failed', error); host.dataset.bootstrapError = 'renderer'; host.innerHTML = '<section class="bootstrap-error"><strong>BITLAND BOOT FAILURE</strong><span>Unable to initialize the game renderer. Check the browser console for diagnostics.</span></section>'; }
}

void bootstrap();
