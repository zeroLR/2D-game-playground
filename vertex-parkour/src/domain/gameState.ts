import { DEFAULT_DEV_TUNING, type DevTuning } from '../dev/DevTuning';
import { applySkillLevel, createEmptySkillLevels, type SkillId, type SkillLevels } from './skills';
import { hasSynergy } from './synergies';

export type Vec2 = { x: number; y: number };
export const PLAYER_FEET_OFFSET = 24;
export const AUTO_JUMP_VELOCITY = -540;
export const RISE_GRAVITY = 1080;
export const FALL_GRAVITY = 1500;
export const APEX_GRAVITY = 620;
export const APEX_SPEED = 75;
export const MAX_FALL_SPEED = 820;
export const MIN_DASH_SPEED = 520;
export const MAX_DASH_SPEED = 760;
export const DASH_SPEED = MAX_DASH_SPEED;
export const DASH_DURATION = 0.13;
export const DASH_DRAG = 10;
export const MIN_DASH_STRENGTH = 0.35;
export const AIR_NUDGE_SPEED = 285;
export const AIR_NUDGE_DURATION = 0.085;
export const LANDING_DELAY = 0.06;
export const WALL_SLIDE_SPEED = 105;
export const WALL_JUMP_VELOCITY_X = 390;
export const WALL_JUMP_VELOCITY_Y = -455;
export const WALL_JUMP_LOCK = 0.11;
export const DRONE_BOUNCE_VELOCITY = -360;
export const CRYSTAL_LIFT_VELOCITY = -250;
export const MAX_AUTO_JUMP_RISE = (AUTO_JUMP_VELOCITY * AUTO_JUMP_VELOCITY) / (2 * RISE_GRAVITY);
export const FLOW_RUSH_THRESHOLD = 6;
export const FLOW_OVERDRIVE_THRESHOLD = 9;
export const FLOW_RUSH_HIT_FLOOR = 3;
export const FLOW_OVERDRIVE_HIT_FLOOR = 5;
export const DASH_UPGRADE_SPEED_MULTIPLIER = 1.1;
export const REBOUND_JUMP_MULTIPLIER = 1.08;
export const KILL_REFUND_FLOW_BONUS = 0.6;
export const MOMENTUM_LOOP_FLOW_BONUS = 0.25;
export const PREDATOR_RHYTHM_JUMP_MULTIPLIER = 1.12;

export type UpgradeKind = 'dash' | 'flow';
export type GameState = {
  playerX: number; playerY: number; velocityX: number; velocityY: number;
  dashTime: number; dashReady: boolean; landingTime: number;
  wallSide: -1 | 0 | 1; wallJumpLock: number;
  score: number; flow: number; hp: number; elapsed: number; speed: number; gameOver: boolean;
  dashUpgradeLevel: number; flowUpgradeLevel: number;
  skills: SkillLevels;
  predatorRhythmReady: boolean;
};

export const createInitialState = (tuning: DevTuning = DEFAULT_DEV_TUNING): GameState => ({
  playerX: 180, playerY: 578, velocityX: 0, velocityY: AUTO_JUMP_VELOCITY * tuning.jumpPower,
  dashTime: 0, dashReady: true, landingTime: 0, wallSide: 0, wallJumpLock: 0,
  score: 0, flow: 1, hp: 3, elapsed: 0, speed: 0, gameOver: false,
  dashUpgradeLevel: 0, flowUpgradeLevel: 0, skills: createEmptySkillLevels(), predatorRhythmReady: false,
});

export function tickState(state: GameState, deltaSeconds: number, tuning: DevTuning = DEFAULT_DEV_TUNING): GameState {
  if (state.gameOver) return state;
  const elapsed = state.elapsed + deltaSeconds;
  const verticalDelta = deltaSeconds * tuning.jumpSpeed;
  const landingTime = Math.max(0, state.landingTime - verticalDelta);
  const wallJumpLock = Math.max(0, state.wallJumpLock - deltaSeconds);
  let velocityY = state.velocityY; let playerY = state.playerY; let predatorRhythmReady = state.predatorRhythmReady;
  if (state.landingTime > 0) {
    if (landingTime <= 0) {
      const rebound = Math.pow(REBOUND_JUMP_MULTIPLIER, state.skills.rebound);
      const predator = state.predatorRhythmReady ? PREDATOR_RHYTHM_JUMP_MULTIPLIER : 1;
      velocityY = AUTO_JUMP_VELOCITY * tuning.jumpPower * rebound * predator;
      predatorRhythmReady = false;
    } else velocityY = 0;
  } else {
    const gravity = Math.abs(velocityY) <= APEX_SPEED ? APEX_GRAVITY : velocityY < 0 ? RISE_GRAVITY : FALL_GRAVITY;
    velocityY = Math.min(MAX_FALL_SPEED, velocityY + gravity * verticalDelta);
    if (state.wallSide !== 0 && velocityY > WALL_SLIDE_SPEED) velocityY = WALL_SLIDE_SPEED;
    playerY += velocityY * verticalDelta;
  }
  const dashTime = Math.max(0, state.dashTime - deltaSeconds);
  const velocityX = dashTime > 0 || wallJumpLock > 0 ? state.velocityX : state.velocityX * Math.max(0, 1 - DASH_DRAG * deltaSeconds);
  const playerX = Math.max(52, Math.min(308, state.playerX + velocityX * deltaSeconds));
  const climbed = Math.max(0, state.playerY - playerY);
  return { ...state, elapsed, playerX, playerY, velocityX, velocityY, dashTime, landingTime, wallJumpLock, predatorRhythmReady, speed: Math.hypot(velocityX, velocityY), score: state.score + climbed * Math.max(1, state.flow) };
}

export function applyLanding(state: GameState, platformY: number): GameState { if (state.gameOver) return state; return { ...state, playerY: platformY - PLAYER_FEET_OFFSET, velocityY: 0, landingTime: LANDING_DELAY, dashReady: true, wallSide: 0, flow: Math.min(12, state.flow + 0.25) }; }
export function applyWallContact(state: GameState, side: -1 | 1, wallX: number): GameState { if (state.gameOver || state.wallJumpLock > 0) return state; return { ...state, playerX: wallX - side * 14, velocityX: 0, velocityY: Math.min(state.velocityY, WALL_SLIDE_SPEED), wallSide: side, dashReady: true }; }
export function clearWallContact(state: GameState): GameState { return state.wallSide === 0 ? state : { ...state, wallSide: 0 }; }
export function applyWallJump(state: GameState, tuning: DevTuning = DEFAULT_DEV_TUNING): GameState { if (state.gameOver || state.wallSide === 0) return state; const direction = (state.wallSide * -1) as -1 | 1; return { ...state, velocityX: direction * WALL_JUMP_VELOCITY_X, velocityY: WALL_JUMP_VELOCITY_Y * tuning.jumpPower, dashTime: 0, dashReady: true, wallSide: 0, wallJumpLock: WALL_JUMP_LOCK, flow: Math.min(12, state.flow + 0.45) }; }
export function applyAirNudge(state: GameState, direction: -1 | 1, strength = 1): GameState { if (state.gameOver) return state; const clamped = Math.max(0.45, Math.min(1, strength)); return { ...state, velocityX: direction * AIR_NUDGE_SPEED * clamped, dashTime: AIR_NUDGE_DURATION }; }
export function applyDash(state: GameState, direction: -1 | 1, strength = 1, tuning: DevTuning = DEFAULT_DEV_TUNING): GameState { if (state.gameOver || !state.dashReady) return state; const clampedStrength = Math.max(MIN_DASH_STRENGTH, Math.min(1, strength)); const baseDashSpeed = MIN_DASH_SPEED + (MAX_DASH_SPEED - MIN_DASH_SPEED) * clampedStrength; const dashLevel = state.dashUpgradeLevel + state.skills['phase-dash']; const dashSpeed = baseDashSpeed * Math.pow(DASH_UPGRADE_SPEED_MULTIPLIER, dashLevel) * tuning.dashPower; const synergyFlow = hasSynergy(state.skills, 'momentum-loop') ? MOMENTUM_LOOP_FLOW_BONUS : 0; return { ...state, velocityX: direction * dashSpeed, dashTime: DASH_DURATION, dashReady: false, wallSide: 0, velocityY: Math.min(state.velocityY, 25), flow: Math.min(12, state.flow + 0.6 + synergyFlow) }; }
export function applyCrystalPickup(state: GameState): GameState { if (state.gameOver) return state; return { ...state, dashReady: true, velocityY: Math.min(state.velocityY, CRYSTAL_LIFT_VELOCITY), score: state.score + 250, flow: Math.min(12, state.flow + 1.4) }; }
export function applyDroneKill(state: GameState): GameState { if (state.gameOver) return state; return { ...state, dashReady: true, velocityY: Math.min(state.velocityY, DRONE_BOUNCE_VELOCITY), score: state.score + 400, flow: Math.min(12, state.flow + 1.8 + state.skills['kill-refund'] * KILL_REFUND_FLOW_BONUS), predatorRhythmReady: hasSynergy(state.skills, 'predator-rhythm') || state.predatorRhythmReady }; }
export function applyUpgrade(state: GameState, kind: UpgradeKind): GameState { return kind === 'dash' ? { ...state, dashUpgradeLevel: state.dashUpgradeLevel + 1 } : { ...state, flowUpgradeLevel: state.flowUpgradeLevel + 1 }; }
export function applySkill(state: GameState, id: SkillId): GameState { return { ...state, skills: applySkillLevel(state.skills, id) }; }
export function getFlowAfterHit(flow: number) { if (flow >= FLOW_OVERDRIVE_THRESHOLD) return FLOW_OVERDRIVE_HIT_FLOOR; if (flow >= FLOW_RUSH_THRESHOLD) return FLOW_RUSH_HIT_FLOOR; return 1; }
export function applyHit(state: GameState): GameState { const hp = state.hp - 1; return { ...state, hp, flow: getFlowAfterHit(state.flow), gameOver: hp <= 0 }; }
