import type { Rect } from './movement';

export const PLAYER_MAX_HP = 5;
export const PLAYER_INVULNERABILITY = 0.85;
export const PLAYER_HURT_KNOCKBACK = 145;

export interface PlayerCombatState {
  hp: number;
  invulnerability: number;
  dead: boolean;
}

export function createPlayerCombatState(): PlayerCombatState {
  return { hp: PLAYER_MAX_HP, invulnerability: 0, dead: false };
}

export function stepPlayerCombat(state: PlayerCombatState, dt: number) {
  state.invulnerability = Math.max(0, state.invulnerability - dt);
}

export function damagePlayer(state: PlayerCombatState) {
  if (state.dead || state.invulnerability > 0) return false;
  state.hp = Math.max(0, state.hp - 1);
  state.invulnerability = PLAYER_INVULNERABILITY;
  state.dead = state.hp <= 0;
  return true;
}

export function playerHurtbox(x: number, y: number): Rect {
  return { x: x - 10, y: y - 43, width: 20, height: 42 };
}

export function resetPlayerCombat(state: PlayerCombatState) {
  state.hp = PLAYER_MAX_HP;
  state.invulnerability = 0;
  state.dead = false;
}
