import { Application, Container, Graphics, Text } from 'pixi.js';

async function bootstrap() {
const W=360,H=640;
const app=new Application(); await app.init({width:W,height:H,background:'#08101b',antialias:false});
document.querySelector('#app')!.appendChild(app.canvas);
app.canvas.style.touchAction='none';
const world=new Container(); app.stage.addChild(world);

type Shot={g:Graphics,vx:number,vy:number,enemy:boolean}; type Enemy={g:Graphics,hp:number,t:number,elite?:boolean};
const shots:Shot[]=[]; const enemies:Enemy[]=[]; let score=0,xp=0,level=1,hp=5,fire=0,spawn=0,time=0,paused=false,spread=0,power=1,rate=1;
const keys=new Set<string>(); addEventListener('keydown',e=>keys.add(e.code)); addEventListener('keyup',e=>keys.delete(e.code));
let touchId:number|null=null,touchX=0,touchY=0,touchFocus=false;

for(let i=0;i<80;i++){const s=new Graphics().rect(0,0,Math.random()<.15?2:1,Math.random()<.15?2:1).fill({color:0x8090a8,alpha:.3+Math.random()*.6});s.x=Math.random()*W;s.y=Math.random()*H;world.addChild(s);app.ticker.add(t=>{s.y+=.25*t.deltaTime;if(s.y>H)s.y=0})}
const player=new Graphics().poly([0,-14,10,10,0,6,-10,10]).fill(0x55d8ff).rect(-3,-4,6,12).fill(0xf4f1bb); player.x=W/2;player.y=H-70;world.addChild(player);
const hud=new Text({text:'',style:{fontFamily:'monospace',fontSize:12,fill:0xe8f1ff}});hud.x=8;hud.y=8;app.stage.addChild(hud);
const title=new Text({text:'IRON TEMPEST  //  PROTOTYPE',style:{fontFamily:'monospace',fontSize:13,fill:0xffcc55}});title.x=70;title.y=28;app.stage.addChild(title);

function bullet(x:number,y:number,vx:number,vy:number,enemy=false){const g=new Graphics().circle(0,0,enemy?3:2).fill(enemy?0xff5b5b:0x72f1ff);g.x=x;g.y=y;world.addChild(g);shots.push({g,vx,vy,enemy})}
function shoot(){for(let i=-spread;i<=spread;i++)bullet(player.x+i*5,player.y-14,i*.45,-8,false)}
function enemy(x=Math.random()*(W-50)+25,elite=false){const g=new Graphics().poly([0,12,11,-8,0,-4,-11,-8]).fill(elite?0xffa63d:0xd9475d);g.x=x;g.y=-20;world.addChild(g);enemies.push({g,hp:elite?12:3,t:Math.random()*6,elite})}
function dist(a:Graphics,b:Graphics){return Math.hypot(a.x-b.x,a.y-b.y)}
function canvasPoint(e:PointerEvent){const r=app.canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
app.canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||paused)return;const p=canvasPoint(e);touchId=e.pointerId;touchX=p.x;touchY=p.y;touchFocus=true;app.canvas.setPointerCapture(e.pointerId);e.preventDefault()});
app.canvas.addEventListener('pointermove',e=>{if(e.pointerId!==touchId||paused)return;const p=canvasPoint(e);const dx=p.x-touchX,dy=p.y-touchY;player.x=Math.max(12,Math.min(W-12,player.x+dx));player.y=Math.max(55,Math.min(H-20,player.y+dy));touchX=p.x;touchY=p.y;e.preventDefault()});
const endTouch=(e:PointerEvent)=>{if(e.pointerId===touchId){touchId=null;touchFocus=false}e.preventDefault()};app.canvas.addEventListener('pointerup',endTouch);app.canvas.addEventListener('pointercancel',endTouch);

function applyUpgrade(index:number){if(index===0)spread=Math.min(2,spread+1);if(index===1)rate+=.35;if(index===2)power++}
function upgrade(){paused=true;const ui:Container[]=[];const panel=new Graphics().roundRect(25,170,310,300,8).fill({color:0x10192b,alpha:.97}).stroke({color:0xffcc55,width:2});app.stage.addChild(panel);ui.push(panel);const head=new Text({text:'MODULE ACQUIRED — CHOOSE',style:{fontFamily:'monospace',fontSize:15,fill:0xffcc55}});head.x=62;head.y=190;app.stage.addChild(head);ui.push(head);const opts=[['TWIN BARREL','+ projectile spread'],['OVERCLOCK','+ fire rate'],['HIGH CALIBER','+ damage']];let done=false;const finish=(i:number)=>{if(done)return;done=true;applyUpgrade(i);removeEventListener('keydown',pick);ui.forEach(c=>c.destroy());paused=false};opts.forEach((o,i)=>{const card=new Graphics().roundRect(45,230+i*70,270,56,5).fill(0x192943).stroke({color:0x4f7199,width:1});card.eventMode='static';card.cursor='pointer';card.on('pointertap',()=>finish(i));app.stage.addChild(card);ui.push(card);const t=new Text({text:`${i+1}  ${o[0]}\n   ${o[1]}`,style:{fontFamily:'monospace',fontSize:14,fill:0xdcecff}});t.x=60;t.y=239+i*70;app.stage.addChild(t);ui.push(t)});const pick=(e:KeyboardEvent)=>{const i=['Digit1','Digit2','Digit3'].indexOf(e.code);if(i>=0)finish(i)};addEventListener('keydown',pick)}

app.ticker.add(t=>{if(paused)return;const d=t.deltaTime;time+=d/60;const focus=keys.has('ShiftLeft')||keys.has('ShiftRight')||touchFocus;const speed=focus?2.1:4.2;let dx=0,dy=0;if(keys.has('ArrowLeft')||keys.has('KeyA'))dx--;if(keys.has('ArrowRight')||keys.has('KeyD'))dx++;if(keys.has('ArrowUp')||keys.has('KeyW'))dy--;if(keys.has('ArrowDown')||keys.has('KeyS'))dy++;player.x=Math.max(12,Math.min(W-12,player.x+dx*speed*d));player.y=Math.max(55,Math.min(H-20,player.y+dy*speed*d));player.scale.set(focus?.85:1);fire-=d;if(fire<=0){shoot();fire=Math.max(2,8/rate)}spawn-=d;if(spawn<=0){enemy(undefined,Math.random()<.08);spawn=Math.max(18,48-time*.35)}
for(const e of enemies){e.t+=.025*d;e.g.y+=(e.elite?.75:1.15)*d;e.g.x+=Math.sin(e.t)*(.8*d);if(Math.random()<(e.elite?.018:.006)*d)bullet(e.g.x,e.g.y,Math.sin(e.t)*1.2,2.6,true)}
for(const s of shots){s.g.x+=s.vx*d;s.g.y+=s.vy*d;if(s.enemy){if(dist(s.g,player)<(focus?5:9)){hp--;s.g.y=H+50}}else for(const e of enemies){if(e.hp>0&&dist(s.g,e.g)<13){e.hp-=power;s.g.y=-50;if(e.hp<=0){score+=e.elite?250:60;xp+=e.elite?4:1;e.g.y=H+80}}}}
for(let i=shots.length-1;i>=0;i--)if(shots[i].g.y<-30||shots[i].g.y>H+30){shots[i].g.destroy();shots.splice(i,1)}for(let i=enemies.length-1;i>=0;i--)if(enemies[i].g.y>H+40){enemies[i].g.destroy();enemies.splice(i,1)}
if(xp>=level*10){xp-=level*10;level++;upgrade()}hud.text=`HULL ${'■'.repeat(Math.max(0,hp))}  SCORE ${score}\nLV ${level}  SCRAP ${xp}/${level*10}  ${focus?'FOCUS':''}`;if(hp<=0){paused=true;const over=new Text({text:'MISSION FAILED\nREFRESH TO REDEPLOY',style:{fontFamily:'monospace',fontSize:24,fill:0xff665e,align:'center'}});over.anchor.set(.5);over.x=W/2;over.y=H/2;app.stage.addChild(over)}});
}

void bootstrap();
