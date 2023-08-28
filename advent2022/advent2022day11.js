const input = `Monkey 0:
Starting items: 84, 66, 62, 69, 88, 91, 91
Operation: new = old * 11
Test: divisible by 2
  If true: throw to monkey 4
  If false: throw to monkey 7

Monkey 1:
Starting items: 98, 50, 76, 99
Operation: new = old * old
Test: divisible by 7
  If true: throw to monkey 3
  If false: throw to monkey 6

Monkey 2:
Starting items: 72, 56, 94
Operation: new = old + 1
Test: divisible by 13
  If true: throw to monkey 4
  If false: throw to monkey 0

Monkey 3:
Starting items: 55, 88, 90, 77, 60, 67
Operation: new = old + 2
Test: divisible by 3
  If true: throw to monkey 6
  If false: throw to monkey 5

Monkey 4:
Starting items: 69, 72, 63, 60, 72, 52, 63, 78
Operation: new = old * 13
Test: divisible by 19
  If true: throw to monkey 1
  If false: throw to monkey 7

Monkey 5:
Starting items: 89, 73
Operation: new = old + 5
Test: divisible by 17
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 6:
Starting items: 78, 68, 98, 88, 66
Operation: new = old + 6
Test: divisible by 11
  If true: throw to monkey 2
  If false: throw to monkey 5

Monkey 7:
Starting items: 70
Operation: new = old + 7
Test: divisible by 5
  If true: throw to monkey 1
  If false: throw to monkey 3`;


const input2 = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

const stringToItems = (line, divisors) => {
  const {itemsStr = ''} = line.match(/(?<itemsStr>(\d+(, )?)+)/)?.groups ?? {};
  return itemsStr.split(', ').map(x => {
    const modMap = new Map();
    divisors.forEach(divisor => modMap.set(divisor, +x % divisor));
    return modMap;
  });
};

const stringToOperation = (line) => {
  const {operator = '+', operand2 = '0'} = line.match(/(?<operator>[\+\*]) (?<operand2>(\d+|old))/)?.groups ?? {};
  switch (operator) {
    case '+':
      return operand2 === 'old' ?
      (old) => old.forEach((m, d, map) => map.set(d, (m + m) % d)) :
      (old) => old.forEach((m, d, map) => map.set(d, (m + +operand2) % d));
      case '*':
      return operand2 === 'old' ?
        (old) => old.forEach((m, d, map) => map.set(d, (m * m) % d)) :
        (old) => old.forEach((m, d, map) => map.set(d, (m * +operand2) % d));
    default:
      return () => 0;
  }
};

const stringToTest = (lines) => {
  const {divisorStr = '1'} = lines[0].match(/divisible by (?<divisorStr>\d+)/).groups ?? {};
  const divisor = +divisorStr;
  const trueMonkey = lines[1][lines[1].length - 1];
  const falseMonkey = lines[2][lines[2].length - 1];
  // return (value) => value % divisor ? falseMonkey : trueMonkey;
  return (modMap) => modMap.get(divisor) ? falseMonkey : trueMonkey;
};

let monkeys = [];

class Monkey {
  constructor(lines, divisors) {
    const {id = 0} = lines[0].match(/Monkey (?<id>\d+):/)?.groups ?? {};
    this.id = id;
    this.items = stringToItems(lines[1], divisors);
    this.operation = stringToOperation(lines[2]);
    this.test = stringToTest(lines.slice(3));
    this.numInspections = 0;
  }

  inspect() {
    if (!this.items.length) return false;
    this.numInspections++;
    // Look at fist item
    const item = this.items.shift();
    // Set new worry level
    // const newWorry = Math.floor(this.operation(item) / 3);
    this.operation(item);
    // Throw to new monkey
    const throwId = this.test(item);
    monkeys[throwId]?.receive(item);
    return true;
  }

  receive(item) {
    // Add item to end of items list
    this.items.push(item);
  }
}

const divisors = input.match(/divisible by \d+/g).map(s => +s.match(/divisible by (?<divisor>\d+)/)?.groups.divisor);

const monkeyParagraphs = input.split('\n\n');
monkeys = monkeyParagraphs.map(par => {
  const lines = par.split('\n');
  return new Monkey(lines, divisors);
});


const round = () => {
  monkeys.forEach(monkey => {
    Array.from(monkey.items).forEach(i => monkey.inspect());
  });
  // monkeys.forEach(monkey => {
  //   console.log(monkey.id, monkey.items);
  // });
};

Array.from(Array(10000)).forEach(x => {
  round();
});

console.log(monkeys.map(m => m.numInspections));

const topTwoInspectionNums = monkeys.map(m => m.numInspections).sort((a, b) => a - b).slice(-2);
console.log(topTwoInspectionNums.reduce((a, b) => a * b, 1));
