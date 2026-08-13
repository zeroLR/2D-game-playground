export interface InputActions {
  left: boolean;
  right: boolean;
  jump: boolean;
  fire: boolean;
}

export interface InputCallbacks {
  selectTower(index: 0 | 1): void;
  build(): void;
  restart(): void;
}

export class KeyboardInput {
  private readonly keys = new Set<string>();

  constructor(private readonly callbacks: InputCallbacks) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  get actions(): InputActions {
    return {
      left: this.keys.has('KeyA') || this.keys.has('ArrowLeft'),
      right: this.keys.has('KeyD') || this.keys.has('ArrowRight'),
      jump: this.keys.has('KeyW') || this.keys.has('ArrowUp') || this.keys.has('Space'),
      fire: this.keys.has('KeyJ') || this.keys.has('KeyK'),
    };
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    this.keys.add(event.code);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code === 'Digit1') this.callbacks.selectTower(0);
    if (event.code === 'Digit2') this.callbacks.selectTower(1);
    if (event.code === 'KeyB') this.callbacks.build();
    if (event.code === 'KeyR') this.callbacks.restart();
  };

  private readonly onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
  };
}
