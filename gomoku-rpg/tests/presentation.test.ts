import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { IDLE_TARGETING,beginTargeting,selectTargetingCell } from '../src/runtime/targeting';
import { describeSkillBar,statusKey } from '../src/runtime/presentation';
import { createTurnState,endMatch } from '../src/runtime/turn-runtime';

const arcanist=createLoadout('arcanist');

describe('R5 skill bar presentation',()=>{
 it('marks skills the player cannot pay for as disabled',()=>{const bar=describeSkillBar(createCombatState(createBoard(),1),1,'arcanist',arcanist,createTurnState(),IDLE_TARGETING);expect(bar.map((item)=>item.enabled)).toEqual([false,false]);});
 it('enables skills once their cost is covered',()=>{const bar=describeSkillBar(createCombatState(createBoard(),3),1,'arcanist',arcanist,createTurnState(),IDLE_TARGETING);expect(bar.every((item)=>item.enabled)).toBe(true);});
 it('disables every skill while the CPU holds the turn',()=>{const bar=describeSkillBar(createCombatState(createBoard(),5),1,'arcanist',arcanist,{turn:2,phase:'cpu',status:'playing'},IDLE_TARGETING);expect(bar.some((item)=>item.enabled)).toBe(false);});
 it('reports exactly one selected skill',()=>{const bar=describeSkillBar(createCombatState(createBoard(),5),1,'arcanist',arcanist,createTurnState(),beginTargeting('phase'));expect(bar.filter((item)=>item.selected).map((item)=>item.skillId)).toEqual(['phase']);});
 it('presents Vanguard Blink as cooldown while Arcanist Blink stays Mana',()=>{const vanguard=createLoadout('vanguard');const v=describeSkillBar(createCombatState(createBoard()),1,'vanguard',vanguard,createTurnState(),IDLE_TARGETING);const a=describeSkillBar(createCombatState(createBoard(),2),1,'arcanist',arcanist,createTurnState(),IDLE_TARGETING);expect(v.find(i=>i.skillId==='blink')?.activation).toEqual({kind:'cooldown',turns:3});expect(a.find(i=>i.skillId==='blink')?.activation).toEqual({kind:'resource',resourceId:'mana',amount:2});});
});

describe('R5 status line',()=>{
 const state=createCombatState((()=>{const b=createBoard();b[4][4]=1;return b;})(),5);
 it('follows the turn phase',()=>{expect(statusKey(createTurnState(),IDLE_TARGETING)).toBe('yourTurn');expect(statusKey({turn:2,phase:'cpu',status:'playing'},IDLE_TARGETING)).toBe('opponentTurn');expect(statusKey(endMatch(createTurnState(),'victory'),IDLE_TARGETING)).toBe('victory');});
 it('names the selected skill and then asks for a destination',()=>{const opened=beginTargeting('blink');expect(statusKey(createTurnState(),opened)).toBe('blink');const picked=selectTargetingCell(state,1,opened,{row:4,col:4});if(picked.kind!=='source')throw new Error('expected a source selection');expect(statusKey(createTurnState(),picked.targeting)).toBe('selectDestination');});
 it('resolves every status key to a message in both locales',()=>{const keys=[statusKey(createTurnState(),IDLE_TARGETING),statusKey(createTurnState(),beginTargeting('charge')),'selectDestination','victory','defeat','draw'] as const;keys.forEach((key)=>{expect(typeof getMessages('en')[key]).toBe('string');expect(typeof getMessages('zh-TW')[key]).toBe('string');});});
});
