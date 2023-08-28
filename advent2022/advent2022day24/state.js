const {MAX_ROW, MAX_COL} = require('./constants');
const {inputLines} = require('./parse');

const newMap = () => Array.from(Array(MAX_ROW + 1), () => Array.from(Array(MAX_COL + 1), () => '.'));

// Store state as 4 2D maps and a minute; one for each direction.  
const state = inputLines
  .reduce((state, line, r) => {
    const row = line.split('');
    row.forEach((char, c) => {
      switch (char) {
        case '>':
          state.rt[r][c] = char;
          break;
        case 'v':
          state.dn[r][c] = char;
          break;
        case '<':
          state.lt[r][c] = char;
          break;
        case '^':
          state.up[r][c] = char;
          break;
        case '#':
          state.rt[r][c] = char;
          state.dn[r][c] = char;
          state.lt[r][c] = char;
          state.up[r][c] = char;
          break;
        default:
      }
    });
    return state;
  }, {up: newMap(), dn: newMap(), lt: newMap(), rt: newMap()});

const MAP_KEYS = ['up','dn','rt','lt'];

const mod = (x, n) => {
  const rem = x % n;
  return rem < 0 ? rem + n : rem;
};

const getRC = (mapKey, r, c, m) => {
  let newR = r;
  let newC = c;
  if (mapKey === 'up') {
    newR = (r + m - 1) % (MAX_ROW - 1) + 1;
  } else if (mapKey === 'dn') {
    newR = mod(r - m - 1, MAX_ROW - 1) + 1;
  } else if (mapKey === 'rt') {
    newC = mod(c - m - 1, MAX_COL - 1) + 1;
  } else if (mapKey === 'lt') {
    newC = (c + m - 1) % (MAX_COL - 1) + 1;
  }
  try {
    return state[mapKey][newR][newC];
  } catch(err) {
    console.log(`r: ${r} | c: ${c} | newR: ${newR} | newC: ${newC} | m: ${m} | mapKey: ${mapKey} | `);
    console.log(err);
    process.exit(1);
  }
};

const getRCFree = (r, c, m) => {
  if (r <= 0 || c <= 0 || r >= MAX_ROW || c >= MAX_COL) {
    if ((r === 0 && c === 1) || (r === MAX_ROW && c === MAX_COL - 1)) return true;
    else return false;
  }
  return MAP_KEYS.every(mapKey => {
    return getRC(mapKey, r, c, m) === '.';
  });
};

const printState = (node) => {
  let totalStr = '';
  for (let r = 0; r <= MAX_ROW; r++) {
    let rowStr = '';
    for (let c = 0; c <= MAX_COL; c++) {
      let char = '.';
      if (r === node.pos[0] && c === node.pos[1]) {
        char = 'E';
      } else if (r === 0 || c === 0 || r === MAX_ROW || c === MAX_COL) {
        if ((r === 0 && c === 1) || (r === MAX_ROW && c === MAX_COL - 1)) char = '.';
        else char = '#';
      } else {
        MAP_KEYS.some(mapKey => {
          const charAtMap = getRC(mapKey, r, c, node.minute);
          if (charAtMap === '.') {
            return false;
          } else if (charAtMap === '#') {
            char = '#';
            return true;
          } else {
            if (char === '.') char = charAtMap;
            else char = ((+char || 1) + 1).toString();
          }
        });
      }
      rowStr += char;
    }
    totalStr += `${rowStr}\n`;
  }
  console.log(totalStr);
};

const printAllMaps = (node) => {
  let totalStr = '';
  for (let r = 0; r <= MAX_ROW; r++) {
    let rowStr = '';
    for (let m = 0; m < MAP_KEYS.length; m++) {
      for (let c = 0; c <= MAX_COL; c++) {
        let char = '.';
        if (r === node.pos[0] && c === node.pos[1]) {
          char = 'E';
        } else if (r === 0 || c === 0 || r === MAX_ROW || c === MAX_COL) {
          if ((r === 0 && c === 1) || (r === MAX_ROW && c === MAX_COL - 1)) char = '.';
          else char = '#';
        } else {
          char = getRC(MAP_KEYS[m], r, c, node.minute);
        }
        rowStr += char;
      }
      rowStr += '  ';
    }
    totalStr += `${rowStr}\n`;
  }
  console.log(totalStr);
  console.log('\n');
};

module.exports = {
  state,
  printState,
  printAllMaps,
  getRC,
  getRCFree,
};
