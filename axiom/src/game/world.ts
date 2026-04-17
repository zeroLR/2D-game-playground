export type EntityId = number;

export type Team = "player" | "enemy" | "projectile" | "enemy-shot";

export type EnemyKind =
  | "circle" | "square" | "star" | "boss"
  | "pentagon" | "hexagon" | "diamond" | "cross" | "crescent";

export interface Pos { x: number; y: number }
export interface Vel { x: number; y: number }

export interface WeaponState {
  period: number;     // seconds between shots
  damage: number;
  projectileSpeed: number;
  projectiles: number; // shots fired per trigger (spread fan if > 1)
  pierce: number;     // projectile hits before despawn (0 = one hit)
  crit: number;       // 0..1 crit chance for 2x damage
  cooldown: number;   // seconds remaining until next shot
}

export interface Projectile {
  damage: number;
  crit: boolean;
  pierceRemaining: number;
  // Enemies already hit, so pierce doesn't re-hit the same target mid-flight.
  hitIds: Set<EntityId>;
  ttl: number;
}

export interface Enemy {
  kind: EnemyKind;
  contactDamage: number;
  maxSpeed: number;
  wobblePhase: number;
  /** Shield HP (hexagon only). Absorbs one hit when > 0 before real HP takes damage. */
  shield?: number;
  /** Diamond dash state: cooldown timer, dash speed multiplier. */
  dashCooldown?: number;
  /** Cross shooting timer. */
  shootCooldown?: number;
  /** Crescent orbit angle (radians). */
  orbitAngle?: number;
  /** Whether survival scaling has been applied (prevents double-scaling). */
  scaled?: boolean;
}

export interface Avatar {
  hp: number;
  maxHp: number;
  speedMul: number;
  iframes: number;    // seconds of invulnerability remaining
  targetX: number;
  targetY: number;
}

export interface Components {
  pos?: Pos;
  vel?: Vel;
  radius?: number;
  team?: Team;
  avatar?: Avatar;
  weapon?: WeaponState;
  enemy?: Enemy;
  projectile?: Projectile;
  hp?: { value: number }; // enemies only; avatar hp lives on Avatar
  flash?: number;         // seconds of hit flash remaining
}

export class World {
  private nextId: EntityId = 1;
  readonly entities = new Map<EntityId, Components>();

  create(c: Components): EntityId {
    const id = this.nextId++;
    this.entities.set(id, c);
    return id;
  }

  remove(id: EntityId): void {
    this.entities.delete(id);
  }

  get(id: EntityId): Components | undefined {
    return this.entities.get(id);
  }

  // Iterate entities that have all requested components. The returned map is
  // the same reference as stored, so callers may mutate in place.
  *with<K extends keyof Components>(...keys: K[]): Generator<[EntityId, Components]> {
    outer: for (const [id, c] of this.entities) {
      for (const k of keys) if (c[k] === undefined) continue outer;
      yield [id, c];
    }
  }

  clear(): void {
    this.entities.clear();
    this.nextId = 1;
  }
}
