import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Ability } from "./abilities";
import { Action, ActionQueue } from "./actions";
import { Attack } from "./attack";
import { UnitAttributes } from "./attributes";
import { Cost } from "./cost";
import { Energy } from "./energy";
import { Gas, Minerals, Supply, Time } from "./resources";
import { UnitUpgrade, Upgrade } from "./upgrade";

export type UnitCost = Cost & {
  supply: Supply,
}

const getUnitCost = (
  minerals: Minerals,
  gas: Gas,
  time: Time,
  supply: Supply
): UnitCost => ({ minerals, gas, time, supply });

export const UNIT_COSTS = {
  larva: getUnitCost(0, 0, 0, 0),
  drone: getUnitCost(50, 0, 12, 1),
  overlord: getUnitCost(100, 0, 18, -8),
  queen: getUnitCost(150, 0, 36, 2),
  zergling: getUnitCost(25, 0, 17, 0.5),
  roach: getUnitCost(75, 25, 19, 2),
  ravager: getUnitCost(25, 75, 9, 1),
  hydralisk: getUnitCost(100, 50, 24, 2),
  lurker: getUnitCost(50, 100, 18, 1),
  mutalisk: getUnitCost(100, 100, 24, 2),
  corruptor: getUnitCost(150, 100, 29, 2),
  broodLord: getUnitCost(150, 150, 24, 2),
  baneling: getUnitCost(25, 25, 14, 0.5),
  overseer: getUnitCost(50, 50, 12, 0),
  swarmHost: getUnitCost(100, 75, 29, 3),
  infestor: getUnitCost(100, 150, 36, 2),
  viper: getUnitCost(100, 200, 29, 3),
  ultralisk: getUnitCost(300, 200, 39, 6),
  scv: getUnitCost(50, 0, 12, 1),
  probe: getUnitCost(50, 0, 12, 1),
};

type TemporaryUnit =
  | 'changeling'
  | 'broodling'
  | 'locust'
  | 'larvaCocoon'
  | 'banelingCocoon'
  | 'ravagerCocoon'
  | 'lurkerCocoon'
  | 'broodLordCocoon'
  | 'overseerCocoon'


export type ZergUnit = (keyof typeof UNIT_COSTS) | TemporaryUnit;

export type UnitType = ZergUnit;

export type Unit = { // TODO: Separate static properties from dynamic properties? (hp, shields, upgrades, visibilty)
  id: string,
  name: UnitType,
  hp: number,
  shields: number,
  fullHp: number,
  fullShields: number,
  upgrades: Upgrade[], // overrides
  speed: number,
  visibility: 'visible' | 'cloaked' | 'burrowed',
  armor: number,
  energy: Energy,
  cargoSize: number,
  attack: Attack,
  abilities: Ability[],
  attributes: UnitAttributes,
  queues: ActionQueue[],
  supplyType: 'army' | 'workers' | 'neither',
  isInProgress?: boolean,
}

export const getUnit = (
  name: Unit['name'],
  hp: Unit['hp'],
  shields: Unit['shields'],
  upgrades: Unit['upgrades'],
  speed: Unit['speed'],
  visibility: Unit['visibility'],
  armor: Unit['armor'],
  energy: Unit['energy'],
  cargoSize: Unit['cargoSize'],
  attack: Unit['attack'],
  abilities: Unit['abilities'],
  attributes: Unit['attributes'],
  queues: Unit['queues'],
  supplyType: Unit['supplyType'],
): Unit => ({
  id: '',
  name,
  hp,
  shields,
  fullHp: hp,
  fullShields: shields,
  upgrades,
  speed,
  visibility,
  armor,
  energy,
  cargoSize,
  attack,
  abilities,
  attributes,
  queues,
  supplyType,
});

const noEnergy = (): Energy => ({current: 0, max: 0, rate: 0, starting: 0});

const unitActionQueue = (): ActionQueue[] => [{size: Infinity, actions: []}];

export const ZERG_UNITS: Partial<Record<UnitType, Unit>> = {
  drone: getUnit('drone', 40, 0, [], 3.94, 'visible', 0, noEnergy(), 1, {damage: 5, cooldown: 1.07, range: 0.1}, [], {structure: 'biological', weight: 'light'}, unitActionQueue(), 'workers'),
  overlord: getUnit('overlord', 200, 0, [], 0.902, 'visible', 0, noEnergy(), 0, {damage: 0, cooldown: Infinity, range: 0}, [], {structure: 'biological', weight: 'armored'}, unitActionQueue(), 'neither'),
  queen: getUnit('queen', 175, 0, [], 1.31, 'visible', 1, {current: 25, starting: 25, rate: 0.7875, max: 200 }, 2, {damage: 8, cooldown: 0.71, range: 5}, [], {weight: 'neither', structure: 'biological'}, unitActionQueue(), 'army'),
  zergling: getUnit('zergling', 35, 0, [], 4.13, 'visible', 0, noEnergy(), 1, {damage: 5, cooldown: 0.497, range: 0.1}, [], {weight: 'light', structure: 'biological'}, unitActionQueue(), 'army'),
  roach: getUnit('roach', 145, 0, [], 3.15, 'visible', 1, noEnergy(), 2, {damage: 16, cooldown: 1.43, range: 4}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  ravager: getUnit('ravager', 120, 0, [], 3.85, 'visible', 1, noEnergy(), 4, {damage: 16, cooldown: 1.14, range: 6}, [], {weight: 'neither', structure: 'biological'}, unitActionQueue(), 'army'),
  hydralisk: getUnit('hydralisk', 90, 0, [], 3.15, 'visible', 0, noEnergy(), 2, {damage: 12, cooldown: 0.59, range: 5}, [], {weight: 'light', structure: 'biological'}, unitActionQueue(), 'army'),
  lurker: getUnit('lurker', 200, 0, [], 4.13, 'visible', 1, noEnergy(), 4, {damage: 20, cooldown: 1.43, range: 8}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  mutalisk: getUnit('mutalisk', 120, 0, [], 5.6, 'visible', 0, noEnergy(), 0, {damage: 9, cooldown: 1.09, range: 3}, [], {weight: 'light', structure: 'biological'}, unitActionQueue(), 'army'),
  corruptor: getUnit('corruptor', 200, 0, [], 4.725, 'visible', 2, noEnergy(), 0, {damage: 14, cooldown: 1.36, range: 6}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  broodLord: getUnit('broodLord', 225, 0, [], 2.24, 'visible', 1, noEnergy(), 0, {damage: 20, cooldown: 1.79, range: 10}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  baneling: getUnit('baneling', 30, 0, [], 3.5, 'visible', 0, noEnergy(), 2, {damage: 16, cooldown: null, range: 0.25}, [], {weight: 'neither', structure: 'biological'}, unitActionQueue(), 'army'),
  overseer: getUnit('overseer', 200, 0, [], 2.62, 'visible', 1, {current: 50, starting: 50, rate: 0.7875, max: 200}, 0, {damage: 0, cooldown: Infinity, range: 0}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'neither'),
  swarmHost: getUnit('swarmHost', 160, 0, [], 3.15, 'visible', 1, noEnergy(), 4, {damage: 0, cooldown: Infinity, range: 0}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  infestor: getUnit('infestor', 90, 0, [], 3.15, 'visible', 0, {current: 50, starting: 50, rate: 0.7875, max: 200}, 2, {damage: 0, cooldown: Infinity, range: 0}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  viper: getUnit('viper', 150, 0, [], 4.13, 'visible', 1, {current: 50, starting: 50, rate: 0.7875, max: 200}, 0, {damage: 0, cooldown: Infinity, range: 0}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
  ultralisk: getUnit('ultralisk', 500, 0, [], 4.13, 'visible', 2, noEnergy(), 8, {damage: 35, cooldown: 0.61, range: 1}, [], {weight: 'armored', structure: 'biological'}, unitActionQueue(), 'army'),
};

export const UNITS = {
  ...ZERG_UNITS,
};

export const createUnit = (unitType: UnitType): Unit => ({..._.cloneDeep(UNITS[unitType]), id: uuidv4()});

export const createNUnits = (n: number, unitType: UnitType) => Array(n).fill(1).map(() => createUnit(unitType));
