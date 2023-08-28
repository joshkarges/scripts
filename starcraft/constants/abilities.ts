import { EnergyCost } from "./energy";
import { GameEffect } from "./gameEffect";

export type Ability = {
  energy: EnergyCost,
  /** TODO: effect */
  effect: GameEffect,
};