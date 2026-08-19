import { Container, Graphics, Text } from 'pixi.js';
import { ControlDeck } from './ControlDeck';
import { InputState } from './InputState';
import { GAMEPLAY_HEIGHT, LOGICAL_WIDTH } from './layout';

export class GameShell extends Container {
  readonly input = new InputState();
  private readonly player = new Container();
  private readonly status = new Text({ text: '', style: { fill: 0x34332f, fontSize: 12 } });

  constructor() {
    super();
    this.drawWorld();
    this.drawHud();
    this.drawPlayer();
    this.addChild(new ControlDeck(this.input));
  }

  update(deltaSeconds: number) {
    const input = this.input.snapshot();
    const speed = input.dash ? 150 : 75;
    this.player.x = Math.max(22, Math.min(LOGICAL_WIDTH - 22, this.player.x + input.moveX * speed * deltaSeconds));
    this.player.y = Math.max(72, Math.min(GAMEPLAY_HEIGHT - 54, this.player.y + input.moveY * speed * deltaSeconds));
    this.status.text = `move ${input.moveX.toFixed(2)}, ${input.moveY.toFixed(2)}  ${input.attack ? '斬 ' : ''}${input.dash ? '身 ' : ''}${input.ink ? '墨' : ''}`;
  }

  private drawWorld() {
    const paper = new Graphics().rect(0, 0, LOGICAL_WIDTH, GAMEPLAY_HEIGHT).fill(0xe9e4d8);
    this.addChild(paper);
    for (let i = 0; i < 9; i++) {
      const x = 18 + i * 49;
      const bamboo = new Graphics().moveTo(x, 82 + (i % 3) * 15).lineTo(x - 10, 470).stroke({ color: 0x777565, width: i % 2 ? 3 : 2, alpha: 0.22 });
      this.addChild(bamboo);
    }
    const mountain = new Graphics().moveTo(0, 390).bezierCurveTo(70, 330, 115, 360, 165, 305).bezierCurveTo(230, 385, 305, 300, 390, 365).lineTo(390, GAMEPLAY_HEIGHT).lineTo(0, GAMEPLAY_HEIGHT).fill({ color: 0x68675f, alpha: 0.13 });
    this.addChild(mountain);
    const ground = new Graphics().rect(0, 500, LOGICAL_WIDTH, 60).fill({ color: 0x292923, alpha: 0.72 });
    this.addChild(ground);
  }

  private drawHud() {
    const hp = new Text({ text: '● ● ● ● ●', style: { fill: 0x3e3c35, fontSize: 14, letterSpacing: 2 } }); hp.position.set(14, 14);
    const ink = new Text({ text: '墨  ◐ ◐ ◐', style: { fill: 0x3e3c35, fontSize: 14 } }); ink.position.set(286, 14);
    this.status.position.set(14, 40);
    this.addChild(hp, ink, this.status);
  }

  private drawPlayer() {
    const shadow = new Graphics().ellipse(0, 23, 18, 5).fill({ color: 0x111111, alpha: 0.18 });
    const body = new Graphics().moveTo(-10, 18).quadraticCurveTo(-14, -8, 0, -23).quadraticCurveTo(14, -8, 10, 18).closePath().fill(0x24231f);
    const scarf = new Graphics().moveTo(-5, -12).bezierCurveTo(-30, -20, -28, -2, -42, 3).stroke({ color: 0x444139, width: 4, alpha: 0.8 });
    this.player.addChild(shadow, scarf, body); this.player.position.set(LOGICAL_WIDTH / 2, 450); this.addChild(this.player);
  }
}
