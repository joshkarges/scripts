const input = `Valve GV has flow rate=23; tunnel leads to valve WO
Valve TS has flow rate=0; tunnels lead to valves IG, TX
Valve UC has flow rate=0; tunnels lead to valves XJ, VZ
Valve TJ has flow rate=0; tunnels lead to valves GJ, YV
Valve KF has flow rate=0; tunnels lead to valves QY, VP
Valve PO has flow rate=0; tunnels lead to valves YF, VP
Valve CV has flow rate=0; tunnels lead to valves VB, QK
Valve NK has flow rate=6; tunnels lead to valves MI, QY, DO, QJ, YH
Valve IG has flow rate=4; tunnels lead to valves MI, FP, OP, UV, TS
Valve KN has flow rate=0; tunnels lead to valves RF, CY
Valve KR has flow rate=0; tunnels lead to valves VP, DI
Valve VZ has flow rate=19; tunnel leads to valve UC
Valve MW has flow rate=0; tunnels lead to valves UZ, VB
Valve LJ has flow rate=25; tunnels lead to valves XJ, LI
Valve DI has flow rate=0; tunnels lead to valves KR, AA
Valve TO has flow rate=12; tunnels lead to valves TG, PB, BZ
Valve CG has flow rate=0; tunnels lead to valves VP, TX
Valve GJ has flow rate=0; tunnels lead to valves QL, TJ
Valve UZ has flow rate=0; tunnels lead to valves MW, VP
Valve RF has flow rate=16; tunnels lead to valves RD, KN, AU
Valve CY has flow rate=0; tunnels lead to valves KN, YV
Valve AA has flow rate=0; tunnels lead to valves UV, VS, NB, XO, DI
Valve YV has flow rate=11; tunnels lead to valves CY, PW, TJ
Valve VS has flow rate=0; tunnels lead to valves QK, AA
Valve TX has flow rate=14; tunnels lead to valves RM, CG, TS, DM, YH
Valve SB has flow rate=0; tunnels lead to valves YF, BZ
Valve QY has flow rate=0; tunnels lead to valves NK, KF
Valve PB has flow rate=0; tunnels lead to valves HP, TO
Valve YF has flow rate=20; tunnels lead to valves DM, SB, PO
Valve TG has flow rate=0; tunnels lead to valves RM, TO
Valve UV has flow rate=0; tunnels lead to valves IG, AA
Valve XJ has flow rate=0; tunnels lead to valves LJ, UC
Valve DM has flow rate=0; tunnels lead to valves YF, TX
Valve PW has flow rate=0; tunnels lead to valves YV, LI
Valve RD has flow rate=0; tunnels lead to valves QL, RF
Valve OM has flow rate=0; tunnels lead to valves QK, OP
Valve RM has flow rate=0; tunnels lead to valves TX, TG
Valve SH has flow rate=0; tunnels lead to valves AU, HP
Valve LI has flow rate=0; tunnels lead to valves PW, LJ
Valve FP has flow rate=0; tunnels lead to valves IG, VB
Valve BZ has flow rate=0; tunnels lead to valves SB, TO
Valve DO has flow rate=0; tunnels lead to valves NK, VB
Valve WO has flow rate=0; tunnels lead to valves QK, GV
Valve MI has flow rate=0; tunnels lead to valves IG, NK
Valve QK has flow rate=10; tunnels lead to valves VS, OM, WO, CV
Valve OP has flow rate=0; tunnels lead to valves IG, OM
Valve AU has flow rate=0; tunnels lead to valves SH, RF
Valve QJ has flow rate=0; tunnels lead to valves NK, XO
Valve VP has flow rate=8; tunnels lead to valves PO, CG, KF, KR, UZ
Valve HP has flow rate=17; tunnels lead to valves SH, PB
Valve XO has flow rate=0; tunnels lead to valves QJ, AA
Valve QL has flow rate=15; tunnels lead to valves RD, GJ
Valve NB has flow rate=0; tunnels lead to valves VB, AA
Valve VB has flow rate=7; tunnels lead to valves DO, CV, MW, NB, FP
Valve YH has flow rate=0; tunnels lead to valves NK, TX`;

const input2 = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const lines = input.split('\n');

const graph = {};
lines.forEach((line, i) => {
  const {id, rateStr, childrenStr} = line.match(/Valve (?<id>[A-Z]{2}) has flow rate=(?<rateStr>\d+); tunnels? leads? to valves? (?<childrenStr>([A-Z]{2}(, )?)+)/)?.groups ?? {};
  const rate = +rateStr;
  const children = childrenStr.split(', ');
  graph[id] = {rate, children, paths: {}};
});

const setPath = (graph, start, end, dist) => {
  if (!graph[start].paths) graph[start].paths = {};
  graph[start].paths[end] = dist;
  if (!graph[end].paths) graph[end].paths = {};
  graph[end].paths[start] = dist;
};

const fillPathDistance = (graph, start, end, visited) => {
  if (start === end) {
    return 0;
  }
  if (end in graph[start].paths) return graph[start].paths[end];
  visited.add(start);
  const shortestDistanceToEndFromChild = graph[start].children.reduce((shortestDist, child) => {
    if (visited.has(child)) return shortestDist;
    const distChildToEnd = fillPathDistance(graph, child, end, visited);
    shortestDist = Math.min(distChildToEnd, shortestDist);
    return shortestDist;
  }, Infinity);
  setPath(graph, start, end, shortestDistanceToEndFromChild + 1);
  return shortestDistanceToEndFromChild + 1;
};

const valves = Object.keys(graph);
valves.forEach((node) => {
  graph[node].paths = {};
  valves.forEach((endNode) => {
    if (node === endNode) return;
    fillPathDistance(graph, node, endNode, new Set(), 0);
  });
});

const valvesWithNonZeroRates = valves.filter(valve => !!graph[valve].rate);


const TIME_LIMIT = 26;
const solutions = [];
const maxPressureFromValve = (graph, currentValve, currentPressure, openValves, minute, solutions) => {
  const unOpenedValves = valvesWithNonZeroRates.filter(valve => !openValves.has(valve) && (minute + graph[currentValve].paths[valve]) < TIME_LIMIT);
  if (solutions) solutions.push([currentPressure, new Set(openValves)]);
  if (!unOpenedValves.length) {
    return currentPressure;
  }

  let maxOutPressure = 0;
  for (let u = 0; u < unOpenedValves.length; u++) {
    const valve = unOpenedValves[u];
    const travelAndOpenTime = 1 + graph[currentValve].paths[valve];
    const pressureForOpeningValve = (TIME_LIMIT - (minute + travelAndOpenTime)) * graph[valve].rate;
    const newOutPressure = maxPressureFromValve(graph, valve, pressureForOpeningValve + currentPressure, new Set(openValves).add(valve), minute + travelAndOpenTime, solutions);
    if (newOutPressure > maxOutPressure) {
      maxOutPressure = newOutPressure;
    }
  }
  return maxOutPressure;
};
const result = maxPressureFromValve(graph, 'AA', 0, new Set(), 0, solutions);
console.log('result = ', result);

let maxOfBoth = 0;
let bestSolution = [];
solutions.forEach(([pressureOfOnePerson, openValves]) => {
  const solutions2 = [];
  const totalPressure = maxPressureFromValve(graph, 'AA', pressureOfOnePerson, new Set(openValves), 0, solutions2);
  if (totalPressure > maxOfBoth) {
    bestSolution = [[pressureOfOnePerson, openValves], solutions2.find(s => s[0] === totalPressure)]
    maxOfBoth = totalPressure;
  }
});
console.log(bestSolution);
console.log(maxOfBoth);

let currentValve = 'AA';
let minutesLeft = TIME_LIMIT;
let totalPressure = 0;
bestSolution[0][1].forEach((valve) => {
  if (currentValve === valve) return;
  minutesLeft -= ((graph[currentValve].paths[valve] || 0) + 1);
  valvesAccumulatedPressure = graph[valve].rate * minutesLeft;
  totalPressure += valvesAccumulatedPressure;
  console.log(`By minute ${TIME_LIMIT - minutesLeft}, I traveled ${(graph[currentValve].paths[valve] || 0)} minutes and opened up valve ${valve} adding ${graph[valve].rate} * ${minutesLeft} = ${valvesAccumulatedPressure} for a total of ${totalPressure} pressure.`);
  currentValve = valve;
});

currentValve = 'AA';
minutesLeft = TIME_LIMIT
bestSolution[1][1].forEach((valve) => {
  if (bestSolution[0][1].has(valve) || valve === currentValve) return;
  minutesLeft -= ((graph[currentValve].paths[valve] || 0) + 1);
  valvesAccumulatedPressure = graph[valve].rate * minutesLeft;
  totalPressure += valvesAccumulatedPressure;
  console.log(`By minute ${TIME_LIMIT - minutesLeft}, the elephant traveled ${(graph[currentValve].paths[valve] || 0)} minutes and opened up valve ${valve} adding ${graph[valve].rate} * ${minutesLeft} = ${valvesAccumulatedPressure} for a total of ${totalPressure} pressure.`);
  currentValve = valve;
});