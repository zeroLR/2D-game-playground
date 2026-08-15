import RAPIER from '@dimforge/rapier3d-compat';
import './style.css';
import { StackShiftGame } from './game/StackShiftGame';

await RAPIER.init();
new StackShiftGame(document.querySelector<HTMLDivElement>('#game')!);
