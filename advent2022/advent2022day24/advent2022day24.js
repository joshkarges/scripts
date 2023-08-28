const {heapInsert} = require('../../heap');
const {getChildrenFn, getNextBestNode, askQuestion, setAlreadyExplored, createNodeFn} = require('./helpers');
const {printState} = require('./state');
const {end, MAX_ROW, MAX_COL} = require('./constants');


const run = async (startPos, endPos, startMinute) => {
  let currentNode;
  let notAtGoal = true;
  const createNode = createNodeFn(endPos);
  const nodesToExplore = [createNode(startPos[0], startPos[1], startMinute)];
  const getChildren = getChildrenFn(startPos, endPos);
  let iter = 0;
  while (notAtGoal) {
    // Get next state from the stack.
    currentNode = getNextBestNode(nodesToExplore);
    setAlreadyExplored(currentNode.pos[0], currentNode.pos[1], currentNode.minute);
    // if (++iter > 10) process.exit(1);
    
    notAtGoal = !endPos.every((coord, i) => coord === currentNode.pos[i]);
    if (!notAtGoal) break;
    
    // Get children
    const children = getChildren(currentNode);
    
    // Explore each viable child
    children.forEach(child => {
      // Pop each child on to the stack
      if (!nodesToExplore.some(({pos, minute}) => child.pos[0] === pos[0] && child.pos[1] === pos[1] && child.minute === minute)) heapInsert(nodesToExplore, child);
    });
    
    // console.log(`pos: ${currentNode.pos} | minute: ${currentNode.minute} | nodesToExplore: ${nodesToExplore.map(child => `[${child.pos}, ${child.minute}]`)}`);
    // printState(currentNode);
    // await askQuestion('Continue');
  }
  return currentNode;
}

const main = async () => {
  const trip1 = await run([0, 1], [MAX_ROW, MAX_COL - 1], 0);
  console.log(trip1);
  const trip2 = await run([MAX_ROW, MAX_COL - 1], [0, 1], trip1.minute);
  console.log(trip2);
  const trip3 = await run([0, 1], [MAX_ROW, MAX_COL - 1], trip2.minute);
  console.log(trip3);
};

main();