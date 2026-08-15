import type { WorldRenderer } from '../presentation/WorldRenderer';
import { START_PLATFORM_Y, WorldGenerator, createRunSeed, type RouteKind, type WorldBand, type WorldSpawn } from '../world/WorldGenerator';
import { WorldState } from '../world/WorldState';

export class WorldLifecycleSystem {
  readonly state = new WorldState();
  private generator = new WorldGenerator(createRunSeed());
  private waitingForRouteSelection = false;

  constructor(private readonly renderer: WorldRenderer) {}

  seedInitialWorld() {
    this.spawn({ type: 'platform', x: 180, y: START_PLATFORM_Y, width: 122 }, null);
    for (let i = 0; i < 12; i += 1) {
      if (this.waitingForRouteSelection) break;
      this.spawnBand();
    }
  }

  getVisualRoute(): RouteKind | null {
    return this.waitingForRouteSelection ? null : this.state.getActiveRoute();
  }

  updateMotion(elapsed: number) {
    for (const platform of this.state.platforms) {
      const motion = platform.motion;
      if (!motion) continue;
      platform.x = motion.originX + Math.sin(elapsed * motion.speed + motion.phase) * motion.amplitude;
    }
  }

  update(cameraOffset: number) {
    const selectedRoute = this.state.consumePendingRoute();
    if (selectedRoute) {
      this.generator.queueRoute(selectedRoute);
      this.waitingForRouteSelection = false;
    }
    while (!this.waitingForRouteSelection && this.generator.getLastY() + cameraOffset > -150) this.spawnBand();
  }

  reset() {
    this.renderer.clear();
    this.state.clear();
    this.generator = new WorldGenerator(createRunSeed());
    this.waitingForRouteSelection = false;
    this.seedInitialWorld();
  }

  private spawnBand() {
    const band = this.generator.nextBand();
    const routeTheme = this.themeForBand(band);
    for (const spawn of band.spawns) this.spawn(spawn, routeTheme);
    if (band.encounter === 'route-choice' && band.encounterStep === 3) this.waitingForRouteSelection = true;
  }

  private themeForBand(band: WorldBand): RouteKind | null {
    if (band.encounter === 'route-choice') return null;
    return this.state.getActiveRoute();
  }

  private spawn(spawn: WorldSpawn, routeTheme: RouteKind | null) {
    const entity = this.state.addSpawn(spawn, spawn.type === 'platform' ? routeTheme : null);
    this.renderer.mount(entity);
  }
}
