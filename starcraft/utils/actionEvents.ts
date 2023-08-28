import { Action } from "../constants/actions"
import { Building, BuildingType } from "../constants/buildings";
import { ActionableEntity, EVENTS, GameEvent } from "../constants/events";
import { GameState } from "../constants/gameState";
import { UnitType } from "../constants/units";

export const applyUserEvents = (state: GameState, userEvents: GameEvent[]) => {
  // Add all the user actions that currently satisfy the activation condition for this building.
  while (true) {
    const userEvent = userEvents[0];
    const entity = userEvent?.source(state);
    if (!entity || !userEvent.condition?.(state, entity)) break;
    const action = {
      eventKey: userEvent.eventKey,
      startTime: state.time,
    };
    // User action could be something like
    // - Build unit: Where the hatchery should start immediately without finishing the previous build unit actions.  Or add to the end of a production queue if it's a terran structure or a non-warpgate protoss structure.
    //   - Hatchery units: Create units immediately with the 'inProgress' tag.
    //   - Production queued units: Only create the units when the event is done.
    //   : Buildings should have multiple action queues: 1-2 production queues (depending if it has a reactor).  Parallel actions for actions that start immediately, passive actions like spawning larva and changing health.
    // - Build building: Where the worker should stop mining and immediately start building.
    //   - Buildings are created immediately with the 'inProgress' tag.
    //   - Drones are removed.
    //   - SCVs take time for their action to complete.
    //   - Probes immediately end the build building action and goes back to mining.
    //   : Units should have a single action queue, where user actions are bumped to the front of the line.
    // - Upgrade: Goes on the end of a production queue.
    // - Mutate unit: Where the unit stops everything and changes into a new unit.
    if (userEvent.queued) {
      const nonFullQueue = entity.queues.find(queue => queue.actions.length < queue.size);
      if (nonFullQueue) nonFullQueue.actions.push(action);
    } else {
      if ('parallelActions' in entity) entity.parallelActions.push(action);
    }
    userEvents.shift();
  };
};

const maybeStartAction = (state: GameState, entity: ActionableEntity, action?: Action) => {
  if (!action) return null;
  const event = EVENTS[action.eventKey];
  if (action.isStarted) {
    return event;
  } else if (event.condition?.(state, entity)) {
    action.isStarted = true;
    action.startTime = state.time;
    event.startMutate(state, entity);
    console.log(`start ${event.eventKey}`);
    return event;
  }
  return null;
}; 

export const progressQueuedActions = (state: GameState, entity: ActionableEntity, smallestTimeDelta: number) => {
  const queues = entity.queues;
  // Remove queued actions if their time is up.
  queues.forEach(queue => {
    let currentAction = queue.actions[0];
    let currentEvent = maybeStartAction(state, entity, currentAction);
    while (currentEvent) {

      if (currentAction.startTime + currentEvent.timeDelta <= state.time) {
        currentEvent.endMutate(state, entity);
        console.log(`end ${currentEvent.eventKey}`);
        queue.actions.shift();
        if (currentEvent.repeated) {
          currentAction.isStarted = false;
          queue.actions.push(currentAction);
        }
        const nextQueuedAction = queue.actions[0];
        currentEvent = maybeStartAction(state, entity, nextQueuedAction);
        if (currentEvent && currentEvent.timeDelta < smallestTimeDelta) smallestTimeDelta = currentEvent.timeDelta;
      } else {
        const timeUntilFinished = (currentAction.startTime + currentEvent.timeDelta) - state.time;
        if (timeUntilFinished < smallestTimeDelta) smallestTimeDelta = timeUntilFinished;
        break;
      }
      
    }
  });
  return smallestTimeDelta;
};

export const updateParallelActions = (state: GameState, building: Building, smallestTimeDelta: number) => {
  // Remove any active actions if their time is up.
  for (let i = building.parallelActions.length - 1; i >= 0; i--) {
    const action = building.parallelActions[i];
    const event = maybeStartAction(state, building, action);
    if (!event) continue;
    if (action.startTime + event.timeDelta <= state.time) {
      event.endMutate(state, building);
      console.log(`end ${event.eventKey}`);
      building.parallelActions.splice(i, 1);
      if (event.repeated) {
        action.isStarted = false;
        building.parallelActions.push(action);
      }
    } else {
      const timeUntilFinished = (action.startTime + event.timeDelta) - state.time;
      if (timeUntilFinished < smallestTimeDelta) smallestTimeDelta = timeUntilFinished;
    }
  };

  return smallestTimeDelta;
};
