import { describe, expect, it } from 'vitest';
import { ActionHistoryEntry } from '../src/runtime/action-feedback';
import { clampReplayIndex, projectReplay } from '../src/replay';

const action=(overrides:Partial<ActionHistoryEntry>):ActionHistoryEntry=>({sequence:1,actor:'player',player:1,heroId:'arcanist',kind:'place',at:{row:4,col:4},...overrides});

describe('HUD M3 replay projection',()=>{
 it('creates an initial frame and projects placements without mutating older frames',()=>{
  const frames=projectReplay([action({}),action({sequence:2,actor:'cpu',player:2,heroId:'vanguard',at:{row:3,col:3}})]);
  expect(frames).toHaveLength(3);expect(frames[0].board[4][4]).toBe(0);expect(frames[1].board[4][4]).toBe(1);expect(frames[2].board[3][3]).toBe(2);
 });
 it('projects blink and corrupt occupancy changes',()=>{
  const frames=projectReplay([action({at:{row:4,col:4}}),action({sequence:2,kind:'skill',skillId:'blink',source:{row:4,col:4},at:{row:4,col:5}}),action({sequence:3,actor:'cpu',player:2,heroId:'shade',kind:'place',at:{row:3,col:5}}),action({sequence:4,kind:'skill',skillId:'corrupt',at:{row:3,col:5}})]);
  expect(frames[2].board[4][4]).toBe(0);expect(frames[2].board[4][5]).toBe(1);expect(frames[4].board[3][5]).toBe(0);
 });
 it('projects charge pushes and clamps replay navigation',()=>{
  const frames=projectReplay([action({at:{row:4,col:3}}),action({sequence:2,actor:'cpu',player:2,heroId:'vanguard',at:{row:4,col:4}}),action({sequence:3,heroId:'vanguard',kind:'skill',skillId:'charge',source:{row:4,col:3},at:{row:4,col:4}})]);
  expect(frames[3].board[4][3]).toBe(0);expect(frames[3].board[4][4]).toBe(1);expect(frames[3].board[4][5]).toBe(2);expect(clampReplayIndex(-1,frames.length)).toBe(0);expect(clampReplayIndex(99,frames.length)).toBe(3);
 });
});
