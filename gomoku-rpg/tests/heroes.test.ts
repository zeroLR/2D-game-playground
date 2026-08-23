import { describe,expect,it } from 'vitest';
import { createCombatState,executePlace,getMana,setMana } from '../src/combat';
import { createBoard } from '../src/game';
import { COMMON_SKILL,createLoadout,heroes,isHeroSkillEquipped,isLegalLoadout,isSkillAccessible,isSkillEquipped,tryCreateLoadout } from '../src/heroes';
import { resolveAbilityActivation } from '../src/hero-ability-activation';
import { chargeSkill,commonSkillIds,corruptSkill,skills } from '../src/skills';
import { resolveSkillAction } from '../src/runtime/action-resolution';

describe('M2 combat resources',()=>{
 it('tracks Mana independently for both actors',()=>{let state=createCombatState(createBoard(),3);state=setMana(state,2,4);expect(getMana(state,1)).toBe(3);expect(getMana(state,2)).toBe(4);});
 it('CPU pattern rewards do not alter player Mana',()=>{const board=createBoard();board[3][2]=board[3][3]=2;let state=createCombatState(board,2,2);const result=executePlace(state,{kind:'place',at:{row:3,col:4}});expect(result.manaGained).toBe(1);expect(getMana(result.state,1)).toBe(2);expect(getMana(result.state,2)).toBe(1);});
 it('activation service spends before hero after-skill hooks',()=>{let state=createCombatState(createBoard(),5,2);state=setMana(state,2,3);const result=resolveSkillAction(state,'arcanist',2,'seal',{row:4,col:4});expect(result.ok).toBe(true);expect(getMana(result.state,1)).toBe(5);expect(getMana(result.state,2)).toBe(2);});
});

describe('Slice 1 hero domain contract',()=>{
 it('makes signaturePassive authoritative while preserving compatibility aliases',()=>{expect(heroes.vanguard.signaturePassive).toBe('fortified');expect(heroes.arcanist.signaturePassive).toBe('flow');expect(heroes.shade.signaturePassive).toBe('pressure');expect(heroes.vanguard.passive).toBe(heroes.vanguard.signaturePassive);expect(heroes.arcanist.innatePassive).toBe(heroes.arcanist.signaturePassive);});
 it('exposes curated pools without changing default match loadouts',()=>{expect(heroes.vanguard.skillPool).toEqual(['blink','guard','bulwark','charge']);expect(heroes.arcanist.skillPool).toEqual(['blink','seal','phase']);expect(heroes.shade.skillPool).toEqual(['blink','corrupt']);expect(createLoadout('vanguard').skillIds).toEqual(['blink','charge']);expect(createLoadout('arcanist').skillIds).toEqual(['blink','phase']);expect(createLoadout('shade').skillIds).toEqual(['blink','corrupt']);});
 it('validates two unique skills against the selected hero pool',()=>{expect(isLegalLoadout('vanguard',['charge','guard'])).toBe(true);expect(isLegalLoadout('vanguard',['blink','bulwark'])).toBe(true);expect(isLegalLoadout('vanguard',['charge','charge'])).toBe(false);expect(isLegalLoadout('vanguard',['charge'])).toBe(false);expect(isLegalLoadout('vanguard',['charge','corrupt'])).toBe(false);expect(isSkillAccessible('arcanist','seal')).toBe(true);expect(isSkillAccessible('shade','seal')).toBe(false);});
 it('adds playstyle and interaction metadata without runtime modifiers',()=>{expect(heroes.vanguard.playstyleTags).toEqual(['defense','tempo']);expect(heroes.arcanist.synergyTags).toContain('zone');expect(heroes.shade.counterTags).toContain('protection');});
});

describe('Slice 2 configurable loadout contract',()=>{
 it('builds a legal loadout without mandatory Blink',()=>{const loadout=createLoadout('vanguard',['guard','bulwark']);expect(loadout.skillIds).toEqual(['guard','bulwark']);expect(loadout.commonSkill).toBeNull();expect(loadout.heroSkills).toEqual(['guard','bulwark']);expect(loadout.skills).toEqual(['guard','bulwark']);});
 it('keeps compatibility aliases coherent when Blink is equipped',()=>{const loadout=createLoadout('arcanist',['seal','blink']);expect(loadout.skillIds).toEqual(['seal','blink']);expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['seal']);});
 it('rejects illegal combinations at construction time',()=>{expect(tryCreateLoadout('shade',['blink','seal'])).toBeNull();expect(tryCreateLoadout('vanguard',['charge','charge'])).toBeNull();expect(()=>createLoadout('shade',['blink','seal'])).toThrow(/Illegal loadout/);});
});

describe('V2 hero ability economy contract',()=>{
 it('migrates Vanguard to cooldown and Shade to pressure while retaining Mana for Arcanist and Architect',()=>{expect(heroes.vanguard.abilityEconomy).toEqual({kind:'cooldown'});expect(heroes.shade.abilityEconomy).toEqual({kind:'resource',resourceId:'pressure',max:3});for(const id of ['arcanist','architect'] as const)expect(heroes[id].abilityEconomy).toEqual({kind:'resource',resourceId:'mana',max:5});});
 it('resolves shared Blink differently by hero economy',()=>{expect(resolveAbilityActivation('vanguard','blink')).toEqual({kind:'cooldown',turns:3});expect(resolveAbilityActivation('arcanist','blink')).toEqual({kind:'resource',resourceId:'mana',amount:2});expect(resolveAbilityActivation('shade','blink')).toEqual({kind:'resource',resourceId:'pressure',amount:2});});
 it('defines Vanguard cooldown seeds per tactical ability',()=>{expect(resolveAbilityActivation('vanguard','guard')).toEqual({kind:'cooldown',turns:3});expect(resolveAbilityActivation('vanguard','charge')).toEqual({kind:'cooldown',turns:4});expect(resolveAbilityActivation('vanguard','bulwark')).toEqual({kind:'cooldown',turns:5});});
 it('defines Corrupt as a full-pressure commitment',()=>{expect(resolveAbilityActivation('shade','corrupt')).toEqual({kind:'resource',resourceId:'pressure',amount:3});});
 it('keeps skill activation metadata as the default rule for non-overridden heroes',()=>{expect(skills.blink.activation).toEqual({kind:'resource',resourceId:'mana',amount:2});expect(skills.lattice.activation).toEqual({kind:'resource',resourceId:'mana',amount:3});});
});

describe('Slice 1 skill domain contract',()=>{
 it('models Blink as common availability instead of relying on ownership alone',()=>{expect(COMMON_SKILL).toBe('blink');expect(commonSkillIds).toEqual(['blink']);expect(skills.blink.availability).toEqual({kind:'common'});});
 it('declares hero-pool availability for specialized skills',()=>{expect(skills.charge.availability).toEqual({kind:'hero-pool',heroIds:['vanguard']});expect(skills.guard.availability).toEqual({kind:'hero-pool',heroIds:['vanguard']});expect(skills.seal.availability).toEqual({kind:'hero-pool',heroIds:['arcanist']});expect(skills.phase.availability).toEqual({kind:'hero-pool',heroIds:['arcanist']});expect(skills.corrupt.availability).toEqual({kind:'hero-pool',heroIds:['shade']});});
 it('requires design metadata for every registered skill',()=>{for(const skill of Object.values(skills)){expect(skill.category).toBeTruthy();expect(skill.effectTags.length).toBeGreaterThan(0);expect(skill.riskProfile).toMatch(/^(low|medium|high)$/);expect(Array.isArray(skill.synergyTags)).toBe(true);expect(Array.isArray(skill.counterTags)).toBe(true);expect(skill.activation).toBeTruthy();}});
});

describe('M2.4 compatibility architecture',()=>{
 it('keeps default-slot aliases for staged consumers',()=>{const loadout=createLoadout('arcanist');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['phase']);expect(loadout.skills).toEqual(['blink','phase']);});
 it('keeps Shade defaulted to common Blink and Corrupt',()=>{expect(createLoadout('shade').skills).toEqual(['blink','corrupt']);});
 it('keeps Vanguard defaulted to common Blink and Charge',()=>{const loadout=createLoadout('vanguard');expect(loadout.commonSkill).toBe('blink');expect(loadout.heroSkills).toEqual(['charge']);expect(loadout.skills).toEqual(['blink','charge']);expect(isSkillEquipped(loadout,'blink')).toBe(true);expect(isHeroSkillEquipped(loadout,'charge')).toBe(true);expect(isHeroSkillEquipped(loadout,'bulwark')).toBe(false);});
 it('keeps identity-owned aliases stable for existing UI/runtime consumers',()=>{expect(heroes.vanguard.heroSkills).toEqual(['charge']);expect(heroes.arcanist.heroSkills).toEqual(['phase']);expect(heroes.shade.heroSkills).toEqual(['corrupt']);});
});

describe('M2.4 Shade Corrupt',()=>{it('targets only enemy stones adjacent to a Shade stone',()=>{const board=createBoard();board[4][4]=1;board[4][5]=2;board[1][1]=2;const state=createCombatState(board,5);expect(corruptSkill.legalTargets({state,player:1})).toEqual([{row:4,col:5}]);});});

describe('M2.4 Vanguard Charge',()=>{
 it('advances into an adjacent empty intersection without spending Mana',()=>{const board=createBoard();board[4][4]=1;const result=resolveSkillAction(createCombatState(board),'vanguard',1,'charge',{row:4,col:5},{row:4,col:4});expect(result.ok).toBe(true);expect(result.state.board[4][4]).toBe(0);expect(result.state.board[4][5]).toBe(1);expect(getMana(result.state,1)).toBe(0);expect(result.skillCost).toBe(0);});
 it('pushes an enemy one additional step in the same direction',()=>{const board=createBoard();board[4][3]=1;board[4][4]=2;const next=chargeSkill.execute({state:createCombatState(board,3),player:1},{row:4,col:4},{row:4,col:3});expect(next.board[4][3]).toBe(0);expect(next.board[4][4]).toBe(1);expect(next.board[4][5]).toBe(2);});
 it('cannot push when the cell behind the enemy is occupied',()=>{const board=createBoard();board[4][3]=1;board[4][4]=2;board[4][5]=2;const legal=chargeSkill.legalTargets({state:createCombatState(board,3),player:1},{row:4,col:3});expect(legal).not.toContainEqual({row:4,col:4});});
 it('cannot push an enemy off the board',()=>{const board=createBoard();board[4][7]=1;board[4][8]=2;const legal=chargeSkill.legalTargets({state:createCombatState(board,3),player:1},{row:4,col:7});expect(legal).not.toContainEqual({row:4,col:8});});
});
