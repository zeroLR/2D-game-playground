import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { RouteKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

const META: Record<RouteKind, { label: string; detail: string; accent: number }> = {
  treasure: { label: 'TREASURE', detail: 'REWARD ROUTE', accent: Palette.gold },
  elite: { label: 'ELITE', detail: 'HIGH PRESSURE', accent: Palette.magenta },
  rest: { label: 'REST', detail: 'RECOVERY ROUTE', accent: Palette.tealSoft },
  skill: { label: 'SKILL', detail: 'BUILD CHOICE', accent: 0x9abce8 },
};

export function createRouteVisual(kind: RouteKind): Container {
  const root = new Container();
  const meta = META[kind];
  const glyph = new Graphics();
  glyph.roundRect(-30, -22, 60, 44, 10).fill({ color: meta.accent, alpha: 0.055 });
  glyph.roundRect(-30, -22, 60, 44, 10).stroke({ width: 1.2, color: meta.accent, alpha: 0.42 });

  if (kind === 'treasure') glyph.poly([-10, -5, 0, -13, 10, -5, 7, 9, -7, 9]).fill({ color: meta.accent, alpha: 0.9 });
  else if (kind === 'elite') { glyph.moveTo(-12, 10).lineTo(0, -12).lineTo(12, 10).stroke({ width: 3, color: meta.accent, alpha: 0.9 }); glyph.circle(0, 3, 3).fill(meta.accent); }
  else if (kind === 'rest') { glyph.moveTo(-12, 4).lineTo(12, 4).stroke({ width: 3, color: meta.accent, alpha: 0.9 }); glyph.moveTo(-8, -5).lineTo(8, -5).stroke({ width: 2, color: meta.accent, alpha: 0.7 }); }
  else { glyph.poly([0, -13, 9, 0, 0, 13, -9, 0]).fill({ color: meta.accent, alpha: 0.9 }); }

  const label = new Text({ text: meta.label, style: new TextStyle({ fill: '#f0eadf', fontSize: 7.5, fontWeight: '600', letterSpacing: 1.1 }) });
  label.anchor.set(0.5, 0); label.position.set(0, 27);
  const detail = new Text({ text: meta.detail, style: new TextStyle({ fill: '#91aaa7', fontSize: 6, letterSpacing: 0.35 }) });
  detail.anchor.set(0.5, 0); detail.position.set(0, 39);
  root.addChild(glyph, label, detail);
  return root;
}
