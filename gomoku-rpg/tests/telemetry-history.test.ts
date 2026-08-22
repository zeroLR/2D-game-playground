import {beforeEach,describe,expect,it,vi} from 'vitest';
import {HISTORY_STORAGE_KEY,clearHistory,createPlaytestMetrics,exportHistory,finishMetrics,loadHistory} from '../src/telemetry';

const store=new Map<string,string>();
beforeEach(()=>{store.clear();vi.stubGlobal('localStorage',{getItem:(key:string)=>store.get(key)??null,setItem:(key:string,value:string)=>store.set(key,value),removeItem:(key:string)=>store.delete(key)});});

describe('playtest history',()=>{
  it('persists every completed match',()=>{const first=createPlaytestMetrics('vanguard');finishMetrics(first,'victory',2);const second=createPlaytestMetrics('shade');finishMetrics(second,'defeat',1);expect(loadHistory()).toHaveLength(2);expect(exportHistory().heroCounts).toEqual({vanguard:1,arcanist:0,shade:1,architect:0});});
  it('does not duplicate a match when finish is called twice',()=>{const match=createPlaytestMetrics('arcanist');finishMetrics(match,'victory',3);finishMetrics(match,'victory',3);expect(loadHistory()).toHaveLength(1);});
  it('recovers from corrupt storage',()=>{store.set(HISTORY_STORAGE_KEY,'not-json');expect(loadHistory()).toEqual([]);});
  it('clears the complete dataset',()=>{const match=createPlaytestMetrics('shade');finishMetrics(match,'draw',0);clearHistory();expect(exportHistory().totalMatches).toBe(0);});
});
