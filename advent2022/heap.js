const getHeapNodeVal = (node) => node?.cost ?? Infinity;

const heapGetVal = (heap, i) => {
  return getHeapNodeVal(heap[i]);
}

const swap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

const heapParent = (i) => Math.floor( (i - 1) / 2);

const heapChildLeft = (i) => 2 * i + 1;

const heapChildRight = (i) => 2 * i + 2;

const heapInsert = (heap, node) => {
  const nodeVal = getHeapNodeVal(node);
  let i = heap.push(node) - 1;
  let parentIdx = heapParent(i);
  let heapIsValid = heapGetVal(heap, parentIdx) < nodeVal;
  while (!heapIsValid && parentIdx >= 0) {
    swap(heap, parentIdx, i);
    i = parentIdx;
    parentIdx = heapParent(i);
    heapIsValid = heapGetVal(heap, parentIdx) < nodeVal;
  }
  return heap;
};

const heapExtractRoot = (heap) => {
  const root = heap[0];
  heap[0] = heap[heap.length - 1];
  heap.pop();
  if (!heap.length) return root;
  let curIdx = 0;
  let curVal = heapGetVal(heap, curIdx);
  let childLeftIdx = heapChildLeft(curIdx);
  let childRightIdx = heapChildRight(curIdx);
  let heapIsValid = curVal < heapGetVal(heap, childLeftIdx) && curVal < heapGetVal(heap, childRightIdx);
  while (!heapIsValid) {
    if (heapGetVal(heap, childLeftIdx) < heapGetVal(heap, childRightIdx)) {
      // Swap with left child
      swap(heap, childLeftIdx, curIdx);
      curIdx = childLeftIdx;
    } else {
      // Swap with right child
      swap(heap, childRightIdx, curIdx);
      curIdx = childRightIdx;
    }
    childLeftIdx = heapChildLeft(curIdx);
    childRightIdx = heapChildRight(curIdx);
    heapIsValid = curVal < heapGetVal(heap, childLeftIdx) && curVal < heapGetVal(heap, childRightIdx);
  }
  return root;
};

module.exports = {
  heapInsert,
  heapExtractRoot,
};