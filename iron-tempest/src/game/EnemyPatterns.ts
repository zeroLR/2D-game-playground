import type { Enemy } from './Enemy';

export type FormationSpawn = { x:number; delay:number; elite?:boolean; motion:'sway'|'drift-left'|'drift-right' };
export type BulletVector = { vx:number; vy:number };

export function formationFor(index:number): FormationSpawn[] {
  const kind=index%3;
  if(kind===0)return [0,1,2,3,4].map(i=>({x:70+i*55,delay:i*7,motion:'sway' as const}));
  if(kind===1)return [0,1,2,3,4].map(i=>({x:180+(i-2)*42,delay:Math.abs(i-2)*7,motion:(i<2?'drift-right':i>2?'drift-left':'sway') as FormationSpawn['motion']}));
  return [{x:90,delay:0,motion:'drift-right'},{x:270,delay:0,motion:'drift-left'},{x:135,delay:12,motion:'drift-right'},{x:225,delay:12,motion:'drift-left'},{x:180,delay:24,elite:true,motion:'sway'}];
}

export function aimedBurst(enemy:Enemy,px:number,py:number):BulletVector[]{const a=Math.atan2(py-enemy.view.y,px-enemy.view.x);return[-.18,0,.18].map(o=>({vx:Math.cos(a+o)*2.25,vy:Math.sin(a+o)*2.25}))}
export function fanBurst(count=5,speed=2):BulletVector[]{const start=Math.PI*.22,end=Math.PI*.78;return Array.from({length:count},(_,i)=>{const a=start+(end-start)*(i/(count-1));return{vx:Math.cos(a)*speed,vy:Math.sin(a)*speed}})}
