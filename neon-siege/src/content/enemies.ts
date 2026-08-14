export type EnemyRole = 'grunt' | 'runner' | 'heavy' | 'drone' | 'shield' | 'hacker' | 'sniper' | 'bomber';
export interface EnemyDefinition { id:EnemyRole; name:string; hp:number; speed:number; coreDamage:number; contactDamage:number; reward:number; flying?:boolean; structureDamage?:number; preferredRange?:number; hackRange?:number; resistance?:'ballistic'|'energy'; vulnerability?:'ballistic'|'energy'; }
export const ENEMIES:Record<EnemyRole,EnemyDefinition>={
 grunt:{id:'grunt',name:'GRUNT',hp:38,speed:49,coreDamage:9,contactDamage:9,reward:24},
 runner:{id:'runner',name:'RUNNER',hp:24,speed:92,coreDamage:7,contactDamage:7,reward:22,vulnerability:'energy'},
 heavy:{id:'heavy',name:'HEAVY',hp:110,speed:30,coreDamage:20,contactDamage:18,reward:46,structureDamage:34,resistance:'ballistic',vulnerability:'energy'},
 drone:{id:'drone',name:'DRONE',hp:32,speed:64,coreDamage:8,contactDamage:8,reward:30,flying:true,vulnerability:'ballistic'},
 shield:{id:'shield',name:'SHIELD',hp:86,speed:38,coreDamage:11,contactDamage:10,reward:38,resistance:'ballistic',vulnerability:'energy'},
 hacker:{id:'hacker',name:'HACKER',hp:46,speed:42,coreDamage:8,contactDamage:7,reward:42,hackRange:170},
 sniper:{id:'sniper',name:'SNIPER',hp:34,speed:35,coreDamage:8,contactDamage:14,reward:40,preferredRange:300},
 bomber:{id:'bomber',name:'BOMBER',hp:42,speed:54,coreDamage:18,contactDamage:20,reward:44,structureDamage:80},
};
export interface WaveEntry { role:EnemyRole; count:number; eliteChance?:number; }
export function waveComposition(wave:number):WaveEntry[]{const e:WaveEntry[]=[{role:'grunt',count:Math.max(2,5-Math.floor(wave/3))}];if(wave>=2)e.push({role:'runner',count:2+Math.floor(wave/3)});if(wave>=3)e.push({role:'heavy',count:1+Math.floor(wave/5)});if(wave>=4)e.push({role:'drone',count:1+Math.floor(wave/4)});if(wave>=5)e.push({role:'shield',count:1+Math.floor(wave/5)});if(wave>=6)e.push({role:'hacker',count:1+Math.floor(wave/6)});if(wave>=7)e.push({role:'sniper',count:1+Math.floor(wave/7)});if(wave>=8)e.push({role:'bomber',count:1+Math.floor(wave/8)});if(wave>=9)for(const x of e)x.eliteChance=Math.min(.35,.08+(wave-9)*.025);return e;}
export function waveLabel(wave:number){return waveComposition(wave).map(e=>`${e.role.toUpperCase()}×${e.count}`).join('  ');}
