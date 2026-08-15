import { describe, expect, it } from 'vitest';
import { GameEventQueue } from '../src/domain/events';
import { createInitialState } from '../src/domain/gameState';
import { CollisionSystem } from '../src/systems/CollisionSystem';
import { ROUTE_ZONE_HALF_HEIGHT, ROUTE_ZONE_HALF_WIDTH } from '../src/world/RouteChoice';
import { WorldState } from '../src/world/WorldState';

function createRouteWorld() {
  const world = new WorldState();
  world.addSpawn({ type: 'route', x: 82, y: 400, kind: 'treasure', choiceId: 1 });
  world.addSpawn({ type: 'route', x: 278, y: 400, kind: 'elite', choiceId: 1 });
  return world;
}

describe('Route choice zones', () => {
  it('commits a route anywhere inside the large half-screen zone', () => {
    const world = createRouteWorld();
    const state = { ...createInitialState(), playerX: 82 + ROUTE_ZONE_HALF_WIDTH - 2, playerY: 400 + ROUTE_ZONE_HALF_HEIGHT - 2, velocityY: 0 };
    new CollisionSystem().update(state, state.playerY, world, 0, 0, new GameEventQueue());

    expect(world.routes[0]).toMatchObject({ taken: true, locked: false });
    expect(world.routes[1]).toMatchObject({ taken: false, locked: true });
    expect(world.consumePendingRoute()).toBe('treasure');
  });

  it('does not commit before the player enters either zone', () => {
    const world = createRouteWorld();
    const state = { ...createInitialState(), playerX: 180, playerY: 400 - ROUTE_ZONE_HALF_HEIGHT - 12, velocityY: 0 };
    new CollisionSystem().update(state, state.playerY, world, 0, 0, new GameEventQueue());

    expect(world.routes.every((route) => !route.taken && !route.locked)).toBe(true);
    expect(world.consumePendingRoute()).toBeNull();
  });
});
