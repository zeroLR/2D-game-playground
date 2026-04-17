import { Graphics } from "pixi.js";
import { PLAY_H, PLAY_W } from "./game/config";
import type { EnemyKind, World } from "./game/world";

export function drawGrid(g: Graphics): void {
  const STEP = 40;
  for (let x = 0; x <= PLAY_W; x += STEP) { g.moveTo(x, 0); g.lineTo(x, PLAY_H); }
  for (let y = 0; y <= PLAY_H; y += STEP) { g.moveTo(0, y); g.lineTo(PLAY_W, y); }
  g.stroke({ color: 0xf0f0f0, width: 1 });
}

export function drawWorld(g: Graphics, world: World): void {
  g.clear();

  for (const [, c] of world.with("projectile", "pos", "radius")) {
    const enemyShot = c.team === "enemy-shot";
    const color = enemyShot
      ? (c.projectile!.crit ? 0xff2020 : 0xff7043)
      : (c.projectile!.crit ? 0xff3030 : 0xd81b60);
    g.circle(c.pos!.x, c.pos!.y, c.radius!);
    g.fill({ color });
    if (enemyShot) {
      g.circle(c.pos!.x, c.pos!.y, c.radius! + 1.5);
      g.stroke({ color: 0x111111, width: 1 });
    }
  }

  for (const [, c] of world.with("enemy", "pos", "radius")) {
    const { x, y } = c.pos!;
    const r = c.radius!;
    const kind = c.enemy!.kind;
    const flash = (c.flash ?? 0) > 0;
    const fillColor = flash ? 0xffffff : enemyColor(kind);
    drawEnemyShape(g, kind, x, y, r);
    g.fill({ color: fillColor }).stroke({ color: 0x111111, width: 2 });
  }

  for (const [, c] of world.with("avatar", "pos", "radius")) {
    const { x, y } = c.pos!;
    const r = c.radius!;
    const a = c.avatar!;
    const bodyFill = (c.flash ?? 0) > 0 ? 0xffffff : 0x111111;
    const h = r * Math.sqrt(3) / 2;
    g.moveTo(x, y - h * 0.9);
    g.lineTo(x + r * 0.9, y + h * 0.6);
    g.lineTo(x - r * 0.9, y + h * 0.6);
    g.closePath();
    g.fill({ color: bodyFill }).stroke({ color: 0x111111, width: 2 });
    if (a.iframes > 0) {
      g.circle(x, y, r + 4);
      g.stroke({ color: 0x00bcd4, width: 1.5 });
    }
  }
}

function enemyColor(kind: EnemyKind): number {
  switch (kind) {
    case "circle":  return 0xfafafa;
    case "square":  return 0xffe6a0;
    case "star":    return 0xc9e7ff;
    case "boss":    return 0xffd1e1;
  }
}

function drawEnemyShape(g: Graphics, kind: EnemyKind, x: number, y: number, r: number): void {
  switch (kind) {
    case "circle": g.circle(x, y, r); break;
    case "square": g.rect(x - r, y - r, r * 2, r * 2); break;
    case "star":   drawStar(g, x, y, r, 5); break;
    case "boss":   drawPolygon(g, x, y, r, 6); break;
  }
}

function drawPolygon(g: Graphics, cx: number, cy: number, r: number, sides: number): void {
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}

function drawStar(g: Graphics, cx: number, cy: number, r: number, points: number): void {
  const inner = r * 0.45;
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}
