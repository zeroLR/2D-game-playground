import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { AudioDirector } from '../audio/AudioDirector';
import { type ArenaBounds, type WallSide } from '../game/BallModel';
import { DestructionSession, type DestructionEvent } from '../game/DestructionSession';
import type { TargetState } from '../game/TargetSystem';
import { classifyGesturePath } from '../input/GestureRecognizer';
import { PointerPathSampler } from '../input/PointerPathSampler';
import type { Point2D } from '../input/SwipeClassifier';
import type { RuneKind } from '../rune/RuneTypes';
import { CameraFeedback } from './CameraFeedback';
import { ImpactPool } from './ImpactPool';

const COLORS = {
  background: 0x050711,
  arena: 0x0a1020,
  arenaLine: 0x6548a8,
  cyan: 0x6fe9ff,
  magenta: 0xd756ff,
  violet: 0x8f4dff,
  text: 0xcfefff,
  muted: 0x71829b,
  crystal: 0xff4fcf,
  armored: 0xb582ff,
  white: 0xf0fbff,
};

const TRAIL_POINTS = 34;
const NORMAL_TRAIL_POINTS = 15;
const WALL_FLASH_SECONDS = 0.16;
const REBOUND_BEAT_SECONDS = 0.18;
const TARGET_HIT_FLASH_SECONDS = 0.10;
const TARGET_SPAWN_SECONDS = 0.22;
const BREAK_RING_SECONDS = 0.22;
const RUNE_CONFIRM_SECONDS = 0.38;
const GESTURE_RELEASE_SECONDS = 0.22;
const RUNE_FEEDBACK_SECONDS = 0.42;
const CHAIN_FX_SECONDS = 0.32;
const OVERDRIVE_ENTRY_SECONDS = 0.72;
const OVERDRIVE_EXIT_SECONDS = 0.46;
const MAX_BREAK_RINGS = 18;
const MAX_REBOUND_BEATS = 6;
const MAX_RUNE_CONFIRMATIONS = 8;
const MAX_CHAIN_BEATS = 6;
const MAX_OVERDRIVE_BEATS = 3;

interface BreakRing {
  position: Point2D;
  life: number;
  duration: number;
}

interface ReboundBeat {
  position: Point2D;
  side: WallSide;
  life: number;
}

interface RuneConfirmation {
  rune: RuneKind;
  center: Point2D;
  life: number;
  success: boolean;
}

interface ReleasedGesture {
  points: Point2D[];
  life: number;
  success: boolean;
}

interface ChainBeat {
  origin: Point2D;
  targets: Point2D[];
  life: number;
}

interface OverdriveBeat {
  center: Point2D;
  life: number;
  duration: number;
  entering: boolean;
}

export class DestructionScene extends Container {
  private readonly backdrop = new Graphics();
  private readonly cameraRig = new Container();
  private readonly arena = new Graphics();
  private readonly flowFx = new Graphics();
  private readonly targets = new Graphics();
  private readonly wallFlash = new Graphics();
  private readonly reboundFx = new Graphics();
  private readonly breakRings = new Graphics();
  private readonly trail = new Graphics();
  private readonly runeFx = new Graphics();
  private readonly overdriveFx = new Graphics();
  private readonly impactPool = new ImpactPool();
  private readonly ballGlow = new Graphics().circle(0, 0, 38).fill({ color: COLORS.violet, alpha: 0.18 });
  private readonly ballSigil = new Graphics();
  private readonly ball = new Graphics()
    .circle(0, 0, 18)
    .fill({ color: 0x111629, alpha: 1 })
    .circle(0, 0, 16)
    .stroke({ color: COLORS.cyan, width: 2.4, alpha: 0.98 });
  private readonly ballCore = new Graphics()
    .circle(0, 0, 6)
    .fill({ color: COLORS.white, alpha: 0.98 })
    .circle(0, 0, 10)
    .stroke({ color: COLORS.cyan, width: 1, alpha: 0.42 });
  private readonly screenPulse = new Graphics();
  private readonly gestureTrace = new Graphics();
  private readonly runeChargeBar = new Graphics();
  private readonly flowBar = new Graphics();
  private readonly inputSurface = new Graphics();
  private readonly scoreText = new Text({
    text: 'SCORE 000000',
    style: {
      fill: COLORS.text,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.1,
    },
  });
  private readonly comboText = new Text({
    text: 'COMBO --',
    style: {
      fill: COLORS.magenta,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
    },
  });
  private readonly runeGuide = new Text({
    text: '100   ○   V   Z',
    style: {
      fill: COLORS.violet,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
    },
  });
  private readonly runeFeedback = new Text({
    text: '',
    style: {
      fill: COLORS.muted,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
    },
  });

  private readonly session: DestructionSession;
  private readonly pathSampler = new PointerPathSampler();
  private readonly audio = new AudioDirector();
  private readonly cameraFeedback = new CameraFeedback();
  private arenaBounds: ArenaBounds;
  private viewportWidth = 1;
  private viewportHeight = 1;
  private readonly trailPoints: Point2D[] = [];
  private readonly wallFlashes: Record<WallSide, number> = { left: 0, right: 0, top: 0, bottom: 0 };
  private readonly targetHitFlashes = new Map<number, number>();
  private readonly targetSpawnLives = new Map<number, number>();
  private readonly activeBreakRings: BreakRing[] = [];
  private readonly activeReboundBeats: ReboundBeat[] = [];
  private readonly runeConfirmations: RuneConfirmation[] = [];
  private readonly chainBeats: ChainBeat[] = [];
  private readonly overdriveBeats: OverdriveBeat[] = [];
  private activePointerId: number | null = null;
  private releasedGesture: ReleasedGesture | null = null;
  private runeFeedbackLife = 0;
  private presentationTime = 0;
  private cameraOffset: Point2D = { x: 0, y: 0 };
  private reducedMotion = false;

  constructor(width: number, height: number) {
    super();
    this.viewportWidth = Math.max(1, width);
    this.viewportHeight = Math.max(1, height);
    this.arenaBounds = this.calculateArenaBounds(width, height);
    this.session = new DestructionSession(this.arenaBounds);
    this.reducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cameraFeedback.setReducedMotion(this.reducedMotion);
    this.impactPool.setReducedMotion(this.reducedMotion);

    this.scoreText.anchor.set(0, 0);
    this.comboText.anchor.set(1, 0);
    this.runeGuide.anchor.set(0.5, 1);
    this.runeFeedback.anchor.set(0.5);
    this.runeFeedback.alpha = 0;

    this.inputSurface.eventMode = 'static';
    this.inputSurface.cursor = 'crosshair';
    this.inputSurface
      .on('pointerdown', this.handlePointerDown)
      .on('pointermove', this.handlePointerMove)
      .on('pointerup', this.handlePointerUp)
      .on('pointerupoutside', this.handlePointerUp)
      .on('pointercancel', this.handlePointerCancel);

    this.cameraRig.addChild(
      this.arena,
      this.flowFx,
      this.targets,
      this.wallFlash,
      this.reboundFx,
      this.breakRings,
      this.trail,
      this.runeFx,
      this.impactPool,
      this.overdriveFx,
      this.ballGlow,
      this.ballSigil,
      this.ball,
      this.ballCore,
    );

    this.addChild(
      this.backdrop,
      this.cameraRig,
      this.screenPulse,
      this.gestureTrace,
      this.runeChargeBar,
      this.flowBar,
      this.scoreText,
      this.comboText,
      this.runeGuide,
      this.runeFeedback,
      this.inputSurface,
    );

    this.setViewport(width, height);
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
    this.cameraFeedback.setReducedMotion(enabled);
    this.impactPool.setReducedMotion(enabled);
  }

  update(dtSeconds: number): void {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.presentationTime += dt;
    const events = this.session.update(dt);
    for (const event of events) this.handleGameplayEvent(event);

    for (const side of Object.keys(this.wallFlashes) as WallSide[]) {
      this.wallFlashes[side] = Math.max(0, this.wallFlashes[side] - dt);
    }
    this.decayMap(this.targetHitFlashes, dt);
    this.decayMap(this.targetSpawnLives, dt);

    for (const ring of this.activeBreakRings) ring.life -= dt;
    this.removeExpired(this.activeBreakRings);
    for (const beat of this.activeReboundBeats) beat.life -= dt;
    this.removeExpired(this.activeReboundBeats);
    for (const confirmation of this.runeConfirmations) confirmation.life -= dt;
    this.removeExpired(this.runeConfirmations);
    for (const beat of this.chainBeats) beat.life -= dt;
    this.removeExpired(this.chainBeats);
    for (const beat of this.overdriveBeats) beat.life -= dt;
    this.removeExpired(this.overdriveBeats);

    if (this.releasedGesture) {
      this.releasedGesture.life -= dt;
      if (this.releasedGesture.life <= 0) this.releasedGesture = null;
    }

    this.runeFeedbackLife = Math.max(0, this.runeFeedbackLife - dt);
    this.runeFeedback.alpha = this.runeFeedbackLife > 0
      ? Math.min(1, this.runeFeedbackLife / (RUNE_FEEDBACK_SECONDS * 0.25))
      : 0;

    this.impactPool.update(dt);
    this.cameraOffset = this.cameraFeedback.update(dt);

    const snapshot = this.session.snapshot;
    this.audio.update({
      flowIntensity: snapshot.flow.presentationIntensity,
      overdrive: snapshot.flow.overdriveActive,
    });

    const position = snapshot.ball.position;
    this.trailPoints.push({ ...position });
    if (this.trailPoints.length > TRAIL_POINTS) this.trailPoints.shift();
  }

  present(alpha: number): void {
    const snapshot = this.session.snapshot;
    const position = this.session.interpolatedBallPosition(alpha);
    const speedRatio = Math.min(1, Math.max(0, (snapshot.ball.speed - 330) / 140));
    const reboundStrength = snapshot.ball.reboundStrength;
    const reboundEnvelope = this.reboundEnvelope();
    const velocityAngle = Math.atan2(snapshot.ball.velocity.y, snapshot.ball.velocity.x);
    const flowIntensity = snapshot.flow.presentationIntensity;
    const overdrive = snapshot.flow.overdriveActive;
    const overdrivePulse = overdrive ? 0.5 + Math.sin(this.presentationTime * 12) * 0.5 : 0;

    this.cameraRig.position.set(this.cameraOffset.x, this.cameraOffset.y);

    this.ball.position.set(position.x, position.y);
    this.ball.rotation = velocityAngle;
    this.ball.scale.set(
      1 - reboundEnvelope.compression * 0.16 + reboundEnvelope.launch * 0.28 + reboundStrength * 0.10 + (overdrive ? 0.08 : 0),
      1 + reboundEnvelope.compression * 0.14 - reboundEnvelope.launch * 0.10 - reboundStrength * 0.03 - (overdrive ? 0.02 : 0),
    );
    this.ballCore.position.copyFrom(this.ball.position);
    this.ballCore.scale.set(1 + reboundEnvelope.launch * 0.07 + (overdrive ? 0.16 + overdrivePulse * 0.06 : 0));
    this.ballGlow.position.copyFrom(this.ball.position);
    this.ballGlow.alpha = 0.12 + speedRatio * 0.08 + reboundStrength * 0.18 + flowIntensity * 0.08 + (overdrive ? 0.16 : 0);
    this.ballGlow.scale.set(0.9 + speedRatio * 0.16 + reboundStrength * 0.24 + flowIntensity * 0.12 + (overdrive ? 0.26 : 0));

    this.scoreText.text = `SCORE ${snapshot.combo.score.toString().padStart(6, '0')}`;
    this.comboText.text = snapshot.combo.combo > 0 ? `COMBO ${snapshot.combo.combo}` : 'COMBO --';
    this.comboText.alpha = snapshot.combo.combo > 0 ? 1 : 0.42;
    this.comboText.style.fill = overdrive ? COLORS.white : COLORS.magenta;
    this.comboText.scale.set(overdrive ? 1.04 + overdrivePulse * 0.025 : 1);

    const charge = Math.round(snapshot.runes.charge);
    const ready = snapshot.runes.cost === 0 || snapshot.runes.charge >= snapshot.runes.cost;
    this.runeGuide.text = overdrive
      ? '∞   ○   V   Z'
      : `${charge.toString().padStart(3, '0')}   ○   V   Z`;
    this.runeGuide.alpha = ready ? 0.92 : 0.42;
    this.runeGuide.style.fill = overdrive ? COLORS.white : COLORS.violet;

    this.drawTargets(snapshot.targets, overdrive);
    this.drawTrail(position, speedRatio, reboundStrength, flowIntensity, overdrive);
    this.drawFlowState(snapshot.flow.ratio, overdrive, snapshot.flow.overdriveSecondsRemaining, snapshot.flow.overdriveDuration);
    this.drawWallFlash();
    this.drawReboundBeats();
    this.drawBreakRings(overdrive);
    this.drawRuneEffects(
      snapshot.ball.position,
      snapshot.splitEchoes,
      snapshot.runes.vortexCenter,
      snapshot.runes.vortexStrength,
      snapshot.runes.chainReady,
      overdrive,
    );
    this.drawBallSigil(position, velocityAngle, flowIntensity, overdrive);
    this.drawOverdriveBeats();
    this.drawScreenFeedback(overdrive, flowIntensity);
    this.drawGestureTrace();
    this.drawRuneCharge(snapshot.runes.charge / snapshot.runes.maxCharge, ready, overdrive);
    this.drawFlowBar(
      snapshot.flow.ratio,
      overdrive,
      snapshot.flow.overdriveSecondsRemaining / snapshot.flow.overdriveDuration,
    );
  }

  setViewport(width: number, height: number): void {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    this.viewportWidth = safeWidth;
    this.viewportHeight = safeHeight;
    this.arenaBounds = this.calculateArenaBounds(safeWidth, safeHeight);
    this.session.setBounds(this.arenaBounds);
    this.cameraRig.position.set(0, 0);

    const centerX = safeWidth * 0.5;
    const centerY = safeHeight * 0.48;
    const ambientRadius = Math.min(safeWidth, safeHeight) * 0.46;
    this.backdrop.clear().rect(0, 0, safeWidth, safeHeight).fill(COLORS.background);
    this.backdrop.circle(centerX, centerY, ambientRadius).fill({ color: 0x321654, alpha: 0.11 });
    for (const ratio of [0.38, 0.58, 0.78]) {
      this.backdrop
        .circle(centerX, centerY, ambientRadius * ratio)
        .stroke({ color: ratio === 0.58 ? COLORS.violet : COLORS.cyan, width: 1, alpha: 0.035 });
    }

    const { left, right, top, bottom } = this.arenaBounds;
    this.arena.clear()
      .roundRect(left, top, right - left, bottom - top, 26)
      .fill({ color: COLORS.arena, alpha: 0.84 })
      .stroke({ color: COLORS.arenaLine, width: 1.5, alpha: 0.66 });

    this.scoreText.position.set(left + 14, top + 16);
    this.comboText.position.set(right - 14, top + 16);
    this.runeGuide.position.set(safeWidth / 2, bottom - 20);

    this.inputSurface.clear().rect(left, top, right - left, bottom - top).fill({ color: 0xffffff, alpha: 0.001 });
    this.inputSurface.hitArea = new Rectangle(left, top, right - left, bottom - top);
  }

  private readonly handlePointerDown = (event: FederatedPointerEvent): void => {
    if (this.activePointerId !== null) return;
    void this.audio.unlock();
    this.activePointerId = event.pointerId;
    this.releasedGesture = null;
    this.pathSampler.begin({ x: event.global.x, y: event.global.y });
  };

  private readonly handlePointerMove = (event: FederatedPointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;
    this.pathSampler.add({ x: event.global.x, y: event.global.y });
  };

  private readonly handlePointerUp = (event: FederatedPointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;
    const path = this.pathSampler.finish({ x: event.global.x, y: event.global.y });
    const intent = classifyGesturePath(path);
    let success = false;

    switch (intent.type) {
      case 'swipe':
        this.session.applyDirectionalRedirect(intent.direction);
        success = true;
        break;
      case 'rune': {
        const events = this.session.activateRune(intent.rune, intent.center);
        for (const gameplayEvent of events) this.handleGameplayEvent(gameplayEvent);
        success = events.some((gameplayEvent) => gameplayEvent.type === 'rune-activated');
        break;
      }
      case 'failed-rune':
        this.showRuneFailure(intent.center, 'NO RUNE');
        this.audio.playRuneFailure();
        break;
      case 'none':
        break;
    }

    if (path.length > 1) {
      this.releasedGesture = {
        points: path.map((point) => ({ ...point })),
        life: GESTURE_RELEASE_SECONDS,
        success,
      };
    }
    this.clearPointer();
  };

  private readonly handlePointerCancel = (event: FederatedPointerEvent): void => {
    if (event.pointerId === this.activePointerId) this.clearPointer();
  };

  private clearPointer(): void {
    this.activePointerId = null;
    this.pathSampler.clear();
  }

  private handleGameplayEvent(event: DestructionEvent): void {
    switch (event.type) {
      case 'wall-hit': {
        this.wallFlashes[event.side] = WALL_FLASH_SECONDS;
        const position = this.session.snapshot.ball.position;
        this.pushCapped(
          this.activeReboundBeats,
          { position: { ...position }, side: event.side, life: REBOUND_BEAT_SECONDS },
          MAX_REBOUND_BEATS,
        );
        this.audio.playRebound();
        break;
      }
      case 'target-hit': {
        this.targetHitFlashes.set(event.targetId, TARGET_HIT_FLASH_SECONDS);
        const overdrive = this.session.snapshot.flow.overdriveActive;
        this.impactPool.spawn(event.position, overdrive ? 'overdrive' : event.source === 'chain' ? 'break' : 'hit');
        this.audio.playImpact(event.source, event.armorBroken);
        break;
      }
      case 'target-break': {
        this.targetSpawnLives.delete(event.targetId);
        const overdrive = this.session.snapshot.flow.overdriveActive;
        this.impactPool.spawn(event.position, overdrive ? 'overdrive' : 'break');
        this.pushCapped(
          this.activeBreakRings,
          { position: { ...event.position }, life: BREAK_RING_SECONDS, duration: BREAK_RING_SECONDS },
          MAX_BREAK_RINGS,
        );
        this.cameraFeedback.kick('break', event.position, this.arenaCenter());
        this.audio.playBreak(event.combo, event.source, event.kind === 'armored');
        break;
      }
      case 'target-spawn':
        this.targetSpawnLives.set(event.targetId, TARGET_SPAWN_SECONDS);
        break;
      case 'rune-activated':
        this.pushCapped(
          this.runeConfirmations,
          { rune: event.rune, center: { ...event.center }, life: RUNE_CONFIRM_SECONDS, success: true },
          MAX_RUNE_CONFIRMATIONS,
        );
        this.audio.playRune(event.rune);
        break;
      case 'rune-failed':
        this.pushCapped(
          this.runeConfirmations,
          { rune: event.rune, center: { ...event.center }, life: RUNE_CONFIRM_SECONDS * 0.70, success: false },
          MAX_RUNE_CONFIRMATIONS,
        );
        this.showRuneFailure(event.center, event.reason === 'charge' ? 'LOW CHARGE' : 'CHAIN READY');
        this.audio.playRuneFailure();
        break;
      case 'chain-triggered':
        this.pushCapped(
          this.chainBeats,
          {
            origin: { ...event.origin },
            targets: event.targets.map((point) => ({ ...point })),
            life: CHAIN_FX_SECONDS,
          },
          MAX_CHAIN_BEATS,
        );
        this.cameraFeedback.kick('chain', event.origin, this.arenaCenter());
        this.audio.playChain(event.targets.length);
        break;
      case 'overdrive-enter': {
        const center = this.session.snapshot.ball.position;
        this.pushCapped(
          this.overdriveBeats,
          { center: { ...center }, life: OVERDRIVE_ENTRY_SECONDS, duration: OVERDRIVE_ENTRY_SECONDS, entering: true },
          MAX_OVERDRIVE_BEATS,
        );
        this.cameraFeedback.kick('overdrive-enter', center, this.arenaCenter());
        this.audio.playOverdriveEnter();
        break;
      }
      case 'overdrive-exit': {
        const center = this.session.snapshot.ball.position;
        this.pushCapped(
          this.overdriveBeats,
          { center: { ...center }, life: OVERDRIVE_EXIT_SECONDS, duration: OVERDRIVE_EXIT_SECONDS, entering: false },
          MAX_OVERDRIVE_BEATS,
        );
        this.cameraFeedback.kick('overdrive-exit', center, this.arenaCenter());
        this.audio.playOverdriveExit();
        break;
      }
      case 'combo-reset':
        break;
    }
  }

  private showRuneFailure(center: Point2D, text: string): void {
    this.runeFeedback.text = text;
    this.runeFeedback.style.fill = COLORS.muted;
    this.runeFeedback.position.set(center.x, center.y - 42);
    this.runeFeedbackLife = RUNE_FEEDBACK_SECONDS;
    this.runeFeedback.alpha = 1;
  }

  private drawTargets(targets: TargetState[], overdrive: boolean): void {
    this.targets.clear();
    for (const target of targets) {
      const hitFlash = this.targetHitFlashes.get(target.id) ?? 0;
      const flashRatio = Math.min(1, hitFlash / TARGET_HIT_FLASH_SECONDS);
      const spawnLife = this.targetSpawnLives.get(target.id) ?? 0;
      const spawnProgress = spawnLife > 0 ? 1 - spawnLife / TARGET_SPAWN_SECONDS : 1;
      const spawnEase = 1 - Math.pow(1 - spawnProgress, 3);
      const spawnScale = spawnLife > 0
        ? 0.45 + spawnEase * 0.55 + Math.sin(spawnProgress * Math.PI) * 0.08
        : 1;
      const materializeAlpha = spawnLife > 0 ? 0.18 + spawnEase * 0.82 : 1;
      const radius = target.radius * spawnScale;
      const fill = target.kind === 'armored' ? COLORS.armored : COLORS.crystal;
      const alpha = (0.58 + flashRatio * 0.34) * materializeAlpha;

      if (spawnLife > 0) {
        const glyphRadius = target.radius + (1 - spawnEase) * 22;
        this.targets
          .circle(target.position.x, target.position.y, glyphRadius)
          .stroke({ color: COLORS.violet, width: 2, alpha: (1 - spawnProgress) * 0.46 });
        for (let index = 0; index < 4; index += 1) {
          const angle = index * Math.PI * 0.5;
          const inner = glyphRadius + 4;
          const outer = glyphRadius + 10;
          this.targets
            .moveTo(target.position.x + Math.cos(angle) * inner, target.position.y + Math.sin(angle) * inner)
            .lineTo(target.position.x + Math.cos(angle) * outer, target.position.y + Math.sin(angle) * outer);
        }
        this.targets.stroke({ color: COLORS.cyan, width: 1.5, alpha: (1 - spawnProgress) * 0.36 });
      }

      this.targets
        .moveTo(target.position.x, target.position.y - radius)
        .lineTo(target.position.x + radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y + radius)
        .lineTo(target.position.x - radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y - radius)
        .fill({ color: fill, alpha: alpha * 0.46 })
        .stroke({ color: flashRatio > 0 ? COLORS.white : fill, width: flashRatio > 0 ? 3 : 2, alpha });

      this.targets
        .moveTo(target.position.x, target.position.y - radius * 0.78)
        .lineTo(target.position.x + radius * 0.36, target.position.y)
        .lineTo(target.position.x, target.position.y + radius * 0.46)
        .stroke({ color: COLORS.white, width: 1, alpha: 0.22 * materializeAlpha });

      this.targets
        .circle(target.position.x, target.position.y, 4.5 * spawnScale)
        .fill({ color: COLORS.white, alpha: (0.78 + flashRatio * 0.2) * materializeAlpha });

      if (overdrive) {
        this.targets
          .circle(target.position.x, target.position.y, radius + 4)
          .stroke({ color: COLORS.white, width: 1, alpha: 0.16 * materializeAlpha });
      }

      if (target.kind === 'armored') {
        const armorAlpha = (target.hp === target.maxHp ? 0.72 : 0.34) * materializeAlpha;
        this.targets
          .circle(target.position.x, target.position.y, radius + 7 * spawnScale)
          .stroke({ color: COLORS.cyan, width: target.hp === target.maxHp ? 2.5 : 1.5, alpha: armorAlpha });
        if (target.hp < target.maxHp) {
          this.targets
            .moveTo(target.position.x - radius - 4, target.position.y - 6)
            .lineTo(target.position.x - 4, target.position.y + 2)
            .lineTo(target.position.x + 8, target.position.y - 8)
            .stroke({ color: COLORS.magenta, width: 2, alpha: 0.76 * materializeAlpha });
        }
      }
    }
  }

  private drawTrail(
    position: Point2D,
    speedRatio: number,
    reboundStrength: number,
    flowIntensity: number,
    overdrive: boolean,
  ): void {
    this.trail.clear();
    const allPoints = [...this.trailPoints, position];
    const visibleCount = overdrive ? TRAIL_POINTS : reboundStrength > 0.05 ? 28 : NORMAL_TRAIL_POINTS;
    const points = allPoints.slice(-visibleCount);
    if (points.length < 2) return;

    const peakWidth = overdrive ? 7.4 : reboundStrength > 0.05 ? 5.4 : 3.2;
    const peakAlpha = overdrive ? 0.72 : reboundStrength > 0.05 ? 0.52 : 0.34 + flowIntensity * 0.08;

    for (let index = 1; index < points.length; index += 1) {
      const life = index / (points.length - 1);
      const previous = points[index - 1];
      const current = points[index];
      const width = peakWidth * (0.20 + life * 0.80);
      const alpha = peakAlpha * Math.pow(life, 1.35);
      const newest = life > 0.72;
      const color = overdrive && newest
        ? COLORS.white
        : reboundStrength > 0.05 && newest
          ? COLORS.white
          : index % 4 === 0
            ? COLORS.magenta
            : COLORS.cyan;

      this.trail
        .moveTo(previous.x, previous.y)
        .lineTo(current.x, current.y)
        .stroke({ color, width, alpha, cap: 'round', join: 'round' });
    }

    if (overdrive || reboundStrength > 0.05) {
      for (let index = Math.max(0, points.length - 7); index < points.length; index += 2) {
        const life = (index + 1) / points.length;
        this.trail.circle(points[index].x, points[index].y, 1.8 + life * (overdrive ? 2.8 : 1.8)).fill({
          color: overdrive ? COLORS.white : COLORS.cyan,
          alpha: life * (overdrive ? 0.46 : 0.30),
        });
      }
    }

    if (speedRatio > 0.75 && !overdrive) {
      const newest = points[points.length - 1];
      this.trail.circle(newest.x, newest.y, 3.5).fill({ color: COLORS.white, alpha: 0.28 });
    }
  }

  private drawFlowState(ratio: number, overdrive: boolean, remaining: number, duration: number): void {
    const { left, right, top, bottom } = this.arenaBounds;
    const pulse = 0.5 + Math.sin(this.presentationTime * (overdrive ? 10 : 4)) * 0.5;
    const safeRatio = Math.min(1, Math.max(0, ratio));
    const activeRatio = overdrive ? Math.min(1, Math.max(0, remaining / Math.max(0.001, duration))) : safeRatio;

    this.flowFx.clear();
    if (activeRatio <= 0) return;

    this.flowFx
      .roundRect(left + 3, top + 3, right - left - 6, bottom - top - 6, 23)
      .stroke({
        color: overdrive ? COLORS.white : COLORS.violet,
        width: overdrive ? 2.2 : 1.2,
        alpha: overdrive ? 0.14 + pulse * 0.16 : safeRatio * 0.11,
      });

    const tickLength = 9 + activeRatio * 17;
    for (const [x, y, dx, dy] of [
      [left, top, 1, 1],
      [right, top, -1, 1],
      [left, bottom, 1, -1],
      [right, bottom, -1, -1],
    ] as const) {
      this.flowFx
        .moveTo(x + dx * 10, y)
        .lineTo(x + dx * tickLength, y)
        .moveTo(x, y + dy * 10)
        .lineTo(x, y + dy * tickLength)
        .stroke({
          color: overdrive ? COLORS.cyan : COLORS.violet,
          width: overdrive ? 2.6 : 1.4,
          alpha: overdrive ? 0.34 + pulse * 0.20 : safeRatio * 0.22,
        });
    }
  }

  private drawBallSigil(position: Point2D, velocityAngle: number, flowIntensity: number, overdrive: boolean): void {
    this.ballSigil.clear();
    const orbit = this.presentationTime * (overdrive ? 3.6 : 1.8);
    const radius = 24 + flowIntensity * 2 + (overdrive ? 3 : 0);
    this.ballSigil
      .circle(position.x, position.y, radius)
      .stroke({ color: overdrive ? COLORS.white : COLORS.cyan, width: overdrive ? 1.6 : 1, alpha: overdrive ? 0.48 : 0.24 + flowIntensity * 0.10 });

    for (let index = 0; index < 6; index += 1) {
      const angle = orbit + index * Math.PI / 3;
      const inner = radius + 2;
      const outer = radius + (overdrive ? 8 : 5);
      this.ballSigil
        .moveTo(position.x + Math.cos(angle) * inner, position.y + Math.sin(angle) * inner)
        .lineTo(position.x + Math.cos(angle) * outer, position.y + Math.sin(angle) * outer)
        .stroke({ color: index % 2 === 0 ? COLORS.violet : COLORS.cyan, width: overdrive ? 1.8 : 1.2, alpha: overdrive ? 0.55 : 0.30 });
    }

    const leadInner = radius + 4;
    const leadOuter = radius + (overdrive ? 17 : 11);
    this.ballSigil
      .moveTo(position.x + Math.cos(velocityAngle) * leadInner, position.y + Math.sin(velocityAngle) * leadInner)
      .lineTo(position.x + Math.cos(velocityAngle) * leadOuter, position.y + Math.sin(velocityAngle) * leadOuter)
      .stroke({ color: COLORS.white, width: overdrive ? 3 : 2, alpha: overdrive ? 0.82 : 0.58 });
  }

  private drawRuneEffects(
    ballPosition: Point2D,
    splitEchoes: Point2D[],
    vortexCenter: Point2D | null,
    vortexStrength: number,
    chainReady: boolean,
    overdrive: boolean,
  ): void {
    this.runeFx.clear();

    if (vortexCenter && vortexStrength > 0) {
      const rotation = this.presentationTime * 2.6;
      for (const radius of [42, 78, 118]) {
        this.runeFx
          .circle(vortexCenter.x, vortexCenter.y, radius * (1.12 - vortexStrength * 0.12))
          .stroke({
            color: overdrive && radius === 78 ? COLORS.white : radius === 78 ? COLORS.magenta : COLORS.violet,
            width: overdrive ? 2.8 : 2,
            alpha: vortexStrength * (overdrive ? 0.44 : 0.28),
          });
      }
      for (let index = 0; index < 6; index += 1) {
        const angle = rotation + index * (Math.PI / 3);
        this.runeFx
          .moveTo(vortexCenter.x + Math.cos(angle) * 28, vortexCenter.y + Math.sin(angle) * 28)
          .lineTo(vortexCenter.x + Math.cos(angle + 0.36) * 64, vortexCenter.y + Math.sin(angle + 0.36) * 64)
          .stroke({ color: COLORS.cyan, width: overdrive ? 2.2 : 1.5, alpha: vortexStrength * (overdrive ? 0.52 : 0.34) });
      }
    }

    for (const echo of splitEchoes) {
      this.runeFx
        .moveTo(ballPosition.x, ballPosition.y)
        .lineTo(echo.x, echo.y)
        .stroke({ color: overdrive ? COLORS.white : COLORS.violet, width: overdrive ? 2.5 : 1.5, alpha: overdrive ? 0.56 : 0.32 });
      this.runeFx.circle(echo.x, echo.y, overdrive ? 15 : 12).fill({ color: COLORS.violet, alpha: overdrive ? 0.26 : 0.16 });
      this.runeFx.circle(echo.x, echo.y, overdrive ? 9 : 7).stroke({ color: COLORS.cyan, width: overdrive ? 3.2 : 2.5, alpha: 0.82 });
      this.runeFx.circle(echo.x, echo.y, 2.5).fill({ color: COLORS.white, alpha: 0.9 });
    }

    if (chainReady) {
      const pulse = 0.5 + Math.sin(this.presentationTime * 9) * 0.5;
      this.runeFx
        .circle(ballPosition.x, ballPosition.y, (overdrive ? 31 : 27) + pulse * 2)
        .stroke({ color: overdrive ? COLORS.white : COLORS.magenta, width: overdrive ? 3.4 : 2.5, alpha: 0.58 + pulse * 0.20 });
      for (let index = 0; index < 6; index += 1) {
        const angle = index * Math.PI / 3 + this.presentationTime * 0.8;
        this.runeFx
          .moveTo(ballPosition.x + Math.cos(angle) * 29, ballPosition.y + Math.sin(angle) * 29)
          .lineTo(ballPosition.x + Math.cos(angle + 0.18) * (overdrive ? 40 : 35), ballPosition.y + Math.sin(angle + 0.18) * (overdrive ? 40 : 35))
          .stroke({ color: overdrive ? COLORS.cyan : COLORS.violet, width: overdrive ? 2.6 : 2, alpha: overdrive ? 0.70 : 0.54 });
      }
    }

    for (const confirmation of this.runeConfirmations) {
      const progress = 1 - Math.max(0, confirmation.life) / RUNE_CONFIRM_SECONDS;
      const alpha = Math.max(0, 1 - progress);
      const scale = confirmation.success ? 0.78 + progress * 0.46 : 0.92 + progress * 0.12;
      this.drawCanonicalRune(
        confirmation.rune,
        confirmation.center,
        34 * scale,
        confirmation.success ? COLORS.white : COLORS.muted,
        alpha * (confirmation.success ? 0.86 : 0.42),
      );
      if (confirmation.success) {
        this.runeFx
          .circle(confirmation.center.x, confirmation.center.y, 20 + progress * 30)
          .stroke({ color: COLORS.violet, width: 2 - progress, alpha: alpha * 0.34 });
      }
    }

    for (const beat of this.chainBeats) {
      const progress = 1 - Math.max(0, beat.life) / CHAIN_FX_SECONDS;
      const alpha = 1 - progress;
      for (const target of beat.targets) {
        this.runeFx
          .moveTo(beat.origin.x, beat.origin.y)
          .lineTo(target.x, target.y)
          .stroke({
            color: overdrive ? COLORS.white : COLORS.magenta,
            width: (overdrive ? 5 : 4) - progress * 2,
            alpha: alpha * (overdrive ? 0.88 : 0.72),
          });
        this.runeFx
          .circle(target.x, target.y, 10 + progress * (overdrive ? 24 : 18))
          .stroke({ color: overdrive ? COLORS.cyan : COLORS.violet, width: overdrive ? 3 : 2, alpha: alpha * 0.58 });

        const travel = Math.min(1, progress * 1.45);
        const spark = {
          x: beat.origin.x + (target.x - beat.origin.x) * travel,
          y: beat.origin.y + (target.y - beat.origin.y) * travel,
        };
        this.runeFx.circle(spark.x, spark.y, overdrive ? 5 : 4).fill({ color: COLORS.white, alpha: alpha * 0.92 });
      }
    }
  }

  private drawOverdriveBeats(): void {
    this.overdriveFx.clear();
    for (const beat of this.overdriveBeats) {
      const progress = 1 - Math.max(0, beat.life) / beat.duration;
      const alpha = 1 - progress;
      const maxRadius = beat.entering ? 205 : 118;
      const radius = 18 + progress * maxRadius;
      this.overdriveFx
        .circle(beat.center.x, beat.center.y, radius)
        .stroke({
          color: beat.entering ? COLORS.white : COLORS.violet,
          width: beat.entering ? 6 - progress * 4 : 3 - progress * 1.5,
          alpha: alpha * (beat.entering ? 0.84 : 0.46),
        });
      this.overdriveFx
        .circle(beat.center.x, beat.center.y, radius * 0.70)
        .stroke({ color: COLORS.cyan, width: beat.entering ? 3.5 : 2, alpha: alpha * 0.52 });

      if (beat.entering) {
        const rayCount = this.reducedMotion ? 4 : 8;
        for (let index = 0; index < rayCount; index += 1) {
          const angle = index * (Math.PI * 2 / rayCount);
          const inner = 28 + progress * 18;
          const outer = 58 + progress * 86;
          this.overdriveFx
            .moveTo(beat.center.x + Math.cos(angle) * inner, beat.center.y + Math.sin(angle) * inner)
            .lineTo(beat.center.x + Math.cos(angle) * outer, beat.center.y + Math.sin(angle) * outer)
            .stroke({ color: index % 2 === 0 ? COLORS.white : COLORS.magenta, width: 2.5, alpha: alpha * 0.46 });
        }
      }
    }
  }

  private drawScreenFeedback(overdrive: boolean, flowIntensity: number): void {
    this.screenPulse.clear();
    if (overdrive) {
      const pulse = 0.5 + Math.sin(this.presentationTime * 7) * 0.5;
      this.screenPulse.rect(0, 0, this.viewportWidth, this.viewportHeight).fill({
        color: COLORS.violet,
        alpha: this.reducedMotion ? 0.012 : 0.018 + pulse * 0.012,
      });
    } else if (flowIntensity > 0.65) {
      this.screenPulse.rect(0, 0, this.viewportWidth, this.viewportHeight).fill({
        color: COLORS.cyan,
        alpha: (flowIntensity - 0.65) * 0.012,
      });
    }

    for (const beat of this.overdriveBeats) {
      const progress = 1 - Math.max(0, beat.life) / beat.duration;
      const envelope = Math.sin(Math.min(1, progress) * Math.PI);
      const alpha = envelope * (beat.entering ? 0.10 : 0.035) * (this.reducedMotion ? 0.35 : 1);
      if (alpha <= 0) continue;
      this.screenPulse.rect(0, 0, this.viewportWidth, this.viewportHeight).fill({
        color: beat.entering ? COLORS.white : COLORS.violet,
        alpha,
      });
    }
  }

  private drawGestureTrace(): void {
    this.gestureTrace.clear();
    const active = this.activePointerId !== null ? this.pathSampler.snapshot : [];
    const released = this.releasedGesture;
    const points = active.length > 1 ? active : released?.points ?? [];
    if (points.length < 2) return;

    if (active.length > 1) {
      const intent = classifyGesturePath(active);
      const runeLike = intent.type === 'rune' || intent.type === 'failed-rune';
      const baseColor = runeLike ? COLORS.violet : intent.type === 'swipe' ? COLORS.cyan : COLORS.muted;
      this.drawPolyline(this.gestureTrace, points, baseColor, runeLike ? 7 : 5, runeLike ? 0.14 : 0.10);
      for (let index = 1; index < points.length; index += 1) {
        const life = index / (points.length - 1);
        this.gestureTrace
          .moveTo(points[index - 1].x, points[index - 1].y)
          .lineTo(points[index].x, points[index].y)
          .stroke({
            color: life > 0.78 ? (runeLike ? COLORS.magenta : COLORS.white) : baseColor,
            width: (runeLike ? 2.8 : 2.4) + life * 1.8,
            alpha: 0.28 + life * (runeLike ? 0.60 : 0.48),
            cap: 'round',
            join: 'round',
          });
      }
      const newest = points[points.length - 1];
      this.gestureTrace.circle(newest.x, newest.y, runeLike ? 5 : 4).fill({
        color: runeLike ? COLORS.magenta : COLORS.white,
        alpha: 0.82,
      });
      return;
    }

    if (released) {
      const fade = Math.max(0, released.life / GESTURE_RELEASE_SECONDS);
      this.drawPolyline(
        this.gestureTrace,
        released.points,
        released.success ? COLORS.violet : COLORS.muted,
        released.success ? 3.6 : 2.2,
        fade * (released.success ? 0.48 : 0.28),
      );
    }
  }

  private drawRuneCharge(ratio: number, ready: boolean, overdrive: boolean): void {
    const { left, right, bottom } = this.arenaBounds;
    const width = Math.min(150, (right - left) * 0.42);
    const x = (left + right) / 2 - width / 2;
    const y = bottom - 14;
    const clamped = Math.min(1, Math.max(0, ratio));

    this.runeChargeBar.clear();
    this.runeChargeBar.roundRect(x, y, width, 3, 1.5).fill({ color: COLORS.muted, alpha: 0.20 });
    const fillRatio = overdrive ? 1 : clamped;
    if (fillRatio > 0) {
      this.runeChargeBar.roundRect(x, y, width * fillRatio, 3, 1.5).fill({
        color: overdrive ? COLORS.white : ready ? COLORS.violet : COLORS.muted,
        alpha: overdrive ? 0.90 : ready ? 0.78 : 0.42,
      });
    }
  }

  private drawFlowBar(ratio: number, overdrive: boolean, remainingRatio: number): void {
    const { left, right, top } = this.arenaBounds;
    const width = Math.min(170, (right - left) * 0.46);
    const x = (left + right) / 2 - width / 2;
    const y = top + 17;
    const clamped = Math.min(1, Math.max(0, overdrive ? remainingRatio : ratio));

    this.flowBar.clear();
    this.flowBar.roundRect(x, y, width, 3, 1.5).fill({ color: COLORS.muted, alpha: 0.16 });
    if (clamped > 0) {
      this.flowBar.roundRect(x, y, width * clamped, 3, 1.5).fill({
        color: overdrive ? COLORS.white : COLORS.cyan,
        alpha: overdrive ? 0.94 : 0.42 + ratio * 0.32,
      });
      if (!overdrive && ratio > 0.75) {
        const pulse = 0.5 + Math.sin(this.presentationTime * 8) * 0.5;
        this.flowBar.circle(x + width * clamped, y + 1.5, 2.5 + pulse).fill({
          color: COLORS.white,
          alpha: 0.34 + pulse * 0.34,
        });
      }
    }
  }

  private drawCanonicalRune(rune: RuneKind, center: Point2D, size: number, color: number, alpha: number): void {
    switch (rune) {
      case 'vortex':
        this.runeFx.circle(center.x, center.y, size).stroke({ color, width: 3, alpha });
        this.runeFx
          .moveTo(center.x + size * 0.62, center.y - size * 0.35)
          .lineTo(center.x + size * 0.95, center.y)
          .lineTo(center.x + size * 0.58, center.y + size * 0.18)
          .stroke({ color, width: 3, alpha });
        break;
      case 'split':
        this.runeFx
          .moveTo(center.x - size, center.y - size * 0.72)
          .lineTo(center.x, center.y + size)
          .lineTo(center.x + size, center.y - size * 0.72)
          .stroke({ color, width: 3, alpha });
        break;
      case 'chain':
        this.runeFx
          .moveTo(center.x - size, center.y - size * 0.72)
          .lineTo(center.x + size, center.y - size * 0.72)
          .lineTo(center.x - size, center.y + size * 0.72)
          .lineTo(center.x + size, center.y + size * 0.72)
          .stroke({ color, width: 3, alpha });
        break;
    }
  }

  private drawBreakRings(overdrive: boolean): void {
    this.breakRings.clear();
    for (const ring of this.activeBreakRings) {
      const progress = 1 - Math.max(0, ring.life) / ring.duration;
      const radius = 12 + progress * (overdrive ? 38 : 30);
      this.breakRings
        .circle(ring.position.x, ring.position.y, radius)
        .stroke({
          color: overdrive ? COLORS.white : COLORS.magenta,
          width: (overdrive ? 4 : 3) - progress * 1.5,
          alpha: (1 - progress) * (overdrive ? 0.78 : 0.62),
        });
      if (!this.reducedMotion) {
        this.breakRings
          .circle(ring.position.x, ring.position.y, radius * 0.58)
          .stroke({ color: COLORS.cyan, width: 1.5, alpha: (1 - progress) * 0.30 });
      }
    }
  }

  private drawReboundBeats(): void {
    this.reboundFx.clear();
    for (const beat of this.activeReboundBeats) {
      const progress = 1 - Math.max(0, beat.life) / REBOUND_BEAT_SECONDS;
      const alpha = 1 - progress;
      const direction = this.inwardDirection(beat.side);
      const perpendicular = { x: -direction.y, y: direction.x };
      const ringRadius = 10 + progress * 32;

      this.reboundFx
        .circle(beat.position.x, beat.position.y, ringRadius)
        .stroke({ color: COLORS.white, width: 3 - progress * 1.5, alpha: alpha * 0.70 });

      for (const offset of [-9, 0, 9]) {
        const start = {
          x: beat.position.x + perpendicular.x * offset,
          y: beat.position.y + perpendicular.y * offset,
        };
        const distance = (offset === 0 ? 52 : 38) * (0.55 + progress * 0.45);
        this.reboundFx
          .moveTo(start.x, start.y)
          .lineTo(start.x + direction.x * distance, start.y + direction.y * distance)
          .stroke({
            color: offset === 0 ? COLORS.white : COLORS.cyan,
            width: offset === 0 ? 4 : 2,
            alpha: alpha * (offset === 0 ? 0.74 : 0.46),
          });
      }
    }
  }

  private drawWallFlash(): void {
    const { left, right, top, bottom } = this.arenaBounds;
    const peak = Math.max(...Object.values(this.wallFlashes));
    this.wallFlash.clear();
    if (peak <= 0) return;

    const alpha = Math.min(0.98, peak / WALL_FLASH_SECONDS);
    this.wallFlash
      .roundRect(left, top, right - left, bottom - top, 26)
      .stroke({ color: COLORS.cyan, width: 4, alpha: alpha * 0.58 });

    const drawSide = (side: WallSide): void => {
      const life = this.wallFlashes[side];
      if (life <= 0) return;
      const sideAlpha = Math.min(1, life / WALL_FLASH_SECONDS);
      switch (side) {
        case 'left':
          this.wallFlash.moveTo(left, top + 28).lineTo(left, bottom - 28);
          break;
        case 'right':
          this.wallFlash.moveTo(right, top + 28).lineTo(right, bottom - 28);
          break;
        case 'top':
          this.wallFlash.moveTo(left + 28, top).lineTo(right - 28, top);
          break;
        case 'bottom':
          this.wallFlash.moveTo(left + 28, bottom).lineTo(right - 28, bottom);
          break;
      }
      this.wallFlash.stroke({ color: COLORS.white, width: 7, alpha: sideAlpha * 0.78 });
    };

    drawSide('left');
    drawSide('right');
    drawSide('top');
    drawSide('bottom');
  }

  private drawPolyline(graphics: Graphics, points: Point2D[], color: number, width: number, alpha: number): void {
    if (points.length < 2) return;
    graphics.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) graphics.lineTo(points[index].x, points[index].y);
    graphics.stroke({ color, width, alpha, cap: 'round', join: 'round' });
  }

  private reboundEnvelope(): { compression: number; launch: number } {
    let compression = 0;
    let launch = 0;
    for (const beat of this.activeReboundBeats) {
      const progress = 1 - Math.max(0, beat.life) / REBOUND_BEAT_SECONDS;
      if (progress < 0.28) {
        const local = progress / 0.28;
        compression = Math.max(compression, 1 - local);
        launch = Math.max(launch, local);
      } else {
        launch = Math.max(launch, 1 - (progress - 0.28) / 0.72);
      }
    }
    return { compression, launch };
  }

  private inwardDirection(side: WallSide): Point2D {
    switch (side) {
      case 'left': return { x: 1, y: 0 };
      case 'right': return { x: -1, y: 0 };
      case 'top': return { x: 0, y: 1 };
      case 'bottom': return { x: 0, y: -1 };
    }
  }

  private decayMap(map: Map<number, number>, dt: number): void {
    for (const [key, life] of map) {
      const remaining = Math.max(0, life - dt);
      if (remaining <= 0) map.delete(key);
      else map.set(key, remaining);
    }
  }

  private removeExpired<T extends { life: number }>(items: T[]): void {
    for (let index = items.length - 1; index >= 0; index -= 1) {
      if (items[index].life <= 0) items.splice(index, 1);
    }
  }

  private pushCapped<T>(items: T[], item: T, maxItems: number): void {
    items.push(item);
    while (items.length > maxItems) items.shift();
  }

  private arenaCenter(): Point2D {
    return {
      x: (this.arenaBounds.left + this.arenaBounds.right) / 2,
      y: (this.arenaBounds.top + this.arenaBounds.bottom) / 2,
    };
  }

  private calculateArenaBounds(width: number, height: number): ArenaBounds {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const arenaWidth = Math.min(safeWidth * 0.88, 400);
    const arenaHeight = Math.min(safeHeight * 0.76, arenaWidth * 1.58);
    const centerX = safeWidth / 2;
    const centerY = safeHeight * 0.51;

    return {
      left: centerX - arenaWidth / 2,
      right: centerX + arenaWidth / 2,
      top: centerY - arenaHeight / 2,
      bottom: centerY + arenaHeight / 2,
    };
  }
}
