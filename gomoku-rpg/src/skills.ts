import { Cell, Player, Pos } from './game';
import { CombatState, addGuard, addSeal, isGuarded, isSealed, samePos, spendMana } from './combat';

export type SkillId='blink'|'guard'|'seal';
export type SkillOwnership='common'|'hero';
export type SkillTargetType='friendly-then-empty'|'friendly'|'empty';
export type SkillContext={state:CombatState;player:Player};
export type SkillDefinition={id:SkillId;ownership:SkillOwnership;cost:number;targetType:SkillTargetType;descriptionKey:'blinkHelp'|'guardHelp'|'sealHelp';legalSources?:(context:SkillContext)=>Pos[];legalTargets:(context:SkillContext,source?:Pos)=>Pos[];execute:(context:SkillContext,target:Pos,source?:Pos)=>CombatState};

function positions(board:Cell[][],predicate:(cell:Cell,pos:Pos)=>boolean):Pos[]{const out:Pos[]=[];board.forEach((row,r)=>row.forEach((cell,c)=>{const pos={row:r,col:c};if(predicate(cell,pos))out.push(pos);}));return out;}

export const blinkSkill:SkillDefinition={id:'blink',ownership:'common',cost:2,targetType:'friendly-then-empty',descriptionKey:'blinkHelp',
  legalSources:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),
  legalTargets:({state},source)=>source?positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)):[],
  execute:({state,player},target,source)=>{if(!source)return state;const board=state.board.map((row)=>[...row]);board[source.row][source.col]=0;board[target.row][target.col]=player;return spendMana({...state,board},player,2);}
};
/** Legacy hero skills stay executable during the architecture migration. New hero-specific skills will replace them one vertical slice at a time. */
export const guardSkill:SkillDefinition={id:'guard',ownership:'hero',cost:2,targetType:'friendly',descriptionKey:'guardHelp',legalTargets:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),execute:({state,player},target)=>spendMana(addGuard(state,target,player),player,2)};
export const sealSkill:SkillDefinition={id:'seal',ownership:'hero',cost:2,targetType:'empty',descriptionKey:'sealHelp',legalTargets:({state})=>positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)),execute:({state,player},target)=>spendMana(addSeal(state,target,player),player,2)};
export const skills:Record<SkillId,SkillDefinition>={blink:blinkSkill,guard:guardSkill,seal:sealSkill};
export const commonSkillIds=Object.values(skills).filter((skill)=>skill.ownership==='common').map((skill)=>skill.id);
export function isLegalPosition(candidate:Pos,legal:Pos[]){return legal.some((pos)=>samePos(candidate,pos));}
