export interface CpuDifficultyProfile {
  level:number;
  patternDepth:number;
  searchDepth:number;
  candidateWidth:number;
  skillPlanningDepth:number;
  threatAwareness:number;
  defenseAwareness:number;
  optimalMoveRate:number;
  blunderTolerance:number;
}

export const CPU_LEVEL_MIN=1;
export const CPU_LEVEL_MAX=20;
export const CPU_BASELINE_LEVEL=3;

const anchors:Record<number,CpuDifficultyProfile>={
  1:{level:1,patternDepth:1,searchDepth:0,candidateWidth:3,skillPlanningDepth:0,threatAwareness:.45,defenseAwareness:.55,optimalMoveRate:.40,blunderTolerance:.25},
  3:{level:3,patternDepth:2,searchDepth:1,candidateWidth:4,skillPlanningDepth:0,threatAwareness:.70,defenseAwareness:.80,optimalMoveRate:.55,blunderTolerance:.15},
  5:{level:5,patternDepth:3,searchDepth:1,candidateWidth:6,skillPlanningDepth:1,threatAwareness:.85,defenseAwareness:.90,optimalMoveRate:.70,blunderTolerance:.08},
  7:{level:7,patternDepth:4,searchDepth:2,candidateWidth:8,skillPlanningDepth:2,threatAwareness:.95,defenseAwareness:.95,optimalMoveRate:.85,blunderTolerance:.03},
  10:{level:10,patternDepth:5,searchDepth:3,candidateWidth:10,skillPlanningDepth:3,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.94,blunderTolerance:.01},
  20:{level:20,patternDepth:6,searchDepth:4,candidateWidth:14,skillPlanningDepth:4,threatAwareness:1,defenseAwareness:1,optimalMoveRate:.99,blunderTolerance:0},
};
const keys=Object.keys(anchors).map(Number).sort((a,b)=>a-b);
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const lerpInt=(a:number,b:number,t:number)=>Math.round(lerp(a,b,t));
export function cpuDifficulty(level:number=CPU_BASELINE_LEVEL):CpuDifficultyProfile {
  const target=Math.max(CPU_LEVEL_MIN,Math.min(CPU_LEVEL_MAX,Math.round(level)));
  if(anchors[target])return {...anchors[target]};
  const hi=keys.find((key)=>key>target)??CPU_LEVEL_MAX,lo=[...keys].reverse().find((key)=>key<target)??CPU_LEVEL_MIN,a=anchors[lo],b=anchors[hi],t=(target-lo)/(hi-lo);
  return {level:target,patternDepth:lerpInt(a.patternDepth,b.patternDepth,t),searchDepth:lerpInt(a.searchDepth,b.searchDepth,t),candidateWidth:lerpInt(a.candidateWidth,b.candidateWidth,t),skillPlanningDepth:lerpInt(a.skillPlanningDepth,b.skillPlanningDepth,t),threatAwareness:lerp(a.threatAwareness,b.threatAwareness,t),defenseAwareness:lerp(a.defenseAwareness,b.defenseAwareness,t),optimalMoveRate:lerp(a.optimalMoveRate,b.optimalMoveRate,t),blunderTolerance:lerp(a.blunderTolerance,b.blunderTolerance,t)};
}
