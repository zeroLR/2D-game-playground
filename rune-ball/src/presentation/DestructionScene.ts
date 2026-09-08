import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { type ArenaBounds, type WallSide } from '../game/BallModel';
import { DestructionSession, type DestructionEvent } from '../game/DestructionSession';
import type { TargetState } from '../game/TargetSystem';
import { classifyGesturePath } from '../input/GestureRecognizer';
import { PointerPathSampler } from '../input/PointerPathSampler';
import type { Point2D, SwipeDirection } from '../input/SwipeClassifier';
import { RUNE_LABELS, type RuneKind } from '../rune/RuneTypes';
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

const TRAIL_POINTS = 28;
const NORMAL_TRAIL_POINTS = 14;
const WALL_FLASH_SECONDS = 0.16;
const REBOUND_BEAT_SECONDS = 0.18;
const TARGET_HIT_FLASH_SECONDS = 0.11;
const TARGET_SPAWN_SECONDS = 0.22;
const BREAK_RING_SECONDS = 0.20;
const RUNE_CONFIRM_SECONDS = 0.42;
const GESTURE_RELEASE_SECONDS = 0.24;
const RUNE_FEEDBACK_SECONDS = 0.48;
const CHAIN_FX_SECONDS = 0.30;

interface BreakRing {
  position: Point2D;
  life: number;
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

export class DestructionScene extends Container {
  private readonly backdrop = new Graphics();
  private readonly arena = new Graphics();
  private readonly targets = new Graphics();
  private readonly wallFlash = new Graphics();
  private readonly reboundFx = new Graphics();
  private readonly breakRings = new Graphics();
  private readonly trail = new Graphics();
  private readonly runeFx = new Graphics();
  private readonly gestureTrace = new Graphics();
  private readonly runeChargeBar = new Graphics();
  private readonly impactPool = new ImpactPool();
  private readonly ballGlow = new Graphics().circle(0, 0, 38).fill({ color: COLORS.violet, alpha: 0.18 });
  private readonly ball = new Graphics()
    .circle(0, 0, 18)
    .fill({ color: 0x111629, alpha: 1 })
    .stroke({ color: COLORS.cyan, width: 3, alpha: 0.98 });
  private readonly ballCore = new Graphics().circle(0, 0, 6).fill({ color: COLORS.white, alpha: 0.96 });
  private readonly inputSurface = new Graphics();
  private readonly status = new Text({
    text: 'P3  //  DRAW ○  V  Z',
    style: {
      fill: COLORS.text,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 1.7,
    },
  });
  private readonly scoreText = new Text({
    text: 'SCORE 000000',
    style: {
      fill: COLORS.text,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.2,
    },
  });
  private readonly comboText = new Text({
    text: 'COMBO 0',
    style: {
      fill: COLORS.magenta,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.2,
    },
  });
  private readonly runeGuide = new Text({
    text: 'RUNE 100  //  ○  V  Z',
    style: {
      fill: COLORS.violet,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
    },
  });
  private readonly runeFeedback = new Text({
    text: '',
    style: {
      fill: COLORS.white,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.6,
    },
  });
  private readonly telemetry = new Text({
    text: 'SPEED 000',
    style: {
      fill: COLORS.muted,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 10,
      letterSpacing: 1.1,
    },
  });

  private readonly session: DestructionSession;
  private readonly pathSampler = new PointerPathSampler();
  private arenaBounds: ArenaBounds;
  private readonly trailPoints: Point2D[] = [];
  private readonly wallFlashes: Record<WallSide, number> = { left: 0, right: 0, top: 0, bottom: 0 };
  private readonly targetHitFlashes = new Map<number, number>();
  private readonly targetSpawnLives = new Map<number, number>();
  private readonly activeBreakRings: BreakRing[] = [];
  private readonly activeReboundBeats: ReboundBeat[] = [];
  private readonly runeConfirmations: RuneConfirmation[] = [];
  private readonly chainBeats: ChainBeat[] = [];
  private activePointerId: number | null = null;
  private releasedGesture: ReleasedGesture | null = null;
  private runeFeedbackLife = 0;
  private lastDirection: SwipeDirection | null = null;

  constructor(width: number, height: number) {
    super();
    this.arenaBounds = this.calculateArenaBounds(width, height);
    this.session = new DestructionSession(this.arenaBounds);

    this.status.anchor.set(0.5, 0);
    this.scoreText.anchor.set(0, 0);
    this.comboText.anchor.set(1, 0);
    this.runeGuide.anchor.set(0.5, 1);
    this.runeFeedback.anchor.set(0.5);
    this.telemetry.anchor.set(0.5, 1);
    this.runeFeedback.alpha = 0;

    this.inputSurface.eventMode = 'static';
    this.inputSurface.cursor = 'crosshair';
    this.inputSurface
      .on('pointerdown', this.handlePointerDown)
      .on('pointermove', this.handlePointerMove)
      .on('pointerup', this.handlePointerUp)
      .on('pointerupoutside', this.handlePointerUp)
      .on('pointercancel', this.handlePointerCancel);

    this.addChild(
      this.backdrop,
      this.arena,
      this.targets,
      this.wallFlash,
      this.reboundFx,
      this.breakRings,
      this.trail,
      this.runeFx,
      this.impactPool,
      this.ballGlow,
      this.ball,
      this.ballCore,
      this.gestureTrace,
      this.runeChargeBar,
      this.status,
      this.scoreText,
      this.comboText,
      this.runeGuide,
      this.runeFeedback,
      this.telemetry,
      this.inputSurface,
    );

    this.setViewport(width, height);
  }

  update(dtSeconds: number): void {
    const events = this.session.update(dtSeconds);
    for (const event of events) this.handleGameplayEvent(event);

    for (const side of Object.keys(this.wallFlashes) as WallSide[]) {
      this.wallFlashes[side] = Math.max(0, this.wallFlashes[side] - dtSeconds);
    }

    for (const [targetId, life] of this.targetHitFlashes) {
      const remaining = Math.max(0, life - dtSeconds);
      if (remaining <= 0) this.targetHitFlashes.delete(targetId);
      else this.targetHitFlashes.set(targetId, remaining);
    }

    for (const [targetId, life] of this.targetSpawnLives) {
      const remaining = Math.max(0, life - dtSeconds);
      if (remaining <= 0) this.targetSpawnLives.delete(targetId);
      else this.targetSpawnLives.set(targetId, remaining);
    }

    for (const ring of this.activeBreakRings) ring.life -= dtSeconds;
    this.removeExpired(this.activeBreakRings);
    for (const beat of this.activeReboundBeats) beat.life -= dtSeconds;
    this.removeExpired(this.activeReboundBeats);
    for (const confirmation of this.runeConfirmations) confirmation.life -= dtSeconds;
    this.removeExpired(this.runeConfirmations);
    for (const beat of this.chainBeats) beat.life -= dtSeconds;
    this.removeExpired(this.chainBeats);

    if (this.releasedGesture) {
      this.releasedGesture.life -= dtSeconds;
      if (this.releasedGesture.life <= 0) this.releasedGesture = null;
    }

    this.runeFeedbackLife = Math.max(0, this.runeFeedbackLife - dtSeconds);
    this.runeFeedback.alpha = this.runeFeedbackLife > 0
      ? Math.min(1, this.runeFeedbackLife / (RUNE_FEEDBACK_SECONDS * 0.35))
      : 0;

    this.impactPool.update(dtSeconds);
    const position = this.session.snapshot.ball.position;
    this.trailPoints.push(position);
    if (this.trailPoints.length > TRAIL_POINTS) this.trailPoints.shift();
  }

  present(alpha: number): void {
    const snapshot = this.session.snapshot;
    const position = this.session.interpolatedBallPosition(alpha);
    const speedRatio = Math.min(1, Math.max(0, (snapshot.ball.speed - 330) / 140));
    const reboundStrength = snapshot.ball.reboundStrength;
    const reboundEnvelope = this.reboundEnvelope();
    const velocityAngle = Math.atan2(snapshot.ball.velocity.y, snapshot.ball.velocity.x);

    this.ball.position.set(position.x, position.y);
    this.ball.rotation = velocityAngle;
    this.ball.scale.set(
      1 - reboundEnvelope.compression * 0.18 + reboundEnvelope.launch * 0.36 + reboundStrength * 0.14,
      1 + reboundEnvelope.compression * 0.16 - reboundEnvelope.launch * 0.14 - reboundStrength * 0.04,
    );
    this.ballCore.position.copyFrom(this.ball.position);
    this.ballCore.scale.set(1 + reboundEnvelope.launch * 0.08);
    this.ballGlow.position.copyFrom(this.ball.position);
    this.ballGlow.alpha = 0.13 + speedRatio * 0.10 + reboundStrength * 0.22 + reboundEnvelope.launch * 0.10;
    this.ballGlow.scale.set(0.9 + speedRatio * 0.20 + reboundStrength * 0.30 + reboundEnvelope.launch * 0.12);

    this.scoreText.text = `SCORE ${snapshot.combo.score.toString().padStart(6, '0')}`;
    this.comboText.text = snapshot.combo.combo > 0 ? `COMBO ${snapshot.combo.combo}` : 'COMBO --';
    this.comboText.alpha = snapshot.combo.combo > 0 ? 1 : 0.5;
    const charge = Math.round(snapshot.runes.charge);
    const ready = snapshot.runes.charge >= snapshot.runes.cost;
    this.runeGuide.text = `RUNE ${charge.toString().padStart(3, '0')}  //  ○  V  Z${snapshot.runes.chainReady ? '  //  CHAIN ARMED' : ''}`;
    this.runeGuide.alpha = ready ? 1 : 0.48;
    const reboundLabel = reboundStrength > 0.05 ? '  //  REBOUND' : '';
    const directionLabel = this.lastDirection ? `  //  ${this.lastDirection.toUpperCase()}` : '';
    this.telemetry.text = `SPEED ${Math.round(snapshot.ball.speed).toString().padStart(3, '0')}${reboundLabel}${directionLabel}`;

    this.drawTargets(snapshot.targets);
    this.drawTrail(position, speedRatio, reboundStrength);
    this.drawWallFlash();
    this.drawReboundBeats();
    this.drawBreakRings();
    this.drawRuneEffects(snapshot.ball.position, snapshot.splitEchoes, snapshot.runes.vortexCenter, snapshot.runes.vortexStrength, snapshot.runes.chainReady);
    this.drawGestureTrace();
    this.drawRuneCharge(snapshot.runes.charge / snapshot.runes.maxCharge, ready);
  }

  setViewport(width: number, height: number): void {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    this.arenaBounds = this.calculateArenaBounds(safeWidth, safeHeight);
    this.session.setBounds(this.arenaBounds);

    this.backdrop.clear().rect(0, 0, safeWidth, safeHeight).fill(COLORS.background);
    this.backdrop
      .circle(safeWidth * 0.5, safeHeight * 0.48, Math.min(safeWidth, safeHeight) * 0.46)
      .fill({ color: 0x321654, alpha: 0.12 });

    const { left, right, top, bottom } = this.arenaBounds;
    this.arena.clear()
      .roundRect(left, top, right - left, bottom - top, 26)
      .fill({ color: COLORS.arena, alpha: 0.82 })
      .stroke({ color: COLORS.arenaLine, width: 1.5, alpha: 0.72 });

    this.status.position.set(safeWidth / 2, Math.max(18, top - 36));
    this.scoreText.position.set(left + 14, top + 16);
    this.comboText.position.set(right - 14, top + 16);
    this.runeGuide.position.set(safeWidth / 2, bottom - 20);
    this.telemetry.position.set(safeWidth / 2, Math.min(safeHeight - 14, bottom + 30));

    this.inputSurface.clear().rect(left, top, right - left, bottom - top).fill({ color: 0xffffff, alpha: 0.001 });
    this.inputSurface.hitArea = new Rectangle(left, top, right - left, bottom - top);
  }

  private readonly handlePointerDown = (event: FederatedPointerEvent): void => {
    if (this.activePointerId !== null) return;
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
        this.lastDirection = intent.direction;
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
        this.activeReboundBeats.push({ position: { ...position }, side: event.side, life: REBOUND_BEAT_SECONDS });
        break;
      }
      case 'target-hit':
        this.targetHitFlashes.set(event.targetId, TARGET_HIT_FLASH_SECONDS);
        this.impactPool.spawn(event.position, event.source === 'chain' ? 'break' : 'hit');
        break;
      case 'target-break':
        this.targetSpawnLives.delete(event.targetId);
        this.impactPool.spawn(event.position, 'break');
        this.activeBreakRings.push({ position: { ...event.position }, life: BREAK_RING_SECONDS });
        break;
      case 'target-spawn':
        this.targetSpawnLives.set(event.targetId, TARGET_SPAWN_SECONDS);
        break;
      case 'rune-activated':
        this.runeConfirmations.push({ rune: event.rune, center: { ...event.center }, life: RUNE_CONFIRM_SECONDS, success: true });
        this.showRuneFeedback(event.center, RUNE_LABELS[event.rune], COLORS.white);
        break;
      case 'rune-failed':
        this.runeConfirmations.push({ rune: event.rune, center: { ...event.center }, life: RUNE_CONFIRM_SECONDS * 0.72, success: false });
        this.showRuneFailure(event.center, event.reason === 'charge' ? 'NEED CHARGE' : 'CHAIN ARMED');
        break;
      case 'chain-triggered':
        this.chainBeats.push({
          origin: { ...event.origin },
          targets: event.targets.map((point) => ({ ...point })),
          life: CHAIN_FX_SECONDS,
        });
        break;
      case 'combo-reset':
        break;
    }
  }

  private showRuneFeedback(center: Point2D, text: string, color: number): void {
    this.runeFeedback.text = text;
    this.runeFeedback.style.fill = color;
    this.runeFeedback.position.set(center.x, center.y - 44);
    this.runeFeedbackLife = RUNE_FEEDBACK_SECONDS;
    this.runeFeedback.alpha = 1;
  }

  private showRuneFailure(center: Point2D, text: string): void {
    this.showRuneFeedback(center, text, COLORS.muted);
  }

  private drawTargets(targets: TargetState[]): void {
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
      const alpha = (0.56 + flashRatio * 0.34) * materializeAlpha;

      if (spawnLife > 0) {
        const glyphRadius = target.radius + (1 - spawnEase) * 22;
        this.targets
          .circle(target.position.x, target.position.y, glyphRadius)
          .stroke({ color: COLORS.violet, width: 2, alpha: (1 - spawnProgress) * 0.48 });
        for (let index = 0; index < 4; index += 1) {
          const angle = index * Math.PI * 0.5;
          const inner = glyphRadius + 4;
          const outer = glyphRadius + 10;
          this.targets
            .moveTo(target.position.x + Math.cos(angle) * inner, target.position.y + Math.sin(angle) * inner)
            .lineTo(target.position.x + Math.cos(angle) * outer, target.position.y + Math.sin(angle) * outer);
        }
        this.targets.stroke({ color: COLORS.cyan, width: 1.5, alpha: (1 - spawnProgress) * 0.38 });
      }

      this.targets
        .moveTo(target.position.x, target.position.y - radius)
        .lineTo(target.position.x + radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y + radius)
        .lineTo(target.position.x - radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y - radius)
        .fill({ color: fill, alpha: alpha * 0.45 })
        .stroke({ color: flashRatio > 0 ? COLORS.white : fill, width: flashRatio > 0 ? 3 : 2, alpha });

      this.targets
        .circle(target.position.x, target.position.y, 4.5 * spawnScale)
        .fill({ color: COLORS.white, alpha: (0.78 + flashRatio * 0.2) * materializeAlpha });

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

  private drawTrail(position: Point2D, speedRatio: number, reboundStrength: number): void {
    this.trail.clear();
    const allPoints = [...this.trailPoints, position];
    const visibleCount = reboundStrength > 0.05 ? TRAIL_POINTS : NORMAL_TRAIL_POINTS;
    const points = allPoints.slice(-visibleCount);

    if (reboundStrength > 0.05 && points.length > 1) {
      this.drawPolyline(this.trail, points, COLORS.white, 5.5, reboundStrength * 0.22);
      this.drawPolyline(this.trail, points, COLORS.cyan, 2.5, 0.24 + reboundStrength * 0.28);
    }

    points.forEach((point, index) => {
      const life = (index + 1) / points.length;
      const radius = 2 + life * (2.5 + speedRatio * 1.3 + reboundStrength * 2.5);
      const newest = life > 0.72;
      this.trail.circle(point.x, point.y, radius).fill({
        color: reboundStrength > 0.05 && newest ? COLORS.white : index % 3 === 0 ? COLORS.magenta : COLORS.cyan,
        alpha: life * (0.10 + speedRatio * 0.14 + reboundStrength * 0.26),
      });
    });
  }

  private drawRuneEffects(
    ballPosition: Point2D,
    splitEchoes: Point2D[],
    vortexCenter: Point2D | null,
    vortexStrength: number,
    chainReady: boolean,
  ): void {
    this.runeFx.clear();

    if (vortexCenter && vortexStrength > 0) {
      for (const radius of [42, 78, 118]) {
        this.runeFx
          .circle(vortexCenter.x, vortexCenter.y, radius * (1.12 - vortexStrength * 0.12))
          .stroke({ color: radius === 78 ? COLORS.magenta : COLORS.violet, width: 2, alpha: vortexStrength * 0.28 });
      }
      for (let index = 0; index < 6; index += 1) {
        const angle = index * (Math.PI / 3) + (1 - vortexStrength) * 0.8;
        this.runeFx
          .moveTo(vortexCenter.x + Math.cos(angle) * 28, vortexCenter.y + Math.sin(angle) * 28)
          .lineTo(vortexCenter.x + Math.cos(angle + 0.34) * 64, vortexCenter.y + Math.sin(angle + 0.34) * 64)
          .stroke({ color: COLORS.cyan, width: 1.5, alpha: vortexStrength * 0.34 });
      }
    }

    for (const echo of splitEchoes) {
      this.runeFx
        .moveTo(ballPosition.x, ballPosition.y)
        .lineTo(echo.x, echo.y)
        .stroke({ color: COLORS.violet, width: 1.5, alpha: 0.34 });
      this.runeFx.circle(echo.x, echo.y, 12).fill({ color: COLORS.violet, alpha: 0.18 });
      this.runeFx.circle(echo.x, echo.y, 7).stroke({ color: COLORS.cyan, width: 2.5, alpha: 0.82 });
      this.runeFx.circle(echo.x, echo.y, 2.5).fill({ color: COLORS.white, alpha: 0.9 });
    }

    if (chainReady) {
      this.runeFx.circle(ballPosition.x, ballPosition.y, 27).stroke({ color: COLORS.magenta, width: 2.5, alpha: 0.72 });
      for (let index = 0; index < 6; index += 1) {
        const angle = index * Math.PI / 3;
        this.runeFx
          .moveTo(ballPosition.x + Math.cos(angle) * 29, ballPosition.y + Math.sin(angle) * 29)
          .lineTo(ballPosition.x + Math.cos(angle + 0.18) * 35, ballPosition.y + Math.sin(angle + 0.18) * 35)
          .stroke({ color: COLORS.violet, width: 2, alpha: 0.56 });
      }
    }

    for (const confirmation of this.runeConfirmations) {
      const progress = 1 - Math.max(0, confirmation.life) / RUNE_CONFIRM_SECONDS;
      const alpha = Math.max(0, 1 - progress);
      const scale = 0.82 + progress * 0.36;
      this.drawCanonicalRune(
        confirmation.rune,
        confirmation.center,
        34 * scale,
        confirmation.success ? COLORS.white : COLORS.muted,
        alpha * (confirmation.success ? 0.82 : 0.5),
      );
    }

    for (const beat of this.chainBeats) {
      const progress = 1 - Math.max(0, beat.life) / CHAIN_FX_SECONDS;
      const alpha = 1 - progress;
      for (const target of beat.targets) {
        this.runeFx
          .moveTo(beat.origin.x, beat.origin.y)
          .lineTo(target.x, target.y)
          .stroke({ color: COLORS.magenta, width: 4 - progress * 2, alpha: alpha * 0.74 });
        this.runeFx.circle(target.x, target.y, 10 + progress * 18).stroke({ color: COLORS.violet, width: 2, alpha: alpha * 0.6 });
      }
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
      this.drawPolyline(
        this.gestureTrace,
        points,
        runeLike ? COLORS.violet : intent.type === 'swipe' ? COLORS.cyan : COLORS.muted,
        runeLike ? 4.5 : 3.5,
        runeLike ? 0.78 : 0.62,
      );
      this.gestureTrace.circle(points[points.length - 1].x, points[points.length - 1].y, runeLike ? 5 : 4).fill({
        color: runeLike ? COLORS.magenta : COLORS.cyan,
        alpha: 0.72,
      });
      return;
    }

    if (released) {
      const alpha = Math.max(0, released.life / GESTURE_RELEASE_SECONDS);
      this.drawPolyline(
        this.gestureTrace,
        released.points,
        released.success ? COLORS.violet : COLORS.muted,
        released.success ? 4 : 2.5,
        alpha * (released.success ? 0.58 : 0.34),
      );
    }
  }

  private drawRuneCharge(ratio: number, ready: boolean): void {
    const { left, right, bottom } = this.arenaBounds;
    const width = Math.min(150, (right - left) * 0.42);
    const x = (left + right) / 2 - width / 2;
    const y = bottom - 14;
    const clamped = Math.min(1, Math.max(0, ratio));

    this.runeChargeBar.clear();
    this.runeChargeBar.roundRect(x, y, width, 3, 1.5).fill({ color: COLORS.muted, alpha: 0.25 });
    if (clamped > 0) {
      this.runeChargeBar.roundRect(x, y, width * clamped, 3, 1.5).fill({
        color: ready ? COLORS.violet : COLORS.muted,
        alpha: ready ? 0.82 : 0.48,
      });
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

  private drawBreakRings(): void {
    this.breakRings.clear();
    for (const ring of this.activeBreakRings) {
      const progress = 1 - Math.max(0, ring.life) / BREAK_RING_SECONDS;
      const radius = 12 + progress * 28;
      this.breakRings
        .circle(ring.position.x, ring.position.y, radius)
        .stroke({ color: COLORS.magenta, width: 3 - progress * 1.5, alpha: (1 - progress) * 0.65 });
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
        .stroke({ color: COLORS.white, width: 3 - progress * 1.5, alpha: alpha * 0.72 });

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
            alpha: alpha * (offset === 0 ? 0.76 : 0.48),
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
      .stroke({ color: COLORS.cyan, width: 4, alpha: alpha * 0.62 });

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
      this.wallFlash.stroke({ color: COLORS.white, width: 7, alpha: sideAlpha * 0.82 });
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

  private removeExpired<T extends { life: number }>(items: T[]): void {
    for (let index = items.length - 1; index >= 0; index -= 1) {
      if (items[index].life <= 0) items.splice(index, 1);
    }
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
