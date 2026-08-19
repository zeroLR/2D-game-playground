import type { Rect } from './movement';

export interface Combatant { x: number; y: number; hp: number; hurtTime: number; knockbackX: number }
export interface AttackState { time: number; cooldown: number; hitIds: Set<number> }

export const ATTACK_DURATION = 0.22;
export const ATTACK_ACTIVE_START = 0.055;
export const ATTACK_ACTIVE_END = 0.14;
export const ATTACK_COOLDOWN = 0.28;
export const HIT_STOP = 0.055;

export function createAttackState(): AttackState { return { time: 0, cooldown: 0, hitIds: new Set() }; }

export function startAttack(state: AttackState) {
  if (state.time > 0 || state.cooldown > 0) return false;
  state.time = ATTACK_DURATION;
  state.cooldown = ATTACK_COOLDOWN;
  state.hitIds.clear();
  return true;
}

export function stepAttack(state: AttackState, dt: number) {
  state.time = Math.max(0, state.time - dt);
  state.cooldown = Math.max(0, state.cooldown - dt);
}

export function attackProgress(state: AttackState) { return state.time <= 0 ? 1 : 1 - state.time / ATTACK_DURATION; }
export function isAttackActive(state: AttackState) {
  const elapsed = ATTACK_DURATION - state.time;
  return state.time > 0 && elapsed >= ATTACK_ACTIVE_START && elapsed <= ATTACK_ACTIVE_END;
}

export function playerAttackHitbox(x: number, y: number, facing: -1 | 1): Rect {
  return { x: facing > 0 ? x + 8 : x - 62, y: y - 50, width: 54, height: 48 };
}

export function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
