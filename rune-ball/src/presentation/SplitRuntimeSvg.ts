import { Container, Graphics, GraphicsContext } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import {
  SPLIT_RUNTIME_SVG_BY_KEY,
  getSplitRuntimeGlyphSpec,
  type SplitRuntimeGlyphKey,
} from './SplitRuntimeSvgSpec';

export class SplitRuntimeSvg extends Container {
  private readonly glyphs = new Map<SplitRuntimeGlyphKey, Graphics>();

  constructor() {
    super();
    for (const [key, svg] of Object.entries(SPLIT_RUNTIME_SVG_BY_KEY) as [SplitRuntimeGlyphKey, string][]) {
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
