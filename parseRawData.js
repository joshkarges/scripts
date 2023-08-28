const path = require("path");
const fs = require('fs')

const input1 = fs.readFileSync(path.join(__dirname, "rawData.txt"), "utf8")
  .toString();

console.log(input1.slice(40912169-500, 40912169+500));
console.log(input1.match(/NaN/g).length);