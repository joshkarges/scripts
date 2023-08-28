/*
. a b c .
. . d . e
f g h i j
. . . . k
*/
const getWords = (puzzle) => {
    const aWords = {};
    const dWords = {};
    puzzle.forEach((row, r) => row.forEach((char, c) => {
        if (!char)
            return;
        const currCoord = `${r},${c}`;
        const aParentCoord = `${r},${c - 1}`;
        const dParentCoord = `${r - 1},${c}`;
        aWords[currCoord] = (aWords[aParentCoord] || '') + char;
        dWords[currCoord] = (dWords[dParentCoord] || '') + char;
        if (aWords[aParentCoord])
            delete aWords[aParentCoord];
        if (dWords[dParentCoord])
            delete dWords[dParentCoord];
    }));
    return {
        acrossWords: Object.values(aWords).filter(word => word.length > 1),
        downWords: Object.values(dWords).filter(word => word.length > 1),
    };
};
const puzzle1 = `. a b c .
. . d . e
f g h i j
. . . . k`.split('\n').map(row => row.split(' ').map(char => char === '.' ? null : char));
console.log(getWords(puzzle1));
