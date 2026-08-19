import { Container, Graphics } from 'pixi.js';
import type { Rect } from '../movement';
import type { EnemyActor, EnemyKind } from './EnemyActor';

export class WalkerEnemy extends Container implements EnemyActor {
  readonly kind: EnemyKind = 'walker'; hp = 3; hurtTime = 0; private vx = 0; private direction: -1 | 1 = -1;
  constructor(public readonly enemyId: number, x: number, private readonly groundY: number, private minX: number, private maxX: number) {
    super(); this.position.set(x, groundY - 22);
    const shadow = new Graphics().ellipse(0, 22, 17, 5).fill({ color: 0x111111, alpha: 0.18 });
    const body = new Graphics().moveTo(-15, 18).quadraticCurveTo(-18, -13, 0, -24).quadraticCurveTo(18, -13, 15, 18).closePath().fill(0x57554c);
    const eye = new Graphics().circle(-6, -7, 2).circle(6, -7, 2).fill(0xe9e4d8); this.addChild(shadow, body, eye);
  }
  update(playerX: number, _playerY: number, dt: number) {
    this.hurtTime = Math.max(0, this.hurtTime - dt); if (this.hp <= 0) { this.alpha = Math.max(0, this.alpha - dt * 4); return; }
    const distance = playerX - this.x; if (Math.abs(distance) < 150) this.direction = distance < 0 ? -1 : 1;
    const speed = Math.abs(distance) < 150 ? 38 : 22; this.vx += (this.direction * speed - this.vx) * Math.min(1, dt * 7); this.x += this.vx * dt;
    if (this.x < this.minX) { this.x = this.minX; this.direction = 1; } if (this.x > this.maxX) { this.x = this.maxX; this.direction = -1; }
    this.scale.x = this.direction; this.alpha = this.hurtTime > 0 ? 0.45 : 1;
  }
  hurtbox(): Rect { return { x: this.x - 16, y: this.groundY - 46, width: 32, height: 46 }; }
  hit(direction: -1 | 1) { this.hp--; this.hurtTime = 0.12; this.x += direction * 24; this.vx = direction * 115; }
  impactPoint() { return { x: this.x, y: this.groundY - 25 }; }
}
