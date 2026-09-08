import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { BallModel, type ArenaBounds, type WallSide } from '../game/BallModel';
import { classifyDirectionalSwipe, type Point2D, type SwipeDirection } from '../input/SwipeClassifier';

const COLORS = {
  background: 0x050711,
  arena: 0x0a1020,
  arenaLine: 0x6548a8,
  cyan: 0x6fe9ff,
  magenta: 0xd756ff,
  violet: 0x8f4dff,
  text: 0xcfefff,
  muted: 0x71829b,
};

const TRAIL_POINTS = 13;
const WALL_FLASH_SECONDS = 0.10;

export class BallFeelScene extends Container {
  private readonly backdrop = new Graphics();
  private readonly arena = new Graphics();
  private readonly wallFlash = new Graphics();
  private readonly trail = new Graphics();
  private readonly ballGlow = new Graphics().circle(0, 0, 38).fill({ color: COLORS.violet, alpha: 0.18 });
  private readonly ball = new Graphics()
    .circle(0, 0, 18)
    .fill({ color: 0x111629, alpha: 1 })
    .stroke({ color: COLORS.cyan, width: 3, alpha: 0.98 });
  private readonly ballCore = new Graphics().circle(0, 0, 6).fill({ color: 0xf0fbff, alpha: 0.96 });
  private readonly swipeTrace = new Graphics();
  private readonly inputSurface = new Graphics();
  private readonly status = new Text({
    text: 'P1  //  SWIPE TO REDIRECT',
    style: {
      fill: COLORS.text,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 1.7,
    },
  });
  private readonly telemetry = new Text({
    text: 'SPEED 000',
    style: {
      fill: COLORS.muted,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11,
      letterSpacing: 1.2,
    },
  });
  private readonly hint = new Text({
    text: 'SWIPE  ↑  ↓  ←  →',
    style: {
      fill: COLORS.muted,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11,
      letterSpacing: 1.4,
    },
  });

  private readonly model: BallModel;
  private arenaBounds: ArenaBounds;
  private readonly trailPoints: Point2D[] = [];
  private readonly wallFlashes: Record<WallSide, number> = { left: 0, right: 0, top: 0, bottom: 0 };
  private activePointerId: number | null = null;
  private swipeStart: Point2D | null = null;
  private swipeCurrent: Point2D | null = null;
  private lastDirection: SwipeDirection | null = null;

  constructor(width: number, height: number) {
    super();
    this.arenaBounds = this.calculateArenaBounds(width, height);
    this.model = new BallModel(this.arenaBounds);

    this.status.anchor.set(0.5, 0);
    this.telemetry.anchor.set(0.5, 0);
    this.hint.anchor.set(0.5, 1);

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
      this.wallFlash,
      this.trail,
      this.ballGlow,
      this.ball,
      this.ballCore,
      this.swipeTrace,
      this.status,
      this.telemetry,
      this.hint,
      this.inputSurface,
    );

    this.setViewport(width, height);
  }

  update(dtSeconds: number): void {
    const result = this.model.update(dtSeconds);
    for (const side of result.wallHits) this.wallFlashes[side] = WALL_FLASH_SECONDS;
    for (const side of Object.keys(this.wallFlashes) as WallSide[]) {
      this.wallFlashes[side] = Math.max(0, this.wallFlashes[side] - dtSeconds);
    }

    const position = this.model.snapshot.position;
    this.trailPoints.push(position);
    if (this.trailPoints.length > TRAIL_POINTS) this.trailPoints.shift();
  }

  present(alpha: number): void {
    const snapshot = this.model.snapshot;
    const position = this.model.interpolatedPosition(alpha);
    const speedRatio = Math.min(1, Math.max(0, (snapshot.speed - 240) / 200));

    this.ball.position.set(position.x, position.y);
    this.ballCore.position.copyFrom(this.ball.position);
    this.ballGlow.position.copyFrom(this.ball.position);
    this.ballGlow.alpha = 0.13 + speedRatio * 0.12;
    this.ballGlow.scale.set(0.9 + speedRatio * 0.24);

    this.telemetry.text = `SPEED ${Math.round(snapshot.speed).toString().padStart(3, '0')}${this.lastDirection ? `  //  ${this.lastDirection.toUpperCase()}` : ''}`;
    this.drawTrail(position, speedRatio);
    this.drawWallFlash();
    this.drawSwipeTrace();
  }

  setViewport(width: number, height: number): void {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    this.arenaBounds = this.calculateArenaBounds(safeWidth, safeHeight);
    this.model.setBounds(this.arenaBounds);

    this.backdrop.clear().rect(0, 0, safeWidth, safeHeight).fill(COLORS.background);
    this.backdrop
      .circle(safeWidth * 0.5, safeHeight * 0.48, Math.min(safeWidth, safeHeight) * 0.46)
      .fill({ color: 0x321654, alpha: 0.12 });

    const { left, right, top, bottom } = this.arenaBounds;
    this.arena.clear()
      .roundRect(left, top, right - left, bottom - top, 26)
      .fill({ color: COLORS.arena, alpha: 0.82 })
      .stroke({ color: COLORS.arenaLine, width: 1.5, alpha: 0.72 });

    this.status.position.set(safeWidth / 2, Math.max(20, top - 34));
    this.telemetry.position.set(safeWidth / 2, top + 18);
    this.hint.position.set(safeWidth / 2, Math.min(safeHeight - 18, bottom + 34));

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
      this.model.applyDirectionalRedirect(intent.direction);
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

  private drawTrail(position: Point2D, speedRatio: number): void {
    this.trail.clear();
    const points = [...this.trailPoints, position];
    points.forEach((point, index) => {
      const life = (index + 1) / points.length;
      const radius = 2 + life * (2.5 + speedRatio * 1.5);
      this.trail.circle(point.x, point.y, radius).fill({
        color: index % 3 === 0 ? COLORS.magenta : COLORS.cyan,
        alpha: life * (0.10 + speedRatio * 0.18),
      });
    });
  }

  private drawWallFlash(): void {
    const { left, right, top, bottom } = this.arenaBounds;
    const peak = Math.max(...Object.values(this.wallFlashes));
    this.wallFlash.clear();
    if (peak <= 0) return;

    const alpha = Math.min(0.9, peak / WALL_FLASH_SECONDS);
    this.wallFlash
      .roundRect(left, top, right - left, bottom - top, 26)
      .stroke({ color: COLORS.cyan, width: 4, alpha: alpha * 0.5 });

    const line = (side: WallSide): void => {
      if (this.wallFlashes[side] <= 0) return;
      const sideAlpha = Math.min(1, this.wallFlashes[side] / WALL_FLASH_SECONDS);
      switch (side) {
        case 'left': this.wallFlash.moveTo(left, top + 24).lineTo(left, bottom - 24); break;
        case 'right': this.wallFlash.moveTo(right, top + 24).lineTo(right, bottom - 24); break;
        case 'top': this.wallFlash.moveTo(left + 24, top).lineTo(right - 24, top); break;
        case 'bottom': this.wallFlash.moveTo(left + 24, bottom).lineTo(right - 24, bottom); break;
      }
      this.wallFlash.stroke({ color: COLORS.magenta, width: 6, alpha: sideAlpha * 0.72 });
    };

    line('left');
    line('right');
    line('top');
    line('bottom');
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
