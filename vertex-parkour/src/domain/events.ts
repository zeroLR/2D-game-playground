export type Direction = -1 | 1;

export type GameEvent =
  | { type: 'dash-started'; x: number; y: number; direction: Direction; strength: number }
  | { type: 'landed'; x: number; y: number }
  | { type: 'wall-jumped'; x: number; y: number; direction: Direction }
  | { type: 'crystal-picked'; x: number; y: number }
  | { type: 'drone-killed'; x: number; y: number }
  | { type: 'player-hit'; x: number; y: number }
  | { type: 'flow-tier-entered'; x: number; y: number; tier: 'rush' | 'overdrive' };

export class GameEventQueue {
  private readonly events: GameEvent[] = [];

  emit(event: GameEvent) {
    this.events.push(event);
  }

  drain(): GameEvent[] {
    return this.events.splice(0, this.events.length);
  }

  clear() {
    this.events.length = 0;
  }
}
