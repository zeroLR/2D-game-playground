import { Pos } from '../game';
import { BoardFeedback } from './board-view';

/** Milliseconds each transient mark stays on screen. */
export const FEEDBACK_MS={action:220,passive:850,invalid:180,manaPlace:420,manaSkill:520} as const;

export interface FeedbackState extends BoardFeedback{manaPulse:number;passiveBanner:boolean}
export type Scheduler=(callback:()=>void,delay:number)=>ReturnType<typeof setTimeout>;

/**
 * Owns every transient presentation mark (pulses, flashes, banner) and the timers that
 * retire them. It reads nothing from the rules and mutates no CombatState.
 */
export interface CombatFeedback{
  state():FeedbackState;
  /** Silent marks: the caller renders once it has finished applying a resolution. */
  markMove(pos:Pos|null):void;
  markWinningLine(cells:Pos[]):void;
  showManaGain(amount:number,duration:number):void;
  /** Animated marks: these render immediately and retire themselves. */
  showAction(pos:Pos):void;
  showPassiveTriggered(pos:Pos):void;
  showInvalidTarget(pos:Pos):void;
  clear():void;
}

const emptyState=():FeedbackState=>({lastMove:null,winCells:[],actionPulse:null,passivePulse:null,flash:null,manaPulse:0,passiveBanner:false});

export function createCombatFeedback(onChange:()=>void,schedule:Scheduler=setTimeout):CombatFeedback{
  let current=emptyState();
  const timers=new Set<ReturnType<typeof setTimeout>>();
  const after=(delay:number,retire:()=>void)=>{
    const timer=schedule(()=>{timers.delete(timer);retire();onChange();},delay);
    timers.add(timer);
  };
  return {
    state:()=>current,
    markMove(pos){current={...current,lastMove:pos};},
    markWinningLine(cells){current={...current,winCells:cells};},
    showManaGain(amount,duration){
      if(amount<=0)return;
      current={...current,manaPulse:amount};
      after(duration,()=>{current={...current,manaPulse:0};});
    },
    showAction(pos){
      current={...current,actionPulse:pos};onChange();
      after(FEEDBACK_MS.action,()=>{current={...current,actionPulse:null};});
    },
    showPassiveTriggered(pos){
      current={...current,passivePulse:pos,passiveBanner:true};onChange();
      after(FEEDBACK_MS.passive,()=>{current={...current,passivePulse:null,passiveBanner:false};});
    },
    showInvalidTarget(pos){
      current={...current,flash:pos};onChange();
      after(FEEDBACK_MS.invalid,()=>{current={...current,flash:null};});
    },
    clear(){
      timers.forEach((timer)=>clearTimeout(timer));timers.clear();
      current=emptyState();
    },
  };
}
