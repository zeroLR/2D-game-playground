import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BALANCE } from './content/balance';
import { enemyContactProfile } from './content/enemyCombat';
import { WEAPONS, weaponAt, type WeaponDefinition } from './content/weapons';
import { createInitialGameState, type Facing, type TowerType } from './domain/models';
import { KeyboardInput } from './input/KeyboardInput';
import { CombatFeedback } from './presentation/CombatFeedback';
import { buildSpots, coreX, groundY, isTouchLayout } from './presentation/layout';
import { COLORS as C } from './presentation/theme';

const app = new Application();
await app.init({ background: '#05070b', resizeTo: window, antialias: false });
document.querySelector('#app')!.appendChild(app.canvas);

const world = new Container(); const far = new Graphics(); const mid = new Graphics(); const ground = new Graphics(); const actors = new Container(); const fx = new Container(); const hud = new Container(); const alerts = new Container();
world.addChild(far, mid, ground, actors); app.stage.addChild(world, fx, hud, alerts);
const core = new Graphics(); const player = new Graphics(); actors.addChild(core, player);
const coreTag = new Text({ text: 'DATA // CORE', style: new TextStyle({ fill: C.amber, fontSize: 10, fontWeight: '800', letterSpacing: 2 }) }); actors.addChild(coreTag);
const state = createInitialGameState();
const gy = () => groundY(app.renderer.height); const cx = () => coreX(app.renderer.width); const spots = () => buildSpots(app.renderer.width);
state.playerX = Math.max(110, app.renderer.width * .52);

type EnemyAttackPhase = 'approach' | 'windup' | 'recovery';
interface Enemy { g: Graphics; hp: number; speed: number; x: number; y: number; attack: number; heavy: boolean; flash: number; knockback: number; attackPhase: EnemyAttackPhase; attackTimer: number; }
interface Tower { g: Graphics; x: number; y: number; type: TowerType; cooldown: number; }
interface Bullet { g: Graphics; x: number; y: number; vx: number; vy: number; damage: number; direction: Facing; knockback: number; pierce: number; hitEnemies: Set<Enemy>; }
const enemies: Enemy[] = []; const towers: Tower[] = []; const bullets: Bullet[] = [];
const buildPads = Array.from({ length: 4 }, () => { const g = new Graphics(); ground.addChild(g); return g; });
const feedback = new CombatFeedback(fx, world, app.ticker);
const input = new KeyboardInput({
  selectTower: (index) => { state.towerMode = index; },
  selectWeapon: (index) => {
    state.weaponIndex = index;
    state.shootTimer = Math.min(state.shootTimer, .08);
    const weapon = weaponAt(index);
    flashMessage(`WEAPON // ${weapon.name} // ${weapon.role}`, C.pink);
  },
  build: () => tryBuild(),
  restart: () => { if (state.gameOver) location.reload(); },
});

function drawEnvironment() {
  const w = app.renderer.width, h = app.renderer.height, floor = gy(), horizon = floor * .72;
  far.clear().rect(0, 0, w, h).fill(C.bg).rect(0, 0, w, floor).fill({ color: 0x07171d, alpha: .9 });
  for (let i = 0; i < 12; i++) { const bw = 90 + ((i * 47) % 100), bh = 110 + ((i * 83) % 190), x = i * (w / 10.5) - 30, y = horizon - bh; far.rect(x, y, bw, bh).fill(i % 3 === 0 ? 0x0b1820 : 0x09141b); if (i % 3 === 1) far.rect(x + bw * .42, y - 45, 8, 45).fill(0x13262d); }
  far.moveTo(0, horizon - 24).lineTo(w, horizon - 24).stroke({ color: 0x27424a, width: 3, alpha: .32 });
  mid.clear(); [[0,.22,.2,.45],[.23,.33,.16,.34],[.43,.25,.18,.42],[.66,.31,.14,.36],[.82,.2,.18,.47]].forEach(([rx,ry,rw,rh], i) => { mid.rect(rx*w, ry*floor, rw*w, rh*floor).fill({ color: i%2 ? 0x101820 : 0x0c131a, alpha: .96 }); });
  mid.moveTo(0, floor - 150).lineTo(w * .35, floor - 126).lineTo(w * .62, floor - 158).lineTo(w, floor - 132).stroke({ color: 0x27333a, width: 3, alpha: .72 });
  ground.clear().rect(0, floor - 5, w, h - floor + 5).fill(0x0a0d12).rect(0, floor - 5, w, 5).fill(0x26323b).rect(0, floor, w, 2).fill({ color: C.cyan, alpha: .48 });
  spots().forEach((x, i) => { const occupied = towers.some((t) => Math.abs(t.x - x) < 18); buildPads[i].clear().poly([x-40,floor,x+40,floor,x+28,floor-11,x-28,floor-11]).fill(occupied ? 0x1a2229 : 0x131a20).stroke({ color: occupied ? C.amber : C.cyanDim, width: 2, alpha: .7 }); });
  drawCore(); drawPlayer();
}
function drawCore() { const floor=gy(), x=cx(), danger=state.coreHp<35, energy=danger?C.red:C.cyan; core.clear().poly([x-56,floor,x-45,floor-117,x-30,floor-134,x+31,floor-134,x+47,floor-117,x+58,floor]).fill(0x171e27).stroke({color:0x38434d,width:3}).rect(x-36,floor-120,72,7).fill(C.amber).rect(x-31,floor-103,62,74).fill(0x091116).circle(x,floor-67,29).stroke({color:energy,width:7}).circle(x,floor-67,6).fill(energy); core.rect(x-36,floor-149,72,4).fill(0x222a31).rect(x-36,floor-149,72*(state.coreHp/100),4).fill(energy); coreTag.position.set(x-34,floor-166); }
function drawPlayer() { const y=state.playerY||gy(),x=state.playerX,d=state.facing; player.alpha=state.hitCooldown>0&&Math.floor(state.hitCooldown*18)%2===0?.45:1; player.clear().poly([x-12,y-63,x+12,y-63,x+22,y-31,x+14,y-8,x-18,y-8,x-25,y-31]).fill(0x1d2530).poly([x-24,y-31,x+14,y-28,x+9,y-10,x-20,y-8]).fill(C.pink).poly([x-11,y-78,x+8,y-80,x+14,y-69,x+7,y-58,x-12,y-60,x-17,y-69]).fill(0xe3e9eb).rect(x-11,y-71,24,5).fill(C.cyan).rect(x-15,y-9,9,13).fill(0x313944).rect(x+5,y-9,9,13).fill(0x313944); if(d>0) player.rect(x+10,y-43,26,6).fill(0x323d47).rect(x+34,y-42,25,4).fill(0x525d66).rect(x+55,y-41,10,2).fill(C.pink); else player.rect(x-36,y-43,26,6).fill(0x323d47).rect(x-59,y-42,25,4).fill(0x525d66).rect(x-65,y-41,10,2).fill(C.pink); }
function spawnEnemy() { const floor=gy(),g=new Graphics(),heavy=state.wave>=3&&Math.random()<.22; if(heavy) g.poly([-23,-52,23,-52,31,-15,22,0,-22,0,-31,-15]).fill(0x28313a).rect(-18,-49,36,10).fill(C.pink).circle(-10,-34,4).fill(C.red).circle(10,-34,4).fill(C.red); else g.poly([-12,-44,10,-44,17,-36,13,-25,-13,-25,-17,-35]).fill(0xd9e0e3).rect(-13,-38,28,5).fill(0x1a2027).rect(-8,-37,5,4).fill(C.pink).rect(5,-37,5,4).fill(C.pink).poly([-15,-24,15,-24,19,-5,10,0,-10,0,-19,-5]).fill(0x29323b); g.position.set(-45,floor); actors.addChild(g); enemies.push({g,hp:heavy?80:38,speed:heavy?30:47+state.wave*2,x:-45,y:floor,attack:heavy?18:9,heavy,flash:0,knockback:0,attackPhase:'approach',attackTimer:0}); state.spawned++; }

function fireProjectile(x:number,y:number,damage:number,speed:number,direction:Facing,angle=0,knockback=100,pierce=1,length=18,width=4,color=C.pink) {
  const g=new Graphics().rect(-length*.4,-width/2,length,width).fill(color).rect(-length*.15,-1,length*.55,2).fill(C.white);
  const rotation=direction>0?angle:Math.PI-angle; g.position.set(x,y); g.rotation=rotation; fx.addChild(g);
  bullets.push({g,x,y,vx:Math.cos(angle)*speed*direction,vy:Math.sin(angle)*speed,damage,direction,knockback,pierce,hitEnemies:new Set()});
}
function fireWeapon(weapon:WeaponDefinition) {
  const x=state.playerX+state.facing*62, y=state.playerY-40;
  for(let i=0;i<weapon.pellets;i++) {
    let angle=0;
    if(weapon.pellets>1) angle=-weapon.spreadRadians+(weapon.spreadRadians*2*i)/(weapon.pellets-1);
    else if(weapon.spreadRadians>0) angle=(Math.random()*2-1)*weapon.spreadRadians;
    fireProjectile(x,y,weapon.damage,weapon.projectileSpeed,state.facing,angle,weapon.knockback,weapon.pierce,weapon.projectileLength,weapon.projectileWidth,weapon.id==='railgun'?C.cyan:C.pink);
  }
  feedback.muzzle(x,y,state.facing);
}
function drawTower(g:Graphics,type:TowerType){g.clear();if(type==='turret')g.poly([-28,-8,28,-8,20,0,-20,0]).fill(0x161d24).rect(-19,-38,38,30).fill(0x25303a).poly([-11,-47,14,-47,19,-38,-19,-38]).fill(C.cyan).rect(-38,-43,34,7).fill(0x48545f).rect(-53,-42,18,4).fill(0x707983);else g.poly([-29,-8,29,-8,20,0,-20,0]).fill(0x161d24).rect(-18,-31,36,23).fill(0x26313a).moveTo(-20,-31).lineTo(0,-58).lineTo(20,-31).stroke({color:C.cyan,width:4}).circle(0,-48,11).stroke({color:C.cyan,width:5}).circle(0,-48,3).fill(C.white);}
function tryBuild(){const types:TowerType[]=['turret','tesla'],costs=[BALANCE.tower.turretCost,BALANCE.tower.teslaCost],type=types[state.towerMode],cost=costs[state.towerMode];if(state.credits<cost)return flashMessage('CREDITS // INSUFFICIENT',C.red);const free=spots().filter(x=>!towers.some(t=>Math.abs(t.x-x)<20)),frontline=free.filter(x=>x<state.playerX-16).sort((a,b)=>Math.abs(a-state.playerX)-Math.abs(b-state.playerX)),fallback=[...free].sort((a,b)=>Math.abs(a-state.playerX)-Math.abs(b-state.playerX)),spot=frontline[0]??fallback[0];if(spot===undefined)return flashMessage('GRID // OCCUPIED',C.amber);state.credits-=cost;const g=new Graphics();drawTower(g,type);g.position.set(spot,gy());actors.addChild(g);towers.push({g,x:spot,y:gy(),type,cooldown:0});flashMessage(frontline[0]!==undefined?'FRONTLINE // ONLINE':'GRID // FALLBACK',C.cyan);}
function flashMessage(message:string,color:number){const t=new Text({text:message,style:new TextStyle({fill:color,fontSize:14,fontWeight:'900',letterSpacing:2})});t.anchor.set(.5);t.position.set(app.renderer.width/2,92);alerts.addChild(t);let life=1.1;const fade=(ticker:typeof app.ticker)=>{life-=ticker.deltaMS/1000;t.alpha=Math.min(1,Math.max(0,life/.3));t.position.x=app.renderer.width/2;if(life<=0){t.destroy();app.ticker.remove(fade);}};app.ticker.add(fade);}
function nearestEnemyTo(x:number){let best:Enemy|undefined,bestDistance=Infinity;for(const e of enemies){const distance=Math.abs(e.x-x);if(distance<bestDistance){best=e;bestDistance=distance;}}return best;}
function updatePlayer(dt:number){const actions=input.actions;state.hitCooldown=Math.max(0,state.hitCooldown-dt);if(actions.left){state.playerX-=BALANCE.player.speed*dt;state.facing=-1;}if(actions.right){state.playerX+=BALANCE.player.speed*dt;state.facing=1;}state.playerX=Math.max(55,Math.min(cx()-78,state.playerX));const floor=gy();if(actions.jump&&state.grounded){state.vy=BALANCE.player.jumpVelocity;state.grounded=false;}if(!state.grounded){state.vy+=BALANCE.player.gravity*dt;state.playerY+=state.vy*dt;if(state.playerY>=floor){state.playerY=floor;state.vy=0;state.grounded=true;}}else state.playerY=floor;if(actions.fire&&state.shootTimer<=0){const target=nearestEnemyTo(state.playerX);if(target)state.facing=target.x<state.playerX?-1:1;const weapon=weaponAt(state.weaponIndex);fireWeapon(weapon);state.shootTimer=weapon.cooldown;}state.shootTimer-=dt;}
function updateEnemies(dt:number){const floor=gy();for(let i=enemies.length-1;i>=0;i--){const e=enemies[i],profile=enemyContactProfile(e.heavy),distance=Math.abs(e.x-state.playerX),playerReachable=state.playerY>floor-54;e.flash=Math.max(0,e.flash-dt);e.g.tint=e.flash>0?0xffd7e6:0xffffff;e.knockback*=Math.pow(.02,dt);if(e.attackPhase==='recovery'){e.attackTimer-=dt;e.x+=e.speed*.28*dt+e.knockback*dt;if(e.attackTimer<=0)e.attackPhase='approach';}else if(e.attackPhase==='windup'){e.attackTimer-=dt;e.x+=e.knockback*dt;if(distance>profile.triggerRange+24||!playerReachable){e.attackPhase='approach';e.attackTimer=0;}else if(e.attackTimer<=0){const direction:Facing=e.x<state.playerX?1:-1;if(state.hitCooldown<=0){state.playerHp=Math.max(0,state.playerHp-profile.damage);state.hitCooldown=BALANCE.player.hitInvulnerability;state.playerX+=direction*profile.playerKnockback;e.x-=direction*profile.enemyRecoil;feedback.enemyAttackImpact(e.x,e.y-28,e.heavy);feedback.playerHit(state.playerX,state.playerY-35,e.heavy);}e.attackPhase='recovery';e.attackTimer=profile.recovery;}}else if(distance<=profile.triggerRange&&playerReachable){e.attackPhase='windup';e.attackTimer=profile.windup;feedback.enemyAttackTelegraph(e.x,e.y-28,e.heavy);}else{e.x+=e.speed*dt+e.knockback*dt;}if(e.x>cx()-58){state.coreHp-=e.attack*dt;e.x-=8*dt;}e.g.position.set(e.x,floor);if(e.hp<=0){feedback.death(e.x,e.y-24,e.heavy);state.credits+=BALANCE.economy.killReward;state.killed++;e.g.destroy();enemies.splice(i,1);}}}
function updateBullets(dt:number){for(let i=bullets.length-1;i>=0;i--){const b=bullets[i],previousX=b.x;b.x+=b.vx*dt;b.y+=b.vy*dt;b.g.position.set(b.x,b.y);feedback.trail(previousX,b.x,b.y,b.direction);for(const e of enemies){if(b.hitEnemies.has(e))continue;if(Math.abs(e.x-b.x)<(e.heavy?30:20)&&Math.abs((e.y-27)-b.y)<38){e.hp-=b.damage;e.flash=.08;e.knockback+=b.direction*(e.heavy?b.knockback*.55:b.knockback);b.hitEnemies.add(e);b.pierce--;feedback.hit(e.x,e.y-28,b.damage,e.heavy);if(b.pierce<=0)break;}}if(b.pierce<=0||b.x>app.renderer.width+40||b.x<-40||b.y<0||b.y>app.renderer.height){b.g.destroy();bullets.splice(i,1);}}}
function updateTowers(dt:number){for(const tower of towers){tower.y=gy();tower.g.position.y=tower.y;tower.cooldown-=dt;const primaryRange=tower.type==='turret'?BALANCE.tower.turretPrimaryRange:BALANCE.tower.teslaPrimaryRange,emergencyRange=tower.type==='turret'?BALANCE.tower.turretEmergencyRange:BALANCE.tower.teslaEmergencyRange,primary=enemies.filter(e=>e.x<=tower.x&&tower.x-e.x<=primaryRange).sort((a,b)=>b.x-a.x)[0],emergency=enemies.filter(e=>e.x>tower.x&&e.x-tower.x<=emergencyRange).sort((a,b)=>a.x-b.x)[0],target=primary??emergency;if(!target||tower.cooldown>0)continue;const direction:Facing=target.x<=tower.x?-1:1;if(tower.type==='turret'){tower.g.scale.x=direction<0?1:-1;fireProjectile(tower.x+direction*50,tower.y-40,17,760,direction,0,70,1,18,4,C.cyan);feedback.muzzle(tower.x+direction*50,tower.y-40,direction);tower.cooldown=direction<0?.52:.68;}else{const damage=direction<0?28:20;target.hp-=damage;target.flash=.08;feedback.hit(target.x,target.y-28,damage,target.heavy);const arc=new Graphics().moveTo(tower.x,tower.y-48).lineTo((tower.x+target.x)/2,tower.y-92).lineTo(target.x,target.y-30).stroke({color:C.cyan,width:3,alpha:direction<0?.9:.62});fx.addChild(arc);setTimeout(()=>arc.destroy(),90);tower.cooldown=direction<0?.85:1.05;}}}
function updateWave(dt:number){state.spawnTimer-=dt;if(state.spawned<state.waveSize&&state.spawnTimer<=0){spawnEnemy();state.spawnTimer=Math.max(.42,1.25-state.wave*.08);}if(state.spawned>=state.waveSize&&enemies.length===0){state.wave++;state.waveSize=Math.min(18,7+state.wave*2);state.spawned=0;state.killed=0;state.credits+=BALANCE.economy.waveReward;state.spawnTimer=2;flashMessage(`WAVE ${state.wave} // INCOMING`,C.pink);}if(state.playerHp<=0){state.playerHp=0;state.gameOver=true;flashMessage('OPERATOR // DOWN // PRESS R',C.red);}else if(state.coreHp<=0){state.coreHp=0;state.gameOver=true;flashMessage('CORE // BREACHED // PRESS R',C.red);}}
function panel(x:number,y:number,w:number,h:number){return new Graphics().roundRect(x,y,w,h,5).fill({color:0x0b1016,alpha:.86}).stroke({color:0x313b45,width:1,alpha:.8});}
function drawHud(){hud.removeChildren();const w=app.renderer.width,compact=isTouchLayout(),margin=compact?10:18,topH=compact?60:68;hud.addChild(panel(margin,margin,w-margin*2,topH));const weapon=weaponAt(state.weaponIndex);const title=new Text({text:compact?'NEON//SIEGE':'NEON // SIEGE',style:new TextStyle({fill:C.white,fontSize:compact?16:22,fontWeight:'900',letterSpacing:2})});title.position.set(margin+16,margin+10);hud.addChild(title);const wave=new Text({text:`W${state.wave}  HOSTILES ${Math.max(0,state.waveSize-state.killed)}  // ${weapon.name}`,style:new TextStyle({fill:C.white,fontSize:compact?9:12,fontWeight:'800'})});wave.position.set(compact?w*.34:250,margin+10);hud.addChild(wave);const barX=compact?w*.34:250,barY=margin+34,barW=compact?Math.max(100,w*.28):320,bars=new Graphics().roundRect(barX,barY,barW,6,3).fill(0x252d35).roundRect(barX,barY,barW*Math.max(0,state.coreHp/100),6,3).fill(state.coreHp<35?C.red:C.cyan).roundRect(barX,barY+11,barW,3,2).fill(0x252d35).roundRect(barX,barY+11,barW*Math.max(0,state.playerHp/100),3,2).fill(state.playerHp<35?C.red:C.pink);hud.addChild(bars);const cash=new Text({text:`$${Math.floor(state.credits)}`,style:new TextStyle({fill:C.amber,fontSize:compact?16:20,fontWeight:'900'})});cash.anchor.set(1,0);cash.position.set(w-margin-15,margin+10);hud.addChild(cash);if(!compact){const y=app.renderer.height-56;hud.addChild(panel(18,y,760,38));const txt=new Text({text:`${state.towerMode===0?'1 TURRET $120':'2 TESLA $180'}  |  Z/X/C/V ${WEAPONS.map(item=>item.name).join('/')}  |  B BUILD  A/D MOVE  SPACE JUMP  J FIRE`,style:new TextStyle({fill:C.muted,fontSize:10,fontWeight:'800'})});txt.position.set(32,y+13);hud.addChild(txt);}}
app.ticker.add(ticker=>{const rawDt=Math.min(.033,ticker.deltaMS/1000),dt=feedback.consumeTime(rawDt);if(!state.gameOver){updatePlayer(dt);updateEnemies(dt);updateBullets(dt);updateTowers(dt);updateWave(dt);}drawEnvironment();drawHud();feedback.update(rawDt);});
window.addEventListener('resize',()=>{state.playerX=Math.min(state.playerX,cx()-78);});
drawEnvironment();flashMessage('SECTOR 07 // LINK ESTABLISHED',C.cyan);
