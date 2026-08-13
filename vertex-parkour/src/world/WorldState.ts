import type { WorldSpawn } from './WorldGenerator';

export type EntityId = number;
type BaseEntity = { id: EntityId; x: number; y: number };
export type PlatformEntity = BaseEntity & { type: 'platform'; width: number };
export type CrystalEntity = BaseEntity & { type: 'crystal'; taken: boolean };
export type DroneEntity = BaseEntity & { type: 'drone'; destroyed: boolean; phase: number };
export type HazardEntity = BaseEntity & { type: 'hazard'; hit: boolean };
export type SpikeEntity = BaseEntity & { type: 'spike'; width: number };
export type BreakableEntity = BaseEntity & { type: 'breakable'; width: number; height: number; destroyed: boolean };
export type WallEntity = BaseEntity & { type: 'wall'; side: -1 | 1; height: number };
export type WorldEntity = PlatformEntity | CrystalEntity | DroneEntity | HazardEntity | SpikeEntity | BreakableEntity | WallEntity;

export class WorldState {
  private nextId = 1;
  readonly platforms: PlatformEntity[] = [];
  readonly crystals: CrystalEntity[] = [];
  readonly drones: DroneEntity[] = [];
  readonly hazards: HazardEntity[] = [];
  readonly spikes: SpikeEntity[] = [];
  readonly breakables: BreakableEntity[] = [];
  readonly walls: WallEntity[] = [];

  addSpawn(spawn: WorldSpawn): WorldEntity {
    const id = this.nextId++;
    switch (spawn.type) {
      case 'platform': { const entity: PlatformEntity = { id, type: 'platform', x: spawn.x, y: spawn.y, width: spawn.width }; this.platforms.push(entity); return entity; }
      case 'crystal': { const entity: CrystalEntity = { id, type: 'crystal', x: spawn.x, y: spawn.y, taken: false }; this.crystals.push(entity); return entity; }
      case 'drone': { const entity: DroneEntity = { id, type: 'drone', x: spawn.x, y: spawn.y, destroyed: false, phase: spawn.phase }; this.drones.push(entity); return entity; }
      case 'hazard': { const entity: HazardEntity = { id, type: 'hazard', x: spawn.x, y: spawn.y, hit: false }; this.hazards.push(entity); return entity; }
      case 'spike': { const entity: SpikeEntity = { id, type: 'spike', x: spawn.x, y: spawn.y, width: spawn.width }; this.spikes.push(entity); return entity; }
      case 'breakable': { const entity: BreakableEntity = { id, type: 'breakable', x: spawn.x, y: spawn.y, width: spawn.width, height: spawn.height, destroyed: false }; this.breakables.push(entity); return entity; }
      case 'wall': { const entity: WallEntity = { id, type: 'wall', x: spawn.side === -1 ? 52 : 308, y: spawn.y, side: spawn.side, height: spawn.height }; this.walls.push(entity); return entity; }
    }
  }

  clear() { this.platforms.length = 0; this.crystals.length = 0; this.drones.length = 0; this.hazards.length = 0; this.spikes.length = 0; this.breakables.length = 0; this.walls.length = 0; this.nextId = 1; }
  all(): WorldEntity[] { return [...this.platforms, ...this.crystals, ...this.drones, ...this.hazards, ...this.spikes, ...this.breakables, ...this.walls]; }
}
