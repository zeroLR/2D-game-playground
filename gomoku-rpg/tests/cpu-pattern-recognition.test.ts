import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { patternMoveScore,recognizeMovePatterns } from '../src/runtime/cpu-pattern-recognition';
import { scoreCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7.1 CPU pattern recognition',()=>{
 it('recognizes an open three created by a candidate move',()=>{const board=createBoard();board[4][3]=2;board[4][5]=2;const state=createCombatState(board);expect(recognizeMovePatterns(state,{row:4,col:4},2,3)[0].kind).toBe('open-three');});
 it('values a forcing open four above an open three',()=>{const a=createBoard();a[4][2]=2;a[4][3]=2;a[4][4]=2;const b=createBoard();b[4][3]=2;b[4][4]=2;expect(patternMoveScore(createCombatState(a),{row:4,col:5},2,3)).toBeGreaterThan(patternMoveScore(createCombatState(b),{row:4,col:5},2,3));});
 it('gives Lv4+ explicit pattern value while keeping lower levels on legacy heuristic',()=>{const board=createBoard();board[4][3]=2;board[4][5]=2;const state=createCombatState(board),action={kind:'place' as const,at:{row:4,col:4}};expect(scoreCpuAction(state,action,cpuDifficulty(4))).toBeGreaterThan(scoreCpuAction(state,action,cpuDifficulty(3)));});
 it('recognizes compound threats as stronger than an isolated line',()=>{const fork=createBoard();fork[4][3]=2;fork[4][5]=2;fork[3][4]=2;fork[5][4]=2;const single=createBoard();single[4][3]=2;single[4][5]=2;expect(patternMoveScore(createCombatState(fork),{row:4,col:4},2,3)).toBeGreaterThan(patternMoveScore(createCombatState(single),{row:4,col:4},2,3));});
});
