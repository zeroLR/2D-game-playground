import { Graphics } from 'pixi.js';
import type { BiomeId } from '../world/Biome';
import { platformSilhouetteForBiome } from '../world/BiomePlatformStyle';
import { Palette } from './visuals';

export function createBiomePlatformVisual(width: number, biome: BiomeId): Graphics {
  const g = new Graphics();
  const silhouette = platformSilhouetteForBiome(biome);

  if (silhouette === 'industrial-deck') {
    g.rect(-width / 2 - 5, -8, width + 10, 12).fill({ color: 0x263332, alpha: 0.98 });
    g.rect(-width / 2, -8, width, 3).fill(Palette.gold);
    g.rect(-width / 2 + 7, -2, Math.max(10, width - 14), 2).fill({ color: Palette.cream, alpha: 0.24 });
    for (let x = -width / 2 + 12; x < width / 2 - 5; x += 22) g.rect(x, 1, 9, 3).fill({ color: Palette.gold, alpha: 0.28 });
    g.rect(-width / 2 - 8, -4, 5, 8).fill({ color: 0x182424, alpha: 0.95 });
    g.rect(width / 2 + 3, -4, 5, 8).fill({ color: 0x182424, alpha: 0.95 });
    return g;
  }

  if (silhouette === 'night-slab') {
    const half = width / 2;
    if (width < 60) {
      g.poly([-half - 3, -5, -half + 6, -9, half + 4, -6, half - 2, 5, -half + 2, 4]).fill({ color: 0x20263d, alpha: 0.98 });
      g.moveTo(-half + 3, -7).lineTo(half - 4, -6).stroke({ width: 2, color: 0xb49cff, alpha: 0.8 });
      g.poly([half + 1, 0, half + 7, -3, half + 5, 4]).fill({ color: 0x7969bc, alpha: 0.34 });
      g.rect(-half + 5, 6, Math.max(10, width - 10), 1).fill({ color: 0xcbbcff, alpha: 0.16 });
      return g;
    }
    const gap = Math.max(10, width * 0.1);
    g.poly([-half - 6, -6, -gap / 2 - 3, -9, -gap / 2, 3, -half + 5, 5]).fill({ color: 0x20263d, alpha: 0.97 });
    g.poly([gap / 2, -8, half + 7, -5, half - 4, 5, gap / 2 + 3, 3]).fill({ color: 0x20263d, alpha: 0.97 });
    g.rect(-half + 4, -7, Math.max(14, half - gap), 2).fill({ color: 0xb49cff, alpha: 0.78 });
    g.rect(gap / 2 + 4, -7, Math.max(14, half - gap - 5), 2).fill({ color: 0xb49cff, alpha: 0.78 });
    g.poly([-half - 15, -1, -half - 8, -6, -half - 3, 2]).fill({ color: 0x7969bc, alpha: 0.42 });
    g.poly([half + 5, 1, half + 13, -4, half + 10, 5]).fill({ color: 0x7969bc, alpha: 0.38 });
    g.rect(-half + 15, 7, Math.max(20, width - 30), 1).fill({ color: 0xcbbcff, alpha: 0.16 });
    return g;
  }

  if (silhouette === 'pale-slab') {
    const half = width / 2;
    g.poly([-half - 5, -5, -half + 4, -9, -half + width * 0.34, -7, -half + width * 0.54, -10, half + 6, -5, half - 4, 5, half * 0.32, 8, -half * 0.18, 6, -half + 3, 4]).fill({ color: 0x294858, alpha: 0.98 });
    g.moveTo(-half + 2, -7).lineTo(-half + width * 0.36, -6).lineTo(-half + width * 0.55, -8).lineTo(half - 2, -5).stroke({ width: 2, color: 0xd9f7ff, alpha: 0.86 });
    g.poly([-half + width * 0.28, -5, -half + width * 0.4, 2, -half + width * 0.51, -6]).stroke({ width: 1, color: 0xaedbe8, alpha: 0.42 });
    g.rect(-half + 8, 8, Math.max(16, width - 16), 1).fill({ color: 0xd8f7ff, alpha: 0.14 });
    return g;
  }

  if (silhouette === 'crown-slab') {
    const half = width / 2;
    g.poly([-half - 5, -5, -half + 5, -10, -half + width * 0.28, -7, -half + width * 0.5, -12, half - width * 0.18, -7, half + 6, -4, half - 3, 6, -half + 3, 5]).fill({ color: 0x302640, alpha: 0.98 });
    g.moveTo(-half + 3, -8).lineTo(-half + width * 0.28, -6).lineTo(-half + width * 0.5, -10).lineTo(half - 3, -5).stroke({ width: 2, color: 0xffdf82, alpha: 0.9 });
    g.moveTo(-half + width * 0.48, -8).lineTo(-half + width * 0.56, 2).lineTo(-half + width * 0.66, -6).stroke({ width: 1, color: 0xd2b4ff, alpha: 0.55 });
    g.rect(-half + 8, 7, Math.max(16, width - 16), 1).fill({ color: 0xffe7a0, alpha: 0.2 });
    return g;
  }

  g.poly([-width / 2 - 7, -7, -width / 2 + 8, -9, width / 2 + 7, -7, width / 2 - 5, 4, -width / 2 + 3, 4]).fill({ color: 0x173437, alpha: 0.98 });
  g.rect(-width / 2, -7, Math.max(18, width * 0.43), 3).fill(Palette.teal);
  g.rect(-width / 2 + width * 0.49, -7, Math.max(16, width * 0.45), 3).fill(Palette.teal);
  g.rect(-width / 2 + 8, -3, Math.max(12, width - 18), 2).fill({ color: Palette.tealSoft, alpha: 0.22 });
  return g;
}
