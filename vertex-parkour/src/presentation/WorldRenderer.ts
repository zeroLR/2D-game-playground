import { Container, Graphics } from 'pixi.js';
import type { EntityId, RouteEntity, WorldEntity } from '../world/WorldState';
import { windFieldForPlatform } from '../world/WindField';
import { createBiomePlatformVisual } from './BiomePlatformRenderer';
import { getBiomeTheme, mixTint } from './BiomeTheme';
import { createRouteVisual, updateRouteVisual } from './RouteRenderer';
import { getRouteTheme } from './RouteTheme';
import { createInterceptorVisual, createPulseGateVisual, updatePulseGateVisual } from './ThreatRenderer';
import { createUpgradeVisual } from './UpgradeRenderer';
import { createWindFieldVisual } from './WindFieldRenderer';
import { createCrystalVisual, createDroneVisual, createHazardVisual, createSpikeVisual, createWallVisual, setHazardDanger } from './visuals';

function routeForPlatform(platform: Extract<WorldEntity, { type: 'platform' }>, entities: WorldEntity[]): RouteEntity | undefined { return entities.find((entity): entity is RouteEntity => entity.type === 'route' && Math.abs(entity.x - platform.x) < 40 && Math.abs(entity.y + 48 - platform.y) < 8); }

export class WorldRenderer {
  private readonly views = new Map<EntityId, Container>();
  constructor(private readonly container: Container) {}
  mount(entity: WorldEntity) {
    let view: Container;
    switch (entity.type) {
      case 'platform': {
        view = createBiomePlatformVisual(entity.width, entity.biomeTheme);
        const wind = windFieldForPlatform(entity);
        if (wind) view.addChild(createWindFieldVisual(wind));
        break;
      }
      case 'crystal': view = createCrystalVisual(); break;
      case 'drone': view = createDroneVisual(); break;
      case 'interceptor': view = createInterceptorVisual(entity.biomeTheme); break;
      case 'pulse-gate': view = createPulseGateVisual(entity.height, entity.biomeTheme); break;
      case 'hazard': view = createHazardVisual(); break;
      case 'spike': view = createSpikeVisual(entity.width); break;
      case 'wall': view = createWallVisual(entity.height, entity.side); break;
      case 'upgrade': view = createUpgradeVisual(entity.kind, entity.skillId); break;
      case 'route': view = createRouteVisual(entity.kind); break;
    }
    view.position.set(entity.x, entity.y); this.container.addChild(view); this.views.set(entity.id, view);
  }
  update(entities: WorldEntity[], cameraOffset: number, elapsed: number, playerX: number, playerY: number, dt: number) {
    for (const entity of entities) {
      const view = this.views.get(entity.id); if (!view) continue;
      if (entity.type === 'platform') { view.x = entity.x; view.y = entity.y + cameraOffset; const route = routeForPlatform(entity, entities); const routeKind = entity.routeTheme ?? route?.kind ?? null; const biomeTint = getBiomeTheme(entity.biomeTheme).platformTint; const graphics = view as Graphics; graphics.tint = routeKind ? mixTint(biomeTint, getRouteTheme(routeKind).platformTint, 0.58) : biomeTint; graphics.alpha = route?.locked ? 0.38 : 1; }
      else if (entity.type === 'wall' || entity.type === 'spike') view.y = entity.y + cameraOffset;
      else if (entity.type === 'pulse-gate') { view.x = entity.x; view.y = entity.y + cameraOffset; updatePulseGateVisual(view, entity.active, elapsed, entity.biomeTheme); }
      else if (entity.type === 'interceptor') { view.visible = !entity.destroyed; if (!entity.destroyed) { view.x = entity.x; view.y = entity.y + cameraOffset + Math.sin(elapsed * 4 + entity.phase) * 3; view.rotation = Math.sin(elapsed * 3 + entity.phase) * 0.08; } }
      else if (entity.type === 'crystal') { view.visible = !entity.taken; view.y = entity.y + cameraOffset + Math.sin(elapsed * 2.4 + entity.x) * 3; view.rotation = Math.sin(elapsed * 1.3 + entity.x) * 0.04; }
      else if (entity.type === 'upgrade') { view.visible = !entity.taken; view.alpha = entity.locked ? 0.16 : 1; view.y = entity.y + cameraOffset + Math.sin(elapsed * 2 + entity.x * 0.01) * 2; view.scale.set(entity.locked ? 0.9 : 1 + Math.sin(elapsed * 3 + entity.x) * 0.015); }
      else if (entity.type === 'route') { view.visible = true; view.x = entity.x; view.y = entity.y + cameraOffset; updateRouteVisual(view, entity.taken, entity.locked, elapsed); }
      else if (entity.type === 'drone') { view.visible = !entity.destroyed; if (!entity.destroyed) { view.x = entity.x; view.y = entity.y + cameraOffset + Math.sin(elapsed * 3 + entity.phase) * 5; view.rotation = Math.sin(elapsed * 2 + entity.phase) * 0.06; } }
      else if (entity.type === 'hazard') { view.y = entity.y + cameraOffset; view.rotation += dt * 0.36; setHazardDanger(view as Graphics, 1 - Math.min(1, Math.hypot(playerX - entity.x, playerY - entity.y) / 150)); }
    }
  }
  clear() { for (const view of this.views.values()) view.destroy({ children: true }); this.views.clear(); }
}
