export class CameraSystem {
  private offset = 0;
  private velocity = 0;

  constructor(
    private readonly deadZoneY = 330,
    private readonly spring = 42,
    private readonly damping = 11,
  ) {}

  reset() {
    this.offset = 0;
    this.velocity = 0;
  }

  update(playerY: number, deltaSeconds: number) {
    const playerScreenY = playerY + this.offset;
    const targetOffset = playerScreenY < this.deadZoneY ? this.deadZoneY - playerY : this.offset;
    const acceleration = (targetOffset - this.offset) * this.spring - this.velocity * this.damping;
    this.velocity += acceleration * deltaSeconds;
    this.offset = Math.max(this.offset, this.offset + this.velocity * deltaSeconds);
    if (this.velocity < 0) this.velocity = 0;
    return this.offset;
  }

  getOffset() {
    return this.offset;
  }
}
