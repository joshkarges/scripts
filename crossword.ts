/*
. a b c .
. d e . f
g h i j k
. . . . l
*/

const getWords = (puzzle: (string | null)[][]) => {
  const aWords = {} as { [coord: string]: { word: string, clueCount: number } };
  const dWords = {} as { [coord: string]: { word: string, clueCount: number } };
  let clueCounter = 0;
  puzzle.forEach((row, r) => row.forEach((char, c) => {
    if (!char) return;
    const currCoord = `${r},${c}`;
    const aParentCoord = `${r},${c - 1}`;
    const dParentCoord = `${r - 1},${c}`;
    const nextClueCount = clueCounter++;
    aWords[currCoord] = {
      word: ((aWords[aParentCoord] && aWords[aParentCoord].word) || '') + char,
      clueCount: aWords[aParentCoord] ? aWords[aParentCoord].clueCount : nextClueCount
    };
    dWords[currCoord] = {
      word: ((dWords[dParentCoord] && dWords[dParentCoord].word) || '') + char,
      clueCount: dWords[dParentCoord] ? dWords[dParentCoord].clueCount : nextClueCount
    };
    if (aWords[aParentCoord]) delete aWords[aParentCoord];
    if (dWords[dParentCoord]) delete dWords[dParentCoord];
  }));
  clueCounter = 0;
  let prevRawClueCount = -1;
  return [
    ...Object.values(aWords).filter(wordClue => wordClue.word.length > 1).map(wordClue => ({ ...wordClue, direction: 'across' })),
    ...Object.values(dWords).filter(wordClue => wordClue.word.length > 1).map(wordClue => ({ ...wordClue, direction: 'down' })),
  ].sort((a, b) => a.clueCount - b.clueCount).reduce((p, wordClueDir, i) => {
    const newClueCount = prevRawClueCount === wordClueDir.clueCount ? clueCounter : ++clueCounter;
    p.push(({ ...wordClueDir, clueCount: newClueCount }));
    prevRawClueCount = wordClueDir.clueCount;
    return p;
  }, []);
};

const puzzle1 = `. a b c .
. d e . f
g h i j k
. . . . l`.split('\n').map(row => row.split(' ').map(char => char === '.' ? null : char));

console.log(getWords(puzzle1));