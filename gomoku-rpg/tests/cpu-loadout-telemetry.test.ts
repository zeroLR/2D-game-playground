import { describe,expect,it } from 'vitest';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { createLoadout } from '../src/heroes';
import { createMatchRecord } from '../src/match-records';
import { exportMatchesCsv } from '../src/match-export';
import { cpuActionCandidates } from '../src/runtime/cpu-runtime';
import { createMatchRuntime,MatchEvent } from '../src/runtime/match-runtime';
import { createPlaytestMetrics } from '../src/telemetry';

describe('Slice 3 CPU loadout',()=>{
 it('generates skill candidates from the CPU equipped pair instead of hero hard-coding',()=>{
  const board=createBoard();board[4][4]=2;board[4][5]=2;
  const state=createCombatState(board,0,3);
  const loadout=createLoadout('vanguard',['guard','bulwark']);
  const skillIds=cpuActionCandidates(state,'vanguard',loadout,true).filter(a=>a.kind==='skill').map(a=>a.kind==='skill'?a.skillId:null);
  expect(skillIds).toContain('guard');
  expect(skillIds).toContain('bulwark');
  expect(skillIds).not.toContain('blink');
  expect(skillIds).not.toContain('charge');
 });
 it('keeps the CPU default loadout when no explicit kit is supplied',()=>{
  const board=createBoard();board[4][4]=2;
  const state=createCombatState(board,0,3);
  const skillIds=cpuActionCandidates(state,'vanguard').filter(a=>a.kind==='skill').map(a=>a.kind==='skill'?a.skillId:null);
  expect(skillIds).toContain('blink');
  expect(skillIds).toContain('charge');
 });
 it('validates CPU loadout changes through match runtime',()=>{
  const events:MatchEvent[]=[];
  const runtime=createMatchRuntime({heroId:'arcanist',cpuHeroId:'vanguard',schedule:(cb)=>0 as unknown as ReturnType<typeof setTimeout>,cancel:()=>{},onChange:()=>{},onEvent:e=>events.push(e)});
  expect(runtime.setCpuLoadout(['guard','bulwark'])).toBe(true);
  expect(runtime.snapshot().cpuLoadout.skillIds).toEqual(['guard','bulwark']);
  expect(runtime.setCpuLoadout(['guard','corrupt'])).toBe(false);
  expect(runtime.snapshot().cpuLoadout.skillIds).toEqual(['guard','bulwark']);
  runtime.dispose();
 });
});

describe('Slice 3 loadout telemetry',()=>{
 it('derives exact player and CPU kits from action telemetry',()=>{
  const record=createMatchRecord({
   startedAt:'2026-08-23T00:00:00.000Z',heroId:'vanguard',cpuHeroId:'arcanist',cpuDifficulty:'normal',cpuProfileLevel:4,result:'victory',turns:4,
   actions:[
    {sequence:1,actor:'player',player:1,heroId:'vanguard',equippedSkillIds:['guard','bulwark'],kind:'place',at:{row:4,col:4}},
    {sequence:2,actor:'cpu',player:2,heroId:'arcanist',equippedSkillIds:['seal','phase'],kind:'place',at:{row:3,col:3}},
   ],
   metrics:createPlaytestMetrics('vanguard'),
  });
  expect(record.playerSkillIds).toEqual(['guard','bulwark']);
  expect(record.cpuSkillIds).toEqual(['seal','phase']);
  const csv=exportMatchesCsv([record]);
  expect(csv).toContain('playerLoadout');
  expect(csv).toContain('cpuLoadout');
  expect(csv).toContain('guard+bulwark');
  expect(csv).toContain('seal+phase');
 });
 it('backfills legacy records with each hero default kit',()=>{
  const record=createMatchRecord({startedAt:'2026-08-23T00:00:00.000Z',heroId:'shade',cpuHeroId:'vanguard',result:'draw',turns:1,actions:[],metrics:createPlaytestMetrics('shade')});
  expect(record.playerSkillIds).toEqual(['blink','corrupt']);
  expect(record.cpuSkillIds).toEqual(['blink','charge']);
 });
});
