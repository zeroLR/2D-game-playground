import { HeroId,createLoadout } from '../heroes';
import { CpuDifficultyId } from '../runtime/cpu-difficulty-tier';

export interface MatchParticipantInfo{heroId:HeroId;passive:string;skills:readonly string[];cpuDifficulty?:CpuDifficultyId;cpuProfileLevel?:number;}
export function matchParticipantInfo(heroId:HeroId,cpuDifficulty?:CpuDifficultyId,cpuProfileLevel?:number):MatchParticipantInfo{const loadout=createLoadout(heroId);return {heroId,passive:loadout.passive,skills:loadout.skills,cpuDifficulty,cpuProfileLevel};}
