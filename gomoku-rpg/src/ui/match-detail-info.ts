import { HeroId,createLoadout } from '../heroes';

export interface MatchParticipantInfo{heroId:HeroId;passive:string;skills:readonly string[];cpuLevel?:number;}
export function matchParticipantInfo(heroId:HeroId,cpuLevel?:number):MatchParticipantInfo{const loadout=createLoadout(heroId);return {heroId,passive:loadout.passive,skills:loadout.skills,cpuLevel};}
