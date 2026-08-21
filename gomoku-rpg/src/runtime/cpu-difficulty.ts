export type CpuCapability='immediate-tactics'|'pattern-recognition'|'threat-planning'|'lookahead-search'|'skill-aware-search'|'multi-turn-combo'|'strategic-evaluation'|'opponent-modeling'|'deep-selective-search'|'boss-policy';
export interface CpuDifficultyProfile {
  level:number;
  tier:number;
  patternDepth:number;
  searchDepth:number;
  candidateWidth:number;
  skillPlanningDepth:number;
  threatAwareness:number;
  defenseAwareness:number;
  optimalMoveRate:number;
  blunderTolerance:number;
  tacticalAccuracy:number;
  evaluationQuality:number;
  comboPlanning:number;
  opponentModeling:number;
  decisionNoise:number;
  capabilities:readonly CpuCapability[];
}
export const CPU_LEVEL_MIN=1;
export const CPU_LEVEL_MAX=100;
export const CPU_BASELINE_LEVEL=3;

interface DifficultyAnchor extends Omit<CpuDifficultyProfile,'tier'|'capabilities'>{}
const anchors:Record<number,DifficultyAnchor>={
  1:{level:1,patternDepth:1,searchDepth:0,candidateWidth:3,skillPlanningDepth:0,threatAwareness:.45,defenseAwareness:.55,optimalMoveRate:.40,blunderTolerance:.25,tacticalAccuracy:.45,evaluationQuality:.35,comboPlanning:0,opponentModeling:0,decisionNoise:.30},
  5:{level:5,patternDepth:2,searchDepth:0,candidateWidth:5,skillPlanningDepth:0,threatAwareness:.68,defenseAwareness:.75,optimalMoveRate:.58,blunderTolerance:.16,tacticalAccuracy:.68,evaluationQuality:.48,comboPlanning:.05,opponentModeling:0,decisionNoise:.22},
  10:{level:10,patternDepth:3,searchDepth:0,candidateWidth:7,skillPlanningDepth:0,threatAwareness:.88,defenseAwareness:.92,optimalMoveRate:.72,blunderTolerance:.09,tacticalAccuracy:.86,evaluationQuality:.60,comboPlanning:.10,opponentModeling:0,decisionNoise:.15},
  20:{level:20,patternDepth:4,searchDepth:0,candidateWidth:9,skillPlanningDepth:0,threatAwareness:.96,defenseAwareness:.97,optimalMoveRate:.82,blunderTolerance:.055,tacticalAccuracy:.93,evaluationQuality:.70,comboPlanning:.20,opponentModeling:0,decisionNoise:.10},
  30:{level:30,patternDepth:5,searchDepth:1,candidateWidth:11,skillPlanningDepth:0,threatAwareness:.98,defenseAwareness:.985,optimalMoveRate:.87,blunderTolerance:.035,tacticalAccuracy:.96,evaluationQuality:.77,comboPlanning:.32,opponentModeling:0,decisionNoise:.075},
  40:{level:40,patternDepth:5,searchDepth:2,candidateWidth:13,skillPlanningDepth:1,threatAwareness:.99,defenseAwareness:.99,optimalMoveRate:.90,blunderTolerance:.025,tacticalAccuracy:.975,evaluationQuality:.82,comboPlanning:.42,opponentModeling:0,decisionNoise:.055},
  50:{level:50,patternDepth:6,searchDepth:2,candidateWidth:15,skillPlanningDepth:2,threatAwareness:.995,defenseAwareness:.995,optimalMoveRate:.93,blunderTolerance:.018,tacticalAccuracy:.985,evaluationQuality:.86,comboPlanning:.55,opponentModeling:.05,decisionNoise:.04},
  60:{level:60,patternDepth:6,searchDepth:3,candidateWidth:17,skillPlanningDepth:3,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.95,blunderTolerance:.012,tacticalAccuracy:.99,evaluationQuality:.90,comboPlanning:.68,opponentModeling:.10,decisionNoise:.03},
  70:{level:70,patternDepth:7,searchDepth:3,candidateWidth:19,skillPlanningDepth:3,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.965,blunderTolerance:.008,tacticalAccuracy:.994,evaluationQuality:.93,comboPlanning:.76,opponentModeling:.25,decisionNoise:.022},
  80:{level:80,patternDepth:7,searchDepth:4,candidateWidth:21,skillPlanningDepth:4,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.978,blunderTolerance:.005,tacticalAccuracy:.997,evaluationQuality:.95,comboPlanning:.84,opponentModeling:.55,decisionNoise:.015},
  90:{level:90,patternDepth:8,searchDepth:4,candidateWidth:24,skillPlanningDepth:4,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.988,blunderTolerance:.002,tacticalAccuracy:.999,evaluationQuality:.975,comboPlanning:.91,opponentModeling:.75,decisionNoise:.008},
  100:{level:100,patternDepth:8,searchDepth:5,candidateWidth:28,skillPlanningDepth:5,threatAwareness:1,defenseAwareness:1,optimalMoveRate:1,blunderTolerance:0,tacticalAccuracy:1,evaluationQuality:1,comboPlanning:1,opponentModeling:1,decisionNoise:0},
};
const capabilityMilestones:[number,CpuCapability][]=[[10,'immediate-tactics'],[20,'pattern-recognition'],[30,'threat-planning'],[40,'lookahead-search'],[50,'skill-aware-search'],[60,'multi-turn-combo'],[70,'strategic-evaluation'],[80,'opponent-modeling'],[90,'deep-selective-search'],[100,'boss-policy']];
const keys=Object.keys(anchors).map(Number).sort((a,b)=>a-b);
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const lerpInt=(a:number,b:number,t:number)=>Math.round(lerp(a,b,t));
const capabilitiesFor=(level:number)=>capabilityMilestones.filter(([required])=>level>=required).map(([,capability])=>capability);
export function cpuDifficulty(level:number=CPU_BASELINE_LEVEL):CpuDifficultyProfile {
  const target=Math.max(CPU_LEVEL_MIN,Math.min(CPU_LEVEL_MAX,Math.round(level)));
  const exact=anchors[target];
  const profile=exact?{...exact}:(()=>{const hi=keys.find(key=>key>target)??CPU_LEVEL_MAX,lo=[...keys].reverse().find(key=>key<target)??CPU_LEVEL_MIN,a=anchors[lo],b=anchors[hi],t=(target-lo)/(hi-lo);return {level:target,patternDepth:lerpInt(a.patternDepth,b.patternDepth,t),searchDepth:lerpInt(a.searchDepth,b.searchDepth,t),candidateWidth:lerpInt(a.candidateWidth,b.candidateWidth,t),skillPlanningDepth:lerpInt(a.skillPlanningDepth,b.skillPlanningDepth,t),threatAwareness:lerp(a.threatAwareness,b.threatAwareness,t),defenseAwareness:lerp(a.defenseAwareness,b.defenseAwareness,t),optimalMoveRate:lerp(a.optimalMoveRate,b.optimalMoveRate,t),blunderTolerance:lerp(a.blunderTolerance,b.blunderTolerance,t),tacticalAccuracy:lerp(a.tacticalAccuracy,b.tacticalAccuracy,t),evaluationQuality:lerp(a.evaluationQuality,b.evaluationQuality,t),comboPlanning:lerp(a.comboPlanning,b.comboPlanning,t),opponentModeling:lerp(a.opponentModeling,b.opponentModeling,t),decisionNoise:lerp(a.decisionNoise,b.decisionNoise,t)};})();
  return {...profile,tier:Math.ceil(target/5),capabilities:capabilitiesFor(target)};
}
