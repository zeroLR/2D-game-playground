import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { addGuard,addSeal,createCombatState,isGuarded,isSealed } from '../src/combat';
import { completeCpuTurn,completePlayerTurn,continuePlayerTurn,createTurnState,endMatch,isPlayerInput } from '../src/runtime/turn-runtime';
import { cpuLegalCells,resolveCpuTurn } from '../src/runtime/cpu-runtime';

describe('R2 turn runtime',()=>{
 it('starts on turn 1 waiting for the player',()=>{const turn=createTurnState();expect(turn.turn).toBe(1);expect(isPlayerInput(turn)).toBe(true);});
 it('a consumed turn expires player effects, counts the turn and hands over to the CPU',()=>{
  const state=addGuard(createCombatState(createBoard()),{row:4,col:4},1);
  const done=completePlayerTurn(state,createTurnState());
  expect(done.turn.turn).toBe(2);expect(done.turn.phase).toBe('cpu');expect(isPlayerInput(done.turn)).toBe(false);
  expect(isGuarded(done.state,{row:4,col:4})).toBe(true);
 });
 it('a free action keeps the same turn with the player',()=>{
  const turn=continuePlayerTurn(createTurnState());
  expect(turn.turn).toBe(1);expect(isPlayerInput(turn)).toBe(true);
 });
 it('the CPU turn expires player-owned Seal and returns input to the player',()=>{
  const state=addSeal(createCombatState(createBoard()),{row:4,col:4},1);
  const done=completeCpuTurn(state,{turn:2,phase:'cpu',status:'playing'});
  expect(isSealed(done.state,{row:4,col:4})).toBe(false);
  expect(isPlayerInput(done.turn)).toBe(true);
 });
 it('a decided match accepts no further input',()=>{const turn=endMatch(createTurnState(),'victory');expect(turn.status).toBe('victory');expect(isPlayerInput(turn)).toBe(false);});
});

describe('R2 CPU runtime',()=>{
 it('places a stone and returns the board to the player',()=>{const cpu=resolveCpuTurn(createCombatState(createBoard()));expect(cpu.outcome).toBe('moved');expect(cpu.state.board[cpu.at!.row][cpu.at!.col]).toBe(2);expect(cpu.state.activePlayer).toBe(1);});
 it('never targets a sealed or corrupted intersection',()=>{
  const state=addSeal(createCombatState(createBoard()),{row:4,col:4},1);
  expect(cpuLegalCells(state)).not.toContainEqual({row:4,col:4});
  expect(resolveCpuTurn(state).at).not.toEqual({row:4,col:4});
 });
 it('reports a draw when no legal intersection remains',()=>{
  const board=createBoard();board.forEach((row,r)=>row.forEach((_,c)=>{board[r][c]=r%2?1:2;}));
  expect(resolveCpuTurn(createCombatState(board)).outcome).toBe('draw');
 });
 it('reports a win when the CPU completes five in a row',()=>{
  const board=createBoard();for(let c=0;c<4;c++)board[0][c]=2;
  expect(resolveCpuTurn(createCombatState(board)).outcome).toBe('won');
 });
});
