import { Cost } from "./cost";
import { GameEffect } from "./gameEffect";
import { Unit } from "./units";

export type Upgrade = {
  cost: Cost,
  effect: GameEffect
};

export type UnitUpgrade = {
  cost: Cost,
  effect: Unit, // overrides
};