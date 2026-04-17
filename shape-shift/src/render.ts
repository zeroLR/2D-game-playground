import { Graphics } from "pixi.js";
import type { World } from "./game/world";

// One Graphics node redrawn each frame. Every entity is a tiny vector shape;
// at <300 entities with simple paths this is well inside the single-draw-call
// budget and avoids per-entity object churn.

export function drawWorld(g: Graphics, world: World): void {
  g.clear();

  // Grid backdrop (very light) — draw once at the start.
  g.setStrokeStyle({ width: 1, color: 0xf0f0f0 });
  const STEP = 40;
  // Kept as horizontal + vertical lines in play-field coords; the canvas
  // already fills the whole 360×640.
  for (let x = 0; x <= 360; x += STEP) { g.moveTo(x, 0); g.lineTo(x, 640); }
  for (let y = 0; y <= 640; y += STEP) { g.moveTo(0, y); g.lineTo(360, y); }
  g.stroke();

  // Projectiles (magenta dots).
  for (const [, c] of world.with("projectile", "pos", "radius")) {
    const color = c.projectile!.crit ? 0xff3030 : 0xd81b60;
    g.circle(c.pos!.x, c.pos!.y, c.radius!);
    g.fill({ color });
  }

  // Enemies.
  for (const [, c] of world.with("enemy", "pos", "radius")) {
    const { x, y } = c.pos!;
    const r = c.radius!;
    const kind = c.enemy!.kind;
    const flash = (c.flash ?? 0) > 0;
    const fillColor = flash ? 0xffffff : enemyColor(kind);
    const strokeColor = 0x111111;
    drawEnemyShape(g, kind, x, y, r);
    g.fill({ color: fillColor });
    drawEnemyShape(g, kind, x, y, r);
    g.stroke({ color: strokeColor, width: 2 });
  }

  // Avatar (triangle). Flash white briefly on hit; iframes produce a ring.
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
    g.fill({ color: bodyFill });
    g.stroke({ color: 0x111111, width: 2 });
    if (a.iframes > 0) {
      g.circle(x, y, r + 4);
      g.stroke({ color: 0x00bcd4, width: 1.5 });
    }
  }
}

function enemyColor(kind: string): number {
  switch (kind) {
    case "circle":  return 0xfafafa;
    case "square":  return 0xffe6a0;
    case "star":    return 0xc9e7ff;
    case "boss":    return 0xffd1e1;
    default:        return 0xffffff;
  }
}

function drawEnemyShape(g: Graphics, kind: string, x: number, y: number, r: number): void {
  switch (kind) {
    case "circle":
      g.circle(x, y, r);
      break;
    case "square":
      g.rect(x - r, y - r, r * 2, r * 2);
      break;
    case "star":
      drawStar(g, x, y, r, 5);
      break;
    case "boss":
      drawPolygon(g, x, y, r, 6);
      break;
    default:
      g.circle(x, y, r);
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
