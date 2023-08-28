import { Building, BuildingType } from "./buildings";
import { Gas, Minerals, Supply, Time } from "./resources";
import { Unit, UnitType } from "./units";

export type NumericResources = {
  time: Time,
  minerals: Minerals,
  gas: Gas, // TODO: What about avaible vespene geysers, or available mineral patches?
  supply: Supply,
  supplyAvailable: Supply,
  workers: number,
  army: number,
}

type Mutator = (state: GameState) => boolean;

type CanTakeAction = (state: GameState) => boolean;

type Action = {
  canTakeAction: CanTakeAction;
  startMutate: Mutator;
  startTime: number;
  timeDelta: number;
  endMutate: Mutator;
};

type WithAction<T> = T & {action?: Action};

export type GameState = NumericResources & {
  buildings: Partial<Record<BuildingType, Building[]>>,
  units: Partial<Record<UnitType, Unit[]>>,
};

export type Resource = keyof GameState;