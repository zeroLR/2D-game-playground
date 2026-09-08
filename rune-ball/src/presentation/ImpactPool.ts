import { Container, Graphics } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';

export type ImpactTier = 'hit' | 'break' | 'overdrive';

interface ImpactParticle {
  graphic: Graphics;
  velocity: Point2D;
  life: number;
  maxLife: number;
  spin: number;
  active: boolean;
}

export class ImpactPool extends Container {
  private readonly particles: ImpactParticle[] = [];
  private particleCursor = 0;
  private emissionSerial = 0;

  constructor(capacity = 96) {
    super();
    for (let index = 0; index < capacity; index += 1) {
      const graphic = new Graphics()
        .moveTo(0, -4)
        .lineTo(2.5, 0)
        .lineTo(0, 4)
        .lineTo(-2.5, 0)
        .lineTo(0, -4)
        .fill(0xffffff);
      graphic.visible = false;
      this.addChild(graphic);
      this.particles.push({
        graphic,
        velocity: { x: 0, y: 0 },
        life: 0,
        maxLife: 0,
        spin: 0,
        active: false,
      });
    }
  }

  spawn(position: Point2D, tier: ImpactTier): void {
    const count = tier === 'overdrive' ? 16 : tier === 'break' ? 11 : 4;
    const speed = tier === 'overdrive' ? 240 : tier === 'break' ? 190 : 105;
    const lifetime = tier === 'overdrive' ? 0.32 : tier === 'break' ? 0.26 : 0.13;

    for (let index = 0; index < count; index += 1) {
      const particle = this.acquire();
      const phase = this.emissionSerial * 0.73 + index * 2.399;
      const variance = 0.72 + ((this.emissionSerial + index * 7) % 9) / 22;
      particle.active = true;
      particle.life = lifetime;
      particle.maxLife = lifetime;
      particle.velocity = {
        x: Math.cos(phase) * speed * variance,
        y: Math.sin(phase) * speed * variance,
      };
      particle.spin = ((index % 2 === 0 ? 1 : -1) * (6 + (index % 4) * 1.5));
      particle.graphic.position.set(position.x, position.y);
      particle.graphic.rotation = phase;
      particle.graphic.scale.set(tier === 'overdrive' ? 1.2 : tier === 'break' ? 1 : 0.65);
      particle.graphic.tint = tier === 'overdrive'
        ? index % 4 === 0 ? 0xf0fbff : index % 2 === 0 ? 0xd756ff : 0x6fe9ff
        : index % 3 === 0 ? 0xd756ff : 0x6fe9ff;
      particle.graphic.alpha = tier === 'overdrive' ? 1 : tier === 'break' ? 0.95 : 0.78;
      particle.graphic.visible = true;
      this.emissionSerial += 1;
    }
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
      particle.velocity.x *= Math.max(0, 1 - dt * 4.5);
      particle.velocity.y *= Math.max(0, 1 - dt * 4.5);
      particle.graphic.alpha = Math.max(0, particle.life / particle.maxLife);
    }
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
