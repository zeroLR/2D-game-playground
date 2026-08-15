import { describe,expect,it } from 'vitest';
import { FEEDBACK_MS,Scheduler,createCombatFeedback } from '../src/ui/feedback';

/** Collects scheduled callbacks so timing can be driven by the test instead of the clock. */
function manualScheduler(){
  const pending:{callback:()=>void;delay:number}[]=[];
  const schedule:Scheduler=(callback,delay)=>{pending.push({callback,delay});return pending.length as unknown as ReturnType<typeof setTimeout>;};
  return {schedule,pending,flush(){const queued=pending.splice(0,pending.length);queued.forEach((entry)=>entry.callback());}};
}

describe('R6 combat feedback',()=>{
 it('starts with nothing to draw',()=>{
  const feedback=createCombatFeedback(()=>{});
  expect(feedback.state()).toEqual({lastMove:null,winCells:[],actionPulse:null,passivePulse:null,flash:null,manaPulse:0,passiveBanner:false});
 });
 it('retires an action pulse after its timer',()=>{
  const clock=manualScheduler();let renders=0;
  const feedback=createCombatFeedback(()=>{renders++;},clock.schedule);
  feedback.showAction({row:4,col:4});
  expect(feedback.state().actionPulse).toEqual({row:4,col:4});
  expect(renders).toBe(1);
  expect(clock.pending[0].delay).toBe(FEEDBACK_MS.action);
  clock.flush();
  expect(feedback.state().actionPulse).toBeNull();
  expect(renders).toBe(2);
 });
 it('raises and retires the passive banner together',()=>{
  const clock=manualScheduler();
  const feedback=createCombatFeedback(()=>{},clock.schedule);
  feedback.showPassiveTriggered({row:1,col:1});
  expect(feedback.state().passiveBanner).toBe(true);
  clock.flush();
  expect(feedback.state()).toMatchObject({passiveBanner:false,passivePulse:null});
 });
 it('ignores a Mana pulse of zero',()=>{
  const clock=manualScheduler();
  const feedback=createCombatFeedback(()=>{},clock.schedule);
  feedback.showManaGain(0,FEEDBACK_MS.manaPlace);
  expect(feedback.state().manaPulse).toBe(0);
  expect(clock.pending).toHaveLength(0);
 });
 it('marks moves and winning lines without forcing a render',()=>{
  let renders=0;
  const feedback=createCombatFeedback(()=>{renders++;},manualScheduler().schedule);
  feedback.markMove({row:2,col:2});
  feedback.markWinningLine([{row:2,col:2}]);
  expect(renders).toBe(0);
  expect(feedback.state().lastMove).toEqual({row:2,col:2});
  expect(feedback.state().winCells).toHaveLength(1);
 });
 it('clear() drops both marks and pending timers',()=>{
  const clock=manualScheduler();
  const feedback=createCombatFeedback(()=>{},clock.schedule);
  feedback.showInvalidTarget({row:0,col:0});
  feedback.markMove({row:1,col:1});
  feedback.clear();
  expect(feedback.state()).toEqual({lastMove:null,winCells:[],actionPulse:null,passivePulse:null,flash:null,manaPulse:0,passiveBanner:false});
 });
});
