import { Container, Graphics } from 'pixi.js';

export class Projectile {
  readonly view: Graphics;
  constructor(public vx:number,public vy:number,public enemy:boolean,public damage=1,public pierce=0,radius=3,color=0xff5b5b){this.view=new Graphics().circle(0,0,radius).fill(enemy?0xff5b5b:color)}
  spawn(world:Container,x:number,y:number){this.view.x=x;this.view.y=y;world.addChild(this.view);return this}
  update(delta:number){this.view.x+=this.vx*delta;this.view.y+=this.vy*delta}
  destroy(){this.view.destroy()}
}
