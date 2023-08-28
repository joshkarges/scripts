const input = `Blueprint 1: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 10 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 12 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 3: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 17 clay. Each geode robot costs 2 ore and 13 obsidian.
Blueprint 4: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 5: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 5 clay. Each geode robot costs 3 ore and 12 obsidian.
Blueprint 6: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 11 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 7: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 17 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 8: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 11 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 9: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 9 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 10: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 9 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 11: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 12: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 3 ore and 19 obsidian.
Blueprint 13: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 10 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 14: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 13 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 15: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 19 clay. Each geode robot costs 2 ore and 12 obsidian.
Blueprint 16: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 3 ore and 9 obsidian.
Blueprint 17: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 11 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 18: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 18 clay. Each geode robot costs 2 ore and 11 obsidian.
Blueprint 19: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 20: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 8 clay. Each geode robot costs 4 ore and 14 obsidian.
Blueprint 21: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 20 clay. Each geode robot costs 2 ore and 17 obsidian.
Blueprint 22: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 15 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 23: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 3 ore and 11 obsidian.
Blueprint TIME_LIMIT: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 13 clay. Each geode robot costs 3 ore and 12 obsidian.
Blueprint 25: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 3 ore and 17 obsidian.
Blueprint 26: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 12 clay. Each geode robot costs 3 ore and 17 obsidian.
Blueprint 27: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 15 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 28: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 14 clay. Each geode robot costs 4 ore and 10 obsidian.
Blueprint 29: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 15 clay. Each geode robot costs 3 ore and 9 obsidian.
Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 7 clay. Each geode robot costs 4 ore and 13 obsidian.`;

const input2 = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`

const lines = input.split('\n');

const debug = true;
const logging = false;

const EMPTY_RESOURCES = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

const blueprints = lines.map(line => {
  const idStrMatch = line.match(/^Blueprint (?<idStr>\d+):/);
  if (!idStrMatch) return;
  const idStrLen = idStrMatch[0].length ?? 0;
  const id = +(idStrMatch.groups.idStr ?? 0);
  const blueprint = {
    id,
    ore: {...EMPTY_RESOURCES},
    clay: {...EMPTY_RESOURCES},
    obsidian: {...EMPTY_RESOURCES},
    geode: {...EMPTY_RESOURCES},
  };
  const eachStrs = line.slice(idStrLen).split(' Each ');
  eachStrs.forEach(each => {
    const robotStr = each.match(/(ore|clay|obsidian|geode)/)?.[0] ?? '';
    if (!robotStr) return;
    const costStrs = each.match(/\d+ (ore|clay|obsidian)/g);
    costStrs.forEach(costStr => {
      const {cost, resource} = costStr.match(/(?<cost>\d+) (?<resource>ore|clay|obsidian)/)?.groups ?? {};
      if (!cost || !resource) return;
      blueprint[robotStr][resource] = +cost;
    })
  });
  return blueprint;
});

if (debug) {
  console.log(blueprints);
}

const robotTypes = ['ore', 'clay', 'obsidian', 'geode'];
const resourceTypes = ['ore', 'clay', 'obsidian', 'geode'];

const TIME_LIMIT = 32;

const initialState = {
  robots: {...EMPTY_RESOURCES, ore: 1},
  resources: {...EMPTY_RESOURCES},
  log: {},
  minutesLeft: TIME_LIMIT,
};

const canAffordRobot = (blueprint, state, robotType) => {
  return resourceTypes.every(resource => state.resources[resource] >= blueprint[robotType][resource]);
};

const collectResources = (state) => {
  state.minutesLeft--;
  if (logging && !state.log[TIME_LIMIT - state.minutesLeft]) state.log[TIME_LIMIT - state.minutesLeft] = {};
  resourceTypes.forEach(resourceType => {
    state.resources[resourceType] += state.robots[resourceType];
    if (logging && state.robots[resourceType]) state.log[TIME_LIMIT - state.minutesLeft].collect = (state.log[TIME_LIMIT - state.minutesLeft].collect || '') + `${state.robots[resourceType]} ${resourceType} robots collect ${state.robots[resourceType]} ${resourceType}; you now have ${state.resources[resourceType]} ${resourceType}.\n`;
  });
  return state;
};

const buyRobot = (blueprint, state, robotType) => {
  if (logging) {
    if (!state.log[TIME_LIMIT - state.minutesLeft]) state.log[TIME_LIMIT - state.minutesLeft] = {};
    const resourceStr = resourceTypes.map(resource => {
      if (blueprint[robotType][resource] > 0) {
        return `${blueprint[robotType][resource]} ${resource}`;
      }
      return '';
    }).filter(Boolean).join(', ');
    state.log[TIME_LIMIT - state.minutesLeft].bought = `Buying a ${robotType} robot for ${resourceStr}; `;
  }
  state.robots[robotType] = state.robots[robotType] + 1;
  resourceTypes.forEach(resourceType => {
    state.resources[resourceType] -= blueprint[robotType][resourceType];
  });
  if (logging) state.log[TIME_LIMIT - state.minutesLeft].bought += `leaving ${resourceTypes.map(resource => `${state.resources[resource]} ${resource}`).join(', ')}.`;
  return state;
};

const copyState = (state) => logging ? ({
  ...state,
  robots: {...state.robots},
  resources: {...state.resources},
  log: {...state.log},
  }) : ({
    ...state,
    robots: {...state.robots},
    resources: {...state.resources},
  });

const printRecord = (finalState) => {
  for (let m = 0; m < TIME_LIMIT; m++) {
    console.log(`\n== Minute ${m + 1} ==`);
    if (finalState.log[m]) {
      if (finalState.log[m].bought) console.log(finalState.log[m].bought);
      console.log(finalState.log[m].collect);
    }
  }
}

const cache = new Map();

const MAP_LIMIT = 2**23;
const setCache = (cacheKey, result) => {
  if (cache.size < MAP_LIMIT) cache.set(cacheKey, result);
};

let iter = 0;
const maxGeodes = (blueprint, state) => {
  const cacheKey = `${state.minutesLeft}|${robotTypes.map(type => state.robots[type])}|${resourceTypes.map(type => state.resources[type])}`;
  if (!(iter++ % 1000000)) {
    console.log(iter, cacheKey);
  };
  if (cache.has(cacheKey)) {
    // console.log(`We have seen ${cacheKey} before!  ${cache.get(cacheKey)}`);
    return cache.get(cacheKey);
  }
  if (state.minutesLeft <= 0) {
    setCache(cacheKey, state.resources.geode);
    return state.resources.geode;
  }
  // if (state.resources.geode > 9) {
  //   console.log(iter, cacheKey);
  //   printRecord(state);
  //   process.exit(1);
  // }
  const preCollectionState = copyState(state);
  collectResources(state);
  // If you can afford a geode robot, buy it.  Try nothing else;
  if (canAffordRobot(blueprint, preCollectionState, 'geode')) {
    const buyGeodeState = buyRobot(blueprint, copyState(state), 'geode');
    const result = maxGeodes(blueprint, buyGeodeState);
    if (state.minutesLeft <= 24) setCache(cacheKey, result);
    return result;
  }
  // At each minute, either make a robot or don't.
  let canAffordAnyRobot = true;
  const maxAfterBuying = robotTypes.reduce((max, robotType) => {
    if (robotType === 'geode') return max;
    // If you have enough robots to cover that resource cost of any robot, there's no need to build that robot.
    const haveEnoughRobotsToCoverResourceCostOfAnyRobot = robotTypes.every(type => {
      return state.robots[robotType] >= blueprint[type][robotType];
    });
    if (haveEnoughRobotsToCoverResourceCostOfAnyRobot) return max;
    // If you can buy the robot, return the maxGeodes after buying it.
    if (canAffordRobot(blueprint, preCollectionState, robotType)) {
      const buyState = buyRobot(blueprint, copyState(state), robotType);
      max = Math.max(max, maxGeodes(blueprint, buyState));
    } else {
      canAffordAnyRobot = false
    }
    return max;
  }, 0);
  if (!canAffordAnyRobot) {
    // If you can't afford every robot, try to keep saving.
    const dontBuyState = copyState(state);
    const result = Math.max(maxAfterBuying, maxGeodes(blueprint, dontBuyState));
    if (state.minutesLeft <= 24) setCache(cacheKey, result);
    return result;
  }
  if (state.minutesLeft <= 24) setCache(cacheKey, maxAfterBuying);
  return maxAfterBuying;
};

let maxGeodesOfAllBluePrints = 0;
let bestBluePrint = 0;
let sumOfQualtities = 0;
let prodOfMaxGeodes = 1;
blueprints.slice(0,3).forEach((blueprint, i) => {
  console.log(`Trying blueprint ${i + 1}`);
  cache.clear();
  const newState = copyState(initialState);
  const geodes = maxGeodes(blueprint, newState);
  console.log(`Blueprint ${i + 1}: ${geodes}`);
  sumOfQualtities += geodes * (i + 1);
  prodOfMaxGeodes *= geodes;
  if (geodes > maxGeodesOfAllBluePrints) {
    maxGeodesOfAllBluePrints = geodes;
    bestBluePrint = i + 1;
  }
});
console.log(maxGeodesOfAllBluePrints * bestBluePrint);
console.log(sumOfQualtities);
console.log(prodOfMaxGeodes);