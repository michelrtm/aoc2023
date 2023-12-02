const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
const cleanData = data.split("\n").filter((v) => v!=='');

const map = {
    'one': 'o1e',
    'two': 't2o',
    'three': 't3e',
    'four': 'f4r',
    'five': 'f5e',
    'six': 's6x',
    'seven': 's7n',
    'eight': 'e8t',
    'nine': 'n9n',
};

let p1 = cleanData.reduce((acc, curr) => {
    let first = curr.match(/(\d)/)[0];
    let last = [...curr].reverse().join('').match(/(\d)/)[0];

    return acc + parseInt(first + last);
}, 0);

let p2 = cleanData.reduce((acc, curr) => {
    let line = curr;

    while(line.match(/one|two|three|four|five|six|seven|eight|nine/g)) {
        line = line.replace(/one|two|three|four|five|six|seven|eight|nine/g, function (m) {
            return map[m] || m;
        });
    }
    
    let first = line.match(/(\d)/)[0];
    let last = [...line].reverse().join('').match(/(\d)/)[0];

    return acc + parseInt(first + last);
}, 0);

console.log(`Part 1 - ${p1}`)
console.log(`Part 2 - ${p2}`)