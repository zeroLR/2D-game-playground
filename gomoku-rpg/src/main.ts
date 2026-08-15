import { Application,Container } from 'pixi.js';
import { Pos,createBoard,winningLine } from './game';
import { CombatState,createCombatState,getMana } from './combat';
import { SkillId,skills } from './skills';
import { HeroId,createLoadout,heroes } from './heroes';
import { ActionResolution,resolvePlaceAction,resolveSkillAction } from './runtime/action-resolution';
import { TurnState,completeCpuTurn,completePlayerTurn,continuePlayerTurn,createTurnState,endMatch,isPlayerInput } from './runtime/turn-runtime';
import { resolveCpuTurn } from './runtime/cpu-runtime';
import { IDLE_TARGETING,SkillTargetingState,selectTargetingCell,targetingHighlights,toggleTargeting } from './runtime/targeting';
import { Locale,loadLocale,nextLocale,saveLocale } from './i18n';
import { createPlaytestMetrics,finishMetrics,recordMana,recordPlacement,recordSkill,summaryText } from './telemetry';
import { describeSkillBar,statusKey } from './runtime/presentation';
import { ViewContext,prepareStage } from './ui/theme';
import { renderBoard } from './ui/board-view';
import { FEEDBACK_MS,createCombatFeedback } from './ui/feedback';
import { renderFooter,renderHudPanel,renderHudTop } from './ui/hud-view';
import { renderMatchOverBar,renderSkillBar } from './ui/skill-view';
import { renderHeroSelect as drawHeroSelect } from './ui/hero-select-view';
import './style.css';
const app=new Application();await app.init({resizeTo:window,antialias:true,background:'#f3efe7',resolution:Math.min(devicePixelRatio,2)});document.querySelector('#app')!.appendChild(app.canvas);
type Screen='hero-select'|'match';let screen:Screen='hero-select';let selectedHero:HeroId='arcanist';let loadout=createLoadout(selectedHero);let combat:CombatState=createCombatState(createBoard());let metrics=createPlaytestMetrics(selectedHero,getMana(combat,1));let turnState:TurnState=createTurnState();let targeting:SkillTargetingState=IDLE_TARGETING;let locale:Locale=loadLocale();let cpuTimer:ReturnType<typeof setTimeout>|null=null;let summaryCopied=false;
const feedback=createCombatFeedback(()=>render());
const root=new Container();app.stage.addChild(root);
const view=():ViewContext=>({root,locale});
function prepare(){prepareStage(root,app.screen.width,app.screen.height);}
function renderHeroSelect(){prepare();drawHeroSelect(view(),{selectedHero,onSelectHero,onStart:startBattle,onToggleLocale:toggleLocale});renderFooter(view());}
function renderMatch(){
 prepare();
 const ctx=view(),hero=heroes[selectedHero];
 renderHudTop(ctx,{turn:turnState.turn,onToggleLocale:toggleLocale});
 const marks=feedback.state();
 renderBoard(ctx,{state:combat,highlights:targetingHighlights(combat,1,targeting),feedback:marks,onCell});
 renderHudPanel(ctx,{hero,mana:getMana(combat,1),status:statusKey(turnState,targeting),manaPulse:marks.manaPulse>0,passivePulse:!!marks.passivePulse,passiveBanner:marks.passiveBanner});
 if(turnState.status==='playing')renderSkillBar(ctx,{items:describeSkillBar(combat,1,loadout,turnState,targeting),onSelect:selectSkill});
 else renderMatchOverBar(ctx,{summaryCopied,onRestart:restart,onChooseHero:chooseHero,onCopySummary:copySummary});
 renderFooter(ctx);
}
function onSelectHero(id:HeroId){selectedHero=id;loadout=createLoadout(id);render();}
function render(){screen==='hero-select'?renderHeroSelect():renderMatch();}function toggleLocale(){locale=nextLocale(locale);saveLocale(locale);render();}function resetMatch(){if(cpuTimer){clearTimeout(cpuTimer);cpuTimer=null;}combat=createCombatState(createBoard());metrics=createPlaytestMetrics(selectedHero,getMana(combat,1));turnState=createTurnState();targeting=IDLE_TARGETING;feedback.clear();summaryCopied=false;}function startBattle(){loadout=createLoadout(selectedHero);resetMatch();screen='match';render();}function chooseHero(){resetMatch();screen='hero-select';render();}function restart(){resetMatch();render();}async function copySummary(){const text=summaryText(metrics);console.info('[Gomoku RPG playtest metrics]',text);try{await navigator.clipboard.writeText(text);summaryCopied=true;render();setTimeout(()=>{summaryCopied=false;render();},1200);}catch{window.prompt(locale==='en'?'Copy playtest metrics':'複製遊戲測試數據',text);}}function selectSkill(id:SkillId){if(!isPlayerInput(turnState)||!loadout.skills.includes(id)||getMana(combat,1)<skills[id].cost)return;targeting=toggleTargeting(targeting,id);render();}
function onCell(p:Pos){if(!isPlayerInput(turnState))return;if(targeting.mode!=='idle'){const intent=selectTargetingCell(combat,1,targeting,p);if(intent.kind==='invalid'){invalid(p);return;}if(intent.kind==='source'){targeting=intent.targeting;render();return;}const cast=resolveSkillAction(combat,selectedHero,1,intent.skillId,intent.target,intent.source);cast.ok?applyResolution(cast):invalid(p);return;}const resolution=resolvePlaceAction(combat,selectedHero,1,p);resolution.ok?applyResolution(resolution):invalid(p);}
function applyResolution(r:ActionResolution){combat=r.state;r.skillId?recordSkill(metrics,r.skillId,r.skillCost,r.passiveTriggered,r.passiveMana,getMana(combat,1)):recordPlacement(metrics,r.manaGained,r.passiveTriggered,r.passiveMana,getMana(combat,1));targeting=IDLE_TARGETING;feedback.markMove(r.at);feedback.showManaGain(r.skillId?r.passiveMana:r.manaGained,r.skillId?FEEDBACK_MS.manaSkill:FEEDBACK_MS.manaPlace);if(r.passiveTriggered)feedback.showPassiveTriggered(r.at);if(r.won){feedback.markWinningLine(winningLine(combat.board,r.at,1));turnState=endMatch(turnState,'victory');finishMetrics(metrics,'victory',getMana(combat,1));render();return;}feedback.showAction(r.at);finishPlayer(r.passiveTriggered?900:500);}
function invalid(p:Pos){feedback.showInvalidTarget(p);}function finishPlayer(delay=500){recordMana(metrics,getMana(combat,1));const done=completePlayerTurn(combat,turnState);combat=done.state;turnState=done.turn;render();cpuTimer=setTimeout(cpuTurn,delay);}function cpuTurn(){cpuTimer=null;const cpu=resolveCpuTurn(combat);if(cpu.outcome==='draw'){turnState=endMatch(turnState,'draw');finishMetrics(metrics,'draw',getMana(combat,1));render();return;}if(cpu.outcome==='blocked'){turnState=continuePlayerTurn(turnState);render();return;}combat=cpu.state;feedback.markMove(cpu.at);if(cpu.outcome==='won'){feedback.markWinningLine(winningLine(combat.board,cpu.at!,2));turnState=endMatch(turnState,'defeat');finishMetrics(metrics,'defeat',getMana(combat,1));render();return;}const done=completeCpuTurn(combat,turnState);combat=done.state;turnState=done.turn;feedback.showAction(cpu.at!);}
render();window.addEventListener('resize',render);
