import * as CANNON from 'cannon-es';

const DOMINO={thickness:.14,height:1.42,width:.72,spacing:.46,mass:.30};
const COUNT=20;
const STEP=1/180;
const SIMULATION_SECONDS=5;
const REQUIRED_TILT_DEGREES=60;

function createChain(count=COUNT){
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,-10.5,0)});
 if(world.solver instanceof CANNON.GSSolver)world.solver.iterations=30;
 const groundMat=new CANNON.Material('ground'),dominoMat=new CANNON.Material('domino');
 world.addContactMaterial(new CANNON.ContactMaterial(groundMat,dominoMat,{friction:.55,restitution:0}));
 world.addContactMaterial(new CANNON.ContactMaterial(dominoMat,dominoMat,{friction:.02,restitution:0}));
 const ground=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(10,.2,6)),material:groundMat});
 ground.position.y=-.2;
 world.addBody(ground);
 const bodies=Array.from({length:count},(_,i)=>{
  const body=new CANNON.Body({mass:DOMINO.mass,shape:new CANNON.Box(new CANNON.Vec3(DOMINO.width/2,DOMINO.height/2,DOMINO.thickness/2)),material:dominoMat,allowSleep:false});
  body.position.set(0,DOMINO.height/2+.01,i*DOMINO.spacing);
  body.linearDamping=.005;
  body.angularDamping=.002;
  world.addBody(body);
  return body;
 });
 bodies[0].applyImpulse(new CANNON.Vec3(0,0,.42),new CANNON.Vec3(0,DOMINO.height*.46,0));
 return {world,bodies};
}

function tiltDegrees(body:CANNON.Body){
 const up=body.quaternion.vmult(new CANNON.Vec3(0,1,0));
 return Math.acos(Math.min(1,Math.max(-1,Math.abs(up.y))))*180/Math.PI;
}

const {world,bodies}=createChain();
const maxTilt=bodies.map(()=>0);
for(let i=0;i<Math.round(SIMULATION_SECONDS/STEP);i++){
 world.step(STEP);
 bodies.forEach((body,index)=>{maxTilt[index]=Math.max(maxTilt[index],tiltDegrees(body))});
}

console.log('Domino cascade diagnostics');
maxTilt.forEach((tilt,index)=>console.log(`#${String(index+1).padStart(2,'0')} max tilt ${tilt.toFixed(1)}°`));
const firstFailed=maxTilt.findIndex(tilt=>tilt<REQUIRED_TILT_DEGREES);
if(firstFailed!==-1){
 const reached=firstFailed;
 throw new Error(`Domino cascade reached ${reached}/${bodies.length}; #${firstFailed+1} max tilt=${maxTilt[firstFailed].toFixed(1)}° (required >= ${REQUIRED_TILT_DEGREES}°)`);
}
console.log(`PASS: all ${bodies.length} dominoes reached >= ${REQUIRED_TILT_DEGREES}° tilt.`);
