export const clampHistoryOffset=(value:number,max:number)=>Math.max(0,Math.min(max,value));
export const historyOffsetFromDrag=(initial:number,startY:number,currentY:number,max:number)=>clampHistoryOffset(initial-(currentY-startY),max);
