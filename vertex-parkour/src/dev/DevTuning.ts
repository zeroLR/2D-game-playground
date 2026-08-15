export type DevTuning = {
  invincible: boolean;
  jumpPower: number;
  dashPower: number;
  jumpSpeed: number;
};

export const DEFAULT_DEV_TUNING: DevTuning = {
  invincible: false,
  jumpPower: 1,
  dashPower: 1,
  jumpSpeed: 1,
};

export function clampDevTuning(value: DevTuning): DevTuning {
  return {
    invincible: value.invincible,
    jumpPower: Math.max(0.5, Math.min(3, value.jumpPower)),
    dashPower: Math.max(0.5, Math.min(3, value.dashPower)),
    jumpSpeed: Math.max(0.5, Math.min(2.5, value.jumpSpeed)),
  };
}
