import * as CANNON from 'cannon-es';
import {DOMINO_PHYSICS,configureDominoWorld,createGround,createPivotedDomino,releaseFallenDominoes,startDomino,tiltDegrees} from './dominoPhysics.js';

const REQUIRED_TILT_DEGREES=60;
const SIMULATION_HZ=180;
const SIMULATION_SECONDS=6;
const COUNT=20;

const world=new CANNON.World();
const {groundMaterial,dominoMaterial}=configureDominoWorld(world);
const ground=createGround(world,groundMaterial,10,6);
const dominoes=Array.from({length:COUNT},(_,i)=>createPivotedDomino(world,ground,dominoMaterial,0,i*DOMINO_PHYSICS.spacing,0));
const maxTilt=Array(COUNT).fill(0) as number[];
startDomino(dominoes[0],0);

for(let step=0;step<SIMULATION_HZ*SIMULATION_SECONDS;step++){
  world.step(1/SIMULATION_HZ);
  releaseFallenDominoes(world,dominoes);
  dominoes.forEach((domino,index)=>{maxTilt[index]=Math.max(maxTilt[index],tiltDegrees(domino.body));});
}

console.log(`Domino constrained-cascade diagnostics (spacing=${DOMINO_PHYSICS.spacing}, gap=${(DOMINO_PHYSICS.spacing-DOMINO_PHYSICS.thickness).toFixed(2)}, release=${DOMINO_PHYSICS.releaseAngleDeg}deg)`);
maxTilt.forEach((tilt,index)=>console.log(`#${String(index+1).padStart(2,'0')} max tilt ${tilt.toFixed(1)}°`));
const firstFailed=maxTilt.findIndex(tilt=>tilt<REQUIRED_TILT_DEGREES);
if(firstFailed!==-1){
  const reached=maxTilt.filter(tilt=>tilt>=REQUIRED_TILT_DEGREES).length;
  throw new Error(`Domino cascade reached ${reached}/${COUNT}; #${firstFailed+1} max tilt=${maxTilt[firstFailed].toFixed(1)}° (required >= ${REQUIRED_TILT_DEGREES}°)`);
}
