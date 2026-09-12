import { BlurFilter, Container, Graphics, GraphicsContext } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import {
  SPLIT_RUNTIME_SVG_BY_KEY,
  getSplitRuntimeGlyphSpec,
  getSplitRuntimeGlyphSpecByKey,
  type SplitRuntimeGlyphKey,
  type SplitRuntimeGlyphSpec,
} from './SplitRuntimeSvgSpec';

interface SplitMaterialGlyph {
  root: Container;
  body: Graphics;
  backGlow: Graphics | null;
  aura: Graphics | null;
  hot: Graphics | null;
  spec: SplitRuntimeGlyphSpec;
}

export class SplitRuntimeSvg extends Container {
  private readonly glyphs = new Map<SplitRuntimeGlyphKey, SplitMaterialGlyph>();

  constructor() {
    super();
    for (const [key, svg] of Object.entries(SPLIT_RUNTIME_SVG_BY_KEY) as [SplitRuntimeGlyphKey, string][]) {
      const spec = getSplitRuntimeGlyphSpecByKey(key);
      const context = new GraphicsContext().svg(svg);
      const root = new Container();
      root.visible = false;

      let backGlow: Graphics | null = null;
      let aura: Graphics | null = null;
      let hot: Graphics | null = null;

      if (spec.material.glowEnabled) {
        backGlow = new Graphics(context);
        backGlow.alpha = spec.material.backGlowAlpha;
        backGlow.blendMode = 'add';
        backGlow.filters = [new BlurFilter({ strength: spec.material.backGlowBlur, quality: 2, kernelSize: 5 })];

        aura = new Graphics(context);
        aura.alpha = spec.material.auraAlpha;
        aura.blendMode = 'add';
        aura.filters = [new BlurFilter({ strength: spec.material.auraBlur, quality: 2, kernelSize: 5 })];
      }

      const body = new Graphics(context);
      body.alpha = spec.material.bodyAlpha;

      if (spec.material.glowEnabled) {
        hot = new Graphics(context);
        hot.alpha = spec.material.hotAlpha;
        hot.blendMode = 'add';
        hot.pivot.set(spec.pivotX, spec.pivotY);
        hot.position.set(spec.pivotX, spec.pivotY);
        hot.scale.set(spec.material.hotScale);
      }

      if (backGlow) root.addChild(backGlow);
      if (aura) root.addChild(aura);
      root.addChild(body);
      if (hot) root.addChild(hot);

      this.glyphs.set(key, { root, body, backGlow, aura, hot, spec });
      this.addChild(root);
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
    for (const glyph of this.glyphs.values()) glyph.root.visible = false;
    if (!splitActive) return;

    const speed = Math.hypot(ballVelocity.x, ballVelocity.y);
    if (!(speed > 0)) return;

    const spec = getSplitRuntimeGlyphSpec(path, stage);
    const glyph = this.glyphs.get(spec.key);
    if (!glyph) return;

    glyph.root.visible = true;
    glyph.root.pivot.set(spec.pivotX, spec.pivotY);
    glyph.root.position.set(ballPosition.x, ballPosition.y);
    glyph.root.rotation = Math.atan2(ballVelocity.y, ballVelocity.x) + Math.PI / 2;

    const pulse = reducedMotion ? 1 : 1 + Math.sin(presentationTime * 7.5) * (stage === 2 ? 0.018 : 0.012);
    glyph.root.scale.set(spec.scale * pulse);

    const intensity = overdrive ? 1.24 : 1;
    glyph.body.alpha = overdrive ? 1 : spec.material.bodyAlpha;
    if (glyph.backGlow) glyph.backGlow.alpha = Math.min(1, spec.material.backGlowAlpha * intensity);
    if (glyph.aura) glyph.aura.alpha = Math.min(1, spec.material.auraAlpha * intensity);
    if (glyph.hot) glyph.hot.alpha = Math.min(1, spec.material.hotAlpha * (overdrive ? 1.35 : 1));
  }
}
