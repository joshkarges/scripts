const {heapExtractRoot} = require('../../heap');
const {end, DIRS, ROW_COL_LCM} = require('./constants');
const {getRCFree} = require('./state');
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
};

const createNodeFn = (endPos) => {
  const createNode = (r, c, minute) => {
    return {
      pos: [r, c],
      minute,
      cost: Math.abs(r - endPos[0]) + Math.abs(c - endPos[1]) + minute,
    };
  };
  return createNode;
};

const getAeKey = (r, c, m) => `${r}, ${c}, ${m % ROW_COL_LCM}`;
const alreadyExplored = new Set();
const getAlreadyExplored = (r, c, m) => alreadyExplored.has(getAeKey(r, c, m));
const setAlreadyExplored = (r, c, m) => alreadyExplored.add(getAeKey(r, c, m));

const getChildrenFn = (startPos, endPos) => {
  const createNode = createNodeFn(endPos);
  const getChildren = (node) => {
    const children = DIRS.map(dir => {
      const newR = node.pos[0] + dir[0];
      const newC = node.pos[1] + dir[1];
      // console.log(`r: ${node.pos[0]} | c: ${node.pos[1]} | newR: ${newR} | newC: ${newC} | minute: ${node.minute}`);
      const movesBackToStart = (node.pos[0] !== startPos[0] || node.pos[1] !== startPos[1]) && (newR === startPos[0] || newC === startPos[1]);
      const isNotAlreadyExplored = !getAlreadyExplored(newR, newC, node.minute + 1);
      const isFree = getRCFree(newR, newC, node.minute + 1);
      if (!movesBackToStart && isNotAlreadyExplored && isFree) {
        // console.log(`Added [${newR}, ${newC}, ${node.minute + 1}]`);
        return createNode(newR, newC, node.minute + 1);
      } else {
        let reason = ''
        if (movesBackToStart) {
          reason += `moves back to start | `;
        }
        if (!isNotAlreadyExplored) {
          reason += `already explored | `;
        }
        if (!isFree) {
          reason += `is not free`;
        }
        // console.log(reason);
      }
    }).filter(Boolean);
    return children;
  };
  return getChildren;
};

const getNextBestNode = (nodes) => {
  return heapExtractRoot(nodes);
};

module.exports = {
  askQuestion,
  createNodeFn,
  getChildrenFn,
  getNextBestNode,
  setAlreadyExplored,
};
