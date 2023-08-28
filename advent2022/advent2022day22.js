const path = require("path");
const fs = require("fs");

const input1 = fs.readFileSync(path.join(__dirname, "advent2022day22input.txt"), "utf8")
  .toString();

const input2 = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const input3 = `    ........
    ........
    ........
    ........
    ....    
    ....    
    ....    
    ....    
........    
........    
........
........
....        
....        
....        
....        

L2R1R3R3L1L3R2L1L2R3R2L1L2R2L1L2R2L1L1R3R5L1L1R6`;

const lines = input1.split('\n');
const map = lines.slice(0, lines.length - 2).map(line => line.split(''));
const loggingMap = map.map(row => row.slice());
const directions = lines[lines.length - 1].match(/\d+|R|L/g).map(x => isNaN(+x) ? x : +x);

const numRows = map.length;
const numCols = map.length;

const startingRow = 0;
const startingCol = map[startingRow].findIndex(x => x === '.');
const startingPos = [startingRow, startingCol];
const startingDir = [0, 1];

const DIRS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];


// console.log(map.findLastIndex(row => row[149] !== ' '));
// console.log(map[199][149]);
// process.exit(1);

let logging = true;

const getDirIndex = (dir) => DIRS.findIndex(d => d[0] === dir[0] && d[1] === dir[1]);

const getRC = (map, r, c) => map[r]?.[c] ?? ' ';

const wrap1 = (pos, dir) => {
  if (0 <= pos[0] && pos[0] <= 3 && pos[1] === 12) {
    console.log('Side left 1 to right 6');
    pos[0] = 11 - pos[0];
    pos[1] = 15;
    // dir = [0, -1];
    dir[0] = 0;
    dir[1] = -1;
  } else if (4 <= pos[0] && pos[0] <= 7 && pos[1] === 12) {
    console.log('Side 4 to 6');
    pos[1] = 15 - (pos[0] - 4);
    pos[0] = 8;
    // dir = [1, 0];
    dir[0] = 1;
    dir[1] = 0;
  } else if (8 <= pos[0] && pos[0] <= 11 && pos[1] === 16) {
    console.log('Side 6 to 1');
    pos[0] = 11 - pos[0];
    pos[1] = 11;
    // dir = [0, -1];
    dir[0] = 0;
    dir[1] = -1;
  } else if (0 <= pos[0] && pos[0] <= 3 && pos[1] === 7) {
    console.log('Side 1 to 3');
    pos[1] = 4 + pos[0];
    pos[0] = 4;
    // dir = [1, 0];
    dir[0] = 1;
    dir[1] = 0;
  } else if (0 <= pos[0] && pos[0] <= 3 && pos[1] === -1) {
    console.log('Side 2 to 6');
    pos[1] = 15 - (pos[0] - 4);
    pos[0] = 11;
    // dir = [-1, 0];
    dir[0] = -1;
    dir[1] = 0;
  } else if (8 <= pos[0] && pos[0] <= 11 && pos[1] === 7) {
    console.log('Side 5 to 3');
    pos[1] = 7 - (pos[0] - 8);
    pos[0] = 7;
    // dir = [-1, 0];
    dir[0] = -1;
    dir[1] = 0;
  } else if (8 <= pos[1] && pos[1] <= 11 && pos[0] === -1) {
    console.log('Side 1 to 2');
    pos[1] = 3 - (pos[1] - 8);
    pos[0] = 4;
    // dir = [1, 0];
    dir[0] = 1;
    dir[1] = 0;
  } else if (0 <= pos[1] && pos[1] <= 3 && pos[0] === 3) {
    console.log('Side 2 to 1');
    pos[1] = 11 - pos[1];
    pos[0] = 0;
    // dir = [1, 0];
    dir[0] = 1;
    dir[1] = 0;
  } else if (4 <= pos[1] && pos[1] <= 7 && pos[0] === 3) {
    console.log('Side 3 to 1');
    pos[0] = pos[1] - 4;
    pos[1] = 8;
    // dir = [0, 1];
    dir[0] = 0;
    dir[1] = 1;
  } else if (12 <= pos[1] && pos[1] <= 15 && pos[0] === 7) {
    console.log('Side 6 to 4');
    pos[0] = 7 - (pos[1] - 12);
    pos[1] = 11;
    // dir = [0, -1];
    dir[0] = 0;
    dir[1] = -1;
  } else if (0 <= pos[1] && pos[1] <= 3 && pos[0] === 8) {
    console.log('Side 2 to 5');
    pos[1] = 8 + pos[1];
    pos[0] = 11;
    // dir = [-1, 0];
    dir[0] = -1;
    dir[1] = 0;
  } else if (4 <= pos[1] && pos[1] <= 7 && pos[0] === 8) {
    console.log('Side 3 to 5');
    pos[0] = 15 - (pos[1] - 4);
    pos[1] = 12;
    // dir = [1, 0];
    dir[0] = 1;
    dir[1] = 0;
  } else if (8 <= pos[1] && pos[1] <= 11 && pos[0] === 12) {
    console.log('Side 5 to 2');
    pos[1] = 11 - pos[1];
    pos[0] = 7;
    // dir = [-1, 0];
    dir[0] = -1;
    dir[1] = 0;
  } else if (12 <= pos[1] && pos[1] <= 15 && pos[0] === 12) {
    console.log('Side 6 to 2');
    pos[0] = 7 - (pos[1] - 12);
    pos[1] = 0;
    // dir = [0, 1];
    dir[0] = 0;
    dir[1] = 1;
  }
};

const RIGHT_EDGE_0 = 0;
const RIGHT_EDGE_1 = 50;
const RIGHT_EDGE_2 = 100;
const RIGHT_EDGE_3 = 150;
const LEFT_EDGE_0 = -1;
const LEFT_EDGE_1 = 49;
const LEFT_EDGE_2 = 99;
const LEFT_EDGE_3 = 149;
const DOWN_EDGE_0 = 0;
const DOWN_EDGE_1 = 50;
const DOWN_EDGE_2 = 100;
const DOWN_EDGE_3 = 150;
const DOWN_EDGE_4 = 200;
const TOP_EDGE_0 = -1;
const TOP_EDGE_1 = 49;
const TOP_EDGE_2 = 99;
const TOP_EDGE_3 = 149;
const TOP_EDGE_4 = 199;

// const RIGHT_EDGE_0 = 0;
// const RIGHT_EDGE_1 = 4;
// const RIGHT_EDGE_2 = 8;
// const RIGHT_EDGE_3 = 12;
// const LEFT_EDGE_0 = -1;
// const LEFT_EDGE_1 = 3;
// const LEFT_EDGE_2 = 7;
// const LEFT_EDGE_3 = 11;
// const DOWN_EDGE_0 = 0;
// const DOWN_EDGE_1 = 4;
// const DOWN_EDGE_2 = 8;
// const DOWN_EDGE_3 = 12;
// const DOWN_EDGE_4 = 16;
// const TOP_EDGE_0 = -1;
// const TOP_EDGE_1 = 3;
// const TOP_EDGE_2 = 7;
// const TOP_EDGE_3 = 11;
// const TOP_EDGE_4 = 15;

const wrap2 = (pos, dir) => {
  if (DOWN_EDGE_0 <= pos[0] && pos[0] <= TOP_EDGE_1 && pos[1] === RIGHT_EDGE_3) {
    console.log('Side 2 to 5');
    pos[0] = DOWN_EDGE_2 + (TOP_EDGE_1 - pos[0]);
    pos[1] = LEFT_EDGE_2;
    dir[0] = 0;
    dir[1] = -1;
  } else if (DOWN_EDGE_1 <= pos[0] && pos[0] <= TOP_EDGE_2 && pos[1] === RIGHT_EDGE_2 && dir[1] === 1) {
    console.log('Side 3 to 2');
    pos[1] = RIGHT_EDGE_2 + (pos[0] - DOWN_EDGE_1);
    pos[0] = TOP_EDGE_1;
    dir[0] = -1;
    dir[1] = 0;
  } else if (DOWN_EDGE_2 <= pos[0] && pos[0] <= TOP_EDGE_3 && pos[1] === RIGHT_EDGE_2) {
    console.log('Side 5 to 2');
    pos[0] = DOWN_EDGE_0 + (TOP_EDGE_3 - pos[0]);
    pos[1] = LEFT_EDGE_3;
    dir[0] = 0;
    dir[1] = -1;
  } else if (DOWN_EDGE_3 <= pos[0] && pos[0] <= TOP_EDGE_4 && pos[1] === RIGHT_EDGE_1 && dir[1] === 1) {
    console.log('Side 6 to 5');
    pos[1] = RIGHT_EDGE_1 + (pos[0] - DOWN_EDGE_3);
    pos[0] = TOP_EDGE_3;
    dir[0] = -1;
    dir[1] = 0;
  } else if (DOWN_EDGE_0 <= pos[0] && pos[0] <= TOP_EDGE_1 && pos[1] === LEFT_EDGE_1) {
    console.log('Side 1 to 4');
    pos[0] = DOWN_EDGE_2 + (TOP_EDGE_1 - pos[0]);
    pos[1] = RIGHT_EDGE_0;
    dir[0] = 0;
    dir[1] = 1;
  } else if (DOWN_EDGE_1 <= pos[0] && pos[0] <= TOP_EDGE_2 && pos[1] === LEFT_EDGE_1 && dir[1] === -1) {
    console.log('Side 3 to 4');
    pos[1] = RIGHT_EDGE_0 + (pos[0] - DOWN_EDGE_1);
    pos[0] = DOWN_EDGE_2;
    dir[0] = 1;
    dir[1] = 0;
  } else if (DOWN_EDGE_2 <= pos[0] && pos[0] <= TOP_EDGE_3 && pos[1] === LEFT_EDGE_0) {
    console.log('Side 4 to 1');
    pos[0] = DOWN_EDGE_0 + (TOP_EDGE_3 - pos[0]);
    pos[1] = RIGHT_EDGE_1;
    dir[0] = 0;
    dir[1] = 1;
  } else if (DOWN_EDGE_3 <= pos[0] && pos[0] <= TOP_EDGE_4 && pos[1] === LEFT_EDGE_0) {
    console.log('Side 6 to 1');
    pos[1] = RIGHT_EDGE_1 + (pos[0] - DOWN_EDGE_3);
    pos[0] = DOWN_EDGE_0;
    dir[0] = 1;
    dir[1] = 0;
  } else if (RIGHT_EDGE_1 <= pos[1] && pos[1] <= LEFT_EDGE_2 && pos[0] === TOP_EDGE_0) {
    console.log('Side 1 to 6');
    pos[0] = DOWN_EDGE_3 + (pos[1] - RIGHT_EDGE_1);
    pos[1] = RIGHT_EDGE_0;
    dir[0] = 0;
    dir[1] = 1;
  } else if (RIGHT_EDGE_2 <= pos[1] && pos[1] <= LEFT_EDGE_3 && pos[0] === TOP_EDGE_0) {
    console.log('Side 2 to 6');
    pos[1] = RIGHT_EDGE_0 + (pos[1] - RIGHT_EDGE_2);
    pos[0] = TOP_EDGE_4;
    dir[0] = -1;
    dir[1] = 0;
  } else if (RIGHT_EDGE_0 <= pos[1] && pos[1] <= LEFT_EDGE_1 && pos[0] === TOP_EDGE_2 && dir[0] === -1) {
    console.log('4 to 3');
    pos[0] = DOWN_EDGE_1 + (pos[1] - RIGHT_EDGE_0);
    pos[1] = RIGHT_EDGE_1;
    dir[0] = 0;
    dir[1] = 1;
  } else if (RIGHT_EDGE_2 <= pos[1] && pos[1] <= LEFT_EDGE_3 && pos[0] === DOWN_EDGE_1 && dir[0] === 1) {
    console.log('Side 2 to 3');
    pos[0] = DOWN_EDGE_1 + (pos[1] - RIGHT_EDGE_2);
    pos[1] = LEFT_EDGE_2;
    dir[0] = 0;
    dir[1] = -1;
  } else if (RIGHT_EDGE_1 <= pos[1] && pos[1] <= LEFT_EDGE_2 && pos[0] === DOWN_EDGE_3 && dir[0] === 1) {
    console.log('Side 5 to 6');
    pos[0] = DOWN_EDGE_3 + (pos[1] - RIGHT_EDGE_1);
    pos[1] = LEFT_EDGE_1;
    dir[0] = 0;
    dir[1] = -1;
  } else if (RIGHT_EDGE_0 <= pos[1] && pos[1] <= LEFT_EDGE_1 && pos[0] === DOWN_EDGE_4) {
    console.log('Side 6 to 2');
    pos[1] = RIGHT_EDGE_2 + (pos[1] - RIGHT_EDGE_0);
    pos[0] = DOWN_EDGE_0;
    dir[0] = 1;
    dir[1] = 0;
  }
}

const move = (map, pos, dir, dist) => {
  let distMoved = 0;
  const newPos = [pos[0], pos[1]];
  const newDir = [dir[0], dir[1]];
  if (logging) loggingMap[pos[0]][pos[1]] = ['>', 'v', '<', '^'][getDirIndex(dir)];
  while (distMoved < dist) {
    newPos[0] += dir[0];
    newPos[1] += dir[1];
    // If newPos is off the map, or in an empty tile, wrap around to the other side
    let nextTile = getRC(map, newPos[0], newPos[1]);
    if (nextTile === ' ') {
      // // Wrap vertically
      // if (dir[0] > 0) {
      //   newPos[0] = map.findIndex((row, r) => getRC(map, r, newPos[1]) !== ' ');
      // } else if (dir[0] < 0) {
      //   newPos[0] = map.findLastIndex((row, r) => getRC(map, r, newPos[1]) !== ' ');
      // } else if (dir[1] > 0) {
      //   // Wrap horizontally
      //   newPos[1] = map[newPos[0]].findIndex((col, c) => getRC(map, newPos[0], c) !== ' ');
      // } else if (dir[1] < 0) {
      //   newPos[1] = map[newPos[0]].findLastIndex((col, c) => getRC(map, newPos[0], c) !== ' ');
      // }
      wrap2(newPos, newDir);
      nextTile = getRC(map, newPos[0], newPos[1]);
    }
    if (nextTile === '#') {
      break;
    }
    console.log(`pos: ${pos} | newPos: ${newPos} | dir: ${dir} | newDir: ${newDir} | dist: ${dist} | distMoved: ${distMoved} | `);
    distMoved++;
    pos[0] = newPos[0];
    pos[1] = newPos[1];
    dir[0] = newDir[0];
    dir[1] = newDir[1];
    if (logging) loggingMap[pos[0]][pos[1]] = ['>', 'v', '<', '^'][getDirIndex(dir)];
  }
  return [pos, dir];
};

const mod = (x, n) => {
  const rem = x % n;
  return rem >= 0 ? rem : rem + n;
};

const turn = (char, dir) => {
  const curDirIdx = getDirIndex(dir);
  const newDirIdx = char === 'R' ? mod(curDirIdx + 1, 4) : mod(curDirIdx - 1, 4);
  const newDir = DIRS[newDirIdx];
  console.log(`char: ${char} | dir: ${dir} | newDir: ${newDir} | curDirIdx: ${curDirIdx} | newDirIdx: ${newDirIdx}`);
  return DIRS[newDirIdx];
};

let curPos = [...startingPos];
let curDir = [...startingDir];
for (let d = 0; d < directions.length; d++) {
  const direction = directions[d];
  // console.log(direction, curPos, curDir);
  if (typeof direction === 'number') {
    [curPos, curDir] = move(map, curPos.slice(), curDir.slice(), direction);
    // console.log(map.map(row => row.join('')).join('\n'));
    // console.log('\n');
  } else {
    curDir = turn(direction, curDir);
  }
}

console.log(loggingMap.map(row => row.join('')).join('\n'));
console.log(curPos, curDir);
console.log(1000 * (curPos[0] + 1) + 4 * (curPos[1] + 1) + getDirIndex(curDir));

// 51248 too low
// 131172 too high

// 32582 too low

// My answer worked for the example input.  I painstakingly hardcoded the wrap function, and checked it multiple times for accuracy.  Instead of debugging thousands of line of logs, I just gave up and took someones bug-free code from the soultions.
// NEVERMIND!  I made an example test case where it tried to cross every single edge, and I found a bug where tiles next to a 90˚ angle were being considered twice!