import type { WorldRenderer } from '../presentation/WorldRenderer';
import { START_PLATFORM_Y, WorldGenerator, createRunSeed, type WorldSpawn } from '../world/WorldGenerator';
import { WorldState } from '../world/WorldState';

export class WorldLifecycleSystem {
  readonly state = new WorldState();
  private generator = new WorldGenerator(createRunSeed());

  constructor(private readonly renderer: WorldRenderer) {}

  seedInitialWorld() {
    this.spawn({ type: 'platform', x: 180, y: START_PLATFORM_Y, width: 122 });
    for (let i = 0; i < 12; i += 1) this.spawnBand();
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
    if (selectedRoute) this.generator.queueRoute(selectedRoute);
    while (this.generator.getLastY() + cameraOffset > -150) this.spawnBand();
  }

  reset() {
    this.renderer.clear();
    this.state.clear();
    this.generator = new WorldGenerator(createRunSeed());
    this.seedInitialWorld();
  }

  private spawnBand() {
    for (const spawn of this.generator.nextBand().spawns) this.spawn(spawn);
  }

  private spawn(spawn: WorldSpawn) {
    const entity = this.state.addSpawn(spawn);
    this.renderer.mount(entity);
  }
}
