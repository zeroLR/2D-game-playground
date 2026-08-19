import { Container, Graphics } from 'pixi.js';
import type { Rect } from '../movement';
import type { EnemyActor, EnemyKind } from './EnemyActor';

export class LeaperEnemy extends Container implements EnemyActor {
  readonly kind: EnemyKind = 'leaper';
  hp = 2; hurtTime = 0;
  private baseX: number;
  private state: 'idle' | 'telegraph' | 'leap' | 'land' | 'recover' = 'idle';
  private timer = 0.5; private vx = 0; private vy = 0; private facing: -1 | 1 = -1;
  private readonly groundTop: number;

  constructor(public readonly enemyId: number, x: number, groundY: number) {
    super(); this.baseX = x; this.groundTop = groundY - 20; this.position.set(x, this.groundTop);
    const body = new Graphics().moveTo(-17, 18).quadraticCurveTo(-21, -7, 0, -19).quadraticCurveTo(21, -7, 17, 18).closePath().fill(0x45443d);
    const horns = new Graphics().moveTo(-11, -11).lineTo(-18, -24).lineTo(-5, -16).moveTo(11, -11).lineTo(18, -24).lineTo(5, -16).stroke({ color: 0x45443d, width: 4 });
    this.addChild(body, horns);
  }

  update(playerX: number, _playerY: number, dt: number) {
    this.hurtTime = Math.max(0, this.hurtTime - dt);
    if (this.hp <= 0) { this.alpha = Math.max(0, this.alpha - dt * 4); return; }
    this.timer -= dt;
    const distance = playerX - this.x;
    if (this.state === 'idle' && Math.abs(distance) > 8) this.facing = distance < 0 ? -1 : 1;
    this.scale.x = this.facing;

    if (this.state === 'idle') {
      this.scale.y = 1;
      this.y = this.groundTop;
      if (Math.abs(distance) < 190 && this.timer <= 0) { this.state = 'telegraph'; this.timer = 0.5; }
    } else if (this.state === 'telegraph') {
      // Long, readable crouch: facing is locked here so the committed leap has a predictable dodge direction.
      this.scale.y = 0.68;
      if (this.timer <= 0) { this.state = 'leap'; this.timer = 0.65; this.vx = this.facing * 205; this.vy = -245; this.scale.y = 1; }
    } else if (this.state === 'leap') {
      this.vy += 900 * dt; this.x += this.vx * dt; this.y += this.vy * dt;
      // The leap is a single committed action. Only crossing the known platform ground while descending can end it.
      if (this.vy >= 0 && this.y >= this.groundTop) { this.y = this.groundTop; this.vx = 0; this.vy = 0; this.state = 'land'; this.timer = 0.14; }
    } else if (this.state === 'land') {
      this.scale.y = 0.78;
      if (this.timer <= 0) { this.state = 'recover'; this.timer = 0.72; }
    } else if (this.state === 'recover') {
      this.scale.y = 1;
      if (this.timer <= 0) { this.state = 'idle'; this.timer = 0.42; }
    }

    if (Math.abs(this.x - this.baseX) > 150 && this.state === 'idle') this.x += Math.sign(this.baseX - this.x) * 30 * dt;
    this.alpha = this.hurtTime > 0 ? 0.45 : 1;
  }

  hurtbox(): Rect { return { x: this.x - 18, y: this.y - 22, width: 36, height: 42 }; }
  hit(direction: -1 | 1) { this.hp--; this.hurtTime = 0.12; this.x += direction * 22; }
  impactPoint() { return { x: this.x, y: this.y }; }
}
