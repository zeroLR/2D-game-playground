import { Graphics } from "pixi.js";
import { PLAY_H, PLAY_W } from "./game/config";
import { BOSS_FAN_SPREAD, BOSS_TELEGRAPH_LEAD } from "./game/systems/bossWeapon";
import type { EnemyKind, World } from "./game/world";
import type { StageTheme } from "./game/stageThemes";

export function drawGrid(g: Graphics, gridColor: number = 0xf0f0f0): void {
  const STEP = 40;
  for (let x = 0; x <= PLAY_W; x += STEP) { g.moveTo(x, 0); g.lineTo(x, PLAY_H); }
  for (let y = 0; y <= PLAY_H; y += STEP) { g.moveTo(0, y); g.lineTo(PLAY_W, y); }
  g.stroke({ color: gridColor, width: 1 });
}

export function drawWorld(g: Graphics, world: World, theme?: StageTheme): void {
  g.clear();
  const dark = theme?.dark ?? false;
  const strokeColor = theme?.enemyStroke ?? 0x111111;
  const playerBodyColor = theme?.playerColor ?? 0x111111;

  for (const [, c] of world.with("projectile", "pos", "radius")) {
    const enemyShot = c.team === "enemy-shot";
    const color = enemyShot
      ? (c.projectile!.crit ? 0xff2020 : 0xff7043)
      : (c.projectile!.crit ? 0xff3030 : 0xd81b60);
    g.circle(c.pos!.x, c.pos!.y, c.radius!);
    g.fill({ color });
    if (enemyShot) {
      g.circle(c.pos!.x, c.pos!.y, c.radius! + 1.5);
      g.stroke({ color: strokeColor, width: 1 });
    }
  }

  // Boss telegraph: draw each pending fan ray before enemies so the boss
  // body overlaps the origin. Alpha ramps up as the shot nears.
  const RAY_LEN = Math.hypot(PLAY_W, PLAY_H);
  for (const [, c] of world.with("enemy", "weapon", "pos")) {
    if (c.enemy!.kind !== "boss") continue;
    const ang = c.enemy!.telegraphAngle;
    if (ang === undefined) continue;
    const remaining = c.weapon!.cooldown;
    const t = 1 - Math.max(0, Math.min(1, remaining / BOSS_TELEGRAPH_LEAD));
    const alpha = 0.2 + 0.55 * t;
    const n = Math.max(1, c.weapon!.projectiles);
    const startAngle = ang - (BOSS_FAN_SPREAD * (n - 1)) / 2;
    for (let i = 0; i < n; i++) {
      const a = startAngle + BOSS_FAN_SPREAD * i;
      g.moveTo(c.pos!.x, c.pos!.y);
      g.lineTo(c.pos!.x + Math.cos(a) * RAY_LEN, c.pos!.y + Math.sin(a) * RAY_LEN);
    }
    g.stroke({ color: 0xff2020, alpha, width: 2 });
  }

  for (const [, c] of world.with("enemy", "pos", "radius")) {
    const { x, y } = c.pos!;
    const r = c.radius!;
    const kind = c.enemy!.kind;
    const flash = (c.flash ?? 0) > 0;
    const fillColor = flash ? 0xffffff : enemyColor(kind, dark);
    drawEnemyShape(g, kind, x, y, r);
    g.fill({ color: fillColor }).stroke({ color: strokeColor, width: 2 });

    // Shield indicator (hexagon)
    if (c.enemy!.shield && c.enemy!.shield > 0) {
      g.circle(x, y, r + 3);
      g.stroke({ color: 0x00e5ff, width: 1.5 });
    }

    // Elite ring — visual tell that this kill yields a draft token.
    if (c.enemy!.isElite) {
      g.circle(x, y, r + 5);
      g.stroke({ color: 0xd81b60, width: 1.5 });
    }
  }

  for (const [, c] of world.with("avatar", "pos", "radius")) {
    const { x, y } = c.pos!;
    const r = c.radius!;
    const a = c.avatar!;
    const bodyFill = (c.flash ?? 0) > 0 ? 0xffffff : playerBodyColor;
    const h = r * Math.sqrt(3) / 2;
    g.moveTo(x, y - h * 0.9);
    g.lineTo(x + r * 0.9, y + h * 0.6);
    g.lineTo(x - r * 0.9, y + h * 0.6);
    g.closePath();
    g.fill({ color: bodyFill }).stroke({ color: playerBodyColor, width: 2 });
    if (a.iframes > 0) {
      g.circle(x, y, r + 4);
      g.stroke({ color: 0x00bcd4, width: 1.5 });
    }
  }
}

function enemyColor(kind: EnemyKind, dark: boolean): number {
  if (dark) {
    // Brighter, more saturated palette for dark backgrounds
    switch (kind) {
      case "circle":    return 0xffffff;
      case "square":    return 0xffd740;
      case "star":      return 0x64b5f6;
      case "boss":      return 0xff80ab;
      case "pentagon":  return 0x69f0ae;
      case "hexagon":   return 0x40c4ff;
      case "diamond":   return 0xffab40;
      case "cross":     return 0xea80fc;
      case "crescent":  return 0xffe57f;
    }
  }
  switch (kind) {
    case "circle":    return 0xfafafa;
    case "square":    return 0xffe6a0;
    case "star":      return 0xc9e7ff;
    case "boss":      return 0xffd1e1;
    case "pentagon":  return 0xd4f5d4;
    case "hexagon":   return 0xd0f0ff;
    case "diamond":   return 0xffe0cc;
    case "cross":     return 0xf5d0f5;
    case "crescent":  return 0xfff4cc;
  }
}

function drawEnemyShape(g: Graphics, kind: EnemyKind, x: number, y: number, r: number): void {
  switch (kind) {
    case "circle":   g.circle(x, y, r); break;
    case "square":   g.rect(x - r, y - r, r * 2, r * 2); break;
    case "star":     drawStar(g, x, y, r, 5); break;
    case "boss":     drawPolygon(g, x, y, r, 6); break;
    case "pentagon": drawPolygon(g, x, y, r, 5); break;
    case "hexagon":  drawPolygon(g, x, y, r, 6); break;
    case "diamond":  drawDiamond(g, x, y, r); break;
    case "cross":    drawCross(g, x, y, r); break;
    case "crescent": drawCrescent(g, x, y, r); break;
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

function drawDiamond(g: Graphics, cx: number, cy: number, r: number): void {
  g.moveTo(cx, cy - r);       // top
  g.lineTo(cx + r * 0.6, cy); // right
  g.lineTo(cx, cy + r);       // bottom
  g.lineTo(cx - r * 0.6, cy); // left
  g.closePath();
}

function drawCross(g: Graphics, cx: number, cy: number, r: number): void {
  const w = r * 0.35;
  g.moveTo(cx - w, cy - r);
  g.lineTo(cx + w, cy - r);
  g.lineTo(cx + w, cy - w);
  g.lineTo(cx + r, cy - w);
  g.lineTo(cx + r, cy + w);
  g.lineTo(cx + w, cy + w);
  g.lineTo(cx + w, cy + r);
  g.lineTo(cx - w, cy + r);
  g.lineTo(cx - w, cy + w);
  g.lineTo(cx - r, cy + w);
  g.lineTo(cx - r, cy - w);
  g.lineTo(cx - w, cy - w);
  g.closePath();
}

function drawCrescent(g: Graphics, cx: number, cy: number, r: number): void {
  // Outer arc (full circle)
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.fill({ color: 0x000000 }); // placeholder — overridden by caller
  // Inner cutout (shifted circle to create crescent shape)
  // We draw crescent as a custom shape instead:
  const steps = 20;
  const outerR = r;
  const innerR = r * 0.7;
  const offset = r * 0.4;
  // outer arc (full circle CW)
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = cx + Math.cos(a) * outerR;
    const y = cy + Math.sin(a) * outerR;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  // inner arc (offset circle CCW) — create crescent by "cutting"
  for (let i = steps; i >= 0; i--) {
    const a = (i / steps) * Math.PI * 2;
    const x = cx + offset + Math.cos(a) * innerR;
    const y = cy + Math.sin(a) * innerR;
    g.lineTo(x, y);
  }
  g.closePath();
}
