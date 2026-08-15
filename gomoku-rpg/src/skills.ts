import { Cell, Player, Pos } from './game';
import { CombatState, addGuard, addSeal, isGuarded, isSealed, samePos, spendMana } from './combat';

export type SkillTargetType='friendly-then-empty'|'friendly'|'empty';
export type SkillContext={state:CombatState;player:Player};
export type SkillDefinition={id:'blink'|'guard'|'seal';cost:number;targetType:SkillTargetType;descriptionKey:'blinkHelp'|'guardHelp'|'sealHelp';legalSources?:(context:SkillContext)=>Pos[];legalTargets:(context:SkillContext,source?:Pos)=>Pos[];execute:(context:SkillContext,target:Pos,source?:Pos)=>CombatState};

function positions(board:Cell[][],predicate:(cell:Cell,pos:Pos)=>boolean):Pos[]{const out:Pos[]=[];board.forEach((row,r)=>row.forEach((cell,c)=>{const pos={row:r,col:c};if(predicate(cell,pos))out.push(pos);}));return out;}

export const blinkSkill:SkillDefinition={id:'blink',cost:2,targetType:'friendly-then-empty',descriptionKey:'blinkHelp',
  legalSources:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),
  legalTargets:({state},source)=>source?positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)):[],
  execute:({state,player},target,source)=>{if(!source)return state;const board=state.board.map((row)=>[...row]);board[source.row][source.col]=0;board[target.row][target.col]=player;return spendMana({...state,board},player,2);}
};
export const guardSkill:SkillDefinition={id:'guard',cost:2,targetType:'friendly',descriptionKey:'guardHelp',legalTargets:({state,player})=>positions(state.board,(cell,pos)=>cell===player&&!isGuarded(state,pos)),execute:({state,player},target)=>spendMana(addGuard(state,target,player),player,2)};
export const sealSkill:SkillDefinition={id:'seal',cost:2,targetType:'empty',descriptionKey:'sealHelp',legalTargets:({state})=>positions(state.board,(cell,pos)=>cell===0&&!isSealed(state,pos)),execute:({state,player},target)=>spendMana(addSeal(state,target,player),player,2)};
export const skills={blink:blinkSkill,guard:guardSkill,seal:sealSkill} as const;
export type SkillId=keyof typeof skills;
export function isLegalPosition(candidate:Pos,legal:Pos[]){return legal.some((pos)=>samePos(candidate,pos));}
