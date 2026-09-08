import { Container, Graphics } from 'pixi.js';
import type { Rotation } from '../domain/model';
import { gateOpeningProgress, relicAnimationFrame, type GateVisualState } from './world-object-state';

const COLORS = {
  ink: 0x121917,
  shadow: 0x0b0f0e,
  parchment: 0xd8c7a3,
  parchmentDark: 0x9d9278,
  antiqueGold: 0xa8874c,
  antiqueGoldBright: 0xc8ab6a,
  stone: 0x777365,
  stoneDark: 0x4d514c,
  seal: 0x8b544a,
};

export function createRelicWorldObject(pageSize: number, frameTick: number): Container {
  const root = new Container();
  root.zIndex = 24;

  const frame = relicAnimationFrame(frameTick);
  const scale = pageSize / 96;
  const bob = [0, -1, -2, -1][frame] ?? 0;
  const x = 69 * scale;
  const y = (39 + bob) * scale;

  const shadow = new Graphics()
    .ellipse(x, 55 * scale, 11 * scale, 3 * scale)
    .fill({ color: COLORS.shadow, alpha: 0.48 });
  root.addChild(shadow);

  const shard = new Graphics();
  shard
    .rect(x - 9 * scale, y - 11 * scale, 16 * scale, 22 * scale)
    .fill(COLORS.parchmentDark)
    .rect(x - 7 * scale, y - 10 * scale, 14 * scale, 19 * scale)
    .fill(COLORS.parchment)
    .rect(x - 7 * scale, y - 10 * scale, 3 * scale, 19 * scale)
    .fill(COLORS.antiqueGold)
    .rect(x - 2 * scale, y - 5 * scale, 6 * scale, 2 * scale)
    .fill(COLORS.antiqueGold)
    .rect(x - 2 * scale, y, 8 * scale, 2 * scale)
    .fill(COLORS.antiqueGold)
    .rect(x - 2 * scale, y + 5 * scale, 5 * scale, 2 * scale)
    .fill(COLORS.antiqueGold);
  root.addChild(shard);

  const glint = new Graphics();
  if (frame === 1 || frame === 2) {
    glint
      .rect(x + 9 * scale, y - 8 * scale, 2 * scale, 2 * scale)
      .fill({ color: COLORS.antiqueGoldBright, alpha: 0.95 })
      .rect(x + 11 * scale, y - 6 * scale, 2 * scale, 2 * scale)
      .fill({ color: COLORS.antiqueGoldBright, alpha: 0.65 });
  }
  root.addChild(glint);

  return root;
}

export function createGateWorldObject(
  pageSize: number,
  state: GateVisualState,
  frameTick: number,
  rotation: Rotation,
): Container {
  const root = new Container();
  root.zIndex = 23;
  root.pivot.set(pageSize / 2, pageSize / 2);
  root.position.set(pageSize / 2, pageSize / 2);
  root.rotation = (rotation * Math.PI) / 180;

  const scale = pageSize / 96;
  const pulse = [0.52, 0.7, 0.58, 0.78][Math.abs(frameTick) % 4] ?? 0.6;
  const openingFrame = state === 'opening' ? Math.abs(frameTick) % 5 : null;
  const opening = state === 'open' ? 1 : state === 'opening' ? gateOpeningProgress(openingFrame, 5) : 0;

  const x = 48 * scale;
  const top = 23 * scale;
  const doorW = 25 * scale;
  const doorH = 35 * scale;
  const halfGap = 2 * scale + opening * 8 * scale;

  const structure = new Graphics();
  structure
    .rect(x - 19 * scale, top - 7 * scale, 38 * scale, 7 * scale)
    .fill(COLORS.stoneDark)
    .rect(x - 17 * scale, top - 5 * scale, 34 * scale, 5 * scale)
    .fill(COLORS.stone)
    .rect(x - 18 * scale, top, 5 * scale, doorH + 7 * scale)
    .fill(COLORS.stoneDark)
    .rect(x + 13 * scale, top, 5 * scale, doorH + 7 * scale)
    .fill(COLORS.stoneDark);
  root.addChild(structure);

  const interior = new Graphics()
    .rect(x - doorW / 2, top, doorW, doorH)
    .fill({ color: COLORS.ink, alpha: 0.96 });
  if (state !== 'sealed') {
    interior
      .rect(x - 8 * scale, top + 3 * scale, 16 * scale, doorH - 5 * scale)
      .fill({ color: COLORS.antiqueGold, alpha: 0.12 + opening * 0.22 })
      .rect(x - 4 * scale, top + 5 * scale, 8 * scale, doorH - 8 * scale)
      .fill({ color: COLORS.antiqueGoldBright, alpha: 0.08 + opening * 0.18 });
  }
  root.addChild(interior);

  const doors = new Graphics();
  const leafW = doorW / 2 - halfGap / 2;
  if (leafW > 1) {
    doors
      .rect(x - doorW / 2 - opening * 5 * scale, top, leafW, doorH)
      .fill(COLORS.stoneDark)
      .rect(x + halfGap / 2 + opening * 5 * scale, top, leafW, doorH)
      .fill(COLORS.stoneDark);
  }
  root.addChild(doors);

  if (state === 'sealed') {
    const seal = new Graphics()
      .rect(x - 2 * scale, top + 8 * scale, 4 * scale, 19 * scale)
      .fill({ color: COLORS.seal, alpha: pulse })
      .rect(x - 10 * scale, top + 15 * scale, 20 * scale, 4 * scale)
      .fill({ color: COLORS.seal, alpha: pulse });
    root.addChild(seal);
  }

  return root;
}
