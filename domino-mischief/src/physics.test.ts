import * as CANNON from 'cannon-es';

const DOMINO={thickness:.14,height:1.42,width:.72,spacing:.46,mass:.30};

function createChain(count=20){
 const world=new CANNON.World({gravity:new CANNON.Vec3(0,-10.5,0)});
 if(world.solver instanceof CANNON.GSSolver)world.solver.iterations=30;
 const groundMat=new CANNON.Material('ground'),dominoMat=new CANNON.Material('domino');
 world.addContactMaterial(new CANNON.ContactMaterial(groundMat,dominoMat,{friction:.55,restitution:0}));
 world.addContactMaterial(new CANNON.ContactMaterial(dominoMat,dominoMat,{friction:.02,restitution:0}));
 const ground=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(10,.2,3)),material:groundMat});ground.position.y=-.2;world.addBody(ground);
 const bodies=Array.from({length:count},(_,i)=>{const body=new CANNON.Body({mass:DOMINO.mass,shape:new CANNON.Box(new CANNON.Vec3(DOMINO.width/2,DOMINO.height/2,DOMINO.thickness/2)),material:dominoMat,allowSleep:false});body.position.set(0,DOMINO.height/2+.01,i*DOMINO.spacing);body.linearDamping=.005;body.angularDamping=.002;world.addBody(body);return body});
 bodies[0].applyImpulse(new CANNON.Vec3(0,0,.42),new CANNON.Vec3(0,DOMINO.height*.46,0));
 return {world,bodies};
}

// Standalone smoke test usable from CI without a browser. A successful gameplay baseline
// requires the last domino to leave its upright orientation after the first is pushed.
const {world,bodies}=createChain();
for(let i=0;i<180*5;i++)world.step(1/180);
const last=bodies.at(-1)!;
const up=last.quaternion.vmult(new CANNON.Vec3(0,1,0));
if(Math.abs(up.y)>.8)throw new Error(`Domino cascade stopped before the last tile (last up.y=${up.y.toFixed(3)})`);
