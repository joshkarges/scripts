const input1 = `12-1
1=-20
1=112011=
1=212=01
2--2-=
11-2-0201-1
1--=1-110=00===-
1=2==221011==22
22=0=
20---
1==00-121=
2-2=--00
1110=22-10=1=12
1-1===22-1-=2
1010-22-2-121-1
111
1121102
1=-11
102=0-=-2-2=--1-2
2-
22-=000=1=-==
2011-=1221
211=02
1=-002
10---21102
1-00=2-1==-0
1012=22-22-
10-01====-010
22120020121=20
1-01=002=1=-122=
1-101-==1
1=01=1-===--
21122
120=2=1102=1
10=20=2==20
1111200=221-1=--2
1==2-=1
11=1=2-1-21-=1
2-02=0==-1---
120
12
10-0=-=2==2120=-
1-=0
2==-=202-11110=020
1-=212=0212--02---=0
2-=1-2=22=
1=-2-1===200-0=1
10-110
200=-2
210=-21=021-=-12-
2=-2122-20-11=
2=1-1
202=1-20=0--11
12200202
1-2-21-
100=-2
2101010-022
1=-===010=1--1-2
10-=2020===0021
11=10=0=22-10=2=
12-221-2==21=-1
1=-01--00-
21100==-0=120-=0--2
122=1-220-010-0=
120-=-0==--01222-1
1=220=1==122-1-=22
112=1-2=001-
21-012
1=21=10=1==2
2=-=--112=1---
2-=
12020-022-210
1=122==-20-12220-
20=-021-22
1=2-020
101-
2==-010=20-120
10-2=110=
2=22
1=2=0112=22-1-=2
20=0-22---0012=2-
10121-=0=1
1--2=
1=--10222-1-2-1-2-
212-01220=-=
1-=-0==0=0
10102-
20-2-1=-120212-1
2=01=
10101-100-1-=10
210=0----00=21-
1--
111-2=2=22--=
12-22-102==1-21-=
21-2==11
1-=-2
22=1=22-0=-20
120-=
1=20=20
2=12-12-=-
1=2--0-012=
1-2=221102
1=211=-===11-11
21-==-01=0210--
1110-=02001
2=12
1===11=1-1-2=
212=11=11=12000
20=12-02=-=201==-
2==-=21-2=01=01-2
1-==1=0-02=
211==--22
1-2-02=0=12=1-=1211
12122-021==
1-==2110021
11210211==11=
1=-
112=12-
1-
1==-1=-110
2-2100210
2-=1---1-02220201
1201-0
1---02=-2--=-2`;

const input2 = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

const SNAFU_TO_DECIMAL = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
};

const DECIMAL_TO_SNAFU = Object.keys(SNAFU_TO_DECIMAL).reduce((agg, key) => {
  agg[SNAFU_TO_DECIMAL[key]] = key;
  return agg;
}, {});

const matrix = input1.split('\n').map(row => row.split('').map(x => SNAFU_TO_DECIMAL[x]).reverse());
console.log('here');
const decimalSum =matrix.reduce((totalSum, row) => {
  return totalSum + row.reduce((rowSum, x, i) => {
    // const digit = row.length - i - 1;
    const digit = i;
    return rowSum + x * (5**digit);
  }, 0);
}, 0);

console.log(decimalSum);

const decimalToSnafu = (decimal) => {
  let digit = 0;
  let cap = 5 ** digit;
  while (decimal > cap) {
    cap -= 3 * 5 ** digit;
    digit++;
    cap += 5 ** digit;
  }
  // console.log(`decimal: ${decimal} | cap: ${cap} | digit: ${digit} | `);

  if (decimal === cap) {
    cap += 2*5**(digit);
    digit++;
  }

  let fives = (decimal + (cap - 1));
  // console.log(`fives: ${fives}`);
  const result = [];
  digit--;
  while (fives > 0) {
    const fivesDigit = Math.floor(fives / (5**digit));
    result.push(fivesDigit);
    fives -= fivesDigit * 5**digit;
    // console.log(fives);
    if (fives === 0) {
      // Fill the rest with zeros
      result.push(...Array.from(Array(digit), () => 0));
      break;
    }
    digit--;
  }
  return result.map(x => DECIMAL_TO_SNAFU[x - 2]).join('');
}

// console.log(decimalToSnafu(1))
// console.log(decimalToSnafu(2))
// console.log(decimalToSnafu(3))
// console.log(decimalToSnafu(4))
// console.log(decimalToSnafu(5))
// console.log(decimalToSnafu(6))
// console.log(decimalToSnafu(7))
// console.log(decimalToSnafu(8))
// console.log(decimalToSnafu(9))
// console.log(decimalToSnafu(10))
// console.log(decimalToSnafu(15))
// console.log(decimalToSnafu(20))
// console.log(decimalToSnafu(2022))
// console.log(decimalToSnafu(12345))
// console.log(decimalToSnafu(314159265))
console.log(decimalToSnafu(decimalSum));
