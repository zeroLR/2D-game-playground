import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { createApplication } from './bootstrap';
import { GameEventQueue } from './domain/events';
import { LANDING_DELAY, PLAYER_FEET_OFFSET, applyAirNudge, applyCrystalPickup, applyDash, applyDroneKill, applyHit, applyLanding, applyWallContact, applyWallJump, clearWallContact, createInitialState, tickState, type GameState } from './domain/gameState';
import { interpretKey, interpretSwipe } from './input/SwipeInterpreter';
import type { PlayerCommand } from './input/commands';
import { FxSystem } from './presentation/fx/FxSystem';
import { createCrystalVisual, createDroneVisual, createEnvironment, createHazardVisual, createPlatformVisual, createWallVisual, redrawAbyss, redrawPlayer, setHazardDanger, updateEnvironment } from './presentation/visuals';
import { START_PLATFORM_Y, WorldGenerator, createRunSeed, type WorldSpawn } from './world/WorldGenerator';

const LOGICAL_W=360, LOGICAL_H=720, CAMERA_DEAD_ZONE_Y=330, CAMERA_SPRING=42, CAMERA_DAMPING=11, LANDING_EDGE_ASSIST=12;

async function bootstrap(){
 const app=await createApplication(LOGICAL_W,LOGICAL_H); document.querySelector('#app')!.appendChild(app.canvas);
 const root=new Container(); app.stage.addChild(root); const environment=createEnvironment(LOGICAL_W,LOGICAL_H); root.addChild(environment.sky,environment.far,environment.mid);
 const world=new Container(); root.addChild(world); const particles=new Container(); root.addChild(particles); const fx=new FxSystem(particles); const events=new GameEventQueue(); const abyss=new Graphics(); root.addChild(abyss); root.addChild(environment.foreground); const hud=new Container(); root.addChild(hud); const player=new Graphics(); world.addChild(player);
 const platforms:Array<{view:Graphics;x:number;y:number;w:number}>=[], hazards:Array<{view:Graphics;x:number;y:number;hit:boolean}>=[], crystals:Array<{view:Graphics;x:number;y:number;taken:boolean}>=[], drones:Array<{view:Graphics;x:number;y:number;destroyed:boolean;phase:number}>=[], walls:Array<{view:Graphics;x:number;y:number;h:number;side:-1|1}>=[];
 const title=new Text({text:'VERTEX',style:new TextStyle({fill:'#f3efe7',fontSize:16,fontWeight:'600',letterSpacing:6})}); title.position.set(22,20); hud.addChild(title);
 const flowText=new Text({text:'',style:new TextStyle({fill:'#f0eadf',fontSize:19,fontWeight:'600'})}); flowText.position.set(22,61); hud.addChild(flowText);
 const scoreText=new Text({text:'',style:new TextStyle({fill:'#789b99',fontSize:10})}); scoreText.position.set(22,88); hud.addChild(scoreText);
 const hpText=new Text({text:'',style:new TextStyle({fill:'#d8e7e2',fontSize:13,letterSpacing:4})}); hpText.anchor.set(1,0); hpText.position.set(LOGICAL_W-22,22); hud.addChild(hpText);
 const dashText=new Text({text:'',style:new TextStyle({fill:'#a9c8c4',fontSize:9,fontWeight:'600',letterSpacing:1.8})}); dashText.anchor.set(1,0); dashText.position.set(LOGICAL_W-22,50); hud.addChild(dashText);
 const helpText=new Text({text:'SHORT · NUDGE   LONG · DASH   WALL · SWIPE AWAY',style:new TextStyle({fill:'#95b4b1',fontSize:7.5,letterSpacing:0.8})}); helpText.anchor.set(.5); helpText.position.set(LOGICAL_W/2,LOGICAL_H-22); hud.addChild(helpText);
 const overText=new Text({text:'',style:new TextStyle({fill:'#fff7ee',fontSize:21,fontWeight:'600',align:'center'})}); overText.anchor.set(.5); overText.position.set(LOGICAL_W/2,LOGICAL_H/2-20); hud.addChild(overText);
 let state:GameState=createInitialState(),cameraOffset=0,cameraVelocity=0,pointerStartX=0,pointerStartY=0,invulnerable=0,dashDirection:-1|0|1=0,dashVisualTime=0;
 let worldGenerator=new WorldGenerator(createRunSeed());
 const makePlatform=(x:number,y:number,w:number)=>{const view=createPlatformVisual(w);view.position.set(x,y);world.addChild(view);platforms.push({view,x,y,w})};
 const makeHazard=(x:number,y:number)=>{const view=createHazardVisual();view.position.set(x,y);world.addChild(view);hazards.push({view,x,y,hit:false})};
 const makeCrystal=(x:number,y:number)=>{const view=createCrystalVisual();view.position.set(x,y);world.addChild(view);crystals.push({view,x,y,taken:false})};
 const makeDrone=(x:number,y:number,phase:number)=>{const view=createDroneVisual();view.position.set(x,y);world.addChild(view);drones.push({view,x,y,destroyed:false,phase})};
 const makeWall=(side:-1|1,y:number,h=116)=>{const x=side===-1?52:308,view=createWallVisual(h,side);view.position.set(x,y);world.addChild(view);walls.push({view,x,y,h,side})};
 function spawnEntity(spawn:WorldSpawn){
  if(spawn.type==='platform'){makePlatform(spawn.x,spawn.y,spawn.width);return}
  if(spawn.type==='crystal'){makeCrystal(spawn.x,spawn.y);return}
  if(spawn.type==='drone'){makeDrone(spawn.x,spawn.y,spawn.phase);return}
  if(spawn.type==='hazard'){makeHazard(spawn.x,spawn.y);return}
  makeWall(spawn.side,spawn.y,spawn.height)
 }
 function spawnBand(){for(const spawn of worldGenerator.nextBand().spawns)spawnEntity(spawn)}
 function seedWorld(){makePlatform(180,START_PLATFORM_Y,122);for(let i=0;i<12;i++)spawnBand()}
 function reset(){state=createInitialState();cameraOffset=cameraVelocity=0;invulnerable=dashVisualTime=0;dashDirection=0;events.clear();fx.reset();for(const item of [...platforms,...hazards,...crystals,...drones,...walls])item.view.destroy();platforms.length=hazards.length=crystals.length=drones.length=walls.length=0;worldGenerator=new WorldGenerator(createRunSeed());seedWorld();overText.text=''}
 function dash(direction:-1|1,strength=1){if(!state.dashReady||state.gameOver)return;state=applyDash(state,direction,strength);dashDirection=direction;dashVisualTime=.15;events.emit({type:'dash-started',x:state.playerX,y:state.playerY+cameraOffset,direction,strength})}
 function nudge(direction:-1|1,strength:number){if(state.gameOver)return;state=applyAirNudge(state,direction,strength);dashDirection=direction;dashVisualTime=.07}
 function executeCommand(command:PlayerCommand|null){if(!command)return;if(command.type==='restart'){reset();return}if(command.type==='wall-jump'){state=applyWallJump(state);dashDirection=command.direction;dashVisualTime=.11;events.emit({type:'wall-jumped',x:state.playerX,y:state.playerY+cameraOffset,direction:command.direction});return}if(command.type==='air-nudge'){nudge(command.direction,command.strength);return}dash(command.direction,command.strength)}
 window.addEventListener('keydown',e=>executeCommand(interpretKey(e.key,state.wallSide,state.gameOver)));
 app.canvas.addEventListener('pointerdown',e=>{pointerStartX=e.clientX;pointerStartY=e.clientY;if(state.gameOver)reset()});
 app.canvas.addEventListener('pointerup',e=>executeCommand(interpretSwipe(e.clientX-pointerStartX,e.clientY-pointerStartY,state.wallSide)));
 function resize(){const scale=Math.min(innerWidth/LOGICAL_W,innerHeight/LOGICAL_H);app.canvas.style.width=`${LOGICAL_W*scale}px`;app.canvas.style.height=`${LOGICAL_H*scale}px`}
 window.addEventListener('resize',resize);resize();seedWorld();
 app.ticker.add(t=>{const dt=Math.min(.033,t.deltaMS/1000);fx.update(dt);if(!state.gameOver){const previousFeet=state.playerY+PLAYER_FEET_OFFSET;state=tickState(state,dt);invulnerable=Math.max(0,invulnerable-dt);dashVisualTime=Math.max(0,dashVisualTime-dt);if(dashVisualTime<=0)dashDirection=0;
  if(state.velocityY>=0&&state.landingTime<=0){const nextFeet=state.playerY+PLAYER_FEET_OFFSET;for(const p of platforms)if(Math.abs(state.playerX-p.x)<=p.w/2+LANDING_EDGE_ASSIST&&previousFeet<=p.y+4&&nextFeet>=p.y-2){state=applyLanding(state,p.y);events.emit({type:'landed',x:state.playerX,y:state.playerY+cameraOffset});break}}
  let touchingWall=false;if(state.wallJumpLock<=0)for(const w of walls){if(Math.abs(state.playerY-w.y)<=w.h/2+20&&Math.abs(state.playerX-w.x)<=18){state=applyWallContact(state,w.side,w.x);touchingWall=true;break}}if(!touchingWall)state=clearWallContact(state);
  const before=state.playerY+cameraOffset,target=before<CAMERA_DEAD_ZONE_Y?CAMERA_DEAD_ZONE_Y-state.playerY:cameraOffset,acc=(target-cameraOffset)*CAMERA_SPRING-cameraVelocity*CAMERA_DAMPING;cameraVelocity+=acc*dt;cameraOffset=Math.max(cameraOffset,cameraOffset+cameraVelocity*dt);if(cameraVelocity<0)cameraVelocity=0;
  updateEnvironment(environment,cameraOffset,state.elapsed,LOGICAL_H);for(const p of platforms)p.view.y=p.y+cameraOffset;for(const w of walls)w.view.y=w.y+cameraOffset;for(const h of hazards){h.view.y=h.y+cameraOffset;h.view.rotation+=dt*.36;setHazardDanger(h.view,1-Math.min(1,Math.hypot(state.playerX-h.x,state.playerY-h.y)/150))}for(const c of crystals){c.view.y=c.y+cameraOffset+Math.sin(state.elapsed*2.4+c.x)*3;c.view.rotation=Math.sin(state.elapsed*1.3+c.x)*.04}for(const d of drones)if(!d.destroyed){d.view.y=d.y+cameraOffset+Math.sin(state.elapsed*3+d.phase)*5;d.view.rotation=Math.sin(state.elapsed*2+d.phase)*.06}while(worldGenerator.getLastY()+cameraOffset>-150)spawnBand();
  for(const c of crystals)if(!c.taken&&Math.abs(state.playerX-c.x)<24&&Math.abs(state.playerY-c.y)<32){c.taken=true;c.view.visible=false;state=applyCrystalPickup(state);events.emit({type:'crystal-picked',x:c.x,y:c.y+cameraOffset})}
  for(const d of drones){if(d.destroyed||Math.hypot(state.playerX-d.x,state.playerY-d.y)>=28)continue;if(state.dashTime>0&&!state.dashReady){d.destroyed=true;d.view.visible=false;state=applyDroneKill(state);events.emit({type:'drone-killed',x:d.x,y:d.y+cameraOffset})}else if(invulnerable<=0){invulnerable=.9;state=applyHit(state);events.emit({type:'player-hit',x:state.playerX,y:state.playerY+cameraOffset})}}
  if(invulnerable<=0)for(const h of hazards)if(!h.hit&&Math.hypot(state.playerX-h.x,state.playerY-h.y)<25){h.hit=true;invulnerable=.9;state=applyHit(state);events.emit({type:'player-hit',x:state.playerX,y:state.playerY+cameraOffset});break}
  if(state.playerY+cameraOffset>LOGICAL_H+55)state={...state,gameOver:true,hp:0}}
  fx.consume(events.drain());const shake=fx.getShake(state.elapsed);world.position.set(shake.x,shake.y);particles.position.set(shake.x,shake.y);redrawPlayer(player,state.playerX,state.playerY+cameraOffset,state.elapsed,dashDirection);
  if(state.landingTime>0){const pulse=Math.sin((1-state.landingTime/LANDING_DELAY)*Math.PI);player.scale.set(1+pulse*.16,1-pulse*.14)}else player.scale.set(1);
  player.alpha=invulnerable>0&&Math.floor(invulnerable*12)%2===0?.35:1;redrawAbyss(abyss,LOGICAL_W,LOGICAL_H,state.elapsed);flowText.text=`×${state.flow.toFixed(1)}`;scoreText.text=`${Math.floor(state.score).toLocaleString()} · ${state.elapsed.toFixed(1)}s`;hpText.text='◇'.repeat(state.hp);dashText.text=state.wallSide!==0?'WALL  ↗':state.dashReady?'DASH  ◆':'DASH  ·';dashText.alpha=state.dashReady||state.wallSide!==0?1:.45;if(state.gameOver)overText.text=`THE ABYSS CAUGHT YOU\n\n${Math.floor(state.score).toLocaleString()}\n\nTAP TO RETURN`});
}
void bootstrap();
