import { Container, Graphics } from 'pixi.js';
import type { Rect } from '../movement';
import type { EnemyActor, EnemyKind } from './EnemyActor';

export class InkWardenBoss extends Container implements EnemyActor {
  readonly kind: EnemyKind = 'walker';
  readonly maxHp = 12;
  hp = 12; hurtTime = 0;
  private state: 'intro'|'idle'|'telegraph'|'charge'|'recover' = 'intro';
  private timer = 0.8; private facing: -1|1 = -1; private vx = 0;
  private readonly groundY: number;

  constructor(public readonly enemyId: number, x: number, groundY: number) {
    super(); this.groundY = groundY - 31; this.position.set(x, this.groundY);
    const cloak = new Graphics().moveTo(-25,30).quadraticCurveTo(-31,-12,0,-35).quadraticCurveTo(31,-12,25,30).closePath().fill(0x25241f);
    const crown = new Graphics().moveTo(-22,-19).lineTo(-11,-42).lineTo(0,-25).lineTo(13,-45).lineTo(23,-18).stroke({color:0x25241f,width:6});
    const eye = new Graphics().circle(-7,-9,2).circle(7,-9,2).fill(0xe9e4d8); this.addChild(cloak,crown,eye);
  }

  update(playerX:number,_playerY:number,dt:number) {
    this.hurtTime=Math.max(0,this.hurtTime-dt); if(this.hp<=0){this.alpha=Math.max(0,this.alpha-dt*2.2);return;}
    this.timer-=dt; const dx=playerX-this.x;
    if(this.state==='intro'){ if(this.timer<=0){this.state='idle';this.timer=0.65;} }
    else if(this.state==='idle'){ if(Math.abs(dx)>8)this.facing=dx<0?-1:1; if(this.timer<=0){this.state='telegraph';this.timer=this.hp<=6?0.38:0.52;} }
    else if(this.state==='telegraph'){ this.scale.y=0.82; if(this.timer<=0){this.scale.y=1;this.state='charge';this.timer=this.hp<=6?0.48:0.40;this.vx=this.facing*(this.hp<=6?360:300);} }
    else if(this.state==='charge'){ this.x+=this.vx*dt; if(this.timer<=0||this.x<965||this.x>1340){this.state='recover';this.timer=this.hp<=6?0.42:0.62;this.vx=0;} }
    else if(this.state==='recover'){ if(this.timer<=0){this.state='idle';this.timer=this.hp<=6?0.28:0.5;} }
    this.x=Math.max(960,Math.min(1345,this.x)); this.y=this.groundY; this.scale.x=this.facing; this.alpha=this.hurtTime>0?0.45:1;
  }
  hurtbox():Rect{return{x:this.x-25,y:this.y-34,width:50,height:64};}
  hit(direction:-1|1){this.hp--;this.hurtTime=0.12;this.x+=direction*10;}
  impactPoint(){return{x:this.x,y:this.y-10};}
}
