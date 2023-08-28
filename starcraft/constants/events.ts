import _ from 'lodash';
import { CLOSE_WORKER_TRAVEL_TIME, MINING_TIME, MINERALS_PER_GATHER, CLOSE_MINERAL_PATCHES, FAR_WORKER_TRAVEL_TIME, FAR_MINERAL_PATCHES } from "./base";
import { Building, BUILDINGS, BuildingType, createBuilding } from "./buildings";
import { GameState, NumericResources } from "./gameState";
import { zergProductionTargets } from './production';
import { createUnit, Unit, UNITS, UnitType, UNIT_COSTS, ZERG_UNITS } from "./units";

export type Transaction = {
  delta: number,
  resource: keyof NumericResources,
};

export type ActionableEntity = Building | Unit;

type Mutator = (gameState: GameState, buildingOrUnit: ActionableEntity) => boolean;
type Condition = (gameState: GameState, buildingOrUnit: ActionableEntity) => boolean;
type GameEventSource = (gameState: GameState) => ActionableEntity;

export type GameEvent = {
  condition?: Condition,
  startMutate: Mutator,
  endMutate: Mutator,
  timeDelta: number,
  description: string,
  source: GameEventSource,
  eventKey: string,
  repeated?: boolean,
  queued?: boolean,
};

const createMutateFromTransactions = (transactions: Transaction[], otherMutation?: Mutator): Mutator => {
  return (state, entity) => {
    transactions.forEach(({resource, delta}) => {
      state[resource] += delta;
    });
    otherMutation?.(state, entity);
    return true;
  }
};

const createSourceFirstOf = (entityTypes: (UnitType | BuildingType)[]): GameEventSource => {
  return (gameState) => {
    for (let i = 0; i < entityTypes.length; i++) {
      const entityType = entityTypes[i];
      const entityList = (entityType in gameState.buildings) ? gameState.buildings[entityType] : gameState.units[entityType];
      if (entityList.length) return entityList[0];
    };
  };
}

const buildUnitEvent = (
  unitName: UnitType,
  source: (UnitType | BuildingType)[] | GameEventSource,
  condition?: Condition,
  startMutate?: Mutator,
  endMutate?: Mutator,
  queued?: boolean,
): GameEvent => {
  const { minerals, gas, time, supply } = UNIT_COSTS[unitName];
  
  if (typeof source !== 'function') {
    source = createSourceFirstOf(source);
  }

  return ({
    description: `build ${unitName}`,
    eventKey: _.camelCase(`build-${unitName}`),
    source,
    queued,
    timeDelta: time,
    condition,
    startMutate: createMutateFromTransactions([{
      delta: -minerals,
      resource: 'minerals',
    }, {
      delta: -gas,
      resource: 'gas',
    }, {
      delta: supply,
      resource: 'supply',
    }], startMutate),
    endMutate: createMutateFromTransactions(
      UNITS[unitName].supplyType === 'neither' ? [] : [{delta: supply, resource: (UNITS[unitName].supplyType as 'army' | 'workers')}],
      endMutate
    )
  });
};

const canAffordUnit = (state: GameState, unitType: UnitType) => {
  return state.minerals >= UNIT_COSTS[unitType].minerals &&
    state.gas >= UNIT_COSTS[unitType].gas &&
    (state.supplyAvailable - state.supply) >= UNIT_COSTS[unitType].supply;
};

const createBuildBuildingCondition = (buildingType: BuildingType) => (state: GameState, unit: Unit) => {
  const cost = BUILDINGS[buildingType].cost;
  return state.minerals >= cost.minerals &&
    state.gas >= cost.gas;
};

const createBuildUnitCondition = (canBuildingBuild: (building: Building) => boolean, unitType: UnitType) => {
  return (state: GameState, building: Building) => {
    return canBuildingBuild(building) && canAffordUnit(state, unitType);
  };
};

const createBuildUnitWithLarvaCondition = (unitType: UnitType) => createBuildUnitCondition((building: Building) => building.larva > 0, unitType);

const createBuildUnitWithLarvaStart = (unitType: UnitType) => {
  return (state: GameState, building: Building) => {
    building.larva -= 1;
    const newUnit: Unit = {
      ...createUnit(unitType),
      isInProgress: true,
      queues: [{
        size: Infinity,
        actions: [{
          eventKey: _.camelCase(`finish ${unitType}`),
          startTime: state.time,
        }, {
          eventKey: 'closePatchGather',
          startTime: state.time,
        }],
      }],
    };
    if (['drone', 'scv', 'probe'].includes(unitType)) building.workers.push(newUnit.id);
    state.units[unitType].push(newUnit);
    return true;
  };
};

const createBuildUnitWithQueueCondition = (unitType: UnitType) => createBuildUnitCondition((building) => building.queues.some(queue => queue.actions.length < queue.size), unitType);

const createBuildUnitWithQueueStart = (unitType: UnitType) => {
  return () => false;
};

const createBuildUnitWithQueueEnd = (unitType: UnitType) => {
  return (state: GameState) => {
    state.units[unitType].push(createUnit(unitType));
    return true;
  };
};

const createBuildUnitWithLarva = (unitType: UnitType) => {
  return buildUnitEvent(unitType, ['hatchery', 'lair', 'hive'],
    createBuildUnitWithLarvaCondition(unitType),
    createBuildUnitWithLarvaStart(unitType),
    () => false,
  );
};

const createMutateUnit = (from: UnitType, to: UnitType) => buildUnitEvent(
  to,
  [from],
  (state:GameState, unit: Unit) => {
    return state.units[from]?.length && canAffordUnit(state, unit.name)
  },
  (gameState: GameState, fromUnit: Unit) => {
    gameState.units[fromUnit.name]?.pop();
    return true;
  },
  (() => {
    return createBuildUnitWithQueueEnd(to)
  })(),
);

export const balanceWorkers = (state: GameState, building: Building, unitType: UnitType) => {
  const workers = building.workers.map(id => {
    return state.units[unitType].find(unit => unit.id === id);
  });
  workers.forEach((worker, i) => {
    const gatherKey = Math.floor(i / 8) % 2 ? 'farPatchGather' : 'closePatchGather';
    const gatherAction = worker.queues[0].actions.find(action => ['farPatchGather', 'closePatchGather'].includes(action.eventKey));
    gatherAction.eventKey = gatherKey;
  });
};

export const BUILD_UNIT_EVENTS: Record<string, GameEvent> = {
  buildDrone: buildUnitEvent('drone', ['hatchery', 'lair', 'hive'],
    createBuildUnitWithLarvaCondition('drone'),
    createBuildUnitWithLarvaStart('drone'),
    (state: GameState, building: Building) => {
      balanceWorkers(state, building, 'drone');
      return true;
    },
  ),
  buildQueen: buildUnitEvent('queen', ['hatchery', 'lair', 'hive'],
    createBuildUnitWithQueueCondition('queen'),
    createBuildUnitWithQueueStart('queen'),
    createBuildUnitWithQueueEnd('queen'),
  ),
  buildOverlord: createBuildUnitWithLarva('overlord'),
  buildZergling: createBuildUnitWithLarva('zergling'),
  buildRoach: createBuildUnitWithLarva('roach'),
  buildHydralisk: createBuildUnitWithLarva('hydralisk'),
  buildMutalisk: createBuildUnitWithLarva('mutalisk'),
  buildCorruptor: createBuildUnitWithLarva('corruptor'),
  buildSwarmHost: createBuildUnitWithLarva('swarmHost'),
  buildInfestor: createBuildUnitWithLarva('infestor'),
  buildViper: createBuildUnitWithLarva('viper'),
  buildUltralisk: createBuildUnitWithLarva('ultralisk'),
  buildRavager: createMutateUnit('roach', 'ravager'),
  buildLurker: createMutateUnit('hydralisk', 'lurker'),
  buildBroodLord: createMutateUnit('corruptor', 'broodLord'),
  buildBaneling: createMutateUnit('zergling', 'baneling'),
  buildOverseer: createMutateUnit('overlord', 'overseer'),
};

const buildBuildingEvent = (
  buildingName: BuildingType,
  source: (UnitType | BuildingType)[] | GameEventSource,
): GameEvent => {
  const { minerals, gas, time } = BUILDINGS[buildingName].cost;
  if (typeof source !== 'function') {
    source = createSourceFirstOf(source);
  }
  return ({
    description: `build ${buildingName}`,
    eventKey: _.camelCase(`build-${buildingName}`),
    source,
    timeDelta: time,
    condition: createBuildBuildingCondition(buildingName),
    startMutate: (() => {
      const mutateFromTransactions = createMutateFromTransactions([
        {
          delta: -minerals,
          resource: 'minerals',
        }, {
          delta: -gas,
          resource: 'gas',
        },
      ]);
      return (gameState: GameState, unit: Unit) => {
        // Pay for building
        mutateFromTransactions(gameState, unit);

        // Create building in progress
        const buildings = gameState.buildings[buildingName] || [];
        buildings.push({
          ...createBuilding(buildingName),
          isInProgress: true,
          queues: [{
            size: 1,
            actions: [{
              eventKey: _.camelCase(`finishBuilding-${buildingName}`),
              startTime: gameState.time,
            }],
          }]
        });
        gameState.buildings[buildingName] = buildings;

        // Remove drone
        if (unit.name === 'drone') {
          gameState.workers -= 1;
          ['hatchery', 'lair', 'hive'].some((buildingType: BuildingType) => {
            return gameState.buildings[buildingType].some((building) => {
              const workerIndex = building.workers.findIndex(id => id === unit.id);
              if (workerIndex !== -1) {
                building.workers.splice(workerIndex, 1);
                return true;
              }
              return false;
            });
          });
          const droneIndex = gameState.units.drone.findIndex(drone => drone.id === unit.id);
          gameState.units.drone.splice(droneIndex, 1);
        }
        return true;
      };
    })(), // TODO: remove a drone if it's a zerg building.
    endMutate: () => false,
    queued: true,
  });
};

export const BUILD_BUILDING_EVENTS: Record<string, GameEvent> = {
  buildExtractor: buildBuildingEvent('extractor', ['drone']),
  buildHatchery: buildBuildingEvent('hatchery', ['drone']),
  buildLair: buildBuildingEvent('lair', ['hatchery']),
  buildHive: buildBuildingEvent('hive', ['lair']),
  buildCommandCenter: buildBuildingEvent('commandCenter', ['scv']),
  buildOrbitalCommand: buildBuildingEvent('orbitalCommand', ['commandCenter']),
  buildPlanetaryFortress: buildBuildingEvent('planetaryFortress', ['commandCenter']),
  buildBarracks: buildBuildingEvent('barracks', ['scv']),
  // buildBarracksReactor: buildBuildingEvent('barracksReactor'),
  // buildBarracksTechLab: buildBuildingEvent('barracksTechLab'),
  buildFactory: buildBuildingEvent('factory', ['scv']),
  // buildFactoryReactor: buildBuildingEvent('factoryReactor'),
  // buildFactoryTechLab: buildBuildingEvent('factoryTechLab'),
  buildStarport: buildBuildingEvent('starport', ['scv']),
  // buildStarportReactor: buildBuildingEvent('starportReactor'),
  // buildStarportTechLab: buildBuildingEvent('starportTechLab'),
  buildNexus: buildBuildingEvent('nexus', ['probe']),
  buildGateway: buildBuildingEvent('gateway', ['probe']),
  buildWarpGate: buildBuildingEvent('warpGate', ['probe']),
  buildRoboticsFacility: buildBuildingEvent('roboticsFacility', ['probe']),
  buildStarGate: buildBuildingEvent('starGate', ['probe']),
  buildSpawningPool: buildBuildingEvent('spawningPool', ['drone']),
  buildRoachWarren: buildBuildingEvent('roachWarren', ['drone']),
  buildBanelingNest: buildBuildingEvent('banelingNest', ['drone']),
  buildEvolutionChamber: buildBuildingEvent('evolutionChamber', ['drone']),
  buildHydraliskDen: buildBuildingEvent('hydraliskDen', ['drone']),
  buildLurkerDen: buildBuildingEvent('lurkerDen', ['drone']),
  buildSpire: buildBuildingEvent('spire', ['drone']),
  buildInfestationPit: buildBuildingEvent('infestationPit', ['drone']),
  buildUltraLiskCavern: buildBuildingEvent('ultraLiskCavern', ['drone']),
  buildGreaterSpire: buildBuildingEvent('greaterSpire', ['spire']),
  buildNydusNetwork: buildBuildingEvent('nydusNetwork', ['drone']),
  // buildNydusWorm: buildBuildingEvent('nydusWorm'),
  buildCreepTumor: buildBuildingEvent('creepTumor', ['creepTumor']),
  buildSupplyDepot: buildBuildingEvent('supplyDepot', ['scv']),
  buildRefinery: buildBuildingEvent('refinery', ['scv']),
  buildBunker: buildBuildingEvent('bunker', ['scv']),
  buildEngineeringBay: buildBuildingEvent('engineeringBay', ['scv']),
  buildArmory: buildBuildingEvent('armory', ['scv']),
  buildFusionCore: buildBuildingEvent('fusionCore', ['scv']),
  buildSensorTower: buildBuildingEvent('sensorTower', ['scv']),
  buildGhostAcademy: buildBuildingEvent('ghostAcademy', ['scv']),
  buildPylon: buildBuildingEvent('pylon', ['probe']),
  buildAssimilator: buildBuildingEvent('assimilator', ['probe']),
  buildBattery: buildBuildingEvent('battery', ['probe']),
  buildCyberneticsCore: buildBuildingEvent('cyberneticsCore', ['probe']),
  buildForge: buildBuildingEvent('forge', ['probe']),
  buildTwilightCouncil: buildBuildingEvent('twilightCouncil', ['probe']),
  buildTemplarArchives: buildBuildingEvent('templarArchives', ['probe']),
  buildDarkShrine: buildBuildingEvent('darkShrine', ['probe']),
  buildRoboticsBay: buildBuildingEvent('roboticsBay', ['probe']),
  buildFleetBeacon: buildBuildingEvent('fleetBeacon', ['probe']),
  buildSpineCrawler: buildBuildingEvent('spineCrawler', ['drone']),
  buildSporeCrawler: buildBuildingEvent('sporeCrawler', ['drone']),
  buildMissileTurret: buildBuildingEvent('missileTurret', ['scv']),
  buildPhotonCannon: buildBuildingEvent('photonCannon', ['probe']),
};

const FINISH_BUILDING_EVENTS = Object.keys(BUILDINGS).reduce((agg, buildingType: BuildingType) => {
  const originalBuilding = BUILDINGS[buildingType];
  const eventKey = `finishBuilding-${buildingType}`;
  agg[eventKey] = {
    description: `finish building ${buildingType}`,
    eventKey,
    timeDelta: originalBuilding.cost.time,
    source: () => null,
    startMutate: (gameState) => false,
    endMutate: (gameState: GameState, building: Building) => {
      building.isInProgress = false;
      building.queues.forEach((queue, i) => {
        queue.size = originalBuilding.queues[i].size;
      });
      return true;
    },
    queued: true,
  };
  return agg;
}, {} as Record<string, GameEvent>);

const FINISH_UNIT_EVENTS = Object.keys(ZERG_UNITS).reduce((agg, unitType: UnitType) => {
  const originalUnit = ZERG_UNITS[unitType];
  const eventKey = _.camelCase(`finish ${unitType}`);
  agg[eventKey] = {
    description: `finish ${unitType}`,
    eventKey,
    timeDelta: UNIT_COSTS[unitType].time,
    source: () => null,
    startMutate: () => false,
    endMutate: (gameState: GameState, unit: Unit) => {
      unit.isInProgress = false;
      if (unit.supplyType !== 'neither') gameState[unit.supplyType] += 1;
      return true;
    },
    queued: true,
  };
  return agg;
}, {} as Record<string, GameEvent>);

const NON_USER_EVENTS: Record<string, GameEvent> = {
  hatchingLarva: {
    description: 'hatching larva',
    eventKey: 'hatchingLarva',
    timeDelta: 29,
    source: () => null,
    condition: (gameState: GameState, building: Building) => {
      return building.larva < 19;
    },
    startMutate: () => false,
    endMutate: (gameState: GameState, building: Building) => {
      building.larva += 3;
      return true;
    },
  },
  ...FINISH_BUILDING_EVENTS,
  ...FINISH_UNIT_EVENTS,
};

const ABILITY_EVENTS: Record<string, GameEvent> = {
  injectLarva: {
    description: 'inject larva',
    eventKey: 'injectLarva',
    timeDelta: 0,
    source: createSourceFirstOf(['queen']),
    condition: (gameState: GameState, queen: Unit) => {
      return queen.energy.current >= 25;
    },
    startMutate: (gameState: GameState, queen: Unit) => {
      let base: Building;
      (['hatchery', 'lair', 'hive'] as BuildingType[]).some(buildingType => {
        gameState.buildings[buildingType].some(building => {
          if (building.parallelActions.find(action => action.eventKey === 'hatchingLarva')) return false;
          base = building;
          return true;
        });
      });
      if (base) base.parallelActions.push({
        eventKey: 'hatchingLarva',
        startTime: Infinity,
      });
      queen.energy.current -= 25;
      return true;
    },
    endMutate: () => false,
    queued: true,
  },
};

export const USER_EVENTS = {
  ...BUILD_UNIT_EVENTS,
  ...BUILD_BUILDING_EVENTS,
  ...ABILITY_EVENTS,
};

export const REPEATING_EVENTS: Record<string, GameEvent> = {
  closePatchGather: {
    description: 'close patch gather',
    eventKey: _.camelCase('close patch gather'),
    source: createSourceFirstOf(['drone']),
    timeDelta: CLOSE_WORKER_TRAVEL_TIME + MINING_TIME,
    endMutate: createMutateFromTransactions([{
      delta: MINERALS_PER_GATHER * CLOSE_MINERAL_PATCHES,
      resource: 'minerals',
    }]),
    startMutate: (s) => false,
    repeated: true,
    queued: true,
  },
  farPatchGather: {
    description: 'far patch gather',
    eventKey: _.camelCase('far patch gather'),
    source: createSourceFirstOf(['drone']),
    timeDelta: FAR_WORKER_TRAVEL_TIME + MINING_TIME,
    endMutate: createMutateFromTransactions([{
      delta: MINERALS_PER_GATHER * FAR_MINERAL_PATCHES,
      resource: 'minerals',
    }]),
    startMutate: (s) => false,
    repeated: true,
    queued: true,
  },
  hatcherySpawnLarva: {
    condition: (gameState: GameState, building: Building) => {
      return building.larva < 19;
    },
    description: 'hatchery spawn larva',
    eventKey: _.camelCase('hatchery spawn larva'),
    source: createSourceFirstOf(['hatchery', 'lair', 'hive']),
    endMutate: (gameState: GameState, building: Building) => {
      building.larva += 1;
      return true;
    },
    timeDelta: 11,
    startMutate: (s) => false,
    repeated: true,
  },
};

export const EVENTS = {
  ...USER_EVENTS,
  ...REPEATING_EVENTS,
  ...NON_USER_EVENTS,
};
