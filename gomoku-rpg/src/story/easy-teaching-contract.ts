import type { PlaytestMetrics } from '../telemetry';

export type EasyTeachingConcept='five-in-row'|'basic-block'|'open-two'|'open-three'|'mana-generation'|'blink'|'charge'|'vanguard-identity';
export type EasyEncounterId='E1-1'|'E1-2'|'E1-3'|'E1-4'|'E1-5'|'E1-BOSS';

export interface EasyTeachingEncounter{
  id:EasyEncounterId;
  title:string;
  concepts:readonly EasyTeachingConcept[];
  objective:string;
  cpuDifficulty:'easy'|'normal';
  teachingRule:string;
  completionSignal:string;
}

/** Story owns teaching. Free Battle Easy may use the same weak CPU without scripted guidance. */
export const EASY_STORY_TEACHING_CONTRACT:readonly EasyTeachingEncounter[]=[
  {id:'E1-1',title:'Five to Win',concepts:['five-in-row'],objective:'Complete a five-in-a-row while learning legal placement and the victory condition.',cpuDifficulty:'easy',teachingRule:'Keep the board readable and do not introduce skills as required actions.',completionSignal:'Player completes a legal five-in-a-row.'},
  {id:'E1-2',title:'Build a Threat',concepts:['open-two','open-three','basic-block'],objective:'Show how a small line becomes a forcing threat and why open ends matter.',cpuDifficulty:'easy',teachingRule:'Present one obvious offensive line and one obvious block opportunity.',completionSignal:'Player creates or blocks an open-three pattern.'},
  {id:'E1-3',title:'Mana from Shape',concepts:['mana-generation','vanguard-identity'],objective:'Connect pattern creation to Mana gain without requiring immediate skill mastery.',cpuDifficulty:'easy',teachingRule:'Guarantee a readable pattern-to-Mana opportunity before the match becomes tactically dense.',completionSignal:'Player gains pattern Mana and reaches at least 2 Mana.'},
  {id:'E1-4',title:'Blink Lesson',concepts:['blink','mana-generation'],objective:'Teach that Mana can convert into board manipulation through Blink.',cpuDifficulty:'easy',teachingRule:'Create a clearly beneficial Blink opportunity and surface guidance before allowing the player to ignore it indefinitely.',completionSignal:'Player successfully uses Blink at least once.'},
  {id:'E1-5',title:'Vanguard Charge',concepts:['charge','vanguard-identity'],objective:'Demonstrate Charge as a structural/tempo tool rather than a generic power button.',cpuDifficulty:'easy',teachingRule:'Construct a board state where Charge produces an immediately visible positional benefit.',completionSignal:'Player successfully uses Charge at least once and changes a contested line.'},
  {id:'E1-BOSS',title:'Qualification Match',concepts:['open-three','basic-block','mana-generation','blink','charge','vanguard-identity'],objective:'Verify that the player can combine basic Gomoku reading and Vanguard skills without scripted hand-holding.',cpuDifficulty:'normal',teachingRule:'Use the next tier as a preview. No mandatory tutorial prompts after the opening reminder.',completionSignal:'Player defeats the Normal-preview Boss.'},
];

export interface EasyTeachingTelemetryAssessment{
  skillUses:number;
  skillOpportunities:number;
  skillUseRate:number;
  skillIgnoranceSuccess:boolean;
  manaNeglect:boolean;
  readyForBoss:boolean;
}

export function assessEasyTeachingMetrics(metrics:PlaytestMetrics):EasyTeachingTelemetryAssessment{
  const skillUses=Object.values(metrics.skillUses).reduce((sum,value)=>sum+value,0);
  const skillOpportunities=Object.values(metrics.skillOpportunities).reduce((sum,value)=>sum+value,0);
  const skillUseRate=skillOpportunities?skillUses/skillOpportunities:0;
  const skillIgnoranceSuccess=metrics.outcome==='victory'&&skillOpportunities>=4&&skillUses===0;
  const manaNeglect=metrics.manaWasted>=5||metrics.manaCappedTurns>=4;
  const usedStarterSkill=(metrics.skillUses.blink??0)>0||(metrics.skillUses.charge??0)>0;
  const readyForBoss=metrics.outcome==='victory'&&usedStarterSkill&&!manaNeglect;
  return {skillUses,skillOpportunities,skillUseRate,skillIgnoranceSuccess,manaNeglect,readyForBoss};
}
