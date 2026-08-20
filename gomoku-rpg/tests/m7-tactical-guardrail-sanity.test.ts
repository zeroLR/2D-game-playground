import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 tactical guardrail scope',()=>{
 it('still returns an ordinary candidate when no immediate tactic exists',()=>{const state=createCombatState(createBoard());const candidates=[{kind:'place',at:{row:0,col:0}},{kind:'place',at:{row:4,col:4}}] as const;expect(candidates).toContainEqual(chooseCpuAction(state,candidates,cpuDifficulty(4),()=>0)?.action);});
});
