import { Container, Graphics } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';

export type ImpactTier = 'hit' | 'break' | 'overdrive';

interface ImpactParticle {
  graphic: Graphics;
  velocity: Point2D;
  life: number;
  maxLife: number;
  spin: number;
  drag: number;
  active: boolean;
}

const TIER_PROFILE: Record<ImpactTier, { count: number; speed: number; lifetime: number; scale: number }> = {
  hit: { count: 4, speed: 110, lifetime: 0.13, scale: 0.62 },
  break: { count: 12, speed: 205, lifetime: 0.28, scale: 1 },
  overdrive: { count: 18, speed: 255, lifetime: 0.34, scale: 1.18 },
};

export class ImpactPool extends Container {
  private readonly particles: ImpactParticle[] = [];
  private particleCursor = 0;
  private emissionSerial = 0;
  private densityScale = 1;
  private reducedMotion = false;

  constructor(capacity = 112) {
    super();
    for (let index = 0; index < capacity; index += 1) {
      const graphic = this.createParticleGraphic(index);
      graphic.visible = false;
      this.addChild(graphic);
      this.particles.push({
        graphic,
        velocity: { x: 0, y: 0 },
        life: 0,
        maxLife: 0,
        spin: 0,
        drag: 4.5,
        active: false,
      });
    }
  }

  setDensityScale(scale: number): void {
    this.densityScale = Math.min(1, Math.max(0.4, Number.isFinite(scale) ? scale : 1));
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
  }

  spawn(position: Point2D, tier: ImpactTier): void {
    const profile = TIER_PROFILE[tier];
    const motionScale = this.reducedMotion ? 0.72 : 1;
    const count = Math.max(2, Math.round(profile.count * this.densityScale * (this.reducedMotion ? 0.72 : 1)));

    for (let index = 0; index < count; index += 1) {
      const particle = this.acquire();
      const serial = this.emissionSerial + index;
      const phase = serial * 2.399 + (tier === 'overdrive' ? serial * 0.11 : 0);
      const variance = 0.70 + ((serial * 7) % 11) / 25;
      particle.active = true;
      particle.life = profile.lifetime;
      particle.maxLife = profile.lifetime;
      particle.drag = tier === 'overdrive' ? 3.6 : tier === 'break' ? 4.1 : 5.2;
      particle.velocity = {
        x: Math.cos(phase) * profile.speed * variance * motionScale,
        y: Math.sin(phase) * profile.speed * variance * motionScale,
      };
      particle.spin = (serial % 2 === 0 ? 1 : -1) * (5.5 + (serial % 5) * 1.35);
      particle.graphic.position.set(position.x, position.y);
      particle.graphic.rotation = phase;
      particle.graphic.scale.set(profile.scale * (0.86 + (serial % 4) * 0.08));
      particle.graphic.tint = this.tintFor(tier, serial);
      particle.graphic.alpha = tier === 'overdrive' ? 1 : tier === 'break' ? 0.94 : 0.76;
      particle.graphic.visible = true;
    }
    this.emissionSerial += count;
  }

  update(dtSeconds: number): void {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    for (const particle of this.particles) {
      if (!particle.active) continue;
      particle.life -= dt;
      if (particle.life <= 0) {
        particle.active = false;
        particle.graphic.visible = false;
        continue;
      }

      particle.graphic.x += particle.velocity.x * dt;
      particle.graphic.y += particle.velocity.y * dt;
      particle.graphic.rotation += particle.spin * dt;
      const damping = Math.max(0, 1 - dt * particle.drag);
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;
      const ratio = Math.max(0, particle.life / particle.maxLife);
      particle.graphic.alpha = Math.pow(ratio, 0.72);
      particle.graphic.scale.set(particle.graphic.scale.x * Math.max(0.94, 1 - dt * 1.6));
    }
  }

  private createParticleGraphic(index: number): Graphics {
    const graphic = new Graphics();
    switch (index % 3) {
      case 0:
        return graphic
          .moveTo(0, -6)
          .lineTo(2.2, -1)
          .lineTo(0.8, 6)
          .lineTo(-2.4, 1)
          .lineTo(0, -6)
          .fill(0xffffff);
      case 1:
        return graphic
          .moveTo(-4, 3)
          .lineTo(0, -5)
          .lineTo(4, 3)
          .lineTo(-4, 3)
          .fill(0xffffff);
      default:
        return graphic
          .moveTo(-5, 0)
          .lineTo(5, 0)
          .stroke({ color: 0xffffff, width: 2.2, cap: 'round' });
    }
  }

  private tintFor(tier: ImpactTier, serial: number): number {
    if (tier === 'overdrive') {
      if (serial % 4 === 0) return 0xf0fbff;
      return serial % 2 === 0 ? 0xd756ff : 0x6fe9ff;
    }
    return serial % 3 === 0 ? 0xd756ff : 0x6fe9ff;
  }

  private acquire(): ImpactParticle {
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
