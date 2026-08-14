import type{TowerType}from'../domain/models';
export interface TowerDefinition{id:TowerType;name:string;role:string;cost:number;maxHp:number;range:number;cadence:number;}
export const TOWERS:readonly TowerDefinition[]=[
{id:'turret',name:'TURRET',role:'single target',cost:120,maxHp:150,range:360,cadence:.52},
{id:'tesla',name:'TESLA',role:'chain control',cost:180,maxHp:130,range:230,cadence:.9},
{id:'barrier',name:'BARRIER',role:'block + cluster',cost:90,maxHp:300,range:0,cadence:0},
{id:'droneDock',name:'DRONE',role:'mobile pressure',cost:200,maxHp:120,range:440,cadence:.72},
{id:'hackNode',name:'HACK',role:'disable machines',cost:170,maxHp:110,range:250,cadence:2.6},
{id:'mineLayer',name:'MINES',role:'area denial',cost:140,maxHp:100,range:145,cadence:2.2},
];
export const towerAt=(index:number)=>TOWERS[index]??TOWERS[0];
