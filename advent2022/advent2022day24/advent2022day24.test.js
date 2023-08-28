const {heapInsert, heapExtractRoot} = require('../../heap');
const { createNode } = require('./helpers');
const {printState, state, getRC, getRCFree, printAllMaps} = require('./state');

const heap = [1,3, 5, 7].map(x => ({cost: x}));
const newHeap = heapInsert(heap, {cost: 4});
const expected1 = [1, 3, 5, 7, 4].map(x => ({cost: x}));
if (newHeap.every((node, i) => node.cost === expected1[i]?.cost)) {
  console.log('PASSED');
} else {
  console.log('FAILED', newHeap, expected1);
}

const heap2 = [1,3, 5, 7].map(x => ({cost: x}));
const newHeap2 = heapInsert(heap2, {cost: 2});
const expected2 = [1, 2, 5, 7, 3].map(x => ({cost: x}));
if (newHeap2.every((node, i) => node.cost === expected2[i]?.cost)) {
  console.log('PASSED');
} else {
  console.log('FAILED', newHeap2, expected2);
}

const heap3 = [1, 3, 5, 7].map(x => ({cost: x}));
const root = heapExtractRoot(heap3);
const expected3 = [3, 7, 5].map(cost => ({cost}));
if (heap3.every((node, i) => node.cost === expected3[i]?.cost) && root.cost === 1) {
  console.log('PASSED');
} else {
  console.log('FAILED', root.cost, heap3, expected3);
}

const heap4 = [ { cost: 11, pos: [ 0, 1 ], minute: 0 } ];
const root4 = heapExtractRoot(heap4);
const expected4 = [];
if (heap4.every((node, i) => node.cost === expected4[i]?.cost) && root4.cost === 11) {
  console.log('PASSED');
} else {
  console.log('FAILED', root.cost, heap4, expected4);
}

// printState(createNode(0, 1, 0));
// printState(createNode(0, 1, 1));
// printState(createNode(0, 1, 2));
// printState(createNode(0, 1, 3));
// printState(createNode(0, 1, 4));
// printState(createNode(0, 1, 5));
printAllMaps(createNode(0, 1, 0));
printState(createNode(0, 1, 0));
printAllMaps(createNode(0, 1, 10));
printState(createNode(0, 1, 10));
printAllMaps(createNode(0, 1, 11));
printState(createNode(0, 1, 11));