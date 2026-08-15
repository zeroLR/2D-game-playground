import type { WorldRenderer } from '../presentation/WorldRenderer';
import { nextBiome, type BiomeId } from '../world/Biome';
import { START_PLATFORM_Y, WorldGenerator, createRunSeed, type RouteKind, type WorldBand, type WorldSpawn } from '../world/WorldGenerator';
import { WorldState } from '../world/WorldState';

export class WorldLifecycleSystem {
  readonly state = new WorldState();
  private generator = new WorldGenerator(createRunSeed());
  private waitingForRouteSelection = false;

  constructor(private readonly renderer: WorldRenderer) {}

  seedInitialWorld() {
    this.spawn({ type: 'platform', x: 180, y: START_PLATFORM_Y, width: 122 }, null, this.state.getActiveBiome());
    for (let i = 0; i < 12; i += 1) {
      if (this.waitingForRouteSelection) break;
      this.spawnBand();
    }
  }

  getVisualRoute(): RouteKind | null {
    return this.waitingForRouteSelection ? null : this.state.getActiveRoute();
  }

  getVisualBiome(): BiomeId {
    return this.state.getActiveBiome();
  }

  updateMotion(elapsed: number, playerX = 180, playerY = 0, dt = 1 / 60) {
    for (const platform of this.state.platforms) {
      const motion = platform.motion;
      if (!motion) continue;
      platform.x = motion.originX + Math.sin(elapsed * motion.speed + motion.phase) * motion.amplitude;
    }
    for (const drone of this.state.drones) {
      if (drone.destroyed) continue;
      drone.x = drone.originX + Math.sin(elapsed * drone.patrolSpeed + drone.phase) * drone.patrolAmplitude;
    }
    for (const gate of this.state.pulseGates) {
      const normalized = ((elapsed + gate.phase) % gate.period) / gate.period;
      gate.active = normalized < gate.activeRatio;
    }
    for (const interceptor of this.state.interceptors) {
      if (interceptor.destroyed) continue;
      const tracking = Math.abs(playerY - interceptor.y) <= interceptor.trackingRange;
      const targetX = tracking ? playerX : interceptor.originX;
      const delta = targetX - interceptor.x;
      const step = Math.sign(delta) * Math.min(Math.abs(delta), interceptor.maxSpeed * dt);
      interceptor.x = Math.max(58, Math.min(302, interceptor.x + step));
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
    const biomeTheme = this.state.getActiveBiome();
    for (const spawn of band.spawns) this.spawn(spawn, routeTheme, biomeTheme);
    if (band.encounter === 'route-choice' && band.encounterStep === 3) this.waitingForRouteSelection = true;
    if (band.encounter === 'climax' && band.encounterStep === 3) this.advanceBiome();
  }

  private advanceBiome() {
    const current = this.state.getActiveBiome();
    const next = nextBiome(current);
    if (next !== current) this.state.setActiveBiome(next);
  }

  private themeForBand(band: WorldBand): RouteKind | null {
    if (band.encounter === 'route-choice') return null;
    return this.state.getActiveRoute();
  }

  private spawn(spawn: WorldSpawn, routeTheme: RouteKind | null, biomeTheme: BiomeId) {
    const entity = this.state.addSpawn(spawn, spawn.type === 'platform' ? routeTheme : null, biomeTheme);
    this.renderer.mount(entity);
  }
}
