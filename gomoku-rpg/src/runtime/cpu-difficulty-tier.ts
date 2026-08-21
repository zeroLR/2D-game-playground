import { CpuCapability,cpuDifficulty } from './cpu-difficulty';

export const CPU_DIFFICULTIES=['easy','normal','hard','extreme','manic','chaos'] as const;
export type CpuDifficultyId=typeof CPU_DIFFICULTIES[number];

export interface CpuDifficultyTierDefinition{
  id:CpuDifficultyId;
  order:number;
  profileLevel:number;
  capabilities:readonly CpuCapability[];
}

const PROFILE_LEVELS:Record<CpuDifficultyId,number>={
  easy:5,
  normal:20,
  hard:30,
  extreme:50,
  manic:70,
  chaos:90,
};

export const CPU_DEFAULT_DIFFICULTY:CpuDifficultyId='normal';

export const CPU_DIFFICULTY_TIERS:readonly CpuDifficultyTierDefinition[]=CPU_DIFFICULTIES.map((id,order)=>{
  const profileLevel=PROFILE_LEVELS[id];
  return {id,order,profileLevel,capabilities:cpuDifficulty(profileLevel).capabilities};
});

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
