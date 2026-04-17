import { ENEMY_SEEK_ACCEL } from "../config";
import type { EntityId, World } from "../world";

// Enemies seek the avatar. Circle/square go straight; star adds lateral wobble;
// boss moves slowly with the same seek. All use accel-capped steering so they
// don't teleport and feel bouncy when knocked off path.

export function updateEnemyAi(world: World, avatarId: EntityId, dt: number): void {
  const avatar = world.get(avatarId);
  if (!avatar || !avatar.pos) return;
  const ax = avatar.pos.x;
  const ay = avatar.pos.y;
  for (const [, c] of world.with("enemy", "pos", "vel")) {
    const p = c.pos!;
    const v = c.vel!;
    const e = c.enemy!;

    let dx = ax - p.x;
    let dy = ay - p.y;
    const dist = Math.hypot(dx, dy) || 1;
    let nx = dx / dist;
    let ny = dy / dist;

    if (e.kind === "star") {
      // Lateral wobble: perpendicular sine added to direction.
      e.wobblePhase += dt * 3.2;
      const wob = Math.sin(e.wobblePhase) * 0.7;
      const px = -ny;
      const py = nx;
      nx += px * wob;
      ny += py * wob;
      const len = Math.hypot(nx, ny) || 1;
      nx /= len; ny /= len;
    }

    const targetVx = nx * e.maxSpeed;
    const targetVy = ny * e.maxSpeed;
    const dvx = targetVx - v.x;
    const dvy = targetVy - v.y;
    const dvLen = Math.hypot(dvx, dvy);
    const maxStep = ENEMY_SEEK_ACCEL * dt;
    if (dvLen <= maxStep) {
      v.x = targetVx;
      v.y = targetVy;
    } else {
      v.x += (dvx / dvLen) * maxStep;
      v.y += (dvy / dvLen) * maxStep;
    }
    p.x += v.x * dt;
    p.y += v.y * dt;
  }
}
