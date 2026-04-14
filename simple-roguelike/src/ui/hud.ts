/**
 * Tiny DOM-based HUD. We render the sprite grid with PIXI; the status line
 * and message log are just HTML elements under the canvas.
 */

const LOG_LIMIT = 6;

export class MessageLog {
  private items: string[] = [];

  push(msg: string): void {
    this.items.push(msg);
    if (this.items.length > LOG_LIMIT) {
      this.items = this.items.slice(-LOG_LIMIT);
    }
  }

  clear(): void {
    this.items = [];
  }

  all(): readonly string[] {
    return this.items;
  }
}

export interface HudState {
  hp: number;
  maxHp: number;
  seed: number;
  status: "alive" | "dead" | "escaped";
}

export class Hud {
  private readonly statusEl: HTMLElement;
  private readonly logEl: HTMLElement;

  constructor(statusEl: HTMLElement, logEl: HTMLElement) {
    this.statusEl = statusEl;
    this.logEl = logEl;
  }

  render(state: HudState, log: MessageLog): void {
    let trailer = "";
    if (state.status === "dead") trailer = " · YOU DIED — press r to restart";
    if (state.status === "escaped") trailer = " · YOU ESCAPED — press r for a new run";
    this.statusEl.textContent =
      `HP: ${state.hp}/${state.maxHp} · Seed: ${state.seed}${trailer}`;

    // Rebuild the log as a simple <ul> of <li>s. Newest last.
    this.logEl.textContent = "";
    for (const line of log.all()) {
      const li = document.createElement("li");
      li.textContent = line;
      this.logEl.appendChild(li);
    }
  }
}
