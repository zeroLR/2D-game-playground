import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Locale } from '../i18n';
import { canvas,color } from './design/tokens';

export const CANVAS_WIDTH=canvas.width,CANVAS_HEIGHT=canvas.height,CANVAS_CENTER=canvas.centerX;
export const ink=color.ink,muted=color.muted,gold=color.gold,violet=color.violet,paper=color.paper;
export const panel=color.panel,card=color.paperRaised,edge=color.edge,parchment=color.parchment,line=color.line;

/** Everything a view needs to draw: where to attach, and which locale the type is set in. */
export interface ViewContext{root:Container;locale:Locale}

export const textStyle=(locale:Locale,size:number,colorValue=ink,weight='500')=>new TextStyle({fontFamily:'Georgia, "Noto Serif TC", serif',fontSize:size,fill:colorValue,fontWeight:weight as any,letterSpacing:locale==='zh-TW'?1:2});

export function label({root,locale}:ViewContext,text:string,x:number,y:number,size=14,colorValue=ink,weight='500'){
  const node=new Text({text,style:textStyle(locale,size,colorValue,weight)});node.x=x;node.y=y;root.addChild(node);return node;
}

export function centeredLabel(ctx:ViewContext,text:string,centerX:number,y:number,size=14,colorValue=ink,weight='500'){
  const node=label(ctx,text,0,y,size,colorValue,weight);node.x=centerX-node.width/2;return node;
}

export function diamond(g:Graphics,x:number,y:number,r:number,colorValue:number,filled=true){
  g.moveTo(x,y-r).lineTo(x+r,y).lineTo(x,y+r).lineTo(x-r,y).closePath();
  filled?g.fill(colorValue):g.stroke({color:colorValue,width:1});
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
