import * as CANNON from 'cannon-es';

// A domino must be able to reach the next tile before its centre of mass finishes falling.
// Keep a visible gap, but use a gap/height ratio that can sustain a real gravity-driven chain.
const DOMINO={thickness:.14,height:1.42,width:.72,spacing:.36,mass:.30};
const REQUIRED_TILT_DEGREES=60;
const SIMULATION_HZ=180;
const SIMULATION_SECONDS=5;
const PUSH_IMPULSE=.72;

function createChain(count=20){
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,-10.5,0)});
 if(world.solver instanceof CANNON.GSSolver)world.solver.iterations=30;
 const groundMat=new CANNON.Material('ground'),dominoMat=new CANNON.Material('domino');
 world.addContactMaterial(new CANNON.ContactMaterial(groundMat,dominoMat,{friction:.65,restitution:0,contactEquationStiffness:1e8,contactEquationRelaxation:3}));
 world.addContactMaterial(new CANNON.ContactMaterial(dominoMat,dominoMat,{friction:.01,restitution:0}));
 const ground=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(10,.2,6)),material:groundMat});ground.position.y=-.2;world.addBody(ground);
 const bodies=Array.from({length:count},(_,i)=>{const body=new CANNON.Body({mass:DOMINO.mass,shape:new CANNON.Box(new CANNON.Vec3(DOMINO.width/2,DOMINO.height/2,DOMINO.thickness/2)),material:dominoMat,allowSleep:false});body.position.set(0,DOMINO.height/2+.01,i*DOMINO.spacing);body.linearDamping=.001;body.angularDamping=.001;world.addBody(body);return body});
 bodies[0].applyImpulse(new CANNON.Vec3(0,0,PUSH_IMPULSE),new CANNON.Vec3(0,DOMINO.height*.48,0));
 return {world,bodies};
}

const {world,bodies}=createChain();
const maxTilt=Array(bodies.length).fill(0) as number[];
for(let step=0;step<SIMULATION_HZ*SIMULATION_SECONDS;step++){
 world.step(1/SIMULATION_HZ);
 bodies.forEach((body,index)=>{
  const up=body.quaternion.vmult(new CANNON.Vec3(0,1,0));
  const tilt=Math.acos(Math.min(1,Math.max(-1,up.y)))*180/Math.PI;
  maxTilt[index]=Math.max(maxTilt[index],tilt);
 });
}
console.log(`Domino cascade diagnostics (spacing=${DOMINO.spacing}, gap=${(DOMINO.spacing-DOMINO.thickness).toFixed(2)}, impulse=${PUSH_IMPULSE})`);
maxTilt.forEach((tilt,index)=>console.log(`#${String(index+1).padStart(2,'0')} max tilt ${tilt.toFixed(1)}°`));
const firstFailed=maxTilt.findIndex(tilt=>tilt<REQUIRED_TILT_DEGREES);
if(firstFailed!==-1){
 const reached=maxTilt.filter(tilt=>tilt>=REQUIRED_TILT_DEGREES).length;
 throw new Error(`Domino cascade reached ${reached}/${bodies.length}; #${firstFailed+1} max tilt=${maxTilt[firstFailed].toFixed(1)}° (required >= ${REQUIRED_TILT_DEGREES}°)`);
}
