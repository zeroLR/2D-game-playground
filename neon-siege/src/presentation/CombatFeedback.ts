import { Container, Graphics, Text, TextStyle, Ticker } from 'pixi.js';
import { COLORS } from './theme';

export class CombatFeedback {
  private shakeTime = 0;
  private shakeStrength = 0;
  private freezeTime = 0;

  constructor(
    private readonly fx: Container,
    private readonly world: Container,
    private readonly ticker: Ticker,
  ) {}

  muzzle(x: number, y: number, direction: -1 | 1) {
    const flash = new Graphics()
      .poly(direction > 0 ? [0, 0, 16, -5, 28, 0, 16, 5] : [0, 0, -16, -5, -28, 0, -16, 5])
      .fill(COLORS.amber)
      .circle(direction * 8, 0, 3).fill(COLORS.white);
    flash.position.set(x, y);
    this.fx.addChild(flash);
    this.fade(flash, 0.07);
  }

  trail(fromX: number, toX: number, y: number, direction: -1 | 1) {
    const length = Math.max(8, Math.abs(toX - fromX));
    const trail = new Graphics()
      .rect(direction > 0 ? -length : 0, -1, length, 2)
      .fill({ color: COLORS.pink, alpha: 0.55 });
    trail.position.set(toX, y);
    this.fx.addChild(trail);
    this.fade(trail, 0.09);
  }

  enemyAttackTelegraph(x: number, y: number, heavy: boolean) {
    const radius = heavy ? 28 : 20;
    const warning = new Graphics()
      .circle(x, y, radius).stroke({ color: COLORS.amber, width: heavy ? 4 : 3, alpha: 0.95 })
      .circle(x, y, radius * 0.45).stroke({ color: COLORS.red, width: 2, alpha: 0.85 });
    this.fx.addChild(warning);
    this.fade(warning, heavy ? 0.32 : 0.18);
  }

  enemyAttackImpact(x: number, y: number, heavy: boolean) {
    const impact = new Graphics();
    const rays = heavy ? 10 : 7;
    const radius = heavy ? 34 : 24;
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays;
      impact.moveTo(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8)
        .lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)
        .stroke({ color: i % 2 ? COLORS.red : COLORS.amber, width: heavy ? 3 : 2, alpha: 0.9 });
    }
    this.fx.addChild(impact);
    this.fade(impact, heavy ? 0.2 : 0.14);
    this.shakeTime = Math.max(this.shakeTime, heavy ? 0.22 : 0.14);
    this.shakeStrength = Math.max(this.shakeStrength, heavy ? 9 : 6);
  }

  hit(x: number, y: number, damage: number, heavy: boolean) {
    const burst = new Graphics();
    const radius = heavy ? 18 : 12;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      burst.moveTo(x, y).lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)
        .stroke({ color: i % 2 ? COLORS.white : COLORS.pink, width: 2, alpha: 0.9 });
    }
    this.fx.addChild(burst);
    this.fade(burst, 0.12);

    const label = new Text({
      text: `${Math.round(damage)}`,
      style: new TextStyle({ fill: heavy ? COLORS.amber : COLORS.white, fontSize: heavy ? 15 : 12, fontWeight: '900' }),
    });
    label.anchor.set(0.5);
    label.position.set(x, y - 18);
    this.fx.addChild(label);
    let life = 0.42;
    const tick = (t: Ticker) => {
      life -= t.deltaMS / 1000;
      label.y -= t.deltaMS * 0.025;
      label.alpha = Math.max(0, life / 0.18);
      if (life <= 0) {
        label.destroy();
        this.ticker.remove(tick);
      }
    };
    this.ticker.add(tick);

    this.shakeTime = Math.max(this.shakeTime, heavy ? 0.12 : 0.07);
    this.shakeStrength = Math.max(this.shakeStrength, heavy ? 5 : 3);
    this.freezeTime = Math.max(this.freezeTime, heavy ? 0.045 : 0.025);
  }

  death(x: number, y: number, heavy: boolean) {
    const debris = new Graphics();
    const count = heavy ? 10 : 7;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const radius = heavy ? 26 : 18;
      debris.rect(x + Math.cos(angle) * radius - 2, y + Math.sin(angle) * radius - 2, 4, 4)
        .fill(i % 2 ? COLORS.pink : COLORS.cyan);
    }
    this.fx.addChild(debris);
    this.fade(debris, heavy ? 0.28 : 0.2);
    this.shakeTime = Math.max(this.shakeTime, heavy ? 0.2 : 0.1);
    this.shakeStrength = Math.max(this.shakeStrength, heavy ? 7 : 4);
  }

  playerHit(x = 0, y = 0, heavy = false) {
    const ring = new Graphics()
      .circle(x, y, heavy ? 30 : 23)
      .stroke({ color: COLORS.red, width: heavy ? 5 : 3, alpha: 0.95 });
    this.fx.addChild(ring);
    this.fade(ring, heavy ? 0.22 : 0.16);
    this.shakeTime = Math.max(this.shakeTime, heavy ? 0.2 : 0.16);
    this.shakeStrength = Math.max(this.shakeStrength, heavy ? 8 : 6);
  }

  consumeTime(dt: number) {
    return this.freezeTime > 0 ? 0 : dt;
  }

  update(dt: number) {
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      this.world.position.set((Math.random() - 0.5) * this.shakeStrength * 2, (Math.random() - 0.5) * this.shakeStrength * 2);
    } else {
      this.world.position.set(0, 0);
      this.shakeStrength = 0;
    }

    if (this.freezeTime > 0) {
      this.freezeTime = Math.max(0, this.freezeTime - dt);
    }
  }

  private fade(display: Graphics, duration: number) {
    let life = duration;
    const tick = (t: Ticker) => {
      life -= t.deltaMS / 1000;
      display.alpha = Math.max(0, life / duration);
      if (life <= 0) {
        display.destroy();
        this.ticker.remove(tick);
      }
    };
    this.ticker.add(tick);
  }
}
