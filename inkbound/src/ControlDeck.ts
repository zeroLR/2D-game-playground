import { Container, Graphics, Text } from 'pixi.js';
import { CONTROL_HEIGHT, GAMEPLAY_HEIGHT, LOGICAL_WIDTH } from './layout';
import { InputState, type ActionName } from './InputState';

const STICK_X = 86;
const STICK_Y = GAMEPLAY_HEIGHT + 132;
const STICK_RADIUS = 58;
const KNOB_RADIUS = 24;

export class ControlDeck extends Container {
  private readonly knob = new Graphics();
  private stickPointer: number | null = null;

  constructor(private readonly input: InputState) {
    super();
    this.eventMode = 'static';
    this.hitArea = { contains: (x: number, y: number) => x >= 0 && x <= LOGICAL_WIDTH && y >= GAMEPLAY_HEIGHT && y <= GAMEPLAY_HEIGHT + CONTROL_HEIGHT };

    const bg = new Graphics().rect(0, GAMEPLAY_HEIGHT, LOGICAL_WIDTH, CONTROL_HEIGHT).fill(0x25241f);
    const divider = new Graphics().rect(0, GAMEPLAY_HEIGHT, LOGICAL_WIDTH, 2).fill(0x807b6c);
    this.addChild(bg, divider);

    this.addChild(new Text({ text: '墨盤', style: { fill: 0xb9b29f, fontSize: 14, letterSpacing: 3 } }));
    this.children[this.children.length - 1].position.set(16, GAMEPLAY_HEIGHT + 14);

    const stickBase = new Graphics().circle(STICK_X, STICK_Y, STICK_RADIUS).fill({ color: 0x11110f, alpha: 0.55 }).stroke({ color: 0x9b9585, width: 2, alpha: 0.65 });
    this.knob.circle(STICK_X, STICK_Y, KNOB_RADIUS).fill({ color: 0xd8d1bd, alpha: 0.8 });
    this.addChild(stickBase, this.knob);

    this.addAction('ink', '墨', 305, GAMEPLAY_HEIGHT + 84, 38);
    this.addAction('attack', '斬', 250, GAMEPLAY_HEIGHT + 164, 46);
    this.addAction('dash', '身', 337, GAMEPLAY_HEIGHT + 174, 42);

    for (const [label, x] of [['符', 190], ['器', 245], ['藥', 300]] as const) {
      const slot = new Graphics().roundRect(x - 19, GAMEPLAY_HEIGHT + 235, 38, 30, 7).fill(0x33312b).stroke({ color: 0x625f55, width: 1 });
      const text = new Text({ text: label, style: { fill: 0x777268, fontSize: 14 } });
      text.anchor.set(0.5); text.position.set(x, GAMEPLAY_HEIGHT + 250);
      this.addChild(slot, text);
    }

    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointermove', this.onPointerMove, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerupoutside', this.onPointerUp, this);
  }

  private addAction(action: ActionName, label: string, x: number, y: number, radius: number) {
    const button = new Container();
    button.position.set(x, y); button.eventMode = 'static'; button.cursor = 'pointer';
    button.hitArea = new (class { contains(px: number, py: number) { return px * px + py * py <= radius * radius; } })();
    const circle = new Graphics().circle(0, 0, radius).fill({ color: 0xe0d8c1, alpha: 0.12 }).stroke({ color: 0xc7bea7, width: 2, alpha: 0.75 });
    const text = new Text({ text: label, style: { fill: 0xe7dfca, fontSize: action === 'attack' ? 24 : 18, fontWeight: '600' } });
    text.anchor.set(0.5); button.addChild(circle, text);
    button.on('pointerdown', (event) => { event.stopPropagation(); this.input.setAction(action, true); circle.alpha = 0.45; });
    const release = () => { this.input.setAction(action, false); circle.alpha = 1; };
    button.on('pointerup', release); button.on('pointerupoutside', release); button.on('pointercancel', release);
    this.addChild(button);
  }

  private onPointerDown(event: any) {
    const p = event.getLocalPosition(this);
    if (p.x > 160 || p.y < GAMEPLAY_HEIGHT + 45) return;
    this.stickPointer = event.pointerId;
    this.updateStick(p.x, p.y);
  }

  private onPointerMove(event: any) {
    if (this.stickPointer !== event.pointerId) return;
    const p = event.getLocalPosition(this); this.updateStick(p.x, p.y);
  }

  private onPointerUp(event: any) {
    if (this.stickPointer !== event.pointerId) return;
    this.stickPointer = null; this.input.setMove(0, 0); this.drawKnob(STICK_X, STICK_Y);
  }

  private updateStick(x: number, y: number) {
    const dx = x - STICK_X; const dy = y - STICK_Y; const distance = Math.hypot(dx, dy);
    const scale = distance > STICK_RADIUS ? STICK_RADIUS / distance : 1;
    const nx = dx * scale; const ny = dy * scale;
    this.input.setMove(nx / STICK_RADIUS, ny / STICK_RADIUS); this.drawKnob(STICK_X + nx, STICK_Y + ny);
  }

  private drawKnob(x: number, y: number) {
    this.knob.clear().circle(x, y, KNOB_RADIUS).fill({ color: 0xd8d1bd, alpha: 0.8 });
  }
}
