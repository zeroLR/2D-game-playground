import { Container, Graphics } from 'pixi.js';
import type { SplitParticleEnvelopeProfile } from './SplitRuntimeSvgSpec';

interface EnvelopeParticle {
  graphic: Graphics;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  spin: number;
  baseAlpha: number;
  baseScale: number;
  active: boolean;
}

interface ParticleAnchor {
  x: number;
  y: number;
  forwardTipY: number;
}

function unit(serial: number, salt: number): number {
  return ((serial * 37 + salt * 53 + 17) % 101) / 100;
}

export class SplitParticleEnvelope extends Container {
  private readonly particles: EnvelopeParticle[] = [];
  private particleCursor = 0;
  private emissionSerial = 0;
  private emissionAccumulator: number;

  constructor(
    private readonly profile: SplitParticleEnvelopeProfile,
    private readonly anchor: ParticleAnchor,
  ) {
    super();
    this.emissionAccumulator = profile.emitInterval;

    for (let index = 0; index < profile.maxActive; index += 1) {
      const graphic = this.createParticleGraphic(index);
      graphic.visible = false;
      graphic.blendMode = 'add';
      this.addChild(graphic);
      this.particles.push({
        graphic,
        velocityX: 0,
        velocityY: 0,
        life: 0,
        maxLife: 0,
        spin: 0,
        baseAlpha: 0,
        baseScale: 1,
        active: false,
      });
    }
  }

  reset(): void {
    this.emissionAccumulator = this.profile.emitInterval;
    for (const particle of this.particles) {
      particle.active = false;
      particle.graphic.visible = false;
    }
  }

  update(dtSeconds: number, reducedMotion: boolean, overdrive: boolean): void {
    if (this.profile.kind === 'none' || reducedMotion || this.particles.length === 0) {
      this.reset();
      return;
    }

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, Math.min(0.05, dtSeconds)) : 0;
    this.emissionAccumulator += dt;

    let emittedThisFrame = 0;
    while (this.emissionAccumulator >= this.profile.emitInterval && emittedThisFrame < 2) {
      this.emissionAccumulator -= this.profile.emitInterval;
      this.spawn(overdrive);
      emittedThisFrame += 1;
    }

    for (const particle of this.particles) {
      if (!particle.active) continue;

      particle.life -= dt;
      if (particle.life <= 0) {
        particle.active = false;
        particle.graphic.visible = false;
        continue;
      }

      particle.graphic.x += particle.velocityX * dt;
      particle.graphic.y += particle.velocityY * dt;
      particle.graphic.rotation += particle.spin * dt;

      const ratio = Math.max(0, particle.life / particle.maxLife);
      particle.graphic.alpha = particle.baseAlpha * Math.pow(ratio, 0.78);
      particle.graphic.scale.set(particle.baseScale * (0.72 + ratio * 0.28));
    }
  }

  private spawn(overdrive: boolean): void {
    const particle = this.acquire();
    const serial = this.emissionSerial;
    this.emissionSerial += 1;

    const lifetimeVariance = 0.84 + unit(serial, 1) * 0.28;
    particle.active = true;
    particle.life = this.profile.lifetime * lifetimeVariance;
    particle.maxLife = particle.life;
    particle.baseAlpha = Math.min(1, this.profile.alpha * (overdrive ? 1.16 : 1));
    particle.baseScale = this.profile.size * (0.82 + unit(serial, 2) * 0.34);
    particle.graphic.scale.set(particle.baseScale);
    particle.graphic.alpha = particle.baseAlpha;
    particle.graphic.tint = this.tintFor(serial);
    particle.graphic.visible = true;

    if (this.profile.kind === 'prism-crystal') {
      this.spawnPrismParticle(particle, serial);
      return;
    }

    this.spawnLanceParticle(particle, serial);
  }

  private spawnPrismParticle(particle: EnvelopeParticle, serial: number): void {
    const side = serial % 2 === 0 ? -1 : 1;
    const radial = 0.54 + unit(serial, 3) * 0.46;
    const vertical = (unit(serial, 4) - 0.5) * this.profile.spread;
    const speed = this.profile.speed * (0.76 + unit(serial, 5) * 0.42);

    particle.graphic.position.set(
      this.anchor.x + side * this.profile.reach * radial,
      this.anchor.y + vertical,
    );
    particle.velocityX = side * speed;
    particle.velocityY = (unit(serial, 6) - 0.5) * speed * 0.48;
    particle.spin = (side < 0 ? -1 : 1) * (2.6 + unit(serial, 7) * 3.4);
    particle.graphic.rotation = side < 0 ? -0.35 : 0.35;
  }

  private spawnLanceParticle(particle: EnvelopeParticle, serial: number): void {
    const isTipSpark = this.profile.tipSparkEvery > 0 && serial % this.profile.tipSparkEvery === 0;
    const lateral = (unit(serial, 3) - 0.5) * this.profile.spread;
    const speed = this.profile.speed * (0.80 + unit(serial, 4) * 0.38);

    if (isTipSpark) {
      particle.graphic.position.set(this.anchor.x + lateral * 0.65, this.anchor.forwardTipY + 2);
      particle.velocityX = lateral * 0.8;
      particle.velocityY = -speed;
      particle.spin = (unit(serial, 5) - 0.5) * 2.8;
      particle.graphic.rotation = 0;
      return;
    }

    const shaftProgress = 0.18 + unit(serial, 6) * 0.70;
    const y = this.anchor.y + (this.anchor.forwardTipY - this.anchor.y) * shaftProgress;
    particle.graphic.position.set(this.anchor.x + lateral, y);
    particle.velocityX = lateral * 0.42;
    particle.velocityY = speed * 0.54;
    particle.spin = (unit(serial, 7) - 0.5) * 2.2;
    particle.graphic.rotation = 0;
  }

  private createParticleGraphic(index: number): Graphics {
    const graphic = new Graphics();

    if (this.profile.kind === 'prism-crystal') {
      if (index % 3 === 0) {
        return graphic
          .moveTo(0, -2.8)
          .lineTo(1.9, 0)
          .lineTo(0, 2.8)
          .lineTo(-1.9, 0)
          .lineTo(0, -2.8)
          .fill(0xffffff);
      }
      if (index % 3 === 1) {
        return graphic
          .moveTo(-2.6, 0)
          .lineTo(2.6, 0)
          .stroke({ color: 0xffffff, width: 1.15, cap: 'round' });
      }
      return graphic.circle(0, 0, 1.25).fill(0xffffff);
    }

    if (index % 3 === 0) {
      return graphic
        .moveTo(0, -3.4)
        .lineTo(1.2, 1.8)
        .lineTo(-1.2, 1.8)
        .lineTo(0, -3.4)
        .fill(0xffffff);
    }
    return graphic
      .moveTo(0, -3.8)
      .lineTo(0, 3.8)
      .stroke({ color: 0xffffff, width: index % 3 === 1 ? 1.25 : 0.9, cap: 'round' });
  }

  private tintFor(serial: number): number {
    if (serial % 5 === 0) return 0xf0fbff;
    if (this.profile.kind === 'prism-crystal') return serial % 2 === 0 ? 0x6fe9ff : 0xd756ff;
    return serial % 3 === 0 ? 0x6fe9ff : 0xd756ff;
  }

  private acquire(): EnvelopeParticle {
    for (let offset = 0; offset < this.particles.length; offset += 1) {
      const index = (this.particleCursor + offset) % this.particles.length;
      const particle = this.particles[index];
      if (!particle.active) {
        this.particleCursor = (index + 1) % this.particles.length;
        return particle;
      }
    }

    const particle = this.particles[this.particleCursor];
    this.particleCursor = (this.particleCursor + 1) % this.particles.length;
    return particle;
  }
}
