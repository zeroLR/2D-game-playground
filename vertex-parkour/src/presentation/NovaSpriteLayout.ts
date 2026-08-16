import { PLAYER_FEET_OFFSET } from '../domain/gameState';

export const NOVA_FRAME_SCALE = 0.5;
export const NOVA_ART_FOOT_Y = 232;

/** Gameplay playerY is the body origin, while the PNG uses an authored foot baseline. */
export const NOVA_SPRITE_Y_OFFSET = PLAYER_FEET_OFFSET - NOVA_ART_FOOT_Y * NOVA_FRAME_SCALE;
