import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { UpgradeKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

export function createUpgradeVisual(kind: UpgradeKind): Container {
  const root = new Container();
  const glyph = new Graphics();
  const isDash = kind === 'dash';
  const accent = isDash ? Palette.gold : Palette.tealSoft;

  glyph.circle(0, 0, 26).fill({ color: accent, alpha: 0.055 });
  glyph.circle(0, 0, 21).stroke({ width: 1, color: accent, alpha: 0.34 });

  if (isDash) {
    glyph.poly([-12, -8, 0, 0, -12, 8, -5, 8, 7, 0, -5, -8]).fill({ color: accent, alpha: 0.92 });
    glyph.poly([2, -8, 14, 0, 2, 8, 9, 8, 21, 0, 9, -8]).fill({ color: accent, alpha: 0.55 });
  } else {
    glyph.poly([0, -15, 10, 0, 0, 15, -10, 0]).fill({ color: accent, alpha: 0.9 });
    glyph.rect(-2, -10, 4, 20).fill({ color: Palette.backgroundDeep, alpha: 0.55 });
  }

  const label = new Text({
    text: isDash ? 'IMPULSE' : 'CONTINUITY',
    style: new TextStyle({ fill: isDash ? '#f2d28b' : '#cce9e3', fontSize: 8, fontWeight: '600', letterSpacing: 1.4 }),
  });
  label.anchor.set(0.5, 0);
  label.position.set(0, 31);

  const detail = new Text({
    text: isDash ? 'DASH +10%' : 'FLOW GRACE +0.45s',
    style: new TextStyle({ fill: '#91aaa7', fontSize: 6.5, letterSpacing: 0.45 }),
  });
  detail.anchor.set(0.5, 0);
  detail.position.set(0, 43);

  root.addChild(glyph, label, detail);
  return root;
}
