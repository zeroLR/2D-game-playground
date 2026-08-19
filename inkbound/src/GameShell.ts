import { Container, Graphics, Text } from 'pixi.js';
import { CameraController } from './CameraController';
import { createAttackState, HIT_STOP, isAttackActive, overlaps, playerAttackHitbox, startAttack, stepAttack } from './combat';
import { ControlDeck } from './ControlDeck';
import { Encounter } from './Encounter';
import { InputState } from './InputState';
import { GAMEPLAY_HEIGHT, LOGICAL_WIDTH } from './layout';
import { createPlayerMotion, stepPlayer, type Rect } from './movement';

const WORLD_WIDTH = 1380; const WORLD_HEIGHT = 760; const HIT_SHAKE_DURATION = 0.075; const HIT_SHAKE_STRENGTH = 2;
const PLATFORMS: Rect[] = [
  { x: 0, y: 500, width: 330, height: 80 }, { x: 330, y: 472, width: 130, height: 108 },
  { x: 485, y: 430, width: 150, height: 150 }, { x: 675, y: 500, width: 235, height: 80 },
  { x: 940, y: 455, width: 145, height: 125 }, { x: 1120, y: 405, width: 260, height: 175 },
];

export class GameShell extends Container {
  readonly input = new InputState(); private readonly world = new Container(); private readonly player = new Container(); private readonly attackFx = new Graphics();
  private readonly impactLayer = new Container(); private readonly trailLayer = new Container(); private readonly camera = new CameraController(); private readonly encounter = new Encounter();
  private readonly motion = createPlayerMotion(); private readonly attack = createAttackState(); private dashWasPressed = false; private attackWasPressed = false; private trailTimer = 0; private hitStop = 0; private shakeTime = 0;
  private readonly status = new Text({ text: '', style: { fill: 0x3e3c35, fontSize: 13 } });

  constructor() {
    super(); const gameplayMask = new Graphics().rect(0, 0, LOGICAL_WIDTH, GAMEPLAY_HEIGHT).fill(0xffffff); this.addChild(this.world, gameplayMask); this.world.mask = gameplayMask;
    this.drawWorld(); this.world.addChild(this.trailLayer, this.encounter); this.drawPlayer(); this.world.addChild(this.attackFx, this.impactLayer); this.drawHud(); this.addChild(new ControlDeck(this.input));
  }

  update(deltaSeconds: number) {
    const dt = Math.min(deltaSeconds, 1 / 30); this.updateImpactFx(dt); if (this.hitStop > 0) { this.hitStop = Math.max(0, this.hitStop - dt); this.applyCameraPosition(); return; }
    const input = this.input.snapshot(); const dashPressed = input.dash && !this.dashWasPressed; const attackPressed = input.attack && !this.attackWasPressed; this.dashWasPressed = input.dash; this.attackWasPressed = input.attack;
    if (attackPressed) startAttack(this.attack); stepAttack(this.attack, dt); stepPlayer(this.motion, input.moveX, dashPressed, dt, PLATFORMS); this.encounter.update(this.motion.x, this.motion.y, dt); this.resolveAttack();
    this.camera.update(this.motion.x, this.motion.y, this.motion.facing, dt); this.player.position.set(this.motion.x, this.motion.y - 25); this.player.scale.x = this.motion.facing; this.applyCameraPosition(); this.drawAttackFx();
    this.status.text = this.encounter.cleared ? '墨獸已散' : '';
    if (this.motion.dashTime > 0) { this.trailTimer -= dt; if (this.trailTimer <= 0) { this.spawnInkTrail(); this.trailTimer = 0.035; } } else this.trailTimer = 0;
    for (const child of [...this.trailLayer.children]) { child.alpha -= dt * 2.8; child.scale.x += dt * 0.45; if (child.alpha <= 0) child.destroy(); }
  }

  private resolveAttack() {
    if (!isAttackActive(this.attack)) return; const hitbox = playerAttackHitbox(this.motion.x, this.motion.y, this.motion.facing);
    for (const enemy of this.encounter.enemies) { if (enemy.hp <= 0 || this.attack.hitIds.has(enemy.enemyId) || !overlaps(hitbox, enemy.hurtbox())) continue; this.attack.hitIds.add(enemy.enemyId); enemy.hit(this.motion.facing); this.hitStop = HIT_STOP; this.shakeTime = HIT_SHAKE_DURATION; const point = enemy.impactPoint(); this.spawnImpact(point.x, point.y); }
  }

  private applyCameraPosition() { const strength = this.shakeTime > 0 ? HIT_SHAKE_STRENGTH * (this.shakeTime / HIT_SHAKE_DURATION) : 0; const sx = strength ? (Math.random() * 2 - 1) * strength : 0; const sy = strength ? (Math.random() * 2 - 1) * strength * 0.4 : 0; this.world.position.set(-this.camera.x + sx, -this.camera.y + sy); }
  private spawnImpact(x: number, y: number) { const burst = new Graphics().circle(0, 0, 7).stroke({ color: 0x171714, width: 5, alpha: 0.9 }); for (let i = 0; i < 6; i++) { const a = Math.PI * 2 * i / 6; burst.moveTo(Math.cos(a) * 8, Math.sin(a) * 8).lineTo(Math.cos(a) * 25, Math.sin(a) * 25).stroke({ color: 0x171714, width: 3, alpha: 0.75 }); } burst.position.set(x, y); this.impactLayer.addChild(burst); }
  private updateImpactFx(dt: number) { this.shakeTime = Math.max(0, this.shakeTime - dt); for (const child of [...this.impactLayer.children]) { child.alpha -= dt * 5.5; child.scale.set(child.scale.x + dt * 2.2); if (child.alpha <= 0) child.destroy(); } }
  private drawAttackFx() { this.attackFx.clear(); if (!isAttackActive(this.attack)) return; const x = this.motion.x + this.motion.facing * 34; const y = this.motion.y - 27; this.attackFx.arc(x, y, 38, this.motion.facing > 0 ? -1.05 : 2.1, this.motion.facing > 0 ? 1.05 : 4.18).stroke({ color: 0x171714, width: 8, alpha: 0.82 }); }
  private drawWorld() {
    this.world.addChild(new Graphics().rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT).fill(0xe9e4d8)); const farMountains = new Graphics(); for (let x = -100; x < WORLD_WIDTH + 200; x += 280) farMountains.moveTo(x, 390).bezierCurveTo(x + 80, 300, x + 135, 335, x + 210, 265).bezierCurveTo(x + 270, 340, x + 320, 330, x + 380, 395).lineTo(x + 380, 560).lineTo(x, 560).fill({ color: 0x77756c, alpha: 0.10 }); this.world.addChild(farMountains);
    for (let i = 0; i < 29; i++) { const x = 28 + i * 49; this.world.addChild(new Graphics().moveTo(x, 75 + i % 4 * 19).lineTo(x - 18, 525).stroke({ color: 0x65645b, width: i % 3 === 0 ? 4 : 2, alpha: 0.17 })); }
    for (const p of PLATFORMS) { const rock = new Graphics().moveTo(p.x, p.y).lineTo(p.x + p.width, p.y).lineTo(p.x + p.width - 18, p.y + p.height).lineTo(p.x + 12, p.y + p.height).closePath().fill({ color: 0x36362f, alpha: 0.76 }); rock.moveTo(p.x, p.y).lineTo(p.x + p.width, p.y).stroke({ color: 0x171714, width: 4, alpha: 0.75 }); this.world.addChild(rock); }
    const hint = new Text({ text: '行 · 躍 · 浮  —  讀招後用斬 / 身應對', style: { fill: 0x777269, fontSize: 13 } }); hint.position.set(42, 365); this.world.addChild(hint);
  }
  private drawHud() { const hp = new Text({ text: '● ● ● ● ●', style: { fill: 0x3e3c35, fontSize: 14, letterSpacing: 2 } }); hp.position.set(14, 14); const ink = new Text({ text: '墨  ◐ ◐ ◐', style: { fill: 0x3e3c35, fontSize: 14 } }); ink.position.set(286, 14); this.status.position.set(164, 42); this.addChild(hp, ink, this.status); }
  private drawPlayer() { const shadow = new Graphics().ellipse(0, 27, 19, 5).fill({ color: 0x111111, alpha: 0.18 }); const body = new Graphics().moveTo(-11, 24).quadraticCurveTo(-15, -10, 0, -28).quadraticCurveTo(15, -10, 11, 24).closePath().fill(0x24231f); const scarf = new Graphics().moveTo(-4, -14).bezierCurveTo(-29, -24, -29, -2, -45, 2).stroke({ color: 0x444139, width: 4, alpha: 0.8 }); this.player.addChild(shadow, scarf, body); this.world.addChild(this.player); }
  private spawnInkTrail() { const mark = new Graphics().ellipse(0, 0, 15, 24).fill({ color: 0x24231f, alpha: 0.28 }); mark.position.set(this.motion.x - this.motion.facing * 12, this.motion.y - 25); mark.scale.x = this.motion.facing; this.trailLayer.addChild(mark); }
}
