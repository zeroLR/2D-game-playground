import { Container, Graphics } from 'pixi.js';
import type { GameEvent } from '../../domain/events';
import { Palette } from '../visuals';

export class FxSystem {
  private cameraShake = 0;

  constructor(private readonly particles: Container) {}

  reset() {
    this.cameraShake = 0;
    this.particles.removeChildren().forEach((child) => child.destroy());
  }

  consume(events: GameEvent[]) {
    for (const event of events) {
      switch (event.type) {
        case 'dash-started':
          this.spawnDashTrail(event.x, event.y, event.direction, event.strength);
          break;
        case 'landed':
          this.cameraShake = Math.max(this.cameraShake, 2.2);
          break;
        case 'wall-jumped':
          this.cameraShake = Math.max(this.cameraShake, 2.8);
          break;
        case 'crystal-picked':
          this.spawnBurst(event.x, event.y, Palette.tealSoft);
          break;
        case 'drone-killed':
          this.spawnBurst(event.x, event.y, Palette.gold);
          this.cameraShake = Math.max(this.cameraShake, 3.8);
          break;
        case 'player-hit':
          this.cameraShake = Math.max(this.cameraShake, 6);
          break;
      }
    }
  }

  update(deltaSeconds: number) {
    this.cameraShake = Math.max(0, this.cameraShake - deltaSeconds * 28);
  }

  getShake(elapsed: number) {
    if (this.cameraShake <= 0) return { x: 0, y: 0 };
    return {
      x: Math.sin(elapsed * 68) * this.cameraShake,
      y: Math.cos(elapsed * 57) * this.cameraShake * 0.55,
    };
  }

  private spawnDashTrail(x: number, y: number, direction: -1 | 1, strength: number) {
    const trailLength = 38 + strength * 28;
    for (let i = 0; i < 6; i += 1) {
      const trail = new Graphics();
      const t = i / 6;
      trail.poly([-9, 7, 0, -12, 9, 7]).fill({
        color: Palette.cream,
        alpha: (0.08 + strength * 0.04) * (1 - t),
      });
      trail.position.set(x - direction * (12 + t * trailLength), y);
      this.particles.addChild(trail);
      setTimeout(() => trail.destroy(), 90 + i * 18);
    }
  }

  private spawnBurst(x: number, y: number, color: number) {
    for (let i = 0; i < 7; i += 1) {
      const shard = new Graphics();
      const angle = (Math.PI * 2 * i) / 7;
      shard.poly([0, -4, 3, 2, -2, 2]).fill({ color, alpha: 0.7 });
      shard.position.set(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
      shard.rotation = angle;
      this.particles.addChild(shard);
      setTimeout(() => shard.destroy(), 180 + i * 12);
    }
  }
}
