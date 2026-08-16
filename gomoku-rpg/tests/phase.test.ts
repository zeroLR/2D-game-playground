import { describe,expect,it } from 'vitest';
import { Cell,createBoard } from '../src/game';
import { addSeal,createCombatState,executePlace,forcedPlacementFor,getMana } from '../src/combat';
import { createLoadout } from '../src/heroes';
import { getMessages } from '../src/i18n';
import { isLegalPosition,phaseSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';

const boardWith=(cells:[number,number,Cell][])=>{const board=createBoard();cells.forEach(([r,c,v])=>{board[r][c]=v;});return board;};

describe('M2.4c Arcane Command replacement prototype',()=>{
 it('costs 3 Mana and consumes the turn',()=>{expect(phaseSkill.consumesTurn).toBe(true);expect(phaseSkill.cost).toBe(3);});
 it('targets any legal empty intersection without requiring a source stone',()=>{const state=createCombatState(boardWith([[4,4,1],[4,5,2]]),3);const legal=phaseSkill.legalTargets({state,player:1});expect(phaseSkill.legalSources).toBeUndefined();expect(isLegalPosition({row:0,col:0},legal)).toBe(true);expect(isLegalPosition({row:4,col:4},legal)).toBe(false);expect(isLegalPosition({row:4,col:5},legal)).toBe(false);});
 it('cannot command a sealed intersection',()=>{const state=addSeal(createCombatState(createBoard(),3),{row:3,col:4},1);expect(isLegalPosition({row:3,col:4},phaseSkill.legalTargets({state,player:1}))).toBe(false);});
 it('forces the opponent next placement to the commanded cell',()=>{const target={row:0,col:0};const next=phaseSkill.execute({state:createCombatState(createBoard(),3),player:1},target);expect(forcedPlacementFor(next,2)).toEqual(target);expect(getMana(next,1)).toBe(0);const cpuState={...next,activePlayer:2 as const};expect(executePlace(cpuState,{kind:'place',at:{row:4,col:4}})).toMatchObject({ok:false,error:'forced-placement'});const forced=executePlace(cpuState,{kind:'place',at:target});expect(forced.ok).toBe(true);expect(forced.state.board[0][0]).toBe(2);expect(forcedPlacementFor(forced.state,2)).toBeNull();});
 it('does not alter the board or win on cast',()=>{const state=createCombatState(boardWith([[4,1,1],[4,2,1],[4,3,1],[4,4,1]]),3);const before=state.board.map((row)=>[...row]);const r=resolveSkillAction(state,'arcanist',1,'phase',{row:4,col:5});expect(r.ok).toBe(true);expect(r.won).toBe(false);expect(r.consumedTurn).toBe(true);expect(r.state.board).toEqual(before);expect(r.passiveTriggered).toBe(true);expect(getMana(r.state,1)).toBe(1);});
 it('remains on the Arcanist loadout while the legacy phase id preserves telemetry compatibility',()=>{expect(createLoadout('arcanist').skills).toEqual(['blink','phase']);(['en','zh-TW'] as const).forEach((locale)=>{const m=getMessages(locale);expect(m.phase).toMatch(locale==='en'?/COMMAND/:/指令/);expect(typeof m[skills.phase.descriptionKey]).toBe('string');});});
});
