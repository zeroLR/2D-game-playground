import { Cell, Player, Pos } from './game';
import { CombatState, addGuard, addSeal, isGuarded, isSealed, samePos, spendMana } from './combat';

export type SkillId='blink'|'guard'|'seal'|'corrupt';
export type SkillOwnership='common'|'hero';
export type SkillTargetType='friendly-then-empty'|'friendly'|'empty'|'enemy-adjacent';
export type SkillContext={state:CombatState;player:Player};
export type SkillDefinition={id:SkillId;ownership:SkillOwnership;cost:number;targetType:SkillTargetType;descriptionKey:'blinkHelp'|'guardHelp'|'sealHelp'|'corruptHelp';legalSources?:(context:SkillContext)=>Pos[];legalTargets:(context:SkillContext,source?:Pos)=>Pos[];execute:(context:SkillContext,target:Pos,source?:Pos)=>CombatState};

function positions(board:Cell[][],predicate:(cell:Cell,pos:Pos)=>boolean):Pos[]{const out:Pos[]=[];board.forEach((row,r)=>row.forEach((cell,c)=>{const pos={row:r,col:c};if(predicate(cell,pos))out.push(pos);}));return out;}
const adjacent=(a:Pos,b:Pos)=>Math.max(Math.abs(a.row-b.row),Math.abs(a.col-b.col))===1;

export const blinkSkill:SkillDefinition={id:'blink',ownership:'common',cost:2,targetType:'friendly-then-empty',descriptionKey:'blinkHelp',
  legalSources:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),
  legalTargets:({state},source)=>source?positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)):[],
  execute:({state,player},target,source)=>{if(!source)return state;const board=state.board.map((row)=>[...row]);board[source.row][source.col]=0;board[target.row][target.col]=player;return spendMana({...state,board},player,2);}
};
/** Legacy hero skills stay executable during the architecture migration. */
export const guardSkill:SkillDefinition={id:'guard',ownership:'hero',cost:2,targetType:'friendly',descriptionKey:'guardHelp',legalTargets:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),execute:({state,player},target)=>spendMana(addGuard(state,target,player),player,2)};
export const sealSkill:SkillDefinition={id:'seal',ownership:'hero',cost:2,targetType:'empty',descriptionKey:'sealHelp',legalTargets:({state})=>positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)),execute:({state,player},target)=>spendMana(addSeal(state,target,player),player,2)};
/** Shade vertical slice: trade a whole turn and 3 Mana to break an enemy structure. The target must touch one of Shade's stones, tying the skill directly to Pressure's invasive positioning. */
export const corruptSkill:SkillDefinition={id:'corrupt',ownership:'hero',cost:3,targetType:'enemy-adjacent',descriptionKey:'corruptHelp',
  legalTargets:({state,player})=>positions(state.board,(cell,pos)=>cell!==0&&cell!==player&&!isGuarded(state,pos)&&state.board.some((row,r)=>row.some((own,c)=>own===player&&adjacent(pos,{row:r,col:c})))),
  execute:({state,player},target)=>{const enemy=player===1?2:1;if(state.board[target.row]?.[target.col]!==enemy)return state;const board=state.board.map((row)=>[...row]);board[target.row][target.col]=0;return spendMana({...state,board},player,3);}
};
export const skills:Record<SkillId,SkillDefinition>={blink:blinkSkill,guard:guardSkill,seal:sealSkill,corrupt:corruptSkill};
export const commonSkillIds=Object.values(skills).filter((skill)=>skill.ownership==='common').map((skill)=>skill.id);
export function isLegalPosition(candidate:Pos,legal:Pos[]){return legal.some((pos)=>samePos(candidate,pos));}
