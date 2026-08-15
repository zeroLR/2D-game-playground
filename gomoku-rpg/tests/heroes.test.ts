import { describe,expect,it } from 'vitest';
import { createCombatState,executePlace,getMana,setMana } from '../src/combat';
import { createBoard } from '../src/game';
import { COMMON_SKILL,createLoadout,heroes,isHeroSkillEquipped,isSkillEquipped } from '../src/heroes';
import { chargeSkill,commonSkillIds,corruptSkill,sealSkill } from '../src/skills';

describe('M2 combat resources',()=>{
 it('tracks Mana independently for both actors',()=>{let state=createCombatState(createBoard(),3);state=setMana(state,2,4);expect(getMana(state,1)).toBe(3);expect(getMana(state,2)).toBe(4);});
 it('CPU pattern rewards do not alter player Mana',()=>{const board=createBoard();board[3][2]=board[3][3]=2;let state=createCombatState(board,2,2);const result=executePlace(state,{kind:'place',at:{row:3,col:4}});expect(result.manaGained).toBe(1);expect(getMana(result.state,1)).toBe(2);expect(getMana(result.state,2)).toBe(1);});
 it('skills spend the acting player resource',()=>{let state=createCombatState(createBoard(),5,2);state=setMana(state,2,3);const next=sealSkill.execute({state,player:2},{row:4,col:4});expect(getMana(next,1)).toBe(5);expect(getMana(next,2)).toBe(1);});
});

describe('M2.4 skill architecture',()=>{
 it('declares Blink as the common skill',()=>{expect(COMMON_SKILL).toBe('blink');expect(commonSkillIds).toEqual(['blink']);});
 it('separates common and hero-owned slots for Arcanist',()=>{const loadout=createLoadout('arcanist');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['phase']);expect(loadout.skills).toEqual(['blink','phase']);});
 it('equips Shade with common Blink and Corrupt',()=>{expect(createLoadout('shade').skills).toEqual(['blink','corrupt']);});
 it('equips Vanguard with common Blink and hero-owned Charge',()=>{const loadout=createLoadout('vanguard');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['charge']);expect(loadout.skills).toEqual(['blink','charge']);expect(isSkillEquipped(loadout,'blink')).toBe(true);expect(isHeroSkillEquipped(loadout,'charge')).toBe(true);expect(isHeroSkillEquipped(loadout,'bulwark')).toBe(false);});
 it('keeps hero definitions focused on identity-owned skills',()=>{expect(heroes.vanguard.heroSkills).toEqual(['charge']);expect(heroes.arcanist.heroSkills).toEqual(['phase']);expect(heroes.shade.heroSkills).toEqual(['corrupt']);});
});

describe('M2.4 Shade Corrupt',()=>{
 it('targets only enemy stones adjacent to a Shade stone',()=>{const board=createBoard();board[4][4]=1;board[4][5]=2;board[1][1]=2;const state=createCombatState(board,5);expect(corruptSkill.legalTargets({state,player:1})).toEqual([{row:4,col:5}]);});
});

describe('M2.4 Vanguard Charge',()=>{
 it('advances into an adjacent empty intersection for 3 Mana',()=>{const board=createBoard();board[4][4]=1;const next=chargeSkill.execute({state:createCombatState(board,3),player:1},{row:4,col:5},{row:4,col:4});expect(next.board[4][4]).toBe(0);expect(next.board[4][5]).toBe(1);expect(getMana(next,1)).toBe(0);});
 it('pushes an enemy one additional step in the same direction',()=>{const board=createBoard();board[4][3]=1;board[4][4]=2;const next=chargeSkill.execute({state:createCombatState(board,3),player:1},{row:4,col:4},{row:4,col:3});expect(next.board[4][3]).toBe(0);expect(next.board[4][4]).toBe(1);expect(next.board[4][5]).toBe(2);});
 it('cannot push when the cell behind the enemy is occupied',()=>{const board=createBoard();board[4][3]=1;board[4][4]=2;board[4][5]=2;const legal=chargeSkill.legalTargets({state:createCombatState(board,3),player:1},{row:4,col:3});expect(legal).not.toContainEqual({row:4,col:4});});
 it('cannot push an enemy off the board',()=>{const board=createBoard();board[4][7]=1;board[4][8]=2;const legal=chargeSkill.legalTargets({state:createCombatState(board,3),player:1},{row:4,col:7});expect(legal).not.toContainEqual({row:4,col:8});});
});
