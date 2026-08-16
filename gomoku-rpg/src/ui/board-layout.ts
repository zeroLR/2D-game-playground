import { BOARD_SIZE, Pos } from '../game';
export const BOARD_X=24,BOARD_Y=145,BOARD_SPAN=342,BOARD_PAD=19;
const STEP=(BOARD_SPAN-BOARD_PAD*2)/(BOARD_SIZE-1);
export const cellX=(col:number)=>BOARD_X+BOARD_PAD+col*STEP;
export const cellY=(row:number)=>BOARD_Y+BOARD_PAD+row*STEP;
export interface SkillTrail{source:Pos;target:Pos}
/** Transient marks the board draws on top of state. Owned by the feedback layer, never by rules. */
export interface BoardFeedback{lastMove:Pos|null;winCells:Pos[];actionPulse:Pos|null;passivePulse:Pos|null;flash:Pos|null;skillTrail:SkillTrail|null}
