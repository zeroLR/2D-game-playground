import { Pos } from '../game';
import type { BoardFeedback } from './board-layout';
export const FEEDBACK_MS={action:220,skillTrail:700,passive:850,invalid:180,manaPlace:420,manaSkill:520} as const;
export interface FeedbackState extends BoardFeedback{manaPulse:number;passiveBanner:boolean}
export type Scheduler=(callback:()=>void,delay:number)=>ReturnType<typeof setTimeout>;
export interface CombatFeedback{state():FeedbackState;markMove(pos:Pos|null):void;markWinningLine(cells:Pos[]):void;showManaGain(amount:number,duration:number):void;showAction(pos:Pos):void;showSkillTrail(source:Pos,target:Pos):void;showPassiveTriggered(pos:Pos):void;showInvalidTarget(pos:Pos):void;clear():void;}
const emptyState=():FeedbackState=>({lastMove:null,winCells:[],actionPulse:null,passivePulse:null,flash:null,skillTrail:null,manaPulse:0,passiveBanner:false});
export function createCombatFeedback(onChange:()=>void,schedule:Scheduler=setTimeout):CombatFeedback{
 let current=emptyState();const timers=new Set<ReturnType<typeof setTimeout>>();const after=(delay:number,retire:()=>void)=>{const timer=schedule(()=>{timers.delete(timer);retire();onChange();},delay);timers.add(timer);};
 return {state:()=>current,markMove(pos){current={...current,lastMove:pos};},markWinningLine(cells){current={...current,winCells:cells};},showManaGain(amount,duration){if(amount<=0)return;current={...current,manaPulse:amount};after(duration,()=>{current={...current,manaPulse:0};});},showAction(pos){current={...current,actionPulse:pos};onChange();after(FEEDBACK_MS.action,()=>{current={...current,actionPulse:null};});},showSkillTrail(source,target){current={...current,skillTrail:{source,target}};onChange();after(FEEDBACK_MS.skillTrail,()=>{current={...current,skillTrail:null};});},showPassiveTriggered(pos){current={...current,passivePulse:pos,passiveBanner:true};onChange();after(FEEDBACK_MS.passive,()=>{current={...current,passivePulse:null,passiveBanner:false};});},showInvalidTarget(pos){current={...current,flash:pos};onChange();after(FEEDBACK_MS.invalid,()=>{current={...current,flash:null};});},clear(){timers.forEach((timer)=>clearTimeout(timer));timers.clear();current=emptyState();}};
}
