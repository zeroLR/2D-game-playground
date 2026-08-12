import { Container, Graphics } from 'pixi.js';

export const Palette = {
  background: 0x0d2428,
  backgroundDeep: 0x08181b,
  distant: 0x17363a,
  mid: 0x1d4144,
  foreground: 0x0a1719,
  teal: 0x78c9bf,
  tealSoft: 0xcce9e3,
  cream: 0xf0eadf,
  magenta: 0xb74468,
  magentaDeep: 0x692744,
  hazard: 0x26393b,
  gold: 0xf2d28b,
} as const;

export type EnvironmentLayers = {
  sky: Graphics;
  far: Container;
  mid: Container;
  foreground: Container;
  motes: Array<{ view: Graphics; baseY: number; drift: number }>;
};

export function createEnvironment(width: number, height: number): EnvironmentLayers {
  const sky = new Graphics();
  sky.rect(0, 0, width, height).fill(Palette.background);
  sky.rect(0, 0, width, height * 0.28).fill({ color: 0x18383b, alpha: 0.28 });
  sky.rect(0, height * 0.45, width, height * 0.55).fill({ color: Palette.backgroundDeep, alpha: 0.22 });

  const far = new Container();
  const mid = new Container();
  const foreground = new Container();

  for (let i = 0; i < 10; i += 1) {
    const tower = new Graphics();
    const w = 24 + (i % 3) * 12;
    const h = 120 + (i % 4) * 55;
    tower.rect(-w / 2, -h, w, h).fill({ color: Palette.distant, alpha: 0.42 });
    tower.poly([-w / 2, -h, 0, -h - 28 - (i % 2) * 18, w / 2, -h]).fill({ color: Palette.distant, alpha: 0.42 });
    if (i % 2 === 0) {
      tower.rect(-3, -h + 34, 6, 22).fill({ color: Palette.teal, alpha: 0.12 });
    }
    tower.position.set(18 + i * 42, height - 80 + (i % 2) * 18);
    far.addChild(tower);
  }

  for (let i = 0; i < 7; i += 1) {
    const ruin = new Graphics();
    const w = 40 + (i % 3) * 18;
    const h = 150 + (i % 4) * 70;
    ruin.rect(-w / 2, -h, w, h).fill({ color: Palette.mid, alpha: 0.56 });
    ruin.poly([-w / 2, -h, -w * 0.15, -h - 25, w * 0.12, -h - 10, w / 2, -h]).fill({ color: Palette.mid, alpha: 0.56 });
    ruin.rect(-w * 0.3, -h + 42, w * 0.6, 6).fill({ color: Palette.teal, alpha: 0.09 });
    ruin.position.set(30 + i * 58, height - 12 + (i % 2) * 22);
    mid.addChild(ruin);
  }

  const leftFrame = new Graphics();
  leftFrame.poly([0, 0, 26, 0, 26, 110, 48, 138, 48, 248, 31, 274, 31, height, 0, height]).fill({ color: Palette.foreground, alpha: 0.92 });
  const rightFrame = new Graphics();
  rightFrame.poly([width, 0, width - 28, 0, width - 28, 150, width - 52, 180, width - 52, 310, width - 30, 336, width - 30, height, width, height]).fill({ color: Palette.foreground, alpha: 0.92 });
  foreground.addChild(leftFrame, rightFrame);

  const motes: Array<{ view: Graphics; baseY: number; drift: number }> = [];
  for (let i = 0; i < 16; i += 1) {
    const mote = new Graphics();
    const size = 1 + (i % 3) * 0.7;
    mote.circle(0, 0, size).fill({ color: i % 5 === 0 ? Palette.gold : Palette.tealSoft, alpha: 0.18 + (i % 4) * 0.05 });
    const baseY = 70 + ((i * 83) % (height - 140));
    mote.position.set(40 + ((i * 71) % (width - 80)), baseY);
    foreground.addChild(mote);
    motes.push({ view: mote, baseY, drift: 4 + (i % 5) * 1.4 });
  }

  return { sky, far, mid, foreground, motes };
}

export function updateEnvironment(layers: EnvironmentLayers, worldOffset: number, elapsed: number, height: number) {
  layers.far.y = (worldOffset * 0.08) % 80;
  layers.mid.y = (worldOffset * 0.18) % 110;
  layers.motes.forEach((mote, index) => {
    mote.view.y = mote.baseY + Math.sin(elapsed * 0.7 + index) * mote.drift;
    mote.view.x += Math.sin(elapsed * 0.25 + index * 0.9) * 0.015;
    if (mote.view.y > height - 20) mote.view.y = 20;
  });
}

export function createPlatformVisual(width: number): Graphics {
  const g = new Graphics();
  g.poly([-width / 2 - 7, -7, width / 2 + 7, -7, width / 2, 4, -width / 2 + 3, 4]).fill({ color: 0x173437, alpha: 0.98 });
  g.rect(-width / 2, -7, width, 3).fill(Palette.teal);
  g.rect(-width / 2 + 8, -3, Math.max(12, width - 18), 2).fill({ color: Palette.tealSoft, alpha: 0.35 });
  const supportW = Math.max(14, width * 0.28);
  g.poly([-supportW / 2, 4, supportW / 2, 4, supportW * 0.3, 20, -supportW * 0.25, 20]).fill({ color: Palette.foreground, alpha: 0.72 });
  return g;
}

export function createHazardVisual(): Graphics {
  const g = new Graphics();
  g.circle(0, 0, 14).fill(Palette.hazard);
  g.circle(0, 0, 18).stroke({ width: 2, color: Palette.magentaDeep, alpha: 0.65 });
  for (let i = 0; i < 8; i += 1) {
    const a = (Math.PI * 2 * i) / 8;
    const inner = 17;
    const outer = i % 2 === 0 ? 28 : 24;
    const x1 = Math.cos(a) * inner;
    const y1 = Math.sin(a) * inner;
    const x2 = Math.cos(a) * outer;
    const y2 = Math.sin(a) * outer;
    g.moveTo(x1, y1).lineTo(x2, y2).stroke({ width: 5, color: Palette.magentaDeep });
  }
  g.circle(0, 0, 5).fill(0xf16c78);
  g.circle(-2, -2, 1.5).fill({ color: Palette.cream, alpha: 0.55 });
  return g;
}

export function createCrystalVisual(): Graphics {
  const g = new Graphics();
  g.poly([0, -18, 13, 0, 0, 18, -13, 0]).fill(Palette.teal);
  g.poly([0, -12, 7, 0, 0, 12, -7, 0]).fill(Palette.tealSoft);
  g.poly([0, -18, 13, 0, 5, -2, 0, -11]).fill({ color: 0xffffff, alpha: 0.22 });
  g.circle(0, 0, 24).stroke({ width: 1, color: Palette.tealSoft, alpha: 0.12 });
  return g;
}

export function redrawPlayer(view: Graphics, x: number, y: number, elapsed: number, dashing: number) {
  view.clear();
  const sway = Math.sin(elapsed * 8) * 2;
  const lean = dashing === 0 ? 0 : dashing * 6;

  if (dashing !== 0) {
    view.poly([-26 * dashing, 2, -10 * dashing, -7, -8 * dashing, 5]).fill({ color: Palette.teal, alpha: 0.18 });
  }

  view.poly([-13 + lean, 10, -4 + lean, -19, 10 + lean, -16, 17 + lean, 8, 4 + lean, 15]).fill(Palette.cream);
  view.poly([-4 + lean, -19, 10 + lean, -16, 4 + lean, -7]).fill(0x172b2d);
  view.circle(1 + lean, -8, 2.2).fill(Palette.backgroundDeep);
  view.roundRect(-8 + lean, 8, 18, 18, 6).fill(0x243d3f);
  view.poly([-7 + lean, 13, -20 - sway + lean, 20, -10 + lean, 8]).fill({ color: Palette.teal, alpha: 0.85 });
  view.poly([9 + lean, 14, 18 + sway + lean, 22, 5 + lean, 10]).fill({ color: 0x244447, alpha: 0.9 });
  view.position.set(x, y);
}

export function redrawAbyss(view: Graphics, width: number, height: number, elapsed: number) {
  view.clear();
  const baseY = height - 70;
  const waveA = Math.sin(elapsed * 2.7) * 7;
  const waveB = Math.sin(elapsed * 4.1 + 1.2) * 5;

  view.poly([
    0, baseY + waveA,
    width * 0.16, baseY - 10 + waveB,
    width * 0.34, baseY + 3 - waveA,
    width * 0.52, baseY - 13 + waveB,
    width * 0.7, baseY + 1 + waveA,
    width * 0.86, baseY - 8 - waveB,
    width, baseY + waveA,
    width, height,
    0, height,
  ]).fill({ color: Palette.magentaDeep, alpha: 0.82 });

  view.poly([
    0, baseY + 18,
    width * 0.2, baseY + 3 + waveB,
    width * 0.45, baseY + 12 - waveA,
    width * 0.72, baseY - 3 + waveA,
    width, baseY + 12,
    width, height,
    0, height,
  ]).fill({ color: Palette.magenta, alpha: 0.24 });

  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 59 + elapsed * 12) % (width + 40)) - 20;
    const y = baseY - 12 - ((i * 23 + elapsed * 17) % 70);
    const size = 3 + (i % 3) * 2;
    view.poly([x, y - size, x + size, y, x, y + size, x - size, y]).fill({ color: Palette.magenta, alpha: 0.18 });
  }
}
