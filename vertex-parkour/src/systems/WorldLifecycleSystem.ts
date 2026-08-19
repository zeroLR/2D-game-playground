import type { RelicSource } from '../domain/relics';
import { relicSourceForEncounter } from '../domain/RelicAcquisition';
import { RunProgression, type RunPhase } from '../domain/RunProgression';
import type { WorldRenderer } from '../presentation/WorldRenderer';
import { nextBiome, type BiomeId } from '../world/Biome';
import { biomeSpawnsForBand } from '../world/BiomeEcosystem';
import { buildFinalAscent } from '../world/FinalAscent';
import { buildSummitPlatform, isSummitLanding } from '../world/Summit';
import { START_PLATFORM_Y, WorldGenerator, createRunSeed, type RouteKind, type WorldBand, type WorldSpawn } from '../world/WorldGenerator';
import { WorldState, type EntityId, type WorldEntity } from '../world/WorldState';

type PendingRelicReward = { source: RelicSource; completionY: number };

export class WorldLifecycleSystem {
  readonly state = new WorldState();
  private generator = new WorldGenerator(createRunSeed());
  private waitingForRouteSelection = false;
  private readonly runProgression = new RunProgression();
  private readonly relicRewards: PendingRelicReward[] = [];
  private finalAscentSeeded = false;
  private summitApproachY: number | null = null;
  private summitPlatformId: EntityId | null = null;

  constructor(private readonly renderer: WorldRenderer) {}

  seedInitialWorld() {
    this.generator.setBiome(this.state.getActiveBiome());
    this.spawn({ type: 'platform', x: 180, y: START_PLATFORM_Y, width: 122 }, null, this.state.getActiveBiome());
    for (let i = 0; i < 12; i += 1) {
      if (this.waitingForRouteSelection || !this.runProgression.canGenerateProceduralWorld()) break;
      this.spawnBand();
    }
  }

  getVisualRoute(): RouteKind | null { return this.waitingForRouteSelection ? null : this.state.getActiveRoute(); }
  getVisualBiome(): BiomeId { return this.state.getActiveBiome(); }
  getRunPhase(): RunPhase { return this.runProgression.getPhase(); }
  getSummitApproachY(): number | null { return this.summitApproachY; }
  getSummitPlatformId(): EntityId | null { return this.summitPlatformId; }

  consumeRelicRewardForLanding(landedPlatformId: EntityId | null): RelicSource | null {
    if (landedPlatformId === null || this.relicRewards.length === 0) return null;
    const platform = this.state.platforms.find((candidate) => candidate.id === landedPlatformId);
    if (!platform) return null;
    const rewardIndex = this.relicRewards.findIndex((reward) => platform.y <= reward.completionY + 12);
    if (rewardIndex < 0) return null;
    return this.relicRewards.splice(rewardIndex, 1)[0]?.source ?? null;
  }

  markChapterClearForLanding(landedPlatformId: EntityId | null): boolean {
    if (!isSummitLanding(landedPlatformId, this.summitPlatformId)) return false;
    this.runProgression.markChapterClear();
    return this.runProgression.getPhase() === 'chapter-clear';
  }

  updateMotion(elapsed: number, playerX = 180, playerY = 0, dt = 1 / 60) {
    this.state.updatePlatformCollapse(dt);
    for (const platform of this.state.platforms) { const motion = platform.motion; if (!motion || platform.collapseState === 'broken') continue; platform.x = motion.originX + Math.sin(elapsed * motion.speed + motion.phase) * motion.amplitude; }
    for (const drone of this.state.drones) { if (drone.destroyed) continue; drone.x = drone.originX + Math.sin(elapsed * drone.patrolSpeed + drone.phase) * drone.patrolAmplitude; }
    for (const gate of this.state.pulseGates) { const normalized = ((elapsed + gate.phase) % gate.period) / gate.period; gate.active = normalized < gate.activeRatio; }
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
    if (this.runProgression.getPhase() === 'chapter-clear') return;
    const selectedRoute = this.state.consumePendingRoute();
    if (selectedRoute) { this.generator.queueRoute(selectedRoute); this.waitingForRouteSelection = false; }
    while (this.runProgression.canGenerateProceduralWorld() && !this.waitingForRouteSelection && this.generator.getLastY() + cameraOffset > -150) this.spawnBand();
  }

  reset() {
    this.renderer.clear();
    this.state.clear();
    this.relicRewards.length = 0;
    this.generator = new WorldGenerator(createRunSeed());
    this.generator.setBiome(this.state.getActiveBiome());
    this.waitingForRouteSelection = false;
    this.finalAscentSeeded = false;
    this.summitApproachY = null;
    this.summitPlatformId = null;
    this.runProgression.reset();
    this.seedInitialWorld();
  }

  private spawnBand() {
    const band = this.generator.nextBand();
    const routeTheme = this.themeForBand(band);
    const biomeTheme = this.state.getActiveBiome();
    biomeSpawnsForBand(biomeTheme, band).forEach((spawn) => this.spawn(spawn, routeTheme, biomeTheme));

    const source = relicSourceForEncounter(band.encounter);
    if (source && band.encounterStep === 3) this.relicRewards.push({ source, completionY: band.y });

    this.runProgression.observeEncounter(biomeTheme, band.encounter, band.encounterStep);
    if (this.runProgression.getPhase() === 'final-ascent') this.seedFinalAscent();
    if (band.encounter === 'route-choice' && band.encounterStep === 3) this.waitingForRouteSelection = true;
    if (band.encounter === 'climax' && band.encounterStep === 3 && this.runProgression.getPhase() === 'running') this.advanceBiome();
  }

  private seedFinalAscent() {
    if (this.finalAscentSeeded) return;
    this.finalAscentSeeded = true;
    const bands = buildFinalAscent(this.generator.getLastY());
    for (const band of bands) for (const spawn of band.spawns) this.spawn(spawn, null, 'storm-crown');
    this.summitApproachY = bands[bands.length - 1]?.y ?? null;
    if (this.summitApproachY !== null) {
      const summit = this.spawn(buildSummitPlatform(this.summitApproachY), null, 'storm-crown');
      this.summitPlatformId = summit.type === 'platform' ? summit.id : null;
    }
  }

  private advanceBiome() {
    const current = this.state.getActiveBiome();
    const next = nextBiome(current);
    if (next !== current) { this.state.setActiveBiome(next); this.generator.setBiome(next); }
  }

  private themeForBand(band: WorldBand): RouteKind | null { if (band.encounter === 'route-choice') return null; return this.state.getActiveRoute(); }
  private spawn(spawn: WorldSpawn, routeTheme: RouteKind | null, biomeTheme: BiomeId): WorldEntity { const entity = this.state.addSpawn(spawn, spawn.type === 'platform' ? routeTheme : null, biomeTheme); this.renderer.mount(entity); return entity; }
}
