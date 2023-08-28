import { Action } from "./actions";
import { ZergUnit } from "./units";

export type ZergProductionSource =
  | 'hatchery'
  | 'lair'
  | 'hive'
  | 'larva'
  | 'zergling'
  | 'roach'
  | 'hydralisk'
  | 'corruptor'
  | 'overlord'
  | 'swarmHost'
  | 'broodlord'
  | 'overseer'

/**
 * Some production sources are units themselves
 * zergling -> baneling
 * roach -> ravager
 * hydralisk -> lurker
 * corrupter -> broodlord
 * overlord -> overseer
 * larva -> anything else
 * larva auto-generates (or is spawned from queen) and doesn't cost supply
 */

// What can be built from each production source?
export const zergProductionTargets = {
  hatchery: ['queen'],
  lair: ['queen'],
  hive: ['queen'],
  larva: ['corruptor', 'drone', 'hydralisk', 'infestor', 'mutalisk', 'overlord', 'roach', 'swarmHost', 'ultralisk', 'viper', 'zergling'],
  zergling: ['baneling'],
  roach: ['ravager'],
  hydralisk: ['lurker'],
  corruptor: ['broodLord'],
  overlord: ['overseer'],
  swarmHost: ['locust'],
  broodlord: ['broodling'],
  overseer: ['changeling'],
} as const;



export const productionTargets = {
  ...zergProductionTargets
};

export type ProductionQueue = {
  size: number,
  actions: Action[];
};

