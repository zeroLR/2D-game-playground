import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import './style.css';

await RAPIER.init();

const host = document.querySelector<HTMLDivElement>('#game')!;
const movesEl = document.querySelector<HTMLElement>('#moves')!;
const directionEl = document.querySelector<HTMLElement>('#direction')!;
const gravityDot = document.querySelector<HTMLElement>('#gravity-dot')!;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x34228c, 0.035);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 1.5, 18);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xbad9ff, 0x30105f, 3.2));
const key = new THREE.DirectionalLight(0xffffff, 5);
key.position.set(-4, 8, 8);
key.castShadow = true;
scene.add(key);
const rim = new THREE.PointLight(0x8f5cff, 25, 25);
rim.position.set(5, 2, 5);
scene.add(rim);

const world = new RAPIER.World({ x: 0, y: -12, z: 0 });
const meshes: Array<{ mesh: THREE.Mesh; body: RAPIER.RigidBody }> = [];
const container = new THREE.Group();
scene.add(container);

const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xa99cff, transparent: true, opacity: 0.16, roughness: 0.08, metalness: 0.05, transmission: 0.25, side: THREE.DoubleSide });
function wall(x:number,y:number,z:number,hx:number,hy:number,hz:number) {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,y,z));
  world.createCollider(RAPIER.ColliderDesc.cuboid(hx,hy,hz).setFriction(0.45).setRestitution(0.12), body);
}
wall(0,-5,0,4.4,.18,2); wall(-4.55,0,0,.18,5,2); wall(4.55,0,0,.18,5,2); wall(0,0,-1.35,4.5,5,.12); wall(0,0,1.35,4.5,5,.12);

const floor = new THREE.Mesh(new THREE.BoxGeometry(9.3,.35,2.9), glassMat); floor.position.y=-5; container.add(floor);
for (const x of [-4.55,4.55]) { const m=new THREE.Mesh(new THREE.BoxGeometry(.28,10,2.9),glassMat); m.position.x=x; container.add(m); }
const back = new THREE.Mesh(new THREE.BoxGeometry(9.2,10,.12), glassMat); back.position.z=-1.35; container.add(back);

const palette=[0xff3f43,0x21b8ff,0xffca28,0x67dc32,0xb84cff];
const geometries=[new THREE.BoxGeometry(1.35,1.35,1.35,4,4,4),new THREE.SphereGeometry(.73,24,16),new THREE.IcosahedronGeometry(.78,1)];
function spawn() {
  meshes.splice(0).forEach(({mesh,body})=>{scene.remove(mesh);world.removeRigidBody(body);});
  for(let i=0;i<26;i++){
    const kind=i%geometries.length; const color=palette[i%palette.length];
    const mat=new THREE.MeshPhysicalMaterial({color,roughness:.22,metalness:.04,clearcoat:1,clearcoatRoughness:.15});
    const mesh=new THREE.Mesh(geometries[kind],mat); mesh.castShadow=true; mesh.receiveShadow=true;
    const x=-3.4+(i%6)*1.35+(Math.random()-.5)*.2; const y=-3.9+Math.floor(i/6)*1.5; const z=(Math.random()-.5)*.5;
    let desc:RAPIER.ColliderDesc;
    if(kind===1) desc=RAPIER.ColliderDesc.ball(.73); else desc=RAPIER.ColliderDesc.cuboid(.65,.65,.65);
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x,y,z).setRotation({x:0,y:0,z:Math.random()*.35,w:1}));
    world.createCollider(desc.setDensity(1).setFriction(.55).setRestitution(.18),body);
    scene.add(mesh); meshes.push({mesh,body});
  }
}
spawn();

let moves=16; let gravityX=0; let tiltTarget=0;
function setGravity(x:number){
  if(moves<=0)return; gravityX=x; world.gravity={x:x*9,y:-10,z:0}; tiltTarget=-x*.07; moves--; movesEl.textContent=String(moves);
  directionEl.textContent=x<0?'GRAVITY ↙':x>0?'GRAVITY ↘':'GRAVITY ↓'; gravityDot.style.transform=`translateX(${x*38}px)`;
}
let startX=0,startY=0;
renderer.domElement.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))setGravity(dx>0?1:-1);});
document.querySelector('#reset')!.addEventListener('click',()=>{moves=16;movesEl.textContent='16';gravityX=0;world.gravity={x:0,y:-12,z:0};tiltTarget=0;spawn();});

function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(host); resize();

let last=performance.now();
function loop(now:number){
  const dt=Math.min((now-last)/1000,.033); last=now; world.timestep=dt; world.step();
  for(const {mesh,body} of meshes){const p=body.translation(),q=body.rotation();mesh.position.set(p.x,p.y,p.z);mesh.quaternion.set(q.x,q.y,q.z,q.w);}
  container.rotation.z+=(tiltTarget-container.rotation.z)*.08;
  renderer.render(scene,camera); requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
