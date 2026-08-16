import { Container, Graphics, Text, TextStyle, type Application } from 'pixi.js';
import { DevPanel, isDevPanelEnabled } from '../dev/DevPanel';
import { DEFAULT_DEV_TUNING, type DevTuning } from '../dev/DevTuning';
import { GameEventQueue } from '../domain/events';
import { LANDING_DELAY, createInitialState, type GameState } from '../domain/gameState';
import { interpretKey, interpretSwipe } from '../input/SwipeInterpreter';
import type { PlayerCommand } from '../input/commands';
import { redrawAbyssLiquid } from '../presentation/AbyssRenderer';
import { BiomeProgressRail } from '../presentation/BiomeProgressRail';
import { getBiomeTheme, mixTint } from '../presentation/BiomeTheme';
import { redrawFlowBackdrop } from '../presentation/FlowEnvironmentRenderer';
import { redrawFlowAura } from '../presentation/FlowRenderer';
import { NovaPlayerRenderer } from '../presentation/NovaPlayerRenderer';
import { getRouteTheme } from '../presentation/RouteTheme';
import { WorldRenderer } from '../presentation/WorldRenderer';
import { FxSystem } from '../presentation/fx/FxSystem';
import { createEnvironment, updateEnvironment } from '../presentation/visuals';
import { AbyssPressureSystem } from '../systems/AbyssPressureSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { FlowSystem, type FlowTier } from '../systems/FlowSystem';
import { MovementSystem, type MovementFrameState } from '../systems/MovementSystem';
import { WorldLifecycleSystem } from '../systems/WorldLifecycleSystem';
import { applyStormSurgeVelocity, stormSurgeFrame, type StormSurgeFrame } from '../world/StormSurge';

export const LOGICAL_W = 360;
export const LOGICAL_H = 720;

export class GameRuntime {
  private readonly root = new Container(); private readonly world = new Container(); private readonly particles = new Container(); private readonly hud = new Container();
  private readonly abyss = new Graphics(); private readonly flowBackdrop = new Graphics(); private readonly flowAura = new Graphics(); private readonly surgeOverlay = new Graphics(); private readonly player = new NovaPlayerRenderer();
  private readonly environment = createEnvironment(LOGICAL_W, LOGICAL_H); private readonly events = new GameEventQueue(); private readonly fx = new FxSystem(this.particles); private readonly worldRenderer = new WorldRenderer(this.world); private readonly worldLifecycle = new WorldLifecycleSystem(this.worldRenderer);
  private devTuning: DevTuning = { ...DEFAULT_DEV_TUNING }; private readonly movement = new MovementSystem(() => this.devTuning); private readonly collision = new CollisionSystem(); private readonly camera = new CameraSystem(); private readonly abyssPressure = new AbyssPressureSystem(); private readonly flow = new FlowSystem(); private readonly biomeProgress = new BiomeProgressRail();
  private readonly flowText = new Text({ text: '', style: new TextStyle({ fill: '#f0eadf', fontSize: 19, fontWeight: '600' }) }); private readonly scoreText = new Text({ text: '', style: new TextStyle({ fill: '#789b99', fontSize: 10 }) }); private readonly hpText = new Text({ text: '', style: new TextStyle({ fill: '#d8e7e2', fontSize: 13, letterSpacing: 4 }) }); private readonly dashText = new Text({ text: '', style: new TextStyle({ fill: '#a9c8c4', fontSize: 9, fontWeight: '600', letterSpacing: 1.8 }) }); private readonly surgeText = new Text({ text: '', style: new TextStyle({ fill: '#f0d79c', fontSize: 9, fontWeight: '600', letterSpacing: 2 }) }); private readonly overText = new Text({ text: '', style: new TextStyle({ fill: '#fff7ee', fontSize: 21, fontWeight: '600', align: 'center' }) });
  private frame: MovementFrameState = { state: createInitialState(this.devTuning), dashDirection: 0, dashVisualTime: 0, restartRequested: false }; private flowTier: FlowTier = 'calm'; private flowIntensity = 0; private invulnerable = 0; private pointerStartX = 0; private pointerStartY = 0; private surge: StormSurgeFrame = stormSurgeFrame(0, 'teal-ruins');

  constructor(private readonly app: Application) { this.composeScene(); }
  start() { this.bindInput(); this.resize(); window.addEventListener('resize', this.resize); if (isDevPanelEnabled()) new DevPanel(this.devTuning, (value) => { this.devTuning = value; }); this.worldLifecycle.seedInitialWorld(); this.app.ticker.add(this.tick); }
  private composeScene() { this.app.stage.addChild(this.root); this.root.addChild(this.environment.sky, this.environment.ambientWash, this.flowBackdrop, this.environment.far, this.environment.mid); this.root.addChild(this.world, this.particles, this.abyss, this.environment.foreground, this.surgeOverlay, this.hud); this.world.addChild(this.flowAura, this.player.view); const title = new Text({ text: 'VERTEX', style: new TextStyle({ fill: '#f3efe7', fontSize: 16, fontWeight: '600', letterSpacing: 6 }) }); title.position.set(22, 20); this.flowText.position.set(22, 61); this.scoreText.position.set(22, 88); this.hpText.anchor.set(1, 0); this.hpText.position.set(LOGICAL_W - 22, 22); this.dashText.anchor.set(1, 0); this.dashText.position.set(LOGICAL_W - 22, 50); this.surgeText.anchor.set(0.5); this.surgeText.position.set(LOGICAL_W / 2, 112); this.biomeProgress.view.position.set(8, 278); const helpText = new Text({ text: 'SHORT · NUDGE   LONG · DASH   WALL · SWIPE AWAY', style: new TextStyle({ fill: '#95b4b1', fontSize: 7.5, letterSpacing: 0.8 }) }); helpText.anchor.set(0.5); helpText.position.set(LOGICAL_W / 2, LOGICAL_H - 22); this.overText.anchor.set(0.5); this.overText.position.set(LOGICAL_W / 2, LOGICAL_H / 2 - 20); this.hud.addChild(title, this.flowText, this.scoreText, this.hpText, this.dashText, this.surgeText, this.biomeProgress.view, helpText, this.overText); }
  private bindInput() { window.addEventListener('keydown', (event) => this.executeCommand(interpretKey(event.key, this.frame.state.wallSide, this.frame.state.gameOver))); this.app.canvas.addEventListener('pointerdown', (event) => { this.pointerStartX = event.clientX; this.pointerStartY = event.clientY; if (this.frame.state.gameOver || this.worldLifecycle.getRunPhase() === 'chapter-clear') this.reset(); }); this.app.canvas.addEventListener('pointerup', (event) => { const command = interpretSwipe(event.clientX - this.pointerStartX, event.clientY - this.pointerStartY, this.frame.state.wallSide); this.executeCommand(command); }); }
  private executeCommand(command: PlayerCommand | null) { if (this.worldLifecycle.getRunPhase() === 'chapter-clear') return; this.frame = this.movement.execute(this.frame, command, this.camera.getOffset(), this.events); if (this.frame.restartRequested) this.reset(); }
  private readonly resize = () => { const scale = Math.min(innerWidth / LOGICAL_W, innerHeight / LOGICAL_H); this.app.canvas.style.width = `${LOGICAL_W * scale}px`; this.app.canvas.style.height = `${LOGICAL_H * scale}px`; };
  private reset() { this.frame = { state: createInitialState(this.devTuning), dashDirection: 0, dashVisualTime: 0, restartRequested: false }; this.flow.reset(); this.flowTier = 'calm'; this.flowIntensity = 0; this.invulnerable = 0; this.surge = stormSurgeFrame(0, 'teal-ruins'); this.camera.reset(); this.abyssPressure.reset(); this.events.clear(); this.fx.reset(); this.worldLifecycle.reset(); this.biomeProgress.update(this.worldLifecycle.getVisualBiome()); this.overText.text = ''; }
  private readonly tick = (ticker: { deltaMS: number }) => { const dt = Math.min(0.033, ticker.deltaMS / 1000); this.fx.update(dt); if (!this.frame.state.gameOver && this.worldLifecycle.getRunPhase() !== 'chapter-clear') { const previousY = this.frame.state.playerY; this.frame = this.movement.update(this.frame, dt); this.surge = stormSurgeFrame(this.frame.state.elapsed, this.worldLifecycle.getVisualBiome()); if (this.frame.state.wallSide === 0) this.frame = { ...this.frame, state: { ...this.frame.state, velocityX: applyStormSurgeVelocity(this.frame.state.velocityX, this.surge, dt) } }; this.invulnerable = Math.max(0, this.invulnerable - dt); this.worldLifecycle.updateMotion(this.frame.state.elapsed, this.frame.state.playerX, this.frame.state.playerY, dt); const collisionResult = this.collision.update(this.frame.state, previousY, this.worldLifecycle.state, this.camera.getOffset(), this.invulnerable, this.events, this.devTuning.invincible); this.frame = { ...this.frame, state: collisionResult.state }; this.invulnerable = collisionResult.invulnerable; const chapterCleared = this.worldLifecycle.markChapterClearForLanding(collisionResult.landedPlatformId); if (chapterCleared) { this.surge = stormSurgeFrame(0, 'teal-ruins'); this.abyssPressure.keepBehind(this.frame.state.playerY); } const flowFrame = this.flow.update(this.frame.state, dt); this.frame = { ...this.frame, state: flowFrame.state }; this.flowTier = flowFrame.tier; this.flowIntensity = flowFrame.intensity; if (flowFrame.enteredTier) this.events.emit({ type: 'flow-tier-entered', x: this.frame.state.playerX, y: this.frame.state.playerY + this.camera.getOffset(), tier: flowFrame.enteredTier }); const cameraOffset = this.camera.update(this.frame.state.playerY, dt); const flowVisualIntensity = Math.min(1, this.flowIntensity + this.fx.getFlowTransitionBoost() * 0.35); this.worldLifecycle.update(cameraOffset); const visualRoute = this.worldLifecycle.getVisualRoute(); const routeTheme = visualRoute ? getRouteTheme(visualRoute) : null; const biomeTheme = getBiomeTheme(this.worldLifecycle.getVisualBiome()); const ambient = routeTheme ? { color: mixTint(biomeTheme.ambient, routeTheme.ambient, 0.46), alpha: Math.max(biomeTheme.ambientAlpha, routeTheme.ambientAlpha), mote: mixTint(biomeTheme.mote, routeTheme.mote, 0.5) } : { color: biomeTheme.ambient, alpha: biomeTheme.ambientAlpha, mote: biomeTheme.mote }; updateEnvironment(this.environment, cameraOffset, this.frame.state.elapsed, LOGICAL_H, flowVisualIntensity, ambient); this.worldRenderer.update(this.worldLifecycle.state.all(), cameraOffset, this.frame.state.elapsed, this.frame.state.playerX, this.frame.state.playerY, dt); this.biomeProgress.update(this.worldLifecycle.getVisualBiome()); if (!chapterCleared) { this.abyssPressure.update(dt); if (this.devTuning.invincible) this.abyssPressure.keepBehind(this.frame.state.playerY); else if (this.abyssPressure.isCaught(this.frame.state.playerY)) this.frame = { ...this.frame, state: { ...this.frame.state, gameOver: true, hp: 0 } }; } } this.renderFrame(); };
  private renderFrame() { const state: GameState = this.frame.state; const cameraOffset = this.camera.getOffset(); this.fx.consume(this.events.drain()); const transitionBoost = this.fx.getFlowTransitionBoost(); const shake = this.fx.getShake(state.elapsed); this.world.position.set(shake.x, shake.y); this.particles.position.set(shake.x, shake.y); redrawFlowBackdrop(this.flowBackdrop, LOGICAL_W, LOGICAL_H, this.flowIntensity, transitionBoost); redrawFlowAura(this.flowAura, state.playerX, state.playerY + cameraOffset, state.elapsed, this.flowIntensity, this.flowTier, transitionBoost); this.player.update({ x: state.playerX, y: state.playerY + cameraOffset, elapsed: state.elapsed, velocityY: state.velocityY, dashDirection: this.frame.dashDirection, dashVisualTime: this.frame.dashVisualTime }); if (state.landingTime > 0) { const pulse = Math.sin((1 - state.landingTime / LANDING_DELAY) * Math.PI); this.player.view.scale.set(1 + pulse * 0.16, 1 - pulse * 0.14); } else this.player.view.scale.set(1); this.player.view.alpha = this.invulnerable > 0 && Math.floor(this.invulnerable * 12) % 2 === 0 ? 0.35 : 1; redrawAbyssLiquid(this.abyss, LOGICAL_W, state.elapsed); this.abyss.position.set(0, this.abyssPressure.getScreenY(cameraOffset)); this.drawSurge(); this.flowText.text = `×${state.flow.toFixed(1)}  ${this.flowTier.toUpperCase()}`; this.flowText.alpha = 0.72 + this.flowIntensity * 0.28; this.flowText.scale.set(1 + this.flowIntensity * 0.035); this.scoreText.text = `${Math.floor(state.score).toLocaleString()} · ${state.elapsed.toFixed(1)}s`; this.hpText.text = this.devTuning.invincible ? 'DEV ∞' : '◇'.repeat(state.hp); this.dashText.text = state.wallSide !== 0 ? 'WALL  ↗' : state.dashReady ? 'DASH  ◆' : 'DASH  ·'; this.dashText.alpha = state.dashReady || state.wallSide !== 0 ? 1 : 0.45; if (this.worldLifecycle.getRunPhase() === 'chapter-clear') this.overText.text = `CHAPTER 1 CLEAR\n\nSUMMIT REACHED\n\n${Math.floor(state.score).toLocaleString()} · ${state.elapsed.toFixed(1)}s\n\nTAP TO ASCEND AGAIN`; else if (state.gameOver) this.overText.text = `THE ABYSS CAUGHT YOU\n\n${Math.floor(state.score).toLocaleString()}\n\nTAP TO RETURN`; }
  private drawSurge() {
    this.surgeOverlay.clear();
    this.surgeText.scale.set(1);
    this.surgeText.alpha = 0;
    if (this.worldLifecycle.getRunPhase() === 'chapter-clear') { this.surgeText.text = ''; return; }
    if (this.surge.phase === 'calm') { this.surgeText.text = ''; return; }

    const dir = this.surge.direction > 0 ? '→' : '←';
    const active = this.surge.phase === 'active';
    const warning = this.surge.phase === 'warning';
    this.surgeText.text = warning ? `STORM BUILDING  ${dir}` : active ? `STORM SURGE  ${dir}${dir}${dir}` : '';
    this.surgeText.alpha = warning ? 0.45 + this.surge.intensity * 0.45 : active ? 1 : 0;
    this.surgeText.scale.set(active ? 1.12 : 1);

    const washAlpha = active ? 0.1 + this.surge.intensity * 0.12 : 0.02 + this.surge.intensity * 0.045;
    this.surgeOverlay.rect(0, 0, LOGICAL_W, LOGICAL_H).fill({ color: 0xd9b96e, alpha: washAlpha });

    if (!warning && !active) return;
    const speed = active ? 430 : 150;
    const spacing = active ? 54 : 72;
    const offset = (this.frame.state.elapsed * speed * this.surge.direction) % spacing;
    const sourceX = this.surge.direction > 0 ? 0 : LOGICAL_W - 28;
    this.surgeOverlay.rect(sourceX, 0, 28, LOGICAL_H).fill({ color: 0xf0d79c, alpha: active ? 0.09 + this.surge.intensity * 0.08 : 0.025 });

    for (let y = 128; y < LOGICAL_H - 50; y += active ? 46 : 76) {
      for (let x = -90; x < LOGICAL_W + 90; x += spacing) {
        const sx = x + offset;
        const length = active ? 34 + ((y + x) % 3) * 9 : 22;
        this.surgeOverlay.moveTo(sx, y).lineTo(sx + length * this.surge.direction, y - 7).stroke({ color: 0xffe6a8, alpha: active ? 0.18 + this.surge.intensity * 0.28 : 0.08 + this.surge.intensity * 0.12, width: active ? 1.5 : 1 });
      }
    }
  }
}
