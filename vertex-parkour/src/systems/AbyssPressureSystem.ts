export const ABYSS_BASE_Y = 650;
export const ABYSS_MAX_RISE = 150;
export const ABYSS_APPROACH_SPEED = 18;
export const ABYSS_RECOVERY_SPEED = 34;
export const ABYSS_PROGRESS_EPSILON = 2;

export class AbyssPressureSystem {
  private rise = 0;
  private bestPlayerY = Number.POSITIVE_INFINITY;

  reset() {
    this.rise = 0;
    this.bestPlayerY = Number.POSITIVE_INFINITY;
  }

  update(playerY: number, dt: number) {
    const madeProgress = playerY < this.bestPlayerY - ABYSS_PROGRESS_EPSILON;
    if (madeProgress) {
      this.bestPlayerY = playerY;
      this.rise = Math.max(0, this.rise - ABYSS_RECOVERY_SPEED * dt);
    } else {
      this.rise = Math.min(ABYSS_MAX_RISE, this.rise + ABYSS_APPROACH_SPEED * dt);
    }
    return this.getBoundaryY();
  }

  getBoundaryY() {
    return ABYSS_BASE_Y - this.rise;
  }

  isCaught(screenPlayerY: number) {
    return screenPlayerY >= this.getBoundaryY();
  }
}
