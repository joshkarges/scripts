const input = `Sensor at x=3428425, y=2345067: closest beacon is at x=3431988, y=2379841
Sensor at x=928237, y=25774: closest beacon is at x=1212315, y=-161555
Sensor at x=2061220, y=2396791: closest beacon is at x=2038311, y=2495160
Sensor at x=1830400, y=2994568: closest beacon is at x=1910058, y=3117415
Sensor at x=2485733, y=2625804: closest beacon is at x=2038311, y=2495160
Sensor at x=1855873, y=3971916: closest beacon is at x=1910058, y=3117415
Sensor at x=119582, y=3929652: closest beacon is at x=311197, y=4221202
Sensor at x=1069031, y=3509672: closest beacon is at x=1910058, y=3117415
Sensor at x=3368023, y=2213635: closest beacon is at x=3431988, y=2379841
Sensor at x=3713877, y=2460862: closest beacon is at x=3431988, y=2379841
Sensor at x=3593503, y=2174008: closest beacon is at x=3507689, y=2000000
Sensor at x=501760, y=93436: closest beacon is at x=1212315, y=-161555
Sensor at x=3712703, y=214999: closest beacon is at x=3507689, y=2000000
Sensor at x=1594824, y=2790273: closest beacon is at x=1910058, y=3117415
Sensor at x=2539549, y=3190814: closest beacon is at x=1910058, y=3117415
Sensor at x=3522790, y=2671548: closest beacon is at x=3431988, y=2379841
Sensor at x=1001452, y=1327490: closest beacon is at x=1212315, y=-161555
Sensor at x=629209, y=2451628: closest beacon is at x=-416149, y=2226089
Sensor at x=2636827, y=1146266: closest beacon is at x=3507689, y=2000000
Sensor at x=3909, y=625124: closest beacon is at x=1212315, y=-161555
Sensor at x=3950231, y=3688780: closest beacon is at x=3888160, y=3226725
Sensor at x=3449978, y=2328058: closest beacon is at x=3431988, y=2379841
Sensor at x=3974214, y=2582925: closest beacon is at x=3888160, y=3226725
Sensor at x=82663, y=3225533: closest beacon is at x=311197, y=4221202
Sensor at x=1958305, y=2292045: closest beacon is at x=2038311, y=2495160
Sensor at x=3465738, y=2123353: closest beacon is at x=3507689, y=2000000
Sensor at x=2940758, y=3884337: closest beacon is at x=2746166, y=4800483
Sensor at x=3429173, y=2275591: closest beacon is at x=3431988, y=2379841
Sensor at x=1527349, y=38565: closest beacon is at x=1212315, y=-161555
Sensor at x=3049925, y=2498038: closest beacon is at x=3431988, y=2379841
Sensor at x=1593202, y=3335178: closest beacon is at x=1910058, y=3117415
Sensor at x=3175520, y=3230234: closest beacon is at x=3888160, y=3226725`;

const input2 = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const manDist = (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

const lines = input.split('\n');
let xMin = Infinity;
let xMax = -Infinity;
let yMin = Infinity;
let yMax = -Infinity;
const sensors = lines.map(line => {
  const {sensorXStr, sensorYStr, beaconXStr, beaconYStr} = line.match(/Sensor at x=(?<sensorXStr>-?\d+), y=(?<sensorYStr>-?\d+): closest beacon is at x=(?<beaconXStr>-?\d+), y=(?<beaconYStr>-?\d+)/)?.groups ?? {};
  const sensorPos = [+sensorXStr, +sensorYStr];
  const beaconPos = [+beaconXStr, +beaconYStr];
  const range = manDist(beaconPos, sensorPos);
  xMin = Math.min(xMin, sensorPos[0] - range);
  xMax = Math.max(xMax, sensorPos[0] + range);
  yMin = Math.min(yMin, sensorPos[1] - range);
  yMax = Math.max(yMax, sensorPos[1] + range);
  return {sensorPos, beaconPos, range};
});

// const y = 2000000;
// let numInRange = 0;
// for (let x = xMin; x < xMax; x++) {
//   if (sensors.some(({beaconPos}) => beaconPos[0] === x && beaconPos[1] === y)) continue;
//   if (sensors.some(({sensorPos, range}) => manDist(sensorPos, [x, y]) <= range)) numInRange++;
// }
// console.log(numInRange);
xMin = 0;
xMax = 4000000;
yMin = 0;
yMax = 4000000;
// for (let x = xMin; x <= xMax; x++) {
//   for (let y = yMin; y <= yMax; y++) {
//     const pos = [x, y];
//     if (!sensors.some(({sensorPos, range}) => manDist(sensorPos, pos) <= range)) {
//       console.log(x, y);
//       console.log(x * 4000000 + y);
//       process.exit(0);
//     }
//   }
// }

for (let y = yMin; y <= yMax; y++) {
  const xRanges = sensors.reduce((agg, {sensorPos, range}) => {
    const yDist = Math.abs(sensorPos[1] - y);
    if (yDist > range) return agg;
    const xMin = sensorPos[0] - (range - yDist);
    const xMax = sensorPos[0] + (range - yDist);
    agg.push([xMin, xMax]);
    return agg;
  }, []).sort((a, b) => a[0] - b[0]);
  // Is there anywere where those x-ranges don't overlap?
  let left = xRanges[0][0];
  if (left > xMin) {
    console.log(`found it! ${y}, ${left}, ${xRanges[0][0]}`);
    console.log(xMin * 4000000 + y);
    process.exit(0);
  }
  let right = xRanges[0][1];
  for (let r = 0; r < xRanges.length; r++) {
    if (xRanges[r][0] > right) {
      console.log(`found it! ${y}, ${right}, ${xRanges[r][0]}`);
      console.log((right + 1) * 4000000 + y);
      process.exit(0);
    }
    if (xRanges[r][1] > right) right = xRanges[r][1];
  }
}