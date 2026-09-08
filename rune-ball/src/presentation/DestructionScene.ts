import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { type ArenaBounds, type WallSide } from '../game/BallModel';
import { DestructionSession, type DestructionEvent } from '../game/DestructionSession';
import type { TargetState } from '../game/TargetSystem';
import { classifyDirectionalSwipe, type Point2D, type SwipeDirection } from '../input/SwipeClassifier';
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
};

const TRAIL_POINTS = 16;
const WALL_FLASH_SECONDS = 0.14;
const TARGET_HIT_FLASH_SECONDS = 0.11;
const BREAK_RING_SECONDS = 0.20;

interface BreakRing {
  position: Point2D;
  life: number;
}

export class DestructionScene extends Container {
  private readonly backdrop = new Graphics();
  private readonly arena = new Graphics();
  private readonly targets = new Graphics();
  private readonly wallFlash = new Graphics();
  private readonly breakRings = new Graphics();
  private readonly trail = new Graphics();
  private readonly impactPool = new ImpactPool();
  private readonly ballGlow = new Graphics().circle(0, 0, 38).fill({ color: COLORS.violet, alpha: 0.18 });
  private readonly ball = new Graphics()
    .circle(0, 0, 18)
    .fill({ color: 0x111629, alpha: 1 })
    .stroke({ color: COLORS.cyan, width: 3, alpha: 0.98 });
  private readonly ballCore = new Graphics().circle(0, 0, 6).fill({ color: 0xf0fbff, alpha: 0.96 });
  private readonly swipeTrace = new Graphics();
  private readonly inputSurface = new Graphics();
  private readonly status = new Text({
    text: 'P2.1  //  REBOUND CHASE',
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
  private arenaBounds: ArenaBounds;
  private readonly trailPoints: Point2D[] = [];
  private readonly wallFlashes: Record<WallSide, number> = { left: 0, right: 0, top: 0, bottom: 0 };
  private readonly targetHitFlashes = new Map<number, number>();
  private readonly activeBreakRings: BreakRing[] = [];
  private activePointerId: number | null = null;
  private swipeStart: Point2D | null = null;
  private swipeCurrent: Point2D | null = null;
  private lastDirection: SwipeDirection | null = null;

  constructor(width: number, height: number) {
    super();
    this.arenaBounds = this.calculateArenaBounds(width, height);
    this.session = new DestructionSession(this.arenaBounds);

    this.status.anchor.set(0.5, 0);
    this.scoreText.anchor.set(0, 0);
    this.comboText.anchor.set(1, 0);
    this.telemetry.anchor.set(0.5, 1);

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
      this.breakRings,
      this.trail,
      this.impactPool,
      this.ballGlow,
      this.ball,
      this.ballCore,
      this.swipeTrace,
      this.status,
      this.scoreText,
      this.comboText,
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

    for (const ring of this.activeBreakRings) ring.life -= dtSeconds;
    while (this.activeBreakRings.length > 0 && this.activeBreakRings[0].life <= 0) this.activeBreakRings.shift();

    this.impactPool.update(dtSeconds);
    const position = this.session.snapshot.ball.position;
    this.trailPoints.push(position);
    if (this.trailPoints.length > TRAIL_POINTS) this.trailPoints.shift();
  }

  present(alpha: number): void {
    const snapshot = this.session.snapshot;
    const position = this.session.interpolatedBallPosition(alpha);
    const speedRatio = Math.min(1, Math.max(0, (snapshot.ball.speed - 240) / 260));
    const reboundStrength = snapshot.ball.reboundStrength;

    this.ball.position.set(position.x, position.y);
    this.ballCore.position.copyFrom(this.ball.position);
    this.ballGlow.position.copyFrom(this.ball.position);
    this.ballGlow.alpha = 0.13 + speedRatio * 0.12 + reboundStrength * 0.10;
    this.ballGlow.scale.set(0.9 + speedRatio * 0.24 + reboundStrength * 0.12);

    this.scoreText.text = `SCORE ${snapshot.combo.score.toString().padStart(6, '0')}`;
    this.comboText.text = snapshot.combo.combo > 0 ? `COMBO ${snapshot.combo.combo}` : 'COMBO --';
    this.comboText.alpha = snapshot.combo.combo > 0 ? 1 : 0.5;
    const reboundLabel = reboundStrength > 0.05 ? '  //  REBOUND' : '';
    const directionLabel = this.lastDirection ? `  //  ${this.lastDirection.toUpperCase()}` : '';
    this.telemetry.text = `SPEED ${Math.round(snapshot.ball.speed).toString().padStart(3, '0')}${reboundLabel}${directionLabel}`;

    this.drawTargets(snapshot.targets);
    this.drawTrail(position, speedRatio, reboundStrength);
    this.drawWallFlash();
    this.drawBreakRings();
    this.drawSwipeTrace();
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
    this.telemetry.position.set(safeWidth / 2, Math.min(safeHeight - 14, bottom + 30));

    this.inputSurface.clear().rect(left, top, right - left, bottom - top).fill({ color: 0xffffff, alpha: 0.001 });
    this.inputSurface.hitArea = new Rectangle(left, top, right - left, bottom - top);
  }

  private readonly handlePointerDown = (event: FederatedPointerEvent): void => {
    if (this.activePointerId !== null) return;
    this.activePointerId = event.pointerId;
    this.swipeStart = { x: event.global.x, y: event.global.y };
    this.swipeCurrent = { ...this.swipeStart };
  };

  private readonly handlePointerMove = (event: FederatedPointerEvent): void => {
    if (event.pointerId !== this.activePointerId || !this.swipeStart) return;
    this.swipeCurrent = { x: event.global.x, y: event.global.y };
  };

  private readonly handlePointerUp = (event: FederatedPointerEvent): void => {
    if (event.pointerId !== this.activePointerId || !this.swipeStart) return;
    const end = { x: event.global.x, y: event.global.y };
    const intent = classifyDirectionalSwipe(this.swipeStart, end);
    if (intent) {
      this.session.applyDirectionalRedirect(intent.direction);
      this.lastDirection = intent.direction;
    }
    this.clearSwipe();
  };

  private readonly handlePointerCancel = (event: FederatedPointerEvent): void => {
    if (event.pointerId === this.activePointerId) this.clearSwipe();
  };

  private clearSwipe(): void {
    this.activePointerId = null;
    this.swipeStart = null;
    this.swipeCurrent = null;
    this.swipeTrace.clear();
  }

  private handleGameplayEvent(event: DestructionEvent): void {
    switch (event.type) {
      case 'wall-hit':
        this.wallFlashes[event.side] = WALL_FLASH_SECONDS;
        break;
      case 'target-hit':
        this.targetHitFlashes.set(event.targetId, TARGET_HIT_FLASH_SECONDS);
        this.impactPool.spawn(event.position, 'hit');
        break;
      case 'target-break':
        this.impactPool.spawn(event.position, 'break');
        this.activeBreakRings.push({ position: { ...event.position }, life: BREAK_RING_SECONDS });
        break;
      case 'target-spawn':
      case 'combo-reset':
        break;
    }
  }

  private drawTargets(targets: TargetState[]): void {
    this.targets.clear();
    for (const target of targets) {
      const hitFlash = this.targetHitFlashes.get(target.id) ?? 0;
      const flashRatio = Math.min(1, hitFlash / TARGET_HIT_FLASH_SECONDS);
      const radius = target.radius;
      const fill = target.kind === 'armored' ? COLORS.armored : COLORS.crystal;
      const alpha = 0.56 + flashRatio * 0.34;

      this.targets
        .moveTo(target.position.x, target.position.y - radius)
        .lineTo(target.position.x + radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y + radius)
        .lineTo(target.position.x - radius * 0.72, target.position.y)
        .lineTo(target.position.x, target.position.y - radius)
        .fill({ color: fill, alpha: alpha * 0.45 })
        .stroke({ color: flashRatio > 0 ? 0xffffff : fill, width: flashRatio > 0 ? 3 : 2, alpha });

      this.targets
        .circle(target.position.x, target.position.y, 4.5)
        .fill({ color: 0xffffff, alpha: 0.78 + flashRatio * 0.2 });

      if (target.kind === 'armored') {
        const armorAlpha = target.hp === target.maxHp ? 0.72 : 0.34;
        this.targets
          .circle(target.position.x, target.position.y, radius + 7)
          .stroke({ color: COLORS.cyan, width: target.hp === target.maxHp ? 2.5 : 1.5, alpha: armorAlpha });
        if (target.hp < target.maxHp) {
          this.targets
            .moveTo(target.position.x - radius - 4, target.position.y - 6)
            .lineTo(target.position.x - 4, target.position.y + 2)
            .lineTo(target.position.x + 8, target.position.y - 8)
            .stroke({ color: COLORS.magenta, width: 2, alpha: 0.76 });
        }
      }
    }
  }

  private drawTrail(position: Point2D, speedRatio: number, reboundStrength: number): void {
    this.trail.clear();
    const points = [...this.trailPoints, position];
    points.forEach((point, index) => {
      const life = (index + 1) / points.length;
      const radius = 2 + life * (2.5 + speedRatio * 1.5 + reboundStrength * 1.2);
      this.trail.circle(point.x, point.y, radius).fill({
        color: index % 3 === 0 ? COLORS.magenta : COLORS.cyan,
        alpha: life * (0.10 + speedRatio * 0.18 + reboundStrength * 0.12),
      });
    });
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

  private drawWallFlash(): void {
    const { left, right, top, bottom } = this.arenaBounds;
    const peak = Math.max(...Object.values(this.wallFlashes));
    this.wallFlash.clear();
    if (peak <= 0) return;

    const alpha = Math.min(0.95, peak / WALL_FLASH_SECONDS);
    this.wallFlash
      .roundRect(left, top, right - left, bottom - top, 26)
      .stroke({ color: COLORS.cyan, width: 4, alpha: alpha * 0.56 });

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
      this.wallFlash.stroke({ color: COLORS.magenta, width: 6, alpha: sideAlpha * 0.72 });
    };

    drawSide('left');
    drawSide('right');
    drawSide('top');
    drawSide('bottom');
  }

  private drawSwipeTrace(): void {
    this.swipeTrace.clear();
    if (!this.swipeStart || !this.swipeCurrent) return;

    const intent = classifyDirectionalSwipe(this.swipeStart, this.swipeCurrent);
    this.swipeTrace
      .moveTo(this.swipeStart.x, this.swipeStart.y)
      .lineTo(this.swipeCurrent.x, this.swipeCurrent.y)
      .stroke({ color: intent ? COLORS.cyan : COLORS.muted, width: intent ? 4 : 2, alpha: intent ? 0.72 : 0.35 });
    this.swipeTrace.circle(this.swipeCurrent.x, this.swipeCurrent.y, intent ? 6 : 4).fill({
      color: intent ? COLORS.magenta : COLORS.muted,
      alpha: intent ? 0.75 : 0.4,
    });
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
