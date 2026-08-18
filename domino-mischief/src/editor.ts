import * as THREE from 'three';
import type {DominoPhysicsConfig} from './dominoPhysics';

export type EditorDomino={x:number;z:number;yaw:number};
export type EditorSnapshot={physics:DominoPhysicsConfig;dominoes:EditorDomino[]};
type EditorCallbacks={onPlay:()=>void;onReset:()=>void;onPhysics:(config:DominoPhysicsConfig)=>void;onLayout:(layout:EditorDomino[])=>void};

const fields:Array<[keyof DominoPhysicsConfig,string,number,number,number]>=[
 ['width','寬度',.2,1.2,.01],['height','高度',.5,2.5,.01],['thickness','厚度',.05,.5,.01],['spacing','間距',.2,1.4,.01],
 ['mass','質量',.05,2,.01],['gravity','重力',-20,-1,.05],['groundFriction','地面摩擦',0,1,.005],['dominoFriction','骨牌摩擦',0,1,.005],
 ['dominoRestitution','碰撞彈性',0,.8,.005],['linearDamping','線性阻尼',0,.2,.001],['angularDamping','角阻尼',0,.2,.001],
 ['releaseAngleDeg','解除角度',45,89,1],['startAngularSpeed','起始角速度',.2,8,.05],['solverIterations','Solver iterations',5,80,1],['physicsHz','Physics Hz',30,240,10],
];

export class PhysicsPlaygroundEditor{
 readonly element=document.createElement('aside');
 private config:DominoPhysicsConfig; private layout:EditorDomino[]; private selected=-1; private edit=true;
 constructor(config:DominoPhysicsConfig,layout:EditorDomino[],private cb:EditorCallbacks){this.config={...config};this.layout=layout.map(x=>({...x}));this.element.className='editor';this.render()}
 isEditing(){return this.edit}
 getLayout(){return this.layout.map(x=>({...x}))}
 setLayout(layout:EditorDomino[]){this.layout=layout.map(x=>({...x}));this.selected=-1;this.render()}
 add(x:number,z:number){if(!this.edit)return;const prev=this.layout.at(-1);const yaw=prev?Math.atan2(x-prev.x,z-prev.z):0;this.layout.push({x,z,yaw});this.selected=this.layout.length-1;this.cb.onLayout(this.getLayout());this.render()}
 select(index:number){if(!this.edit)return;this.selected=index;this.render()}
 moveSelected(x:number,z:number){if(this.selected<0)return;this.layout[this.selected]={...this.layout[this.selected],x,z};this.cb.onLayout(this.getLayout())}
 private render(){const selected=this.layout[this.selected];this.element.innerHTML=`<div class="editor-head"><b>Physics Playground</b><button data-mode>${this.edit?'▶ Play':'✎ Edit'}</button></div><div class="editor-scroll"><details open><summary>骨牌編輯</summary><div class="editor-row"><button data-clear>Clear</button><button data-duplicate ${selected?'':'disabled'}>Duplicate</button><button data-delete ${selected?'':'disabled'}>Delete</button></div>${selected?`<label>Rotation <input data-rotation type="range" min="-180" max="180" step="1" value="${Math.round(selected.yaw*180/Math.PI)}"><output>${Math.round(selected.yaw*180/Math.PI)}°</output></label>`:'<small>點地面新增骨牌；點骨牌後可調方向。</small>'}</details><details open><summary>Physics</summary>${fields.map(([key,label,min,max,step])=>`<label>${label}<span><input data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${this.config[key]}"><input data-number="${key}" type="number" min="${min}" max="${max}" step="${step}" value="${this.config[key]}"></span></label>`).join('')}</details><div class="editor-row"><button data-default>Default</button><button data-export>Export JSON</button></div><textarea readonly data-json hidden></textarea></div>`;
 this.element.querySelector<HTMLButtonElement>('[data-mode]')!.onclick=()=>{this.edit=!this.edit;if(this.edit)this.cb.onReset();else this.cb.onPlay();this.render()};
 this.element.querySelector<HTMLButtonElement>('[data-clear]')!.onclick=()=>{this.layout=[];this.selected=-1;this.cb.onLayout([]);this.render()};
 const del=this.element.querySelector<HTMLButtonElement>('[data-delete]')!;del.onclick=()=>{if(this.selected<0)return;this.layout.splice(this.selected,1);this.selected=-1;this.cb.onLayout(this.getLayout());this.render()};
 const dup=this.element.querySelector<HTMLButtonElement>('[data-duplicate]')!;dup.onclick=()=>{if(this.selected<0)return;const d=this.layout[this.selected];this.layout.push({...d,x:d.x+this.config.spacing});this.selected=this.layout.length-1;this.cb.onLayout(this.getLayout());this.render()};
 const rot=this.element.querySelector<HTMLInputElement>('[data-rotation]');if(rot)rot.oninput=()=>{this.layout[this.selected].yaw=Number(rot.value)*Math.PI/180;(rot.nextElementSibling as HTMLOutputElement).value=`${rot.value}°`;this.cb.onLayout(this.getLayout())};
 const update=(key:keyof DominoPhysicsConfig,value:number)=>{this.config={...this.config,[key]:value};this.cb.onPhysics({...this.config})};
 this.element.querySelectorAll<HTMLInputElement>('[data-key]').forEach(input=>input.oninput=()=>{const key=input.dataset.key as keyof DominoPhysicsConfig,value=Number(input.value);const number=this.element.querySelector<HTMLInputElement>(`[data-number="${key}"]`)!;number.value=String(value);update(key,value)});
 this.element.querySelectorAll<HTMLInputElement>('[data-number]').forEach(input=>input.onchange=()=>{const key=input.dataset.number as keyof DominoPhysicsConfig,value=Number(input.value);const range=this.element.querySelector<HTMLInputElement>(`[data-key="${key}"]`)!;range.value=String(value);update(key,value)});
 this.element.querySelector<HTMLButtonElement>('[data-default]')!.onclick=()=>location.reload();
 this.element.querySelector<HTMLButtonElement>('[data-export]')!.onclick=()=>{const area=this.element.querySelector<HTMLTextAreaElement>('[data-json]')!;area.hidden=false;area.value=JSON.stringify({physics:this.config,dominoes:this.layout},null,2);area.select()};
 }
}

export function raycastGround(event:PointerEvent,camera:THREE.Camera,canvas:HTMLCanvasElement){const rect=canvas.getBoundingClientRect(),pointer=new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1),ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);const hit=new THREE.Vector3();return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),hit)?hit:null}
