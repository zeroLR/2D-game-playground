import type { SkillId } from '../domain/skills';
import { STARTING_BIOME, type BiomeId } from './Biome';
import type { PlatformMotion, RouteKind, UpgradeKind, WorldSpawn } from './WorldGenerator';

export type EntityId = number;
type BaseEntity = { id: EntityId; x: number; y: number };
export type PlatformEntity = BaseEntity & { type: 'platform'; width: number; motion?: PlatformMotion; routeTheme: RouteKind | null; biomeTheme: BiomeId };
export type CrystalEntity = BaseEntity & { type: 'crystal'; taken: boolean };
export type DroneEntity = BaseEntity & { type: 'drone'; destroyed: boolean; phase: number; originX: number; patrolAmplitude: number; patrolSpeed: number };
export type InterceptorEntity = BaseEntity & { type: 'interceptor'; destroyed: boolean; phase: number; originX: number; trackingRange: number; maxSpeed: number };
export type PulseGateEntity = BaseEntity & { type: 'pulse-gate'; height: number; phase: number; active: boolean; period: number; activeRatio: number };
export type HazardEntity = BaseEntity & { type: 'hazard'; hit: boolean };
export type SpikeEntity = BaseEntity & { type: 'spike'; width: number };
export type WallEntity = BaseEntity & { type: 'wall'; side: -1 | 1; height: number };
export type UpgradeEntity = BaseEntity & { type: 'upgrade'; kind: UpgradeKind; skillId?: SkillId; choiceId: number; taken: boolean; locked: boolean };
export type RouteEntity = BaseEntity & { type: 'route'; kind: RouteKind; choiceId: number; taken: boolean; locked: boolean };
export type WorldEntity = PlatformEntity | CrystalEntity | DroneEntity | InterceptorEntity | PulseGateEntity | HazardEntity | SpikeEntity | WallEntity | UpgradeEntity | RouteEntity;

export class WorldState {
  private nextId = 1;
  private pendingRoute: RouteKind | null = null;
  private activeRoute: RouteKind | null = null;
  private activeBiome: BiomeId = STARTING_BIOME;
  readonly platforms: PlatformEntity[] = [];
  readonly crystals: CrystalEntity[] = [];
  readonly drones: DroneEntity[] = [];
  readonly interceptors: InterceptorEntity[] = [];
  readonly pulseGates: PulseGateEntity[] = [];
  readonly hazards: HazardEntity[] = [];
  readonly spikes: SpikeEntity[] = [];
  readonly walls: WallEntity[] = [];
  readonly upgrades: UpgradeEntity[] = [];
  readonly routes: RouteEntity[] = [];

  addSpawn(spawn: WorldSpawn, routeTheme: RouteKind | null = null, biomeTheme: BiomeId = this.activeBiome): WorldEntity {
    const id = this.nextId++;
    switch (spawn.type) {
      case 'platform': { const entity: PlatformEntity = { id, type: 'platform', x: spawn.x, y: spawn.y, width: spawn.width, motion: spawn.motion, routeTheme, biomeTheme }; this.platforms.push(entity); return entity; }
      case 'crystal': { const entity: CrystalEntity = { id, type: 'crystal', x: spawn.x, y: spawn.y, taken: false }; this.crystals.push(entity); return entity; }
      case 'drone': { const entity: DroneEntity = { id, type: 'drone', x: spawn.x, y: spawn.y, destroyed: false, phase: spawn.phase, originX: spawn.x, patrolAmplitude: 34, patrolSpeed: 0.82 }; this.drones.push(entity); return entity; }
      case 'interceptor': { const entity: InterceptorEntity = { id, type: 'interceptor', x: spawn.x, y: spawn.y, destroyed: false, phase: spawn.phase, originX: spawn.x, trackingRange: 150, maxSpeed: 135 }; this.interceptors.push(entity); return entity; }
      case 'pulse-gate': { const entity: PulseGateEntity = { id, type: 'pulse-gate', x: spawn.x, y: spawn.y, height: spawn.height, phase: spawn.phase, active: false, period: 2.4, activeRatio: 0.56 }; this.pulseGates.push(entity); return entity; }
      case 'hazard': { const entity: HazardEntity = { id, type: 'hazard', x: spawn.x, y: spawn.y, hit: false }; this.hazards.push(entity); return entity; }
      case 'spike': { const entity: SpikeEntity = { id, type: 'spike', x: spawn.x, y: spawn.y, width: spawn.width }; this.spikes.push(entity); return entity; }
      case 'wall': { const entity: WallEntity = { id, type: 'wall', x: spawn.side === -1 ? 52 : 308, y: spawn.y, side: spawn.side, height: spawn.height }; this.walls.push(entity); return entity; }
      case 'upgrade': { const entity: UpgradeEntity = { id, type: 'upgrade', x: spawn.x, y: spawn.y, kind: spawn.kind, skillId: spawn.skillId, choiceId: spawn.choiceId, taken: false, locked: false }; this.upgrades.push(entity); return entity; }
      case 'route': { const entity: RouteEntity = { id, type: 'route', x: spawn.x, y: spawn.y, kind: spawn.kind, choiceId: spawn.choiceId, taken: false, locked: false }; this.routes.push(entity); return entity; }
    }
  }

  commitUpgradeChoice(choiceId: number, selectedId: EntityId) { for (const upgrade of this.upgrades) { if (upgrade.choiceId !== choiceId) continue; if (upgrade.id === selectedId) upgrade.taken = true; else upgrade.locked = true; } }
  commitRouteChoice(choiceId: number, selectedId: EntityId) { for (const route of this.routes) { if (route.choiceId !== choiceId) continue; if (route.id === selectedId) { route.taken = true; this.activeRoute = route.kind; this.pendingRoute = route.kind; } else route.locked = true; } }
  getActiveRoute() { return this.activeRoute; }
  getActiveBiome() { return this.activeBiome; }
  setActiveBiome(biome: BiomeId) { this.activeBiome = biome; }
  consumePendingRoute() { const route = this.pendingRoute; this.pendingRoute = null; return route; }
  clear() { this.platforms.length = 0; this.crystals.length = 0; this.drones.length = 0; this.interceptors.length = 0; this.pulseGates.length = 0; this.hazards.length = 0; this.spikes.length = 0; this.walls.length = 0; this.upgrades.length = 0; this.routes.length = 0; this.pendingRoute = null; this.activeRoute = null; this.activeBiome = STARTING_BIOME; this.nextId = 1; }
  all(): WorldEntity[] { return [...this.platforms, ...this.crystals, ...this.drones, ...this.interceptors, ...this.pulseGates, ...this.hazards, ...this.spikes, ...this.walls, ...this.upgrades, ...this.routes]; }
}
