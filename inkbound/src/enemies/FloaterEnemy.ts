import { Container, Graphics } from 'pixi.js';
import type { Rect } from '../movement';
import type { EnemyActor, EnemyKind } from './EnemyActor';

export interface InkShot { x: number; y: number; vx: number; vy: number; life: number }

export class FloaterEnemy extends Container implements EnemyActor {
  readonly kind: EnemyKind = 'floater';
  hp = 2; hurtTime = 0; private age = 0; private fireTimer = 1.1; private facing: -1 | 1 = -1;
  readonly shots: InkShot[] = [];

  constructor(public readonly enemyId: number, x: number, private readonly anchorY: number) {
    super(); this.position.set(x, anchorY);
    const body = new Graphics().ellipse(0, 0, 19, 14).fill(0x66635a);
    const tail = new Graphics().moveTo(-12, 8).bezierCurveTo(-20, 28, 9, 20, 4, 36).stroke({ color: 0x66635a, width: 5, alpha: 0.8 });
    const eye = new Graphics().circle(-6, -2, 2).circle(6, -2, 2).fill(0xe9e4d8); this.addChild(tail, body, eye);
  }

  update(playerX: number, playerY: number, dt: number) {
    this.hurtTime = Math.max(0, this.hurtTime - dt); if (this.hp <= 0) { this.alpha = Math.max(0, this.alpha - dt * 4); return; }
    this.age += dt; this.y = this.anchorY + Math.sin(this.age * 2.2) * 12; this.facing = playerX < this.x ? -1 : 1; this.scale.x = this.facing;
    this.fireTimer -= dt; const dx = playerX - this.x; const dy = (playerY - 25) - this.y; const distance = Math.hypot(dx, dy);
    if (distance < 310 && this.fireTimer <= 0) { const speed = 125; this.shots.push({ x: this.x, y: this.y, vx: dx / distance * speed, vy: dy / distance * speed, life: 3 }); this.fireTimer = 1.55; }
    for (const shot of this.shots) { shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt; }
    for (let i = this.shots.length - 1; i >= 0; i--) if (this.shots[i].life <= 0) this.shots.splice(i, 1);
    this.alpha = this.hurtTime > 0 ? 0.45 : 1;
  }

  hurtbox(): Rect { return { x: this.x - 20, y: this.y - 16, width: 40, height: 32 }; }
  hit(direction: -1 | 1) { this.hp--; this.hurtTime = 0.12; this.x += direction * 18; }
  impactPoint() { return { x: this.x, y: this.y }; }
}
