import {beforeEach,describe,expect,it} from 'vitest';
import {DEFAULT_SETTINGS,loadSettings,resetSettings,saveSettings} from '../src/settings';

describe('HUD M5 settings persistence',()=>{
 beforeEach(()=>localStorage.clear());
 it('loads stable defaults',()=>expect(loadSettings()).toEqual(DEFAULT_SETTINGS));
 it('persists functional settings',()=>{saveSettings({...DEFAULT_SETTINGS,showCoordinates:false,animations:false,locale:'en'});expect(loadSettings()).toMatchObject({showCoordinates:false,animations:false,locale:'en'});});
 it('resets settings',()=>{saveSettings({...DEFAULT_SETTINGS,haptics:false});expect(resetSettings()).toEqual(DEFAULT_SETTINGS);expect(loadSettings()).toEqual(DEFAULT_SETTINGS);});
});
