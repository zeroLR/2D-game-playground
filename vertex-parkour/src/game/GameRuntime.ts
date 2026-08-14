import { Container, Graphics, Text, TextStyle, type Application } from 'pixi.js';
import { GameEventQueue } from '../domain/events';
import { LANDING_DELAY, createInitialState, type GameState } from '../domain/gameState';
import { interpretKey, interpretSwipe } from '../input/SwipeInterpreter';
import type { PlayerCommand } from '../input/commands';
import { redrawAbyssLiquid } from '../presentation/AbyssRenderer';
import { redrawFlowBackdrop } from '../presentation/FlowEnvironmentRenderer';
import { redrawFlowAura } from '../presentation/FlowRenderer';
import { WorldRenderer } from '../presentation/WorldRenderer';
import { FxSystem } from '../presentation/fx/FxSystem';
import { createEnvironment, redrawPlayer, updateEnvironment } from '../presentation/visuals';
import { AbyssPressureSystem } from '../systems/AbyssPressureSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { FlowSystem, type FlowTier } from '../systems/FlowSystem';
import { MovementSystem, type MovementFrameState } from '../systems/MovementSystem';
import { WorldLifecycleSystem } from '../systems/WorldLifecycleSystem';

export const LOGICAL_W = 360;
export const LOGICAL_H = 720;

export class GameRuntime {
  private readonly root = new Container();
  private readonly world = new Container();
  private readonly particles = new Container();
  private readonly hud = new Container();
  private readonly abyss = new Graphics();
  private readonly flowBackdrop = new Graphics();
  private readonly flowAura = new Graphics();
  private readonly player = new Graphics();
  private readonly environment = createEnvironment(LOGICAL_W, LOGICAL_H);
  private readonly events = new GameEventQueue();
  private readonly fx = new FxSystem(this.particles);
  private readonly worldRenderer = new WorldRenderer(this.world);
  private readonly worldLifecycle = new WorldLifecycleSystem(this.worldRenderer);
  private readonly movement = new MovementSystem();
  private readonly collision = new CollisionSystem();
  private readonly camera = new CameraSystem();
  private readonly abyssPressure = new AbyssPressureSystem();
  private readonly flow = new FlowSystem();

  private readonly flowText = new Text({ text: '', style: new TextStyle({ fill: '#f0eadf', fontSize: 19, fontWeight: '600' }) });
  private readonly scoreText = new Text({ text: '', style: new TextStyle({ fill: '#789b99', fontSize: 10 }) });
  private readonly hpText = new Text({ text: '', style: new TextStyle({ fill: '#d8e7e2', fontSize: 13, letterSpacing: 4 }) });
  private readonly dashText = new Text({ text: '', style: new TextStyle({ fill: '#a9c8c4', fontSize: 9, fontWeight: '600', letterSpacing: 1.8 }) });
  private readonly overText = new Text({ text: '', style: new TextStyle({ fill: '#fff7ee', fontSize: 21, fontWeight: '600', align: 'center' }) });

  private frame: MovementFrameState = { state: createInitialState(), dashDirection: 0, dashVisualTime: 0, restartRequested: false };
  private flowTier: FlowTier = 'calm';
  private flowIntensity = 0;
  private invulnerable = 0;
  private pointerStartX = 0;
  private pointerStartY = 0;

  constructor(private readonly app: Application) { this.composeScene(); }
  start() { this.bindInput(); this.resize(); window.addEventListener('resize', this.resize); this.worldLifecycle.seedInitialWorld(); this.app.ticker.add(this.tick); }
  private composeScene() { this.app.stage.addChild(this.root); this.root.addChild(this.environment.sky, this.flowBackdrop, this.environment.far, this.environment.mid); this.root.addChild(this.world, this.particles, this.abyss, this.environment.foreground, this.hud); this.world.addChild(this.flowAura, this.player); const title = new Text({ text: 'VERTEX', style: new TextStyle({ fill: '#f3efe7', fontSize: 16, fontWeight: '600', letterSpacing: 6 }) }); title.position.set(22, 20); this.flowText.position.set(22, 61); this.scoreText.position.set(22, 88); this.hpText.anchor.set(1, 0); this.hpText.position.set(LOGICAL_W - 22, 22); this.dashText.anchor.set(1, 0); this.dashText.position.set(LOGICAL_W - 22, 50); const helpText = new Text({ text: 'SHORT · NUDGE   LONG · DASH   WALL · SWIPE AWAY', style: new TextStyle({ fill: '#95b4b1', fontSize: 7.5, letterSpacing: 0.8 }) }); helpText.anchor.set(0.5); helpText.position.set(LOGICAL_W / 2, LOGICAL_H - 22); this.overText.anchor.set(0.5); this.overText.position.set(LOGICAL_W / 2, LOGICAL_H / 2 - 20); this.hud.addChild(title, this.flowText, this.scoreText, this.hpText, this.dashText, helpText, this.overText); }
  private bindInput() { window.addEventListener('keydown', (event) => this.executeCommand(interpretKey(event.key, this.frame.state.wallSide, this.frame.state.gameOver))); this.app.canvas.addEventListener('pointerdown', (event) => { this.pointerStartX = event.clientX; this.pointerStartY = event.clientY; if (this.frame.state.gameOver) this.reset(); }); this.app.canvas.addEventListener('pointerup', (event) => { const command = interpretSwipe(event.clientX - this.pointerStartX, event.clientY - this.pointerStartY, this.frame.state.wallSide); this.executeCommand(command); }); }
  private executeCommand(command: PlayerCommand | null) { this.frame = this.movement.execute(this.frame, command, this.camera.getOffset(), this.events); if (this.frame.restartRequested) this.reset(); }
  private readonly resize = () => { const scale = Math.min(innerWidth / LOGICAL_W, innerHeight / LOGICAL_H); this.app.canvas.style.width = `${LOGICAL_W * scale}px`; this.app.canvas.style.height = `${LOGICAL_H * scale}px`; };
  private reset() { this.frame = { state: createInitialState(), dashDirection: 0, dashVisualTime: 0, restartRequested: false }; this.flow.reset(); this.flowTier = 'calm'; this.flowIntensity = 0; this.invulnerable = 0; this.camera.reset(); this.abyssPressure.reset(); this.events.clear(); this.fx.reset(); this.worldLifecycle.reset(); this.overText.text = ''; }
  private readonly tick = (ticker: { deltaMS: number }) => { const dt = Math.min(0.033, ticker.deltaMS / 1000); this.fx.update(dt); if (!this.frame.state.gameOver) { const previousY = this.frame.state.playerY; this.frame = this.movement.update(this.frame, dt); this.invulnerable = Math.max(0, this.invulnerable - dt); this.worldLifecycle.updateMotion(this.frame.state.elapsed); const collisionResult = this.collision.update(this.frame.state, previousY, this.worldLifecycle.state, this.camera.getOffset(), this.invulnerable, this.events); this.frame = { ...this.frame, state: collisionResult.state }; this.invulnerable = collisionResult.invulnerable; const flowFrame = this.flow.update(this.frame.state, dt); this.frame = { ...this.frame, state: flowFrame.state }; this.flowTier = flowFrame.tier; this.flowIntensity = flowFrame.intensity; if (flowFrame.enteredTier) this.events.emit({ type: 'flow-tier-entered', x: this.frame.state.playerX, y: this.frame.state.playerY + this.camera.getOffset(), tier: flowFrame.enteredTier }); const cameraOffset = this.camera.update(this.frame.state.playerY, dt); const flowVisualIntensity = Math.min(1, this.flowIntensity + this.fx.getFlowTransitionBoost() * 0.35); updateEnvironment(this.environment, cameraOffset, this.frame.state.elapsed, LOGICAL_H, flowVisualIntensity); this.worldLifecycle.update(cameraOffset); this.worldRenderer.update(this.worldLifecycle.state.all(), cameraOffset, this.frame.state.elapsed, this.frame.state.playerX, this.frame.state.playerY, dt); this.abyssPressure.update(dt); if (this.abyssPressure.isCaught(this.frame.state.playerY)) this.frame = { ...this.frame, state: { ...this.frame.state, gameOver: true, hp: 0 } }; } this.renderFrame(); };
  private renderFrame() { const state: GameState = this.frame.state; const cameraOffset = this.camera.getOffset(); this.fx.consume(this.events.drain()); const transitionBoost = this.fx.getFlowTransitionBoost(); const shake = this.fx.getShake(state.elapsed); this.world.position.set(shake.x, shake.y); this.particles.position.set(shake.x, shake.y); redrawFlowBackdrop(this.flowBackdrop, LOGICAL_W, LOGICAL_H, this.flowIntensity, transitionBoost); redrawFlowAura(this.flowAura, state.playerX, state.playerY + cameraOffset, state.elapsed, this.flowIntensity, this.flowTier, transitionBoost); redrawPlayer(this.player, state.playerX, state.playerY + cameraOffset, state.elapsed, this.frame.dashDirection); if (state.landingTime > 0) { const pulse = Math.sin((1 - state.landingTime / LANDING_DELAY) * Math.PI); this.player.scale.set(1 + pulse * 0.16, 1 - pulse * 0.14); } else this.player.scale.set(1); this.player.alpha = this.invulnerable > 0 && Math.floor(this.invulnerable * 12) % 2 === 0 ? 0.35 : 1; redrawAbyssLiquid(this.abyss, LOGICAL_W, state.elapsed); this.abyss.position.set(0, this.abyssPressure.getScreenY(cameraOffset)); this.flowText.text = `×${state.flow.toFixed(1)}  ${this.flowTier.toUpperCase()}`; this.flowText.alpha = 0.72 + this.flowIntensity * 0.28; this.flowText.scale.set(1 + this.flowIntensity * 0.035); this.scoreText.text = `${Math.floor(state.score).toLocaleString()} · ${state.elapsed.toFixed(1)}s`; this.hpText.text = '◇'.repeat(state.hp); this.dashText.text = state.wallSide !== 0 ? 'WALL  ↗' : state.dashReady ? 'DASH  ◆' : 'DASH  ·'; this.dashText.alpha = state.dashReady || state.wallSide !== 0 ? 1 : 0.45; if (state.gameOver) this.overText.text = `THE ABYSS CAUGHT YOU\n\n${Math.floor(state.score).toLocaleString()}\n\nTAP TO RETURN`; }
}
