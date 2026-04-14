import * as ROT from "rot-js";

import type { Rng } from "../rng";
import { Tile } from "./tiles";
import { TileMap } from "./tilemap";

export interface GeneratedLevel {
  map: TileMap;
  /** Center of room #0 — where the player spawns. */
  spawn: { x: number; y: number };
  /** Furthest room (by BFS path length) from the spawn. */
  stairs: { x: number; y: number };
  /** Centers of all rooms — handy for spawning enemies. */
  roomCenters: { x: number; y: number }[];
}

// generateLevel body is adapted from .claude/skills/game-systems/SKILL.md:167-175,
// plus the connectivity BFS guard the same skill warns about on line 177.
export function generateLevel(rng: Rng, width: number, height: number): GeneratedLevel {
  // Up to 20 attempts; each time, reseed rot-js from our RNG so the result
  // stays deterministic for a given game seed.
  for (let attempt = 0; attempt < 20; attempt++) {
    ROT.RNG.setSeed(Math.floor(rng() * 2 ** 31));
    const digger = new ROT.Map.Digger(width, height, {
      roomWidth: [4, 8],
      roomHeight: [3, 6],
      dugPercentage: 0.25,
    });
    const map = new TileMap(width, height, Tile.Wall);
    digger.create((x, y, wall) => {
      map.set(x, y, wall ? Tile.Wall : Tile.Floor);
    });

    const rooms = digger.getRooms();
    if (rooms.length < 3) continue;

    const roomCenters = rooms.map((r) => {
      const [x, y] = r.getCenter();
      return { x, y };
    });
    const spawn = roomCenters[0];

    const dist = bfsDistances(map, spawn);
    if (!allFloorReachable(map, dist)) continue;

    // Stairs go in the room whose center is farthest (by path length) from spawn.
    let stairs = roomCenters[0];
    let best = -1;
    for (const c of roomCenters) {
      const d = dist[c.y * map.width + c.x];
      if (d > best) {
        best = d;
        stairs = c;
      }
    }
    map.set(stairs.x, stairs.y, Tile.Stairs);

    return { map, spawn, stairs, roomCenters };
  }

  throw new Error("generateLevel: could not produce a connected level after 20 attempts");
}

/**
 * Breadth-first search over floor tiles starting from `origin`.
 * Returns an `Int32Array` the size of the map; unreachable cells stay -1.
 */
function bfsDistances(map: TileMap, origin: { x: number; y: number }): Int32Array {
  const dist = new Int32Array(map.width * map.height).fill(-1);
  const queue: number[] = [];
  const idx = (x: number, y: number) => y * map.width + x;

  dist[idx(origin.x, origin.y)] = 0;
  queue.push(origin.x, origin.y);

  while (queue.length > 0) {
    const x = queue.shift()!;
    const y = queue.shift()!;
    const d = dist[idx(x, y)];
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (!map.inBounds(nx, ny)) continue;
      if (map.info(nx, ny).blocksMove) continue;
      if (dist[idx(nx, ny)] !== -1) continue;
      dist[idx(nx, ny)] = d + 1;
      queue.push(nx, ny);
    }
  }
  return dist;
}

function allFloorReachable(map: TileMap, dist: Int32Array): boolean {
  for (const [x, y, t] of map.cells()) {
    if (t === Tile.Wall) continue;
    if (dist[y * map.width + x] === -1) return false;
  }
  return true;
}

const NEIGHBOURS: readonly [number, number][] = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];
