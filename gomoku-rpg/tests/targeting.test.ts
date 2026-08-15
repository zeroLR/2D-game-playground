import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { IDLE_TARGETING,beginTargeting,selectTargetingCell,targetingHighlights,targetingSkill,toggleTargeting } from '../src/runtime/targeting';

const boardWithStone=()=>{const b=createBoard();b[4][4]=1;return b;};

describe('R3 targeting state',()=>{
 it('opens two-stage skills on source selection',()=>{expect(beginTargeting('blink')).toEqual({mode:'select-source',skillId:'blink'});expect(beginTargeting('charge')).toEqual({mode:'select-source',skillId:'charge'});});
 it('opens single-target skills directly on the target',()=>{expect(beginTargeting('seal')).toEqual({mode:'select-target',skillId:'seal'});expect(beginTargeting('corrupt')).toEqual({mode:'select-target',skillId:'corrupt'});});
 it('toggles the active skill off and switches between skills',()=>{
  const blink=toggleTargeting(IDLE_TARGETING,'blink');
  expect(targetingSkill(blink)).toBe('blink');
  expect(toggleTargeting(blink,'blink')).toEqual(IDLE_TARGETING);
  expect(targetingSkill(toggleTargeting(blink,'seal'))).toBe('seal');
 });
});

describe('R3 targeting highlights',()=>{
 it('highlights sources before a source is chosen and targets after',()=>{
  const state=createCombatState(boardWithStone(),2);
  const opened=beginTargeting('blink');
  expect(targetingHighlights(state,1,opened).sources).toContainEqual({row:4,col:4});
  expect(targetingHighlights(state,1,opened).targets).toEqual([]);
  const picked=selectTargetingCell(state,1,opened,{row:4,col:4});
  expect(picked.kind).toBe('source');
  if(picked.kind!=='source')return;
  expect(targetingHighlights(state,1,picked.targeting).sources).toEqual([]);
  expect(targetingHighlights(state,1,picked.targeting).targets).toContainEqual({row:0,col:0});
 });
 it('highlights nothing while idle',()=>{expect(targetingHighlights(createCombatState(createBoard()),1,IDLE_TARGETING)).toEqual({sources:[],targets:[]});});
});

describe('R3 targeting intent',()=>{
 it('walks Blink through source then cast',()=>{
  const state=createCombatState(boardWithStone(),2);
  const picked=selectTargetingCell(state,1,beginTargeting('blink'),{row:4,col:4});
  expect(picked.kind).toBe('source');
  if(picked.kind!=='source')return;
  const cast=selectTargetingCell(state,1,picked.targeting,{row:5,col:5});
  expect(cast).toEqual({kind:'cast',skillId:'blink',target:{row:5,col:5},source:{row:4,col:4}});
 });
 it('casts a single-target skill in one tap',()=>{
  const state=createCombatState(createBoard(),2);
  expect(selectTargetingCell(state,1,beginTargeting('seal'),{row:4,col:4})).toEqual({kind:'cast',skillId:'seal',target:{row:4,col:4},source:undefined});
 });
 it('rejects an illegal source and an illegal target',()=>{
  const state=createCombatState(boardWithStone(),2);
  expect(selectTargetingCell(state,1,beginTargeting('blink'),{row:0,col:0}).kind).toBe('invalid');
  const picked=selectTargetingCell(state,1,beginTargeting('blink'),{row:4,col:4});
  if(picked.kind!=='source')return;
  expect(selectTargetingCell(state,1,picked.targeting,{row:4,col:4}).kind).toBe('invalid');
 });
});
