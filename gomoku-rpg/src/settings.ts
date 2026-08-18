import { Locale } from './i18n';

export type ThemeSetting='light'|'dark';
export interface GameSettings{
 locale:Locale;
 theme:ThemeSetting;
 showCoordinates:boolean;
 showLegalMoves:boolean;
 animations:boolean;
 haptics:boolean;
}

const STORAGE_KEY='gomoku-rpg.settings.v1';
export const DEFAULT_SETTINGS:GameSettings={locale:'zh-TW',theme:'light',showCoordinates:true,showLegalMoves:true,animations:true,haptics:true};

export function loadSettings():GameSettings{
 try{
  const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return {...DEFAULT_SETTINGS};
  const value=JSON.parse(raw) as Partial<GameSettings>;
  return {...DEFAULT_SETTINGS,...value,locale:value.locale==='en'?'en':'zh-TW',theme:value.theme==='dark'?'dark':'light'};
 }catch{return {...DEFAULT_SETTINGS};}
}
export function saveSettings(settings:GameSettings){localStorage.setItem(STORAGE_KEY,JSON.stringify(settings));}
export function resetSettings(){saveSettings({...DEFAULT_SETTINGS});return {...DEFAULT_SETTINGS};}
