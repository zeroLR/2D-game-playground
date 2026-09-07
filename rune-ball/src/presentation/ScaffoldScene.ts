import { Container, Graphics, Text } from 'pixi.js';

export class ScaffoldScene extends Container {
  private readonly backdrop = new Graphics();
  private readonly arena = new Graphics();
  private readonly orbit = new Graphics();
  private readonly orbGlow = new Graphics().circle(0, 0, 44).fill({ color: 0x8f4dff, alpha: 0.16 });
  private readonly orb = new Graphics()
    .circle(0, 0, 20)
    .fill({ color: 0x111629, alpha: 1 })
    .stroke({ color: 0x6fe9ff, width: 3, alpha: 0.95 });
  private readonly status = new Text({
    text: 'P0  //  CORE ONLINE',
    style: {
      fill: 0xcfefff,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 2,
    },
  });
  private elapsedSeconds = 0;

  constructor(width: number, height: number) {
    super();
    this.status.anchor.set(0.5, 0);
    this.addChild(this.backdrop, this.arena, this.orbit, this.orbGlow, this.orb, this.status);
    this.setViewport(width, height);
  }

  update(dtSeconds: number): void {
    this.elapsedSeconds += dtSeconds;
  }

  present(_alpha: number): void {
    this.orbGlow.alpha = 0.13 + (Math.sin(this.elapsedSeconds * 3.5) + 1) * 0.055;
    this.orbit.rotation = this.elapsedSeconds * 0.18;
  }

  setViewport(width: number, height: number): void {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const centerX = safeWidth / 2;
    const centerY = safeHeight * 0.51;
    const arenaWidth = Math.min(safeWidth * 0.86, 390);
    const arenaHeight = Math.min(safeHeight * 0.72, arenaWidth * 1.55);

    this.backdrop.clear().rect(0, 0, safeWidth, safeHeight).fill(0x070912);
    this.backdrop
      .circle(centerX, centerY, Math.min(safeWidth, safeHeight) * 0.42)
      .fill({ color: 0x381a64, alpha: 0.12 });

    this.arena.clear()
      .roundRect(centerX - arenaWidth / 2, centerY - arenaHeight / 2, arenaWidth, arenaHeight, 28)
      .fill({ color: 0x0b1020, alpha: 0.8 })
      .stroke({ color: 0x6548a8, width: 1.5, alpha: 0.7 });

    this.orbit.clear()
      .circle(0, 0, 62)
      .stroke({ color: 0xd756ff, width: 2, alpha: 0.28 })
      .moveTo(-72, 0)
      .lineTo(-54, 0)
      .moveTo(54, 0)
      .lineTo(72, 0)
      .moveTo(0, -72)
      .lineTo(0, -54)
      .moveTo(0, 54)
      .lineTo(0, 72)
      .stroke({ color: 0x6fe9ff, width: 1.5, alpha: 0.45 });

    this.orbit.position.set(centerX, centerY);
    this.orbGlow.position.set(centerX, centerY);
    this.orb.position.set(centerX, centerY);
    this.status.position.set(centerX, Math.max(24, centerY - arenaHeight / 2 + 24));
  }
}
