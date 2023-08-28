import { GameState } from "./gameState";
import { Unit } from "./units";

export type GameEffect = (gameState: GameState) => GameState;
export type UnitEffect = (gameState: Unit) => Unit;