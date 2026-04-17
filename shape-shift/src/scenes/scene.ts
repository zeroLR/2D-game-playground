import type { Container } from "pixi.js";

// Minimal scene stack. `enter/exit` toggle the scene's Pixi container visibility
// and let the scene wire/unwire its DOM overlay. `update` runs only on the top
// scene; `render` draws every active scene so overlays can sit on frozen play.

export interface Scene {
  readonly root: Container;
  enter?(): void;
  exit?(): void;
  update(dt: number): void;
  render(alpha: number): void;
}

export class SceneStack {
  private readonly stack: Scene[] = [];

  push(s: Scene): void {
    this.stack[this.stack.length - 1]?.exit?.();
    this.stack.push(s);
    s.root.visible = true;
    s.enter?.();
  }

  pop(): void {
    const s = this.stack.pop();
    s?.exit?.();
    if (s) s.root.visible = false;
    this.stack[this.stack.length - 1]?.enter?.();
  }

  replace(s: Scene): void {
    this.pop();
    this.push(s);
  }

  top(): Scene | undefined {
    return this.stack[this.stack.length - 1];
  }

  update(dt: number): void {
    this.top()?.update(dt);
  }

  render(alpha: number): void {
    for (const s of this.stack) s.render(alpha);
  }
}
