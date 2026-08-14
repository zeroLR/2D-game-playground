import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { SKILLS, type SkillArchetype, type SkillId } from '../domain/skills';
import type { UpgradeKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

const accentFor = (archetype: SkillArchetype) => archetype === 'dash' ? Palette.gold : archetype === 'jump' ? 0x9abce8 : archetype === 'kill' ? 0xd98aac : Palette.tealSoft;

export function createUpgradeVisual(kind: UpgradeKind, skillId?: SkillId): Container {
  const root = new Container();
  const glyph = new Graphics();
  const skill = skillId ? SKILLS[skillId] : null;
  const archetype: SkillArchetype = skill?.archetype ?? (kind === 'flow' ? 'flow' : 'dash');
  const accent = accentFor(archetype);
  glyph.circle(0, 0, 26).fill({ color: accent, alpha: 0.055 });
  glyph.circle(0, 0, 21).stroke({ width: 1, color: accent, alpha: 0.34 });
  if (archetype === 'dash') {
    glyph.poly([-12, -8, 0, 0, -12, 8, -5, 8, 7, 0, -5, -8]).fill({ color: accent, alpha: 0.92 });
    glyph.poly([2, -8, 14, 0, 2, 8, 9, 8, 21, 0, 9, -8]).fill({ color: accent, alpha: 0.55 });
  } else if (archetype === 'jump') {
    glyph.poly([-13, 8, 0, -13, 13, 8, 5, 5, 0, -3, -5, 5]).fill({ color: accent, alpha: 0.9 });
  } else if (archetype === 'kill') {
    glyph.moveTo(-13, 0).lineTo(13, 0).stroke({ width: 4, color: accent, alpha: 0.85 });
    glyph.moveTo(0, -13).lineTo(0, 13).stroke({ width: 4, color: accent, alpha: 0.85 });
    glyph.circle(0, 0, 5).fill({ color: Palette.backgroundDeep, alpha: 0.9 });
  } else {
    glyph.poly([0, -15, 10, 0, 0, 15, -10, 0]).fill({ color: accent, alpha: 0.9 });
    glyph.rect(-2, -10, 4, 20).fill({ color: Palette.backgroundDeep, alpha: 0.55 });
  }
  const label = new Text({ text: skill?.name ?? (kind === 'dash' ? 'IMPULSE' : 'CONTINUITY'), style: new TextStyle({ fill: '#f0eadf', fontSize: 7.5, fontWeight: '600', letterSpacing: 1.1 }) });
  label.anchor.set(0.5, 0); label.position.set(0, 31);
  const detail = new Text({ text: skill?.detail ?? (kind === 'dash' ? 'DASH +10%' : 'FLOW GRACE +0.45s'), style: new TextStyle({ fill: '#91aaa7', fontSize: 6.2, letterSpacing: 0.35 }) });
  detail.anchor.set(0.5, 0); detail.position.set(0, 43);
  root.addChild(glyph, label, detail);
  return root;
}
