import { Container, Graphics, GraphicsContext } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import splitBaseSvg from '../assets/runes/split-base.svg?raw';
import prismT1Svg from '../assets/runes/prism-t1.svg?raw';
import prismT2Svg from '../assets/runes/prism-t2.svg?raw';
import lanceT1Svg from '../assets/runes/lance-t1.svg?raw';
import lanceT2Svg from '../assets/runes/lance-t2.svg?raw';

export type SplitRuntimeGlyphKey = 'split-base' | 'prism-t1' | 'prism-t2' | 'lance-t1' | 'lance-t2';

export interface SplitRuntimeGlyphSpec {
  key: SplitRuntimeGlyphKey;
  pivotX: number;
  pivotY: number;
  scale: number;
}

const SPECS: Record<SplitRuntimeGlyphKey, SplitRuntimeGlyphSpec> = {
  'split-base': { key: 'split-base', pivotX: 32, pivotY: 32, scale: 1.68 },
  'prism-t1': { key: 'prism-t1', pivotX: 32, pivotY: 32, scale: 2.90 },
  'prism-t2': { key: 'prism-t2', pivotX: 32, pivotY: 32, scale: 3.47 },
  'lance-t1': { key: 'lance-t1', pivotX: 32, pivotY: 45, scale: 2.55 },
  'lance-t2': { key: 'lance-t2', pivotX: 32, pivotY: 46, scale: 3.40 },
};

const SVG_BY_KEY: Record<SplitRuntimeGlyphKey, string> = {
  'split-base': splitBaseSvg,
  'prism-t1': prismT1Svg,
  'prism-t2': prismT2Svg,
  'lance-t1': lanceT1Svg,
  'lance-t2': lanceT2Svg,
};

export function getSplitRuntimeGlyphSpec(
  path: SplitEvolutionPath,
  stage: SplitEvolutionStage,
): SplitRuntimeGlyphSpec {
  if (stage === 0) return SPECS['split-base'];
  if (path === 'prism') return stage === 1 ? SPECS['prism-t1'] : SPECS['prism-t2'];
  return stage === 1 ? SPECS['lance-t1'] : SPECS['lance-t2'];
}

export function getSplitRuntimeSvgSource(key: SplitRuntimeGlyphKey): string {
  return SVG_BY_KEY[key];
}

export class SplitRuntimeSvg extends Container {
  private readonly glyphs = new Map<SplitRuntimeGlyphKey, Graphics>();

  constructor() {
    super();
    for (const [key, svg] of Object.entries(SVG_BY_KEY) as [SplitRuntimeGlyphKey, string][]) {
      const context = new GraphicsContext().svg(svg);
      const glyph = new Graphics(context);
      glyph.visible = false;
      this.glyphs.set(key, glyph);
      this.addChild(glyph);
    }
  }

  present(
    ballPosition: Point2D,
    ballVelocity: Point2D,
    splitActive: boolean,
    path: SplitEvolutionPath,
    stage: SplitEvolutionStage,
    presentationTime: number,
    reducedMotion: boolean,
    overdrive: boolean,
  ): void {
    for (const glyph of this.glyphs.values()) glyph.visible = false;
    if (!splitActive) return;

    const speed = Math.hypot(ballVelocity.x, ballVelocity.y);
    if (!(speed > 0)) return;

    const spec = getSplitRuntimeGlyphSpec(path, stage);
    const glyph = this.glyphs.get(spec.key);
    if (!glyph) return;

    glyph.visible = true;
    glyph.pivot.set(spec.pivotX, spec.pivotY);
    glyph.position.set(ballPosition.x, ballPosition.y);
    glyph.rotation = Math.atan2(ballVelocity.y, ballVelocity.x) + Math.PI / 2;

    const pulse = reducedMotion ? 1 : 1 + Math.sin(presentationTime * 7.5) * (stage === 2 ? 0.018 : 0.012);
    glyph.scale.set(spec.scale * pulse);
    glyph.alpha = overdrive ? 1 : stage === 0 ? 0.86 : 0.96;
  }
}
