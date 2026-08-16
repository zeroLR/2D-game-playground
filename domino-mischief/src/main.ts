import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

type Level={name:string;goal:string;points:[number,number][];accent:number;prop?:'ball'|'bell'|'cat'|'chicken'|'balloon'};
const line=(n:number,fn:(i:number)=>[number,number])=>Array.from({length:n},(_,i)=>fn(i));
const levels:Level[]=[
{name:'第一推',goal:'推倒整條骨牌',points:line(13,i=>[-4.2+i*.62,0]),accent:0xf08a72},
{name:'轉個彎',goal:'讓連鎖反應繞過轉角',points:[...line(7,i=>[-4+i*.58,-1.8]),...line(6,i=>[-.52,-1.22+i*.58])],accent:0x77bfa3},
{name:'蛇蛇走',goal:'沿 S 彎完成連鎖',points:line(17,i=>[-4+i*.48,Math.sin(i*.38)*1.05]),accent:0x7aa7d9},
{name:'滾球球',goal:'把球撞下終點',points:line(12,i=>[-3.8+i*.62,0]),accent:0xe8b75b,prop:'ball'},
{name:'叫醒貓',goal:'最後一張骨牌要碰到貓',points:line(12,i=>[-3.6+i*.58,Math.sin(i*.28)*.45]),accent:0xc999d4,prop:'cat'},
{name:'雞飛狗跳',goal:'把連鎖送到逃跑的小雞',points:[...line(7,i=>[-3.8+i*.58,-1]),...line(7,i=>[-.32+i*.58,-1+(i/6)*2])],accent:0xf2cf66,prop:'chicken'},
{name:'繞圈圈',goal:'完成半圓連鎖',points:line(18,i=>[Math.cos(Math.PI+i*Math.PI/17)*3.2,Math.sin(Math.PI+i*Math.PI/17)*3.2-1]),accent:0x69c4cc},
{name:'叮一聲',goal:'讓最後的骨牌敲響鈴鐺',points:line(15,i=>[-3.8+i*.54,Math.sin(i*.32)*.7]),accent:0xf09b65,prop:'bell'},
{name:'螺旋',goal:'從外圈一路倒進中心',points:line(20,i=>{const a=i*.38,r=3.8-i*.11;return[Math.cos(a)*r,Math.sin(a)*r]}),accent:0x94bd65},
{name:'飛高高',goal:'完成連鎖，把氣球送上天',points:line(16,i=>[-3.8+i*.5,Math.sin(i*.38)*.55]),accent:0xe889a8,prop:'balloon'}
];

const app=document.querySelector<HTMLDivElement>('#app')!;
const scene=new THREE.Scene(); scene.background=new THREE.Color(0xf7e8c9);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100); camera.position.set(0,9,11);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; app.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement); controls.enablePan=false; controls.minDistance=8; controls.maxDistance=18; controls.maxPolarAngle=Math.PI*.46; controls.target.set(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff5dc,0x8c765f,2.2)); const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(4,10,6);sun.castShadow=true;scene.add(sun);
const floor=new THREE.Mesh(new THREE.CylinderGeometry(6.2,6.4,.45,48),new THREE.MeshStandardMaterial({color:0xf1d7a7,roughness:.9}));floor.position.y=-.28;floor.receiveShadow=true;scene.add(floor);
const world=new CANNON.World({gravity:new CANNON.Vec3(0,-9.82,0)}); world.allowSleep=true; world.solver.iterations=15;
const groundMat=new CANNON.Material('ground'); const dominoMat=new CANNON.Material('domino');
world.addContactMaterial(new CANNON.ContactMaterial(groundMat,dominoMat,{friction:.55,restitution:0,contactEquationStiffness:1e8,contactEquationRelaxation:3}));
world.addContactMaterial(new CANNON.ContactMaterial(dominoMat,dominoMat,{friction:.25,restitution:.02}));
const ground=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(7,.2,7)),material:groundMat});ground.position.y=-.2;world.addBody(ground);
let bodies:CANNON.Body[]=[];let meshes:THREE.Mesh[]=[];let prop:THREE.Object3D|null=null;let current=0;let armed=false;
const hud=document.createElement('div');hud.className='hud';hud.innerHTML=`<div class="top"><div><div class="title"></div><div class="goal"></div></div></div><div class="bottom"><div class="levels"></div><button id="reset">↻</button><button class="primary" id="go">推！</button></div>`;document.body.appendChild(hud);
const hint=document.createElement('div');hint.className='hint';hint.textContent='拖曳旋轉場景 · 按「推！」開始';document.body.appendChild(hint);
const levelBar=hud.querySelector('.levels')!; levels.forEach((_,i)=>{const b=document.createElement('button');b.textContent=String(i+1);b.onclick=()=>load(i);levelBar.appendChild(b)});

function clear(){bodies.forEach(b=>world.removeBody(b));meshes.forEach(m=>scene.remove(m));bodies=[];meshes=[];if(prop){scene.remove(prop);prop=null}}
function heading(points:[number,number][],i:number){const a=points[i],b=points[Math.min(i+1,points.length-1)],p=points[Math.max(0,i-1)];const dx=b[0]-p[0],dz=b[1]-p[1];return Math.atan2(dx,dz)}
function load(index:number){current=index;armed=false;clear();const l=levels[index];(hud.querySelector('.title') as HTMLElement).textContent=`${index+1}. ${l.name}`;(hud.querySelector('.goal') as HTMLElement).textContent=l.goal;[...levelBar.children].forEach((x,i)=>x.classList.toggle('active',i===index));
 l.points.forEach((p,i)=>{const angle=heading(l.points,i);const mesh=new THREE.Mesh(new THREE.BoxGeometry(.22,1.25,.72),new THREE.MeshStandardMaterial({color:i===0?0xff6b5e:l.accent,roughness:.55}));mesh.position.set(p[0],.635,p[1]);mesh.rotation.y=angle;mesh.castShadow=true;scene.add(mesh);const shape=new CANNON.Box(new CANNON.Vec3(.11,.625,.36));const body=new CANNON.Body({mass:1,shape,material:dominoMat,allowSleep:true,sleepSpeedLimit:.08,sleepTimeLimit:.25});body.position.set(p[0],.635,p[1]);body.quaternion.setFromEuler(0,angle,0);body.linearDamping=.18;body.angularDamping=.12;world.addBody(body);body.sleep();meshes.push(mesh);bodies.push(body)}); addProp(l);}
function addProp(l:Level){if(!l.prop)return;const end=l.points.at(-1)!;const group=new THREE.Group();group.position.set(end[0]+.75,.55,end[1]);const mat=new THREE.MeshStandardMaterial({color:0xffffff});if(l.prop==='ball'){group.add(new THREE.Mesh(new THREE.SphereGeometry(.48,24,16),new THREE.MeshStandardMaterial({color:0x6fa8dc})))}else if(l.prop==='bell'){group.add(new THREE.Mesh(new THREE.ConeGeometry(.5,.8,20),new THREE.MeshStandardMaterial({color:0xe9b949})))}else if(l.prop==='balloon'){const b=new THREE.Mesh(new THREE.SphereGeometry(.45,24,16),new THREE.MeshStandardMaterial({color:0xf48fb1}));b.scale.y=1.2;group.add(b)}else{const body=new THREE.Mesh(new THREE.SphereGeometry(.48,20,14),mat);group.add(body);const e1=new THREE.Mesh(new THREE.ConeGeometry(.16,.35,3),mat);e1.position.set(-.25,.42,0);group.add(e1);const e2=e1.clone();e2.position.x=.25;group.add(e2)}prop=group;scene.add(group)}
function push(){if(armed||!bodies.length)return;armed=true;bodies.forEach(b=>b.wakeUp());const first=bodies[0],second=bodies[1];const dx=second.position.x-first.position.x,dz=second.position.z-first.position.z;const len=Math.hypot(dx,dz)||1;const dirX=dx/len,dirZ=dz/len;first.applyImpulse(new CANNON.Vec3(dirX*1.7,0,dirZ*1.7),new CANNON.Vec3(0,.58,0));first.applyTorque(new CANNON.Vec3(dirZ*2.2,0,-dirX*2.2));}
(hud.querySelector('#go') as HTMLButtonElement).onclick=push;(hud.querySelector('#reset') as HTMLButtonElement).onclick=()=>load(current);
function resize(){const w=Math.min(innerWidth,700),h=innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}addEventListener('resize',resize);resize();load(0);
let last=performance.now();function tick(now:number){const dt=Math.min((now-last)/1000,.05);last=now;world.step(1/60,dt,5);bodies.forEach((b,i)=>{meshes[i].position.copy(b.position as unknown as THREE.Vector3);meshes[i].quaternion.copy(b.quaternion as unknown as THREE.Quaternion)});controls.update();renderer.render(scene,camera);requestAnimationFrame(tick)}requestAnimationFrame(tick);
