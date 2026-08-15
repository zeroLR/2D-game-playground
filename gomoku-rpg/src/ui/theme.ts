import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Locale } from '../i18n';

export const CANVAS_WIDTH=390,CANVAS_HEIGHT=844,CANVAS_CENTER=CANVAS_WIDTH/2;
export const ink=0x24232b,muted=0x9d968d,gold=0xc9a35c,violet=0x7450a9,paper=0xf3efe7;
export const panel=0x292936,card=0xf8f5ef,edge=0xd8c8a7,parchment=0xf3e6c9,line=0xb9b1a7;

/** Everything a view needs to draw: where to attach, and which locale the type is set in. */
export interface ViewContext{root:Container;locale:Locale}

export const textStyle=(locale:Locale,size:number,color=ink,weight='500')=>new TextStyle({fontFamily:'Georgia, "Noto Serif TC", serif',fontSize:size,fill:color,fontWeight:weight as any,letterSpacing:locale==='zh-TW'?1:2});

export function label({root,locale}:ViewContext,text:string,x:number,y:number,size=14,color=ink,weight='500'){
  const node=new Text({text,style:textStyle(locale,size,color,weight)});node.x=x;node.y=y;root.addChild(node);return node;
}

/** Same as `label` but horizontally centred on `centerX`, which needs the measured width. */
export function centeredLabel(ctx:ViewContext,text:string,centerX:number,y:number,size=14,color=ink,weight='500'){
  const node=label(ctx,text,0,y,size,color,weight);node.x=centerX-node.width/2;return node;
}

export function diamond(g:Graphics,x:number,y:number,r:number,color:number,filled=true){
  g.moveTo(x,y-r).lineTo(x+r,y).lineTo(x,y+r).lineTo(x-r,y).closePath();
  filled?g.fill(color):g.stroke({color,width:1});
}

export function button({root}:ViewContext,x:number,y:number,w:number,h:number,onTap:()=>void,active=false){
  const g=new Graphics().roundRect(x,y,w,h,7).fill(active?panel:card).stroke({color:active?gold:edge,width:1});
  g.eventMode='static';g.cursor='pointer';g.on('pointertap',onTap);root.addChild(g);return g;
}

/** Clears the stage and re-fits the fixed portrait canvas into the current window. */
export function prepareStage(root:Container,screenWidth:number,screenHeight:number){
  root.removeChildren();
  const scale=Math.min(screenWidth/CANVAS_WIDTH,screenHeight/CANVAS_HEIGHT);
  root.scale.set(scale);root.x=(screenWidth-CANVAS_WIDTH*scale)/2;root.y=(screenHeight-CANVAS_HEIGHT*scale)/2;
  root.addChild(new Graphics().rect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT).fill(paper));
}
