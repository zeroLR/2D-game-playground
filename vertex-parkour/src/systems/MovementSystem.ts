import { DEFAULT_DEV_TUNING, type DevTuning } from '../dev/DevTuning';
import type { GameEventQueue } from '../domain/events';
import { applyAirNudge, applyDash, applyWallJump, tickState, type GameState } from '../domain/gameState';
import type { PlayerCommand } from '../input/commands';

export type MovementFrameState = {
  state: GameState;
  dashDirection: -1 | 0 | 1;
  dashVisualTime: number;
  restartRequested: boolean;
};

export class MovementSystem {
  constructor(private readonly getTuning: () => DevTuning = () => DEFAULT_DEV_TUNING) {}

  execute(
    frame: MovementFrameState,
    command: PlayerCommand | null,
    cameraOffset: number,
    events: GameEventQueue,
  ): MovementFrameState {
    if (!command) return frame;
    if (command.type === 'restart') return { ...frame, restartRequested: true };
    if (command.type === 'wall-jump') {
      const state = applyWallJump(frame.state, this.getTuning());
      events.emit({ type: 'wall-jumped', x: state.playerX, y: state.playerY + cameraOffset, direction: command.direction });
      return { state, dashDirection: command.direction, dashVisualTime: 0.11, restartRequested: false };
    }
    if (command.type === 'air-nudge') {
      if (frame.state.gameOver) return frame;
      return {
        state: applyAirNudge(frame.state, command.direction, command.strength),
        dashDirection: command.direction,
        dashVisualTime: 0.07,
        restartRequested: false,
      };
    }
    if (!frame.state.dashReady || frame.state.gameOver) return frame;
    const state = applyDash(frame.state, command.direction, command.strength, this.getTuning());
    events.emit({ type: 'dash-started', x: state.playerX, y: state.playerY + cameraOffset, direction: command.direction, strength: command.strength });
    return { state, dashDirection: command.direction, dashVisualTime: 0.15, restartRequested: false };
  }

  update(frame: MovementFrameState, deltaSeconds: number): MovementFrameState {
    const dashVisualTime = Math.max(0, frame.dashVisualTime - deltaSeconds);
    return {
      ...frame,
      state: tickState(frame.state, deltaSeconds, this.getTuning()),
      dashVisualTime,
      dashDirection: dashVisualTime <= 0 ? 0 : frame.dashDirection,
      restartRequested: false,
    };
  }
}
