export const ABYSS_START_WORLD_Y = 650;
export const ABYSS_APPROACH_SPEED = 18;

export class AbyssPressureSystem {
  private worldY = ABYSS_START_WORLD_Y;

  reset() {
    this.worldY = ABYSS_START_WORLD_Y;
  }

  update(dt: number) {
    this.worldY -= ABYSS_APPROACH_SPEED * dt;
    return this.worldY;
  }

  getWorldY() {
    return this.worldY;
  }

  getScreenY(cameraOffset: number) {
    return this.worldY + cameraOffset;
  }

  isCaught(playerWorldY: number) {
    return playerWorldY >= this.worldY;
  }
}
