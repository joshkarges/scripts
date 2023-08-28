const {inputLines} = require('./parse');

const DIRS = [
  [0, 1], // Move
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 0], // Wait
];

const lcm = (x, y) => {
  let xm = x;
  let yn = y;
  while (xm !== yn) {
    if (xm > yn) {
      yn += y;
    } else {
      xm += x;
    }
  }
  return xm;
}

const MAX_ROW = inputLines.length - 1;
const MAX_COL = inputLines[0].length - 1;

const ROW_COL_LCM = lcm(MAX_ROW - 1, MAX_COL - 1);

const end = [MAX_ROW, MAX_COL - 1];

module.exports = {
  DIRS,
  MAX_COL,
  MAX_ROW,
  ROW_COL_LCM,
  end,
};
