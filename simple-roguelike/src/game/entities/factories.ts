import type { EntityId, World } from "../world";

export function spawnPlayer(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "player" },
    blocker: true,
    health: { hp: 20, max: 20 },
    combat: { damageDice: [1, 6] },
    stats: { str: 2, def: 1 },
    experience: { xp: 0, level: 1 },
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
    stats: { str: 0, def: 0 },
    xpReward: 3,
    ai: { kind: "hostile", hasSeenPlayer: false },
    name: "the goblin",
  });
}

export function spawnRat(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "rat" },
    blocker: true,
    health: { hp: 3, max: 3 },
    combat: { damageDice: [1, 2] },
    stats: { str: 0, def: 0 },
    xpReward: 1,
    ai: { kind: "hostile", hasSeenPlayer: false },
    name: "the rat",
  });
}

export function spawnOrc(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "orc" },
    blocker: true,
    health: { hp: 9, max: 9 },
    combat: { damageDice: [1, 4] },
    stats: { str: 2, def: 1 },
    xpReward: 6,
    ai: { kind: "hostile", hasSeenPlayer: false },
    name: "the orc",
  });
}

export function spawnTroll(world: World, x: number, y: number): EntityId {
  return world.create({
    position: { x, y },
    renderable: { sprite: "troll" },
    blocker: true,
    health: { hp: 18, max: 18 },
    combat: { damageDice: [2, 4] },
    stats: { str: 4, def: 2 },
    xpReward: 15,
    ai: { kind: "hostile", hasSeenPlayer: false },
    name: "the troll",
  });
}
