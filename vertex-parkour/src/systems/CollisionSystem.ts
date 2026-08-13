import type { GameEventQueue } from '../domain/events';
import { PLAYER_FEET_OFFSET, applyBreakableSmash, applyCrystalPickup, applyDroneKill, applyHit, applyLanding, applyWallContact, clearWallContact, type GameState } from '../domain/gameState';
import type { WorldState } from '../world/WorldState';

const LANDING_EDGE_ASSIST = 12;

export type CollisionResult = { state: GameState; invulnerable: number };

export class CollisionSystem {
  update(state: GameState, previousPlayerY: number, world: WorldState, cameraOffset: number, invulnerable: number, events: GameEventQueue): CollisionResult {
    let next = state;
    let nextInvulnerable = invulnerable;
    const previousFeet = previousPlayerY + PLAYER_FEET_OFFSET;

    if (next.velocityY >= 0 && next.landingTime <= 0) {
      const nextFeet = next.playerY + PLAYER_FEET_OFFSET;
      for (const platform of world.platforms) {
        if (Math.abs(next.playerX - platform.x) <= platform.width / 2 + LANDING_EDGE_ASSIST && previousFeet <= platform.y + 4 && nextFeet >= platform.y - 2) {
          next = applyLanding(next, platform.y);
          events.emit({ type: 'landed', x: next.playerX, y: next.playerY + cameraOffset });
          break;
        }
      }
    }

    let touchingWall = false;
    if (next.wallJumpLock <= 0) {
      for (const wall of world.walls) {
        if (Math.abs(next.playerY - wall.y) <= wall.height / 2 + 20 && Math.abs(next.playerX - wall.x) <= 18) {
          next = applyWallContact(next, wall.side, wall.x); touchingWall = true; break;
        }
      }
    }
    if (!touchingWall) next = clearWallContact(next);

    for (const crystal of world.crystals) {
      if (!crystal.taken && Math.abs(next.playerX - crystal.x) < 24 && Math.abs(next.playerY - crystal.y) < 32) {
        crystal.taken = true; next = applyCrystalPickup(next); events.emit({ type: 'crystal-picked', x: crystal.x, y: crystal.y + cameraOffset });
      }
    }

    for (const breakable of world.breakables) {
      if (breakable.destroyed || Math.abs(next.playerX - breakable.x) > breakable.width / 2 + 10 || Math.abs(next.playerY - breakable.y) > breakable.height / 2 + 18) continue;
      if (next.dashTime > 0 && !next.dashReady) {
        breakable.destroyed = true;
        next = applyBreakableSmash(next);
        events.emit({ type: 'breakable-smashed', x: breakable.x, y: breakable.y + cameraOffset });
      } else if (nextInvulnerable <= 0) {
        nextInvulnerable = 0.9; next = applyHit(next); events.emit({ type: 'player-hit', x: next.playerX, y: next.playerY + cameraOffset });
      }
    }

    for (const drone of world.drones) {
      if (drone.destroyed || Math.hypot(next.playerX - drone.x, next.playerY - drone.y) >= 28) continue;
      if (next.dashTime > 0 && !next.dashReady) {
        drone.destroyed = true; next = applyDroneKill(next); events.emit({ type: 'drone-killed', x: drone.x, y: drone.y + cameraOffset });
      } else if (nextInvulnerable <= 0) {
        nextInvulnerable = 0.9; next = applyHit(next); events.emit({ type: 'player-hit', x: next.playerX, y: next.playerY + cameraOffset });
      }
    }

    if (nextInvulnerable <= 0) {
      for (const spike of world.spikes) {
        const feet = next.playerY + PLAYER_FEET_OFFSET;
        if (Math.abs(next.playerX - spike.x) <= spike.width / 2 + 7 && feet >= spike.y - 13 && feet <= spike.y + 9) {
          nextInvulnerable = 0.9; next = applyHit(next); events.emit({ type: 'player-hit', x: next.playerX, y: next.playerY + cameraOffset }); break;
        }
      }
    }

    if (nextInvulnerable <= 0) {
      for (const hazard of world.hazards) {
        if (!hazard.hit && Math.hypot(next.playerX - hazard.x, next.playerY - hazard.y) < 25) {
          hazard.hit = true; nextInvulnerable = 0.9; next = applyHit(next); events.emit({ type: 'player-hit', x: next.playerX, y: next.playerY + cameraOffset }); break;
        }
      }
    }

    return { state: next, invulnerable: nextInvulnerable };
  }
}
