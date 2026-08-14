import type{EnemyRole}from'./enemies';
export type LaneId=0|1|2;
export const LANE_NAMES=['ROOFTOP','STREET','UNDERGROUND'] as const;
export const laneY=(height:number,lane:LaneId)=>[height*.34,height*.61,height*.82][lane];
export const lanePads=(width:number,lane:LaneId,extra=0)=>{const base=[.19,.34,.49,.64];const extraRatios=[.27,.57];return [...base,...extraRatios.slice(0,Math.min(2,extra))].map(r=>width*r+(lane-1)*8)};
export const CONNECTORS=[{x:.24,name:'LADDER',from:1,to:0},{x:.47,name:'ELEVATOR',from:2,to:1},{x:.60,name:'ELEVATOR',from:1,to:0},{x:.72,name:'JUMP PAD',from:1,to:0},{x:.79,name:'DROP',from:0,to:1},{x:.86,name:'ZIPLINE',from:0,to:1},{x:.36,name:'LADDER',from:2,to:1}] as const;
export const preferredLane=(role:EnemyRole,index:number):LaneId=>{if(role==='drone'||role==='sniper')return 0;if(role==='hacker')return 2;if(role==='heavy'||role==='bomber')return 1;if(role==='runner')return(index%3)as LaneId;if(role==='shield')return(index%2?1:2)as LaneId;return(index%3)as LaneId;};
export function connectorFor(width:number,x:number,lane:LaneId,direction:-1|1){const target=lane+direction;if(target<0||target>2)return undefined;return CONNECTORS.map(c=>({...c,px:c.x*width})).filter(c=>(c.from===lane&&c.to===target)||(c.to===lane&&c.from===target)).sort((a,b)=>Math.abs(a.px-x)-Math.abs(b.px-x))[0];}
