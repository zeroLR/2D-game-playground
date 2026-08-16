import { Player, Pos, createBoard, winningLine } from '../game';
import { CombatState, createCombatState, getMana } from '../combat';
import { SkillId, skills } from '../skills';
import { HeroDefinition, HeroId, Loadout, createLoadout, heroes } from '../heroes';
import { PlaytestMetrics, createPlaytestMetrics, finishMetrics, recordMana, recordManaWaste, recordPlacement, recordSkill, recordSkillOpportunities, recordTurnStart } from '../telemetry';
import { ActionResolution, resolvePlaceAction, resolveSkillAction } from './action-resolution';
import { CpuResolution, resolveCpuTurn } from './cpu-runtime';
import { IDLE_TARGETING, SkillTargetingState, TargetingHighlights, selectTargetingCell, targetingHighlights, toggleTargeting } from './targeting';
import { SkillBarItem, StatusKey, describeSkillBar, statusKey } from './presentation';
import { MatchStatus, TurnState, completeCpuTurn, completePlayerTurn, continuePlayerTurn, createTurnState, endMatch, isPlayerInput } from './turn-runtime';

export const PLAYER:Player=1;
const CPU_DELAY=500,CPU_DELAY_AFTER_PASSIVE=900;
const heroIds=Object.keys(heroes) as HeroId[];
export function randomCpuHero(random:()=>number=Math.random):HeroId{return heroIds[Math.floor(random()*heroIds.length)]??'vanguard';}

export type MatchEvent=|{kind:'reset'}|{kind:'move';at:Pos}|{kind:'mana-gain';amount:number;fromSkill:boolean}|{kind:'passive';at:Pos}|{kind:'action';at:Pos}|{kind:'invalid';at:Pos}|{kind:'winning-line';cells:Pos[]};
export type Timer=ReturnType<typeof setTimeout>;
export interface MatchRuntimeOptions{heroId:HeroId;schedule:(callback:()=>void,delay:number)=>Timer;cancel:(timer:Timer)=>void;onChange:()=>void;onEvent:(event:MatchEvent)=>void;initialState?:()=>CombatState;cpuHeroId?:HeroId;random?:()=>number;}
export interface MatchSnapshot{state:CombatState;turn:TurnState;hero:HeroDefinition;cpuHero:HeroDefinition;loadout:Loadout;mana:number;cpuMana:number;status:StatusKey;highlights:TargetingHighlights;skillBar:SkillBarItem[];acceptsInput:boolean;}
export interface MatchRuntime{snapshot():MatchSnapshot;metrics():PlaytestMetrics;heroId():HeroId;cpuHeroId():HeroId;selectHero(heroId:HeroId):void;reset():void;selectSkill(skillId:SkillId):void;tapCell(pos:Pos):void;dispose():void;}

export function createMatchRuntime({heroId,schedule,cancel,onChange,onEvent,initialState=()=>createCombatState(createBoard()),cpuHeroId,random=Math.random}:MatchRuntimeOptions):MatchRuntime{
 let hero=heroId;let cpuHero=cpuHeroId??randomCpuHero(random);let loadout=createLoadout(hero);let combat=initialState();let metrics=createPlaytestMetrics(hero,getMana(combat,PLAYER));let turn=createTurnState();let targeting:SkillTargetingState=IDLE_TARGETING;let cpuTimer:Timer|null=null;let turnStartRecorded=false;
 const clearCpuTimer=()=>{if(cpuTimer!==null){cancel(cpuTimer);cpuTimer=null;}};
 const decide=(status:Exclude<MatchStatus,'playing'>)=>{turn=endMatch(turn,status);finishMetrics(metrics,status,getMana(combat,PLAYER));onChange();};
 function reset(){clearCpuTimer();if(!cpuHeroId)cpuHero=randomCpuHero(random);combat=initialState();metrics=createPlaytestMetrics(hero,getMana(combat,PLAYER));turn=createTurnState();targeting=IDLE_TARGETING;turnStartRecorded=false;onEvent({kind:'reset'});}
 function finishPlayerTurn(delay:number){recordMana(metrics,getMana(combat,PLAYER));turnStartRecorded=false;const done=completePlayerTurn(combat,turn);combat=done.state;turn=done.turn;onChange();cpuTimer=schedule(runCpuTurn,delay);}
 function keepPlayerTurn(){turn=continuePlayerTurn(turn);onChange();}
 function recordCurrentTurnStart(){if(!turnStartRecorded){recordTurnStart(metrics,getMana(combat,PLAYER));turnStartRecorded=true;}}
 function hasLegalOpportunity(skillId:SkillId){const skill=skills[skillId];if(getMana(combat,PLAYER)<skill.cost)return false;const context={state:combat,player:PLAYER};if(skill.legalSources){return skill.legalSources(context).some((source)=>skill.legalTargets(context,source).length>0);}return skill.legalTargets(context).length>0;}
 function currentSkillOpportunities(){return loadout.skills.filter(hasLegalOpportunity);}
 function applyResolution(resolution:ActionResolution,opportunities:readonly SkillId[]){
  const manaBefore=getMana(combat,PLAYER);recordSkillOpportunities(metrics,opportunities);combat=resolution.state;const mana=getMana(combat,PLAYER);const generated=resolution.skillId?resolution.passiveMana:resolution.manaGained+resolution.passiveMana;recordManaWaste(metrics,generated,manaBefore-(resolution.skillId?resolution.skillCost:0),mana);
  resolution.skillId?recordSkill(metrics,resolution.skillId,resolution.skillCost,resolution.passiveTriggered,resolution.passiveMana,mana,manaBefore):recordPlacement(metrics,resolution.manaGained,resolution.passiveTriggered,resolution.passiveMana,mana);
  targeting=IDLE_TARGETING;onEvent({kind:'move',at:resolution.at});onEvent({kind:'mana-gain',amount:resolution.skillId?resolution.passiveMana:resolution.manaGained,fromSkill:!!resolution.skillId});if(resolution.passiveTriggered)onEvent({kind:'passive',at:resolution.at});
  if(resolution.won){onEvent({kind:'winning-line',cells:winningLine(combat.board,resolution.at,PLAYER)});decide('victory');return;}
  onEvent({kind:'action',at:resolution.at});if(!resolution.consumedTurn){keepPlayerTurn();return;}finishPlayerTurn(resolution.passiveTriggered?CPU_DELAY_AFTER_PASSIVE:CPU_DELAY);
 }
 function runCpuTurn(){cpuTimer=null;const cpu:CpuResolution=resolveCpuTurn(combat,cpuHero);if(cpu.outcome==='draw'){decide('draw');return;}if(cpu.outcome==='blocked'){keepPlayerTurn();return;}combat=cpu.state;onEvent({kind:'move',at:cpu.at!});if(cpu.outcome==='won'){onEvent({kind:'winning-line',cells:winningLine(combat.board,cpu.at!,2)});decide('defeat');return;}const done=completeCpuTurn(combat,turn);combat=done.state;turn=done.turn;turnStartRecorded=false;onEvent({kind:'action',at:cpu.at!});}
 return {snapshot:()=>({state:combat,turn,hero:heroes[hero],cpuHero:heroes[cpuHero],loadout,mana:getMana(combat,PLAYER),cpuMana:getMana(combat,2),status:statusKey(turn,targeting),highlights:targetingHighlights(combat,PLAYER,targeting),skillBar:describeSkillBar(combat,PLAYER,loadout,turn,targeting),acceptsInput:isPlayerInput(turn)}),metrics:()=>metrics,heroId:()=>hero,cpuHeroId:()=>cpuHero,selectHero(next){hero=next;loadout=createLoadout(next);},reset,selectSkill(skillId){if(!isPlayerInput(turn)||!loadout.skills.includes(skillId)||getMana(combat,PLAYER)<skills[skillId].cost)return;recordCurrentTurnStart();targeting=toggleTargeting(targeting,skillId);onChange();},tapCell(pos){if(!isPlayerInput(turn))return;recordCurrentTurnStart();const opportunities=currentSkillOpportunities();if(targeting.mode!=='idle'){const intent=selectTargetingCell(combat,PLAYER,targeting,pos);if(intent.kind==='invalid'){onEvent({kind:'invalid',at:pos});return;}if(intent.kind==='source'){targeting=intent.targeting;onChange();return;}const cast=resolveSkillAction(combat,hero,PLAYER,intent.skillId,intent.target,intent.source);cast.ok?applyResolution(cast,opportunities):onEvent({kind:'invalid',at:pos});return;}const placement=resolvePlaceAction(combat,hero,PLAYER,pos);placement.ok?applyResolution(placement,opportunities):onEvent({kind:'invalid',at:pos});},dispose:clearCpuTimer};
}
