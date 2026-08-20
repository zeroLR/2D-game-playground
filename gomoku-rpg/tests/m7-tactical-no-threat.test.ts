import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 guardrail isolation',()=>{
 it('keeps normal scoring when neither side has mate in one',()=>{const state=createCombatState(createBoard());const center={kind:'place',at:{row:4,col:4}} as const,corner={kind:'place',at:{row:0,col:0}} as const;expect(chooseCpuAction(state,[corner,center],cpuDifficulty(4),()=>0)?.action).toEqual(center);});
});
