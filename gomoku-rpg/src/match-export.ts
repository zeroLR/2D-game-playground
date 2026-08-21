import { MatchRecord } from './match-records';

export function exportMatchesJson(records:readonly MatchRecord[]){return JSON.stringify({schema:'gomoku-rpg.matches.v1',exportedAt:new Date().toISOString(),matches:records},null,2);}
export function exportMatchesCsv(records:readonly MatchRecord[]){
 const header=['id','startedAt','finishedAt','hero','cpuHero','cpuDifficulty','cpuProfileLevel','result','turns','actions','playerSkillUses','cpuSkillUses'];
 const rows=records.map(r=>[r.id,r.startedAt,r.finishedAt,r.heroId,r.cpuHeroId,r.cpuDifficulty??'',r.cpuProfileLevel??r.cpuLevel??'',r.result,r.turns,r.actions.length,totalSkillUses(r.metrics.skillUses),r.actions.filter(a=>a.actor==='cpu'&&a.kind==='skill').length]);
 return [header,...rows].map(row=>row.map(csvCell).join(',')).join('\n');
}
export function downloadText(filename:string,content:string,type:string){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}
function totalSkillUses(value:object|undefined){return Object.values(value??{}).reduce<number>((sum,n)=>sum+(typeof n==='number'?n:0),0);}
function csvCell(value:unknown){const text=String(value??'');return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
