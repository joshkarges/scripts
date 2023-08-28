const pointsAreEqual = (a: [number, number], b: [number, number]): boolean => {
  return a[0] === b[0] && a[1] === b[1];
};


// TODO: make enqueue and dequeue O(logn)
class PriorityQueue {
  values: [number, [number, number]][] = [];
  enqueue(val: [number, number], priority: number) {
      this.values.push([priority, val]);
      this.sort();
  }
  dequeue() {
      return this.values.shift()[1];
  }
  sort() {
      this.values.sort((a, b) => a[0] - b[0]);
  }
  isEmpty() {
      return this.values.length === 0;
  }
  has(val: [number, number]) {
      return this.values.some((el) => pointsAreEqual(el[1], val));
  }
}

const heuristic = (a: [number, number], b: [number, number]): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

const reconstructPath = (cameFrom: Map<[number, number], [number, number]>, current: [number, number]): [number, number][] => {
  const totalPath = [current];
  while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      totalPath.push(current);
  }
  return totalPath.reverse();
}

const getNeighbors = (current: [number, number], grid: number[][]): [number, number][] => {
  const neighbors = [];
  const [row, col] = current;
  if (row > 0 && grid[row - 1][col] === 0) {
      neighbors.push([row - 1, col]);
  }
  if (row < grid.length - 1 && grid[row + 1][col] === 0) {
      neighbors.push([row + 1, col]);
  }
  if (col > 0 && grid[row][col - 1] === 0) {
      neighbors.push([row, col - 1]);
  }
  if (col < grid[0].length - 1 && grid[row][col + 1] === 0) {
      neighbors.push([row, col + 1]);
  }
  return neighbors;
};

const aStarPath = (start: [number, number], end: [number, number], grid: number[][]): [number, number][] => {
  const openSet = new PriorityQueue();
  openSet.enqueue(start, 0);
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));
  while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      if (pointsAreEqual(current, end)) {
          return reconstructPath(cameFrom, current);
      }
      for (const neighbor of getNeighbors(current, grid)) {
          const tentativeGScore = gScore.get(current) + 1;
          if (tentativeGScore < gScore.get(neighbor)) {
              cameFrom.set(neighbor, current);
              gScore.set(neighbor, tentativeGScore);
              fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, end));
              if (!openSet.has(neighbor)) {
                  openSet.enqueue(neighbor, fScore.get(neighbor));
              }
          }
      }
  }
  return [];
}
