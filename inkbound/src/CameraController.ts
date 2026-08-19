import { GAMEPLAY_HEIGHT, LOGICAL_WIDTH } from './layout';

export class CameraController {
  x = 0;
  y = 0;
  private lookX = 0;

  update(playerX: number, playerY: number, facing: -1 | 1, dt: number) {
    const desiredLook = facing * 45;
    this.lookX += (desiredLook - this.lookX) * Math.min(1, dt * 5);

    const targetScreenX = LOGICAL_WIDTH / 2 - this.lookX;
    const screenX = playerX - this.x;
    const deadX = 50;
    if (screenX > targetScreenX + deadX) this.x = playerX - (targetScreenX + deadX);
    if (screenX < targetScreenX - deadX) this.x = playerX - (targetScreenX - deadX);

    const targetScreenY = GAMEPLAY_HEIGHT * 0.58;
    const screenY = playerY - this.y;
    const deadY = 70;
    if (screenY > targetScreenY + deadY) this.y = playerY - (targetScreenY + deadY);
    if (screenY < targetScreenY - deadY) this.y = playerY - (targetScreenY - deadY);

    this.x = Math.max(0, Math.min(1380 - LOGICAL_WIDTH, this.x));
    this.y = Math.max(0, Math.min(760 - GAMEPLAY_HEIGHT, this.y));
  }
}
