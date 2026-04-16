import { describe, expect, it } from "vitest";
import { World } from "../src/game/world";
import { createRng } from "../src/game/rng";
import { attack, gainXp, xpForNextLevel } from "../src/game/systems/combat";
import { MessageLog } from "../src/ui/hud";

/** Helper: spawn a minimal attacker entity. */
function spawnAttacker(
  world: World,
  opts: { dice?: [number, number]; str?: number; isPlayer?: boolean },
) {
  return world.create({
    position: { x: 0, y: 0 },
    health: { hp: 20, max: 20 },
    combat: { damageDice: opts.dice ?? [1, 6] },
    stats: { str: opts.str ?? 0, def: 0 },
    ...(opts.isPlayer
      ? { player: true, experience: { xp: 0, level: 1 }, name: "you" }
      : { name: "attacker" }),
  });
}

/** Helper: spawn a minimal target entity. */
function spawnTarget(
  world: World,
  opts: { hp?: number; def?: number; xpReward?: number },
) {
  return world.create({
    position: { x: 1, y: 0 },
    health: { hp: opts.hp ?? 10, max: opts.hp ?? 10 },
    blocker: true,
    stats: { str: 0, def: opts.def ?? 0 },
    ...(opts.xpReward !== undefined ? { xpReward: opts.xpReward } : {}),
    name: "target",
  });
}

// ---------------------------------------------------------------------------
// Damage formula
// ---------------------------------------------------------------------------

describe("attack – damage formula", () => {
  it("adds STR to dice roll", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    // Use [1,1] so dice always roll 1 — isolate STR effect.
    const atk = spawnAttacker(world, { dice: [1, 1], str: 2 });
    const tgt = spawnTarget(world, { hp: 10, def: 0 });

    attack(world, atk, tgt, rng, log);
    // dmg = max(1, 1 + 2 - 0) = 3
    expect(world.get(tgt)!.health!.hp).toBe(7);
  });

  it("subtracts target DEF from damage", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    const atk = spawnAttacker(world, { dice: [1, 1], str: 0 });
    const tgt = spawnTarget(world, { hp: 10, def: 1 });

    attack(world, atk, tgt, rng, log);
    // dmg = max(1, 1 + 0 - 1) = max(1, 0) = 1
    expect(world.get(tgt)!.health!.hp).toBe(9);
  });

  it("floors damage at 1 even when DEF far exceeds roll + STR", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    const atk = spawnAttacker(world, { dice: [1, 1], str: 0 });
    const tgt = spawnTarget(world, { hp: 10, def: 99 });

    attack(world, atk, tgt, rng, log);
    // dmg = max(1, 1 + 0 - 99) = 1
    expect(world.get(tgt)!.health!.hp).toBe(9);
  });

  it("logs the final damage amount", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    const atk = spawnAttacker(world, { dice: [1, 1], str: 3 });
    spawnTarget(world, { hp: 20, def: 1 });

    attack(world, atk, 2, rng, log);
    // dmg = max(1, 1 + 3 - 1) = 3
    expect(log.all().some((m) => m.includes("for 3"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Kill & XP
// ---------------------------------------------------------------------------

describe("attack – kill & XP award", () => {
  it("awards xpReward to the player on kill", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    const atk = spawnAttacker(world, { dice: [1, 6], str: 10, isPlayer: true });
    spawnTarget(world, { hp: 1, def: 0, xpReward: 3 });

    const killed = attack(world, atk, 2, rng, log);
    expect(killed).toBe(true);
    expect(world.get(atk)!.experience!.xp).toBe(3);
  });

  it("does not award XP when attacker has no experience component", () => {
    const world = new World();
    const rng = createRng(42);
    const log = new MessageLog();
    // Non-player attacker (no experience component)
    const atk = spawnAttacker(world, { dice: [1, 6], str: 10 });
    spawnTarget(world, { hp: 1, def: 0, xpReward: 5 });

    attack(world, atk, 2, rng, log);
    // attacker should have no experience field at all
    expect(world.get(atk)!.experience).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// xpForNextLevel
// ---------------------------------------------------------------------------

describe("xpForNextLevel", () => {
  it("returns level * 5", () => {
    expect(xpForNextLevel(1)).toBe(5);
    expect(xpForNextLevel(2)).toBe(10);
    expect(xpForNextLevel(3)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// gainXp / level-up
// ---------------------------------------------------------------------------

describe("gainXp", () => {
  it("accumulates XP without leveling when below threshold", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true });
    const pc = world.get(id)!;

    gainXp(pc, 4, log); // need 5 to level → stays lv 1
    expect(pc.experience!.xp).toBe(4);
    expect(pc.experience!.level).toBe(1);
    expect(log.all().length).toBe(0);
  });

  it("levels up at exactly the threshold", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true });
    const pc = world.get(id)!;

    gainXp(pc, 5, log); // exactly lv1→2 threshold
    expect(pc.experience!.level).toBe(2);
    expect(pc.experience!.xp).toBe(0);
  });

  it("increases STR and DEF by 1 on level-up", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true, str: 2 });
    const pc = world.get(id)!;
    pc.stats!.def = 1; // set initial DEF

    gainXp(pc, 5, log);
    expect(pc.stats!.str).toBe(3);
    expect(pc.stats!.def).toBe(2);
  });

  it("increases max HP by 3 and heals 3 on level-up", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true });
    const pc = world.get(id)!;
    pc.health!.hp = 10; // simulate damage taken

    gainXp(pc, 5, log);
    expect(pc.health!.max).toBe(23);
    expect(pc.health!.hp).toBe(13);
  });

  it("does not overheal past max HP", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true });
    const pc = world.get(id)!;
    // At full HP (20/20), level-up raises max to 23 and heals 3 → should cap at 23.
    gainXp(pc, 5, log);
    expect(pc.health!.hp).toBe(23);
    expect(pc.health!.max).toBe(23);
  });

  it("logs a level-up message", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true });
    const pc = world.get(id)!;

    gainXp(pc, 5, log);
    expect(log.all().some((m) => m.includes("Lv 2"))).toBe(true);
  });

  it("handles multi-level-up in a single XP grant", () => {
    const world = new World();
    const log = new MessageLog();
    const id = spawnAttacker(world, { isPlayer: true, str: 0 });
    const pc = world.get(id)!;

    // lv1→2 costs 5, lv2→3 costs 10 → total 15 to reach lv3
    gainXp(pc, 15, log);
    expect(pc.experience!.level).toBe(3);
    expect(pc.experience!.xp).toBe(0);
    expect(pc.stats!.str).toBe(2); // +1 per level, started at 0
    expect(pc.health!.max).toBe(26); // 20 + 3 + 3
  });
});
