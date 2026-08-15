import { describe,expect,it } from 'vitest';
import { createCombatState,executePlace,getMana,setMana } from '../src/combat';
import { createBoard } from '../src/game';
import { COMMON_SKILL,createLoadout,heroes,isHeroSkillEquipped,isSkillEquipped } from '../src/heroes';
import { commonSkillIds,corruptSkill,sealSkill } from '../src/skills';

describe('M2 combat resources',()=>{
 it('tracks Mana independently for both actors',()=>{let state=createCombatState(createBoard(),3);state=setMana(state,2,4);expect(getMana(state,1)).toBe(3);expect(getMana(state,2)).toBe(4);});
 it('CPU pattern rewards do not alter player Mana',()=>{const board=createBoard();board[3][2]=board[3][3]=2;let state=createCombatState(board,2,2);const result=executePlace(state,{kind:'place',at:{row:3,col:4}});expect(result.manaGained).toBe(1);expect(getMana(result.state,1)).toBe(2);expect(getMana(result.state,2)).toBe(1);});
 it('skills spend the acting player resource',()=>{let state=createCombatState(createBoard(),5,2);state=setMana(state,2,3);const next=sealSkill.execute({state,player:2},{row:4,col:4});expect(getMana(next,1)).toBe(5);expect(getMana(next,2)).toBe(1);});
});

describe('M2.4 skill architecture',()=>{
 it('declares Blink as the common skill',()=>{expect(COMMON_SKILL).toBe('blink');expect(commonSkillIds).toEqual(['blink']);});
 it('separates common and hero-owned slots for Arcanist',()=>{const loadout=createLoadout('arcanist');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['seal']);expect(loadout.skills).toEqual(['blink','seal']);expect(isSkillEquipped(loadout,'blink')).toBe(true);expect(isHeroSkillEquipped(loadout,'blink')).toBe(false);expect(isHeroSkillEquipped(loadout,'seal')).toBe(true);});
 it('equips Shade with common Blink and hero-owned Corrupt',()=>{const loadout=createLoadout('shade');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['corrupt']);expect(loadout.skills).toEqual(['blink','corrupt']);expect(isHeroSkillEquipped(loadout,'corrupt')).toBe(true);});
 it('equips Vanguard with common Blink and hero-owned Bulwark',()=>{const loadout=createLoadout('vanguard');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['bulwark']);expect(loadout.skills).toEqual(['blink','bulwark']);expect(isSkillEquipped(loadout,'blink')).toBe(true);expect(isHeroSkillEquipped(loadout,'bulwark')).toBe(true);});
 it('keeps hero definitions focused on identity-owned skills',()=>{expect(heroes.vanguard.heroSkills).toEqual(['bulwark']);expect(heroes.arcanist.heroSkills).toEqual(['seal']);expect(heroes.shade.heroSkills).toEqual(['corrupt']);});
});

describe('M2.4 Shade Corrupt',()=>{
 it('targets only enemy stones adjacent to a Shade stone',()=>{const board=createBoard();board[4][4]=1;board[4][5]=2;board[1][1]=2;const state=createCombatState(board,5);expect(corruptSkill.legalTargets({state,player:1})).toEqual([{row:4,col:5}]);});
 it('destroys the target and spends three Mana',()=>{const board=createBoard();board[4][4]=1;board[4][5]=2;const state=createCombatState(board,5);const next=corruptSkill.execute({state,player:1},{row:4,col:5});expect(next.board[4][5]).toBe(0);expect(getMana(next,1)).toBe(2);});
});
