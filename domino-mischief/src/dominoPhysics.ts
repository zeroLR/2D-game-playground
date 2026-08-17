import * as CANNON from 'cannon-es';

export const DOMINO_PHYSICS={
  thickness:.14,
  height:1.42,
  width:.72,
  spacing:.42,
  mass:.30,
  gravity:-10.5,
  groundFriction:.65,
  dominoFriction:.01,
  linearDamping:.001,
  angularDamping:.001,
  releaseAngleDeg:72,
} as const;

export type PivotedDomino={body:CANNON.Body;hinge:CANNON.HingeConstraint;released:boolean};

export function configureDominoWorld(world:CANNON.World){
  world.gravity.set(0,DOMINO_PHYSICS.gravity,0);
  world.allowSleep=true;
  if(world.solver instanceof CANNON.GSSolver)world.solver.iterations=30;
  const groundMaterial=new CANNON.Material('ground');
  const dominoMaterial=new CANNON.Material('domino');
  world.addContactMaterial(new CANNON.ContactMaterial(groundMaterial,dominoMaterial,{friction:DOMINO_PHYSICS.groundFriction,restitution:0,contactEquationStiffness:1e8,contactEquationRelaxation:3}));
  world.addContactMaterial(new CANNON.ContactMaterial(dominoMaterial,dominoMaterial,{friction:DOMINO_PHYSICS.dominoFriction,restitution:0}));
  return {groundMaterial,dominoMaterial};
}

export function createGround(world:CANNON.World,material:CANNON.Material,halfX=10,halfZ=10){
  const ground=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(halfX,.2,halfZ)),material});
  ground.position.y=-.2;
  world.addBody(ground);
  return ground;
}

export function createPivotedDomino(world:CANNON.World,ground:CANNON.Body,material:CANNON.Material,x:number,z:number,yaw:number):PivotedDomino{
  const p=DOMINO_PHYSICS;
  const body=new CANNON.Body({mass:p.mass,shape:new CANNON.Box(new CANNON.Vec3(p.width/2,p.height/2,p.thickness/2)),material,allowSleep:false});
  body.position.set(x,p.height/2+.01,z);
  body.quaternion.setFromEuler(0,yaw,0);
  body.linearDamping=p.linearDamping;
  body.angularDamping=p.angularDamping;
  world.addBody(body);

  const axisA=new CANNON.Vec3(Math.cos(yaw),0,-Math.sin(yaw));
  const hinge=new CANNON.HingeConstraint(ground,body,{
    pivotA:new CANNON.Vec3(x,.21,z),
    axisA,
    pivotB:new CANNON.Vec3(0,-p.height/2,0),
    axisB:new CANNON.Vec3(1,0,0),
    collideConnected:false,
  });
  world.addConstraint(hinge);
  return {body,hinge,released:false};
}

export function tiltDegrees(body:CANNON.Body){
  const up=body.quaternion.vmult(new CANNON.Vec3(0,1,0));
  return Math.acos(Math.min(1,Math.max(-1,up.y)))*180/Math.PI;
}

export function releaseFallenDominoes(world:CANNON.World,dominoes:PivotedDomino[]){
  for(const domino of dominoes){
    if(!domino.released&&tiltDegrees(domino.body)>=DOMINO_PHYSICS.releaseAngleDeg){
      world.removeConstraint(domino.hinge);
      domino.released=true;
    }
  }
}

export function startDomino(domino:PivotedDomino,yaw:number,angularSpeed=3.8){
  const axis=new CANNON.Vec3(Math.cos(yaw),0,-Math.sin(yaw));
  domino.body.wakeUp();
  domino.body.angularVelocity.set(axis.x*angularSpeed,0,axis.z*angularSpeed);
}
