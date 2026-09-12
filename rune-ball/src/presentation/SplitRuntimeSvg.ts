import { BlurFilter, Container, Graphics, GraphicsContext } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import { SplitParticleEnvelope } from './SplitParticleEnvelope';
import {
  SPLIT_RUNTIME_SVG_BY_KEY,
  getSplitRuntimeGlyphSpec,
  getSplitRuntimeGlyphSpecByKey,
  type SplitEnergyMotionKind,
  type SplitRuntimeGlyphKey,
  type SplitRuntimeGlyphSpec,
} from './SplitRuntimeSvgSpec';

interface SplitMaterialGlyph {
  root: Container;
  body: Graphics;
  backGlow: Graphics | null;
  aura: Graphics | null;
  hot: Graphics | null;
  motionPrimary: Graphics | null;
  motionSecondary: Graphics | null;
  particles: SplitParticleEnvelope;
  spec: SplitRuntimeGlyphSpec;
}

function createMotionGraphic(kind: SplitEnergyMotionKind): Graphics | null {
  if (kind === 'none') return null;

  const graphic = new Graphics();
  graphic.blendMode = 'add';

  if (kind === 'prism-outward') {
    graphic
      .moveTo(-5, 2)
      .lineTo(-3, -2)
      .moveTo(5, 2)
      .lineTo(3, -2)
      .stroke({ color: 0xf0fbff, width: 1.35, alpha: 0.96 });
    graphic
      .moveTo(-4, 0)
      .lineTo(-2, 0)
      .moveTo(4, 0)
      .lineTo(2, 0)
      .stroke({ color: 0x6fe9ff, width: 1.1, alpha: 0.9 });
    graphic.position.set(32, 32);
    return graphic;
  }

  graphic
    .moveTo(-3.4, 2.4)
    .lineTo(0, -2.6)
    .lineTo(3.4, 2.4)
    .stroke({ color: 0xf0fbff, width: 1.35, alpha: 0.98 });
  graphic.circle(0, 0, 1.15).fill({ color: 0xd756ff, alpha: 0.88 });
  return graphic;
}

function motionPhase(timeSeconds: number, cycleSeconds: number, offset: number): number {
  const cycle = Math.max(0.05, cycleSeconds);
  const raw = (timeSeconds / cycle + offset) % 1;
  return raw < 0 ? raw + 1 : raw;
}

function easeOutCubic(value: number): number {
  const inv = 1 - value;
  return 1 - inv * inv * inv;
}

function motionEnvelope(phase: number): number {
  return Math.sin(Math.PI * phase) ** 1.15;
}

export class SplitRuntimeSvg extends Container {
  private readonly glyphs = new Map<SplitRuntimeGlyphKey, SplitMaterialGlyph>();
  private activeGlyphKey: SplitRuntimeGlyphKey | null = null;
  private lastPresentationTime: number | null = null;

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

      const motionPrimary = spec.motion.primaryAlpha > 0 ? createMotionGraphic(spec.motion.kind) : null;
      const motionSecondary = spec.motion.secondaryAlpha > 0 ? createMotionGraphic(spec.motion.kind) : null;
      const particles = new SplitParticleEnvelope(spec.particles, {
        x: spec.pivotX,
        y: spec.pivotY,
        forwardTipY: spec.motion.kind === 'lance-forward' ? spec.motion.travelEnd : spec.pivotY,
      });

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
      if (motionPrimary) root.addChild(motionPrimary);
      if (motionSecondary) root.addChild(motionSecondary);
      root.addChild(particles);
      if (hot) root.addChild(hot);

      this.glyphs.set(key, {
        root,
        body,
        backGlow,
        aura,
        hot,
        motionPrimary,
        motionSecondary,
        particles,
        spec,
      });
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
    const dt = this.presentationDelta(presentationTime);

    if (!splitActive) {
      this.deactivateParticles();
      return;
    }

    const speed = Math.hypot(ballVelocity.x, ballVelocity.y);
    if (!(speed > 0)) {
      this.deactivateParticles();
      return;
    }

    const spec = getSplitRuntimeGlyphSpec(path, stage);
    const glyph = this.glyphs.get(spec.key);
    if (!glyph) {
      this.deactivateParticles();
      return;
    }

    if (this.activeGlyphKey !== spec.key) {
      this.resetParticleEnvelopes();
      this.activeGlyphKey = spec.key;
    }

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

    this.presentMotionLayer(
      glyph.motionPrimary,
      spec,
      presentationTime,
      0,
      spec.motion.primaryAlpha,
      reducedMotion,
      overdrive,
    );
    this.presentMotionLayer(
      glyph.motionSecondary,
      spec,
      presentationTime,
      spec.motion.secondaryPhase,
      spec.motion.secondaryAlpha,
      reducedMotion,
      overdrive,
    );

    glyph.particles.update(dt, reducedMotion, overdrive);
  }

  private presentMotionLayer(
    graphic: Graphics | null,
    spec: SplitRuntimeGlyphSpec,
    presentationTime: number,
    phaseOffset: number,
    baseAlpha: number,
    reducedMotion: boolean,
    overdrive: boolean,
  ): void {
    if (!graphic) return;
    if (reducedMotion || spec.motion.kind === 'none') {
      graphic.visible = false;
      return;
    }

    const phase = motionPhase(presentationTime, spec.motion.cycleSeconds, phaseOffset);
    const travel = easeOutCubic(phase);
    const envelope = motionEnvelope(phase);
    const intensity = overdrive ? 1.18 : 1;

    graphic.visible = true;
    graphic.alpha = Math.min(1, baseAlpha * envelope * intensity);

    if (spec.motion.kind === 'prism-outward') {
      const distance = spec.motion.travelStart + (spec.motion.travelEnd - spec.motion.travelStart) * travel;
      graphic.position.set(32, 32);
      graphic.scale.set(Math.max(0.6, distance / 4), 0.92 + envelope * 0.16);
      return;
    }

    const y = spec.motion.travelStart + (spec.motion.travelEnd - spec.motion.travelStart) * travel;
    graphic.position.set(32, y);
    graphic.scale.set(0.9 + envelope * 0.24, 0.9 + phase * 0.16);
  }

  private presentationDelta(presentationTime: number): number {
    if (!Number.isFinite(presentationTime)) return 0;
    if (this.lastPresentationTime === null) {
      this.lastPresentationTime = presentationTime;
      return 0;
    }

    const delta = presentationTime - this.lastPresentationTime;
    this.lastPresentationTime = presentationTime;
    if (!(delta > 0) || delta > 0.2) return 0;
    return Math.min(0.05, delta);
  }

  private deactivateParticles(): void {
    if (this.activeGlyphKey === null) return;
    this.resetParticleEnvelopes();
    this.activeGlyphKey = null;
  }

  private resetParticleEnvelopes(): void {
    for (const glyph of this.glyphs.values()) glyph.particles.reset();
  }
}
