// Bag-of-components ECS, directly from the game-systems skill
// (.claude/skills/game-systems/SKILL.md:19-51).
//
// Systems are pure functions that iterate via `World.with(...keys)`. Easy to
// test, easy to serialize — the component map is just plain data.

export type EntityId = number;

/** Identifies which sprite this entity uses in the render layer. */
export type SpriteKey = "player" | "goblin" | "rat" | "orc" | "troll";

export interface Components {
  position?: { x: number; y: number };
  renderable?: { sprite: SpriteKey };
  blocker?: true;
  health?: { hp: number; max: number };
  ai?: { kind: "hostile"; hasSeenPlayer: boolean };
  combat?: { damageDice: [number, number] }; // [n, sides] — e.g. [1, 6] for 1d6
  /** Attack / defense attributes. Any entity that participates in combat should have this. */
  stats?: { str: number; def: number };
  /** Player-only progression data. */
  experience?: { xp: number; level: number };
  /** XP awarded to the killer when this entity dies. */
  xpReward?: number;
  name?: string;
  /** Tag for the one player entity — systems read this to find "the player". */
  player?: true;
}

export class World {
  private next: EntityId = 1;
  readonly entities = new Map<EntityId, Components>();

  create(c: Components): EntityId {
    const id = this.next++;
    this.entities.set(id, c);
    return id;
  }

  remove(id: EntityId): void {
    this.entities.delete(id);
  }

  get(id: EntityId): Components | undefined {
    return this.entities.get(id);
  }

  clear(): void {
    this.entities.clear();
    this.next = 1;
  }

  /** Find the single player entity, or undefined if none. */
  player(): [EntityId, Components] | undefined {
    for (const [id, c] of this.entities) {
      if (c.player) return [id, c];
    }
    return undefined;
  }

  /** Iterate entities that have *all* of the given component keys. */
  *with<K extends keyof Components>(
    ...keys: K[]
  ): Generator<[EntityId, Required<Pick<Components, K>> & Components]> {
    outer: for (const [id, c] of this.entities) {
      for (const k of keys) if (c[k] === undefined) continue outer;
      yield [id, c as Required<Pick<Components, K>> & Components];
    }
  }

  /** Return the entity (if any) with a `blocker` at the given tile. */
  blockerAt(x: number, y: number): EntityId | undefined {
    for (const [id, c] of this.with("position", "blocker")) {
      if (c.position.x === x && c.position.y === y) return id;
    }
    return undefined;
  }
}
