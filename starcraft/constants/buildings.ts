import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Ability } from "./abilities";
import { Action, ActionQueue } from "./actions";
import { Attack } from "./attack";
import { Cost } from "./cost";
import { UnitType } from "./units";
import { Upgrade } from "./upgrade";

/** PRODUCTION */
export type ZergProductionBuilding =
  | 'hatchery'
  | 'lair'
  | 'hive'

export type TerranProductionBuilding =
  | 'commandCenter'
  | 'orbitalCommand'
  | 'planetaryFortress'
  | 'barracks'
  | 'reactor'
  | 'techLab'
  | 'factory'
  | 'starport'

export type ProtossProductionBuilding =
  | 'nexus'
  | 'gateway'
  | 'warpGate'
  | 'roboticsFacility'
  | 'starGate';

export type ProductionBuilding =
  | ZergProductionBuilding
  | TerranProductionBuilding
  | ProtossProductionBuilding;

/** TECH */
export type ZergTechBuilding =
  | 'spawningPool'
  | 'extractor'
  | 'roachWarren'
  | 'banelingNest'
  | 'evolutionChamber'
  | 'hydraliskDen'
  | 'lurkerDen'
  | 'spire'
  | 'infestationPit'
  | 'ultraLiskCavern'
  | 'greaterSpire'
  | 'nydusNetwork'
  | 'nydusWorm'
  | 'creepTumor';

export type TerranTechBuilding =
  | 'supplyDepot'
  | 'refinery'
  | 'bunker'
  | 'engineeringBay'
  | 'armory'
  | 'fusionCore'
  | 'sensorTower'
  | 'ghostAcademy';

export type ProtossTechBuilding =
  | 'pylon'
  | 'assimilator'
  | 'battery'
  | 'cyberneticsCore'
  | 'forge'
  | 'twilightCouncil'
  | 'templarArchives'
  | 'darkShrine'
  | 'roboticsBay'
  | 'fleetBeacon';

export type TechBuilding =
  | ZergTechBuilding
  | TerranTechBuilding
  | ProtossTechBuilding;

/** STATIC DEFENSE */
export type ZergStaticDefenseBuilding =
  | 'spineCrawler'
  | 'sporeCrawler';

export type TerranStaticDefenseBuilding =
  | 'missileTurret';

export type ProtossStaticDefenseBuilding =
  | 'photonCannon';

export type StaticDefenseBuilding =
  | ZergStaticDefenseBuilding
  | TerranStaticDefenseBuilding
  | ProtossStaticDefenseBuilding;

export type BuildingType = ProductionBuilding | TechBuilding | StaticDefenseBuilding;

export type BuildingCost = Cost;

export type Building = {
  id: string;
  name: BuildingType,
  health: number,
  shields: number,
  hpRegen: number,
  attack: Attack,
  armor: number,
  cost: BuildingCost,
  abilities: Ability[],
  upgrades: Upgrade[],
  queues: ActionQueue[],
  parallelActions: Action[],
  larva?: number,
  workers?: string[],
  isInProgress: boolean,
};

const getBuilding = (
  name: Building['name'],
  health: Building['health'],
  shields: Building['shields'],
  hpRegen: Building['hpRegen'],
  attack: Building['attack'],
  armor: Building['armor'],
  cost: Building['cost'],
  abilities: Building['abilities'],
  upgrades: Building['upgrades'],
  queues: Building['queues'],
  parallelActions: Building['parallelActions'],
): Building => ({
  id: '',
  name,
  health,
  shields,
  hpRegen,
  attack,
  armor,
  cost,
  abilities,
  upgrades,
  queues,
  parallelActions,
  larva: 0,
  workers: [],
  isInProgress: false,
});

const noAttack = (): Attack => ({damage: 0, cooldown: Infinity, range: 0});
const fiveQueue = (): ActionQueue[] => [{size: 5, actions: []}];

export const BUILDINGS: Record<BuildingType, Building> = {
  hatchery: getBuilding('hatchery', 1500, 0, 0.38, noAttack(), 1, {minerals: 300, gas: 0, time: 71}, [], [], fiveQueue(), []),
  lair: getBuilding('lair', 2000, 0, 0.38, noAttack(), 1, {minerals: 150, gas: 100, time: 57}, [], [], fiveQueue(), []),
  hive: getBuilding('hive', 2500, 0, 0.38, noAttack(), 1, {minerals: 200, gas: 150, time: 71}, [], [], fiveQueue(), []),
  spawningPool: getBuilding('spawningPool', 1000, 0, 0.38, noAttack(), 1, {minerals: 200, gas: 0, time: 46}, [], [], fiveQueue(), []),
  extractor: getBuilding('extractor', 500, 0, 0.38, noAttack(), 1, {minerals: 25, gas: 0, time: 21}, [], [], [], []),
  roachWarren: getBuilding('roachWarren', 850, 0, 0.38, noAttack(), 1, {minerals: 150, gas: 0, time: 39}, [], [], fiveQueue(), []),
  banelingNest: getBuilding('banelingNest', 850, 0, 0.38, noAttack(), 1, {minerals: 100, gas: 50, time: 43}, [], [], fiveQueue(), []),
  evolutionChamber: getBuilding('evolutionChamber', 750, 0, 0.38, noAttack(), 1, {minerals: 75, gas: 0, time: 25}, [], [], fiveQueue(), []),
  hydraliskDen: getBuilding('hydraliskDen', 850, 0, 0.38, noAttack(), 1, {minerals: 100, gas: 100, time: 29}, [], [], fiveQueue(), []),
  lurkerDen: getBuilding('lurkerDen', 850, 0, 0.38, noAttack(), 1, {minerals: 100, gas: 150, time: 57}, [], [], fiveQueue(), []),
  spire: getBuilding('spire', 850, 0, 0.38, noAttack(), 1, {minerals: 200, gas: 200, time: 71}, [], [], fiveQueue(), []),
  infestationPit: getBuilding('infestationPit', 850, 0, 0.38, noAttack(), 1, {minerals: 100, gas: 100, time: 36}, [], [], fiveQueue(), []),
  ultraLiskCavern: getBuilding('ultraLiskCavern', 850, 0, 0.38, noAttack(), 1, {minerals: 150, gas: 200, time: 46}, [], [], fiveQueue(), []),
  greaterSpire: getBuilding('greaterSpire', 1000, 0, 0.38, noAttack(), 1, {minerals: 100, gas: 150, time: 71}, [], [], fiveQueue(), []),
  nydusNetwork: getBuilding('nydusNetwork', 850, 0, 0.38, noAttack(), 1, {minerals: 150, gas: 150, time: 36}, [], [], [], []),
  nydusWorm: getBuilding('nydusWorm', 300, 0, 0.38, noAttack(), 1, {minerals: 75, gas: 75, time: 14}, [], [], [], []),
  creepTumor: getBuilding('creepTumor', 50, 0, 0.38, noAttack(), 0, {minerals: 0, gas: 0, time: 14}, [], [], [], []),
  spineCrawler: getBuilding('spineCrawler', 300, 0, 0.38, {damage: 25, cooldown: 1.32, range: 7}, 2, {minerals: 100, gas: 0, time: 36}, [], [], [], []),
  sporeCrawler: getBuilding('sporeCrawler', 400, 0, 0.38, {damage: 15, cooldown: 0.61, range: 7}, 1, {minerals: 75, gas: 0, time: 21}, [], [], [], []),
  nexus: getBuilding('nexus', 1000, 1000, 2, noAttack(), 1, {minerals: 400, gas: 0, time: 71}, [], [], fiveQueue(), []),
  gateway: getBuilding('gateway', 500, 500, 2, noAttack(), 1, {minerals: 150, gas: 0, time: 46}, [], [], fiveQueue(), []),
  warpGate: getBuilding('warpGate', 500, 500, 2, noAttack(), 1, {minerals: 0, gas: 0, time: 7}, [], [], [], []),
  roboticsFacility: getBuilding('roboticsFacility', 450, 450, 2, noAttack(), 1, {minerals: 150, gas: 100, time: 46}, [], [], fiveQueue(), []),
  starGate: getBuilding('starGate', 600, 600, 2, noAttack(), 1, {minerals: 150, gas: 150, time: 43}, [], [], fiveQueue(), []),
  pylon: getBuilding('pylon', 200, 200, 2, noAttack(), 1, {minerals: 100, gas: 0, time: 18}, [], [], [], []),
  assimilator: getBuilding('assimilator', 300, 300, 2, noAttack(), 1, {minerals: 75, gas: 0, time: 21}, [], [], [], []),
  battery: getBuilding('battery', 150, 150, 2, noAttack(), 1, {minerals: 100, gas: 0, time: 29}, [], [], [], []),
  cyberneticsCore: getBuilding('cyberneticsCore', 550, 550, 2, noAttack(), 1, {minerals: 150, gas: 0, time: 36}, [], [], fiveQueue(), []),
  forge: getBuilding('forge', 400, 400, 2, noAttack(), 1, {minerals: 150, gas: 0, time: 32}, [], [], fiveQueue(), []),
  twilightCouncil: getBuilding('twilightCouncil', 500, 500, 2, noAttack(), 1, {minerals: 150, gas: 100, time: 36}, [], [], fiveQueue(), []),
  templarArchives: getBuilding('templarArchives', 500, 500, 2, noAttack(), 1, {minerals: 150, gas: 200, time: 36}, [], [], fiveQueue(), []),
  darkShrine: getBuilding('darkShrine', 500, 500, 2, noAttack(), 1, {minerals: 150, gas: 150, time: 71}, [], [], fiveQueue(), []),
  roboticsBay: getBuilding('roboticsBay', 500, 500, 2, noAttack(), 1, {minerals: 150, gas: 150, time: 46}, [], [], fiveQueue(), []),
  fleetBeacon: getBuilding('fleetBeacon', 500, 500, 2, noAttack(), 1, {minerals: 300, gas: 200, time: 43}, [], [], fiveQueue(), []),
  photonCannon: getBuilding('photonCannon', 150, 150, 2, {damage: 20, cooldown: 0.89, range: 7}, 1, {minerals: 150, gas: 0, time: 29}, [], [], [], []),
  commandCenter: getBuilding('commandCenter', 1500, 0, 0, noAttack(), 1, {minerals: 400, gas: 0, time: 71}, [], [], fiveQueue(), []),
  orbitalCommand: getBuilding('orbitalCommand', 1500, 0, 0, noAttack(), 1, {minerals: 150, gas: 0, time: 25}, [], [], fiveQueue(), []),
  planetaryFortress: getBuilding('planetaryFortress', 1500, 0, 0, {damage: 40, cooldown: 1.43, range: 6}, 3, {minerals: 150, gas: 150, time: 36}, [], [], fiveQueue(), []),
  barracks: getBuilding('barracks', 1000, 0, 0, noAttack(), 1, {minerals: 150, gas: 0, time: 46}, [], [], fiveQueue(), []),
  reactor: getBuilding('reactor', 400, 0, 0, noAttack(), 1, {minerals: 50, gas: 50, time: 36}, [], [], fiveQueue(), []),
  techLab: getBuilding('techLab', 400, 0, 0, noAttack(), 1, {minerals: 50, gas: 25, time: 18}, [], [], [], []),
  factory: getBuilding('factory', 1250, 0, 0, noAttack(), 1, {minerals: 150, gas: 100, time: 43}, [], [], fiveQueue(), []),
  starport: getBuilding('starport', 1300, 0, 0, noAttack(), 1, {minerals: 150, gas: 100, time: 36}, [], [], fiveQueue(), []),
  supplyDepot: getBuilding('supplyDepot', 400, 0, 0, noAttack(), 1, {minerals: 100, gas: 0, time: 21}, [], [], [], []),
  refinery: getBuilding('refinery', 500, 0, 0, noAttack(), 1, {minerals: 75, gas: 0, time: 21}, [], [], [], []),
  bunker: getBuilding('bunker', 400, 0, 0, noAttack(), 1, {minerals: 100, gas: 0, time: 29}, [], [], [], []),
  engineeringBay: getBuilding('engineeringBay', 850, 0, 0, noAttack(), 1, {minerals: 125, gas: 0, time: 25}, [], [], fiveQueue(), []),
  armory: getBuilding('armory', 750, 0, 0, noAttack(), 1, {minerals: 150, gas: 100, time: 46}, [], [], fiveQueue(), []),
  fusionCore: getBuilding('fusionCore', 750, 0, 0, noAttack(), 1, {minerals: 150, gas: 150, time: 46}, [], [], fiveQueue(), []),
  sensorTower: getBuilding('sensorTower', 200, 0, 0, noAttack(), 0, {minerals: 125, gas: 100, time: 18}, [], [], [], []),
  ghostAcademy: getBuilding('ghostAcademy', 1250, 0, 0, noAttack(), 1, {minerals: 150, gas: 50, time: 29}, [], [], fiveQueue(), []),
  missileTurret: getBuilding('missileTurret', 250, 0, 0, {damage: 12, cooldown: 0.61, range: 7}, 0, {minerals: 100, gas: 0, time: 18}, [], [], [], []),
};

export const createBuilding = (buildingType: BuildingType): Building => {
  const building = {..._.cloneDeep(BUILDINGS[buildingType]), id: uuidv4()};
  if (buildingType === 'hatchery') {
    building.larva = 1;
    building.parallelActions.push({
      eventKey: 'hatcherySpawnLarva',
      startTime: 0,
    });
  }
  return building;
};
