export class CameraSystem {
  private offset = 0;
  private velocity = 0;

  constructor(
    private readonly upperDeadZoneY = 330,
    private readonly lowerRescueZoneY = 570,
    private readonly upwardSpring = 42,
    private readonly downwardSpring = 22,
    private readonly damping = 11,
    private readonly maxDownwardSpeed = 260,
  ) {}

  reset() {
    this.offset = 0;
    this.velocity = 0;
  }

  update(playerY: number, deltaSeconds: number) {
    const playerScreenY = playerY + this.offset;

    let targetOffset = this.offset;
    let spring = this.upwardSpring;

    if (playerScreenY < this.upperDeadZoneY) {
      targetOffset = this.upperDeadZoneY - playerY;
      spring = this.upwardSpring;
    } else if (playerScreenY > this.lowerRescueZoneY) {
      targetOffset = this.lowerRescueZoneY - playerY;
      spring = this.downwardSpring;
    }

    const acceleration = (targetOffset - this.offset) * spring - this.velocity * this.damping;
    this.velocity += acceleration * deltaSeconds;
    this.velocity = Math.max(-this.maxDownwardSpeed, this.velocity);
    this.offset += this.velocity * deltaSeconds;

    if (Math.abs(targetOffset - this.offset) < 0.05 && Math.abs(this.velocity) < 0.05) {
      this.offset = targetOffset;
      this.velocity = 0;
    }

    return this.offset;
  }

  getOffset() {
    return this.offset;
  }
}
