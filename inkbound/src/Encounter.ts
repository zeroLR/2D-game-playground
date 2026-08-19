import { Container, Graphics } from 'pixi.js';
import { overlaps } from './combat';
import { FloaterEnemy } from './enemies/FloaterEnemy';
import type { EnemyActor } from './enemies/EnemyActor';
import { InkWardenBoss } from './enemies/InkWardenBoss';
import { LeaperEnemy } from './enemies/LeaperEnemy';
import { WalkerEnemy } from './enemies/WalkerEnemy';
import type { Rect } from './movement';

export class Encounter extends Container {
  readonly enemies: EnemyActor[] = [new WalkerEnemy(1, 770, 500, 710, 885), new LeaperEnemy(2, 1005, 455), new FloaterEnemy(3, 1225, 315)];
  readonly boss = new InkWardenBoss(10, 1270, 405); private bossActive=false; private readonly projectileLayer=new Container();
  constructor(){super();for(const enemy of this.enemies)this.addChild(enemy);this.boss.visible=false;this.addChild(this.boss,this.projectileLayer);}
  update(playerX:number,playerY:number,dt:number){for(const enemy of this.enemies)enemy.update(playerX,playerY,dt);if(!this.bossActive&&this.enemies.every(e=>e.hp<=0)){this.bossActive=true;this.boss.visible=true;}if(this.bossActive)this.boss.update(playerX,playerY,dt);this.drawProjectiles();}
  get combatants():EnemyActor[]{return this.bossActive?[this.boss]:this.enemies;}
  damageSource(rect:Rect){for(const enemy of this.combatants){if(enemy.hp>0&&overlaps(rect,enemy.hurtbox()))return{x:enemy.x,projectile:false};if(!(enemy instanceof FloaterEnemy))continue;for(const shot of enemy.shots)if(overlaps(rect,{x:shot.x-5,y:shot.y-5,width:10,height:10})){shot.life=0;return{x:shot.x,projectile:true};}}return undefined;}
  get bossStarted(){return this.bossActive;}
  get bossHp(){return this.boss.hp;}
  get bossMaxHp(){return this.boss.maxHp;}
  get cleared(){return this.bossActive&&this.boss.hp<=0;}
  private drawProjectiles(){this.projectileLayer.removeChildren().forEach(child=>child.destroy());for(const enemy of this.enemies)if(enemy instanceof FloaterEnemy)for(const shot of enemy.shots){const mark=new Graphics().circle(0,0,5).fill({color:0x24231f,alpha:0.78});mark.position.set(shot.x,shot.y);this.projectileLayer.addChild(mark);}}
}
