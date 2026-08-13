import { Container, Graphics } from 'pixi.js';
import type { EntityId, WorldEntity } from '../world/WorldState';
import { createCrystalVisual, createDroneVisual, createHazardVisual, createPlatformVisual, createSpikeVisual, createWallVisual, setHazardDanger } from './visuals';

export class WorldRenderer {
  private readonly views = new Map<EntityId, Graphics>();

  constructor(private readonly container: Container) {}

  mount(entity: WorldEntity) {
    let view: Graphics;
    switch (entity.type) {
      case 'platform': view = createPlatformVisual(entity.width); break;
      case 'crystal': view = createCrystalVisual(); break;
      case 'drone': view = createDroneVisual(); break;
      case 'hazard': view = createHazardVisual(); break;
      case 'spike': view = createSpikeVisual(entity.width); break;
      case 'wall': view = createWallVisual(entity.height, entity.side); break;
    }
    view.position.set(entity.x, entity.y);
    this.container.addChild(view);
    this.views.set(entity.id, view);
  }

  update(entities: WorldEntity[], cameraOffset: number, elapsed: number, playerX: number, playerY: number, dt: number) {
    for (const entity of entities) {
      const view = this.views.get(entity.id);
      if (!view) continue;
      if (entity.type === 'platform') {
        view.x = entity.x;
        view.y = entity.y + cameraOffset;
      } else if (entity.type === 'wall' || entity.type === 'spike') {
        view.y = entity.y + cameraOffset;
      } else if (entity.type === 'crystal') {
        view.visible = !entity.taken;
        view.y = entity.y + cameraOffset + Math.sin(elapsed * 2.4 + entity.x) * 3;
        view.rotation = Math.sin(elapsed * 1.3 + entity.x) * 0.04;
      } else if (entity.type === 'drone') {
        view.visible = !entity.destroyed;
        if (!entity.destroyed) {
          view.y = entity.y + cameraOffset + Math.sin(elapsed * 3 + entity.phase) * 5;
          view.rotation = Math.sin(elapsed * 2 + entity.phase) * 0.06;
        }
      } else if (entity.type === 'hazard') {
        view.y = entity.y + cameraOffset;
        view.rotation += dt * 0.36;
        setHazardDanger(view, 1 - Math.min(1, Math.hypot(playerX - entity.x, playerY - entity.y) / 150));
      }
    }
  }

  clear() {
    for (const view of this.views.values()) view.destroy();
    this.views.clear();
  }
}
