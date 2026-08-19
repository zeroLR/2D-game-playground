export type ActionName = 'attack' | 'dash' | 'ink';

export interface InputSnapshot {
  moveX: number;
  moveY: number;
  attack: boolean;
  dash: boolean;
  ink: boolean;
}

export class InputState {
  moveX = 0;
  moveY = 0;
  attack = false;
  dash = false;
  ink = false;

  setMove(x: number, y: number) {
    this.moveX = Math.max(-1, Math.min(1, x));
    this.moveY = Math.max(-1, Math.min(1, y));
  }

  setAction(action: ActionName, pressed: boolean) {
    this[action] = pressed;
  }

  snapshot(): InputSnapshot {
    return { moveX: this.moveX, moveY: this.moveY, attack: this.attack, dash: this.dash, ink: this.ink };
  }
}
