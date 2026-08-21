import { CpuCapability } from './cpu-difficulty';

export const CPU_DIFFICULTIES=['easy','normal','hard','extreme','manic','chaos'] as const;
export type CpuDifficultyId=typeof CPU_DIFFICULTIES[number];

export interface CpuDifficultyTierDefinition{
  id:CpuDifficultyId;
  order:number;
  profileLevel:number;
  capabilities:readonly CpuCapability[];
}

// M7.3-R is an abstraction migration, not a silent difficulty rebalance.
// Reuse the previously calibrated Lv.1/3/5/7/10/20 anchors while the
// named tiers are calibrated behaviorally in M7.4+.
const PROFILE_LEVELS:Record<CpuDifficultyId,number>={
  easy:1,
  normal:3,
  hard:5,
  extreme:7,
  manic:10,
  chaos:20,
};

const CAPABILITY_MATRIX:Record<CpuDifficultyId,readonly CpuCapability[]>={
  easy:['immediate-tactics'],
  normal:['immediate-tactics','pattern-recognition'],
  hard:['immediate-tactics','pattern-recognition','threat-planning'],
  extreme:['immediate-tactics','pattern-recognition','threat-planning','lookahead-search','skill-aware-search'],
  manic:['immediate-tactics','pattern-recognition','threat-planning','lookahead-search','skill-aware-search','multi-turn-combo','strategic-evaluation'],
  chaos:['immediate-tactics','pattern-recognition','threat-planning','lookahead-search','skill-aware-search','multi-turn-combo','strategic-evaluation','opponent-modeling','deep-selective-search'],
};

export const CPU_DEFAULT_DIFFICULTY:CpuDifficultyId='normal';

export const CPU_DIFFICULTY_TIERS:readonly CpuDifficultyTierDefinition[]=CPU_DIFFICULTIES.map((id,order)=>({
  id,
  order,
  profileLevel:PROFILE_LEVELS[id],
  capabilities:CAPABILITY_MATRIX[id],
}));

export function isCpuDifficultyId(value:unknown):value is CpuDifficultyId{
  return typeof value==='string'&&(CPU_DIFFICULTIES as readonly string[]).includes(value);
}

export function cpuDifficultyTier(id:CpuDifficultyId=CPU_DEFAULT_DIFFICULTY):CpuDifficultyTierDefinition{
  return CPU_DIFFICULTY_TIERS.find(tier=>tier.id===id)??CPU_DIFFICULTY_TIERS[1];
}

export function cpuProfileLevelForDifficulty(id:CpuDifficultyId):number{
  return cpuDifficultyTier(id).profileLevel;
}

export function closestDifficultyForProfileLevel(level:number):CpuDifficultyId{
  let best=CPU_DIFFICULTY_TIERS[0];
  for(const tier of CPU_DIFFICULTY_TIERS){
    if(Math.abs(tier.profileLevel-level)<Math.abs(best.profileLevel-level))best=tier;
  }
  return best.id;
}
