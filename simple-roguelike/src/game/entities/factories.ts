import type { EntityId, World } from "../world";

export function spawnPlayer(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "player" },
    blocker: true,
    health: { hp: 20, max: 20 },
    combat: { damageDice: [1, 6] },
    name: "you",
    player: true,
  });
}

export function spawnGoblin(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "goblin" },
    blocker: true,
    health: { hp: 5, max: 5 },
    combat: { damageDice: [1, 3] },
    ai: { kind: "hostile", hasSeenPlayer: false },
    name: "the goblin",
  });
}
