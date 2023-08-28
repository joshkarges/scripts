import _ from 'lodash';
import { BUILDINGS, BuildingType, createBuilding } from "./constants/buildings";
import { balanceWorkers, EVENTS, GameEvent, USER_EVENTS } from "./constants/events";
import { GameState } from "./constants/gameState";
import { createNUnits, UnitType } from "./constants/units";
import { applyUserEvents, progressQueuedActions, updateParallelActions } from './utils/actionEvents';
import { stringify } from './utils/stringify';

const ZERG_STARTING_GAME_STATE: GameState = {
  time: 0,
  workers: 12,
  army: 0,
  minerals: 50,
  gas: 0,
  supply: 12,
  supplyAvailable: 14,
  buildings: { hatchery: [{...createBuilding('hatchery'), larva: 3}] },
  units: {
    drone: createNUnits(12, 'drone'),
    overlord: createNUnits(1, 'overlord')
  },
};

ZERG_STARTING_GAME_STATE.units.drone.forEach(d => d.queues[0].actions.push({eventKey: 'closePatchGather', startTime: 0, isStarted: true}));

ZERG_STARTING_GAME_STATE.buildings.hatchery[0].workers = ZERG_STARTING_GAME_STATE.units.drone.map(d => d.id);

balanceWorkers(ZERG_STARTING_GAME_STATE, ZERG_STARTING_GAME_STATE.buildings.hatchery[0], 'drone');

const userEvents: GameEvent[] = [
  USER_EVENTS.buildDrone,
];

const USER_EVENT_KEYS = Object.keys(USER_EVENTS);

const run = (state: GameState, userEvents: GameEvent[]): GameState[] => {
  const allStates = [state] as GameState[];
  
  let smallestTimeDelta = Infinity;
  
  let hasFinishedAllUserEvents = !userEvents.length;

  while (!hasFinishedAllUserEvents && state.time !== Infinity) {
    state = _.cloneDeep(state) as GameState;
    applyUserEvents(state, userEvents);
    let noUserEventsInBuildings = true;
    // For everything that can take an action, check if it's ready to take another action
    Object.keys(state.buildings).forEach((buildingKey: BuildingType) => {
      const buildingList = state.buildings[buildingKey];
      buildingList.forEach(building => {
        smallestTimeDelta = progressQueuedActions(state, building, smallestTimeDelta);

        smallestTimeDelta = updateParallelActions(state, building, smallestTimeDelta);

        noUserEventsInBuildings = noUserEventsInBuildings && !building.queues.some(q => q.actions.find(a => USER_EVENT_KEYS.includes(a.eventKey))) &&
          !building.parallelActions.find(a => USER_EVENT_KEYS.includes(a.eventKey));
      });
    });

    let noUserEventsInUnits = true;
    Object.keys(state.units).forEach((unitKey: UnitType) => {
      const unitList = state.units[unitKey];
      unitList.forEach(unit => {
        smallestTimeDelta = progressQueuedActions(state, unit, smallestTimeDelta);
        noUserEventsInUnits = noUserEventsInUnits && !unit.queues.some(q => q.actions.find(a => USER_EVENT_KEYS.includes(a.eventKey)));
      });
    });

    // Update time
    state.time += smallestTimeDelta;
    console.log(state);
    allStates.push(state);
    hasFinishedAllUserEvents = noUserEventsInBuildings && noUserEventsInUnits;
  }

  return allStates;
};

// console.log(stringify(run(ZERG_STARTING_GAME_STATE, userEvents), 2, null, 2));
run(ZERG_STARTING_GAME_STATE, userEvents);
