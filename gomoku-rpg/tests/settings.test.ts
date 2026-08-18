import {beforeEach,describe,expect,it,vi} from 'vitest';
import {DEFAULT_SETTINGS,loadSettings,resetSettings,saveSettings} from '../src/settings';

const storage=new Map<string,string>();
const localStorageMock={
 getItem:vi.fn((key:string)=>storage.get(key)??null),
 setItem:vi.fn((key:string,value:string)=>{storage.set(key,value);}),
 removeItem:vi.fn((key:string)=>{storage.delete(key);}),
 clear:vi.fn(()=>{storage.clear();}),
 key:vi.fn((index:number)=>Array.from(storage.keys())[index]??null),
 get length(){return storage.size;},
};
vi.stubGlobal('localStorage',localStorageMock);

describe('HUD M5 settings persistence',()=>{
 beforeEach(()=>{storage.clear();vi.clearAllMocks();});
 it('loads stable defaults',()=>expect(loadSettings()).toEqual(DEFAULT_SETTINGS));
 it('persists functional settings',()=>{saveSettings({...DEFAULT_SETTINGS,showCoordinates:false,animations:false,locale:'en'});expect(loadSettings()).toMatchObject({showCoordinates:false,animations:false,locale:'en'});});
 it('resets settings',()=>{saveSettings({...DEFAULT_SETTINGS,haptics:false});expect(resetSettings()).toEqual(DEFAULT_SETTINGS);expect(loadSettings()).toEqual(DEFAULT_SETTINGS);});
});
