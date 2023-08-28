const { split } = require("lodash");

const input = `abcccccccccaaaaaaaaaaccccccccccccaaaaaaaaccaaccccccccccccccccccccccccccccccccccccccccccccaaaaaa
abccccccccccaaaaaaaaaccccccccccccaaaaaaaaaaaacccccccccccaacccacccccccccccccccccccccccccccaaaaaa
abcccccccccccaaaaaaacccccccccccccaaaaaaaaaaaaaacccccccccaaacaacccccccccaaaccccccccccccccccaaaaa
abccccccccccaaaaaaccccccccccccccaaaaaaaaaaaaaaaccccccccccaaaaaccccccccccaaacccccccccccccccccaaa
abccccccccccaaaaaaaccccccccccccaaaaaaaaaaaaaacccccccccccaaaaaacccccccccaaaacccccccccccccccccaac
abaaccaaccccaaccaaaccccccccaaaaaaaaaaaaaaacaaccccccccccaaaaaaaacccccccccaaalcccccccccccccccaaac
abaaaaaacccccccccaaccccccccaaaaaacccaaaacccaaccccccccccaaaaaaaaccccccccalllllllcccccccccccccccc
abaaaaaacccccccaaacccccccccaaaaccccccaaaccccaaaaacccccccccaacccccccaaaakllllllllcccccccaacccccc
abaaaaaacccccccaaaacccccccccaacccccccaaaccccaaaaacccccccccaacccccccaakkklllpllllccccacaaacccccc
abaaaaaaaccccccaaaaccccaaccccccccccccccccccaaaaaaccccccccccccccccccckkkkpppppplllcccaaaaaaacccc
abaaaaaaacaaaccaaaaccaaaaaaccccccccccccccccaaaaaacccccccaaaccccckkkkkkkpppppppplllcddaaaaaacccc
abcaaaacccaacccccccccaaaaaacccccaaaccccccccaaaaaacccccccaaaaccjkkkkkkkpppppuppplmmdddddaaaccccc
abccaaaaaaaaaccccccccaaaaaaccccaaaaaacccccccaaacccccccccaaaajjjkkkkkrpppuuuuupppmmmdddddacccccc
abccccaaaaaaaacccccccaaaaacccccaaaaaacccccccccccccccccccaaacjjjjrrrrrrppuuuuupqqmmmmmddddaccccc
abccccaaaaaaaaacccccccaaaacccccaaaaaaccccccccccccccccccccccjjjrrrrrrrrpuuuxuvvqqqmmmmmddddccccc
abccccaaaaaaaaacccccccccccccccccaaaaaccccaacccaccccccccaaccjjjrrrruuuuuuuxxyvvqqqqqmmmmmdddcccc
abccccaaaaaaaacccccccccaaaccccccaacaaccccaaacaacccaaacaaaccjjjrrrtuuuuuuuxxyvvvqqqqqmmmmdddcccc
abccaaaaaaaacccccccccccaaaaaccccccccccccccaaaaacccaaaaaaaccjjjrrttttxxxxxxyyvvvvvqqqqmmmmdeeccc
abccaaaccaaaccccccccaacaaaaacccccccccccccaaaaaacccaaaaaacccjjjrrtttxxxxxxxyyvvvvvvvqqqmmmeeeccc
abaaaaaaaaaacccaaaccaaaaaaaaaaaccaaaccccaaaaaaaacccaaaaaaaajjjqqrttxxxxxxxyyyyyyvvvqqqnnneeeccc
SbaaaaaaaaccccaaaaccaaaaaaaaaaaaaaaaacccaaaaaaaaccaaaaaaaaacjjjqqtttxxxxEzzyyyyvvvvqqqnnneeeccc
abcaaaaaacccccaaaaccccaaaaaaaccaaaaaaccccccaaccccaaaaaaaaaaciiiqqqtttxxxyyyyyyvvvvrrrnnneeecccc
abcaaaaaacccccaaaacccaaaaaaaaccaaaaaaccccccaaccccaaacaaacccciiiqqqqttxxyyyyyywvvvrrrnnneeeecccc
abcaaaaaaccccccccccccaaaaaaaaacaaaaacccccccccccccccccaaaccccciiiqqtttxxyyyyyywwrrrrnnnneeeccccc
abcaaacaacccccaacccccaaaaaaaaacaaaaacccccccccccccccccaaaccccciiiqqttxxxywwyyywwrrrnnnneeecccccc
abccccccccaaacaaccccccccccacccccccccccccccccccccccccccccccccciiqqqttxxwwwwwwywwrrrnnneeeccccccc
abccaacccccaaaaaccccccccccccccccccccccccccccccccccccccccaacaaiiqqqttwwwwsswwwwwrrrnnfffeccccccc
abaaaaccccccaaaaaacccccccccccccccccccccccccccccaaaccccccaaaaaiiqqqttssssssswwwwrrronfffaccccccc
abaaaaaacccaaaaaaacccccccccccccccccccccccccccaaaaaacccccaaaaaiiqqqssssssssssswrrrooofffaaaacccc
abaaaaaaccaaaaaacccccccccccccccccccccccccccccaaaaaacccccaaaaaiiqqqppssspppssssrrrooofffaaaacccc
abaaaaaaccaacaaacccccccccccccccccccccccccccccaaaaaacccccaaaaaiihpppppppppppossrrooofffaaaaacccc
abaaaaccccccccaacccccccccccccccccccccccccccccaaaaaccccccccaaahhhhppppppppppoooooooofffaaaaccccc
abaaaaccccccccccaacccccccccccccccccaaacccccccaaaaacccccccccccchhhhhhhhhhggpoooooooffffaaaaccccc
abccaacccccccacaaaccccccccccccccccaaaaacccccccccccccccccccccccchhhhhhhhhggggoooooffffaacaaacccc
abccccccccccaaaaacaaccccccccccccccaaaaaccccccccccccccccccccccccchhhhhhhhggggggggggffcaacccccccc
abccccccccccaaaaaaaaccccccccccccccaaaacccaacccccccccccaccccccccccccccaaaaaggggggggfcccccccccccc
abccccccccccccaaaaaccccaacccccccccaaaacaaaaccccccccaaaaccccccccccccccaaaacaaagggggcccccccccaccc
abcccccccccccaaaaacccccaacccccccccaaaaaaaaaccccccccaaaaaaccccccccccccaaaccaaaacccccccccccccaaac
abcccccccccccaacaaccaaaaaaaacccaaaaaaaaaaaccccccccccaaaaccccccccccccccaccccaaacccccccccccccaaaa
abccccccccccccccaaccaaaaaaaaccaaaaaaaaaaaccccccccccaaaaacccccccccccccccccccccacccccccccccccaaaa
abccccccccccccccccccccaaaaacccaaaaaaaaaaaacccccccccaacaacccccccccccccccccccccccccccccccccaaaaaa`;

const input2 = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const startingPosition = [-1,-1];
const endingPosition = [0,0];

const graph = input.split('\n')
  .map((line, r) => line.split('')
    .map((char, c) => {
      // if (char === 'S') {
      //   startingPosition[0] = r;
      //   startingPosition[1] = c;
      //   return 1;
      // }
      if (char === 'E') {
        endingPosition[0] = r;
        endingPosition[1] = c;
        return 26;
      }
      return char.charCodeAt(0) - 96;
    }));

const getPos = (matrix, pos) => matrix[pos[0]]?.[pos[1]];
const setPos = (matrix, pos, val) => {
  if (pos[0] >= 0 && pos[0] < matrix.length && pos[1] >= 0 && pos[1] < matrix[pos[0]].length) {
    matrix[pos[0]][pos[1]] = val
  }
};
const addPos = (pos1, pos2) => [pos1[0] + pos2[0], pos1[1] + pos2[1]];
const subPos = (pos1, pos2) => [pos1[0] - pos2[0], pos1[1] - pos2[1]];
const isEqual = (pos1, pos2) => pos1[0] === pos2[0] && pos1[1] === pos2[1];

const open = Array.from(graph, () => Array.from(graph[0], () => 0));
const dist = Array.from(graph, () => Array.from(graph[0], () => Infinity));
// setPos(open, startingPosition, 1);
// setPos(dist, startingPosition, 0);

const allAs = graph.reduce((agg, row, r) => {
  row.forEach((height, c) => {
    if (height === 1) agg.push([r, c]);
  })
  return agg;
}, []);

allAs.forEach(a => setPos(dist, a, 0));

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const getChildren = (graph, open, pos) => {
  const posHeight = getPos(graph, pos);
  return DIRS.map((dir) => addPos(pos, dir))
    .filter(child => (getPos(graph, child) <= (posHeight +1)) && !getPos(open, child));
};

const chooseNextChild = (dist, openStack) => {
  const nextChildObj = openStack.reduce((best, child, i) => {
    const childDist = getPos(dist, child) + subPos(endingPosition, child).reduce((a, x) => a + Math.abs(x), 0);
    // console.log(`child: ${child} | childDist: ${childDist}`);
    if (childDist < best.dist) {
      best.dist = childDist;
      best.pos = child;
      best.idx = i;
    }
    return best;
  }, {dist: Infinity, pos: [0, 0], idx: -1});
  openStack.splice(nextChildObj.idx, 1);
  return nextChildObj.pos;
}

const openStack = [...allAs];
let numIterations = 0;

while (openStack.length) {
  // console.log(`open: ${JSON.stringify(openStack)}`);
  const curPos = chooseNextChild(dist, openStack);
  setPos(open, curPos, 1);
  // console.log(`curPos: ${curPos}`);
  if (isEqual(curPos, endingPosition)) {
    console.log(JSON.stringify(open.map(line => line.join('')), null, 2));
    console.log(`finalDist: ${getPos(dist, curPos)}`);
    process.exit(0);
  }
  const children = getChildren(graph, open, curPos);
  // console.log(children);
  children.forEach(child => {
    const distToChild = getPos(dist, curPos) + 1;
    const curDistToChild = getPos(dist, child);
    // console.log(`distToChild: ${distToChild}`);
    if (distToChild < curDistToChild) {
      // if (curDistToChild !== Infinity) console.log(`curDistToChild: ${curDistToChild}`);
      setPos(dist, child, distToChild);
      if (!openStack.some(open => isEqual(open, child))) openStack.push(child);
    }
    numIterations++;
    if (numIterations === 800) {
      console.log(JSON.stringify(dist.map(line => line.map(x => x === Infinity ? '00' : x.toString().padStart(2, 0)).join(',')), null, 2));
    }
    // console.log(JSON.stringify(dist.map(line => line.toString()), null, 2));
  });
}
console.log(JSON.stringify(dist.map(line => line.toString()), null, 2));
console.log('fail');
return Infinity;