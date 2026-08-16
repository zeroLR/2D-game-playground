import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,isGuarded } from '../src/combat';
import { appendActionHistory } from '../src/runtime/action-feedback';
import { resolveCpuTurn } from '../src/runtime/cpu-runtime';

describe('M2.5 combat readability',()=>{
 it('persists Fortified Guard when CPU Vanguard completes a pattern placement',()=>{const board=createBoard();board[4][2]=2;board[4][3]=2;const state=createCombatState(board);const result=resolveCpuTurn(state,'vanguard');expect(result.action?.kind).toBe('place');expect(result.passiveTriggered).toBe(true);expect(result.at&&isGuarded(result.state,result.at)).toBe(true);});
 it('keeps only the latest three shared action history entries',()=>{let history=[] as ReturnType<typeof appendActionHistory>;for(let i=0;i<4;i++)history=appendActionHistory(history,{actor:i%2?'cpu':'player',player:i%2?2:1,heroId:'vanguard',kind:'place',at:{row:i,col:i}});expect(history).toHaveLength(3);expect(history.map((e)=>e.sequence)).toEqual([2,3,4]);});
 it('retains source and target for skill trajectory feedback',()=>{const history=appendActionHistory([],{actor:'cpu',player:2,heroId:'vanguard',kind:'skill',skillId:'charge',source:{row:4,col:4},at:{row:4,col:5}});expect(history[0]).toMatchObject({skillId:'charge',source:{row:4,col:4},at:{row:4,col:5}});});
});
