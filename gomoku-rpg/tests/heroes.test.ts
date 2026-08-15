import { describe,expect,it } from 'vitest';
import { createCombatState,executePlace,getMana,setMana } from '../src/combat';
import { createBoard } from '../src/game';
import { createLoadout,heroes,isSkillEquipped } from '../src/heroes';
import { sealSkill } from '../src/skills';

describe('M2 combat resources',()=>{
 it('tracks Mana independently for both actors',()=>{let state=createCombatState(createBoard(),3);state=setMana(state,2,4);expect(getMana(state,1)).toBe(3);expect(getMana(state,2)).toBe(4);});
 it('CPU pattern rewards do not alter player Mana',()=>{const board=createBoard();board[3][2]=board[3][3]=2;let state=createCombatState(board,2,2);const result=executePlace(state,{kind:'place',at:{row:3,col:4}});expect(result.manaGained).toBe(1);expect(getMana(result.state,1)).toBe(2);expect(getMana(result.state,2)).toBe(1);});
 it('skills spend the acting player resource',()=>{let state=createCombatState(createBoard(),5,2);state=setMana(state,2,3);const next=sealSkill.execute({state,player:2},{row:4,col:4});expect(getMana(next,1)).toBe(5);expect(getMana(next,2)).toBe(1);});
});

describe('M2 hero definitions',()=>{
 it('gives every hero exactly two active skills',()=>{Object.values(heroes).forEach((hero)=>expect(hero.activeSkills).toHaveLength(2));});
 it('creates an Arcanist control loadout',()=>{const loadout=createLoadout('arcanist');expect(isSkillEquipped(loadout,'blink')).toBe(true);expect(isSkillEquipped(loadout,'seal')).toBe(true);expect(isSkillEquipped(loadout,'guard')).toBe(false);});
});
