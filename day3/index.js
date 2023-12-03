const fs = require('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
const cleanData = data.split("\n").filter((v) => v !== '');

function scanLine(line, x) {
    const values = [];
    const re = /\d{1,}/g;

    while (match = re.exec(line)) {
        if ((match.index <= x && match.index + match[0].length >= x) || match.index == x + 1) {
            values.push(match[0]);
        }
    }

    return values;
}

let parts = [];
let gearRatios = [];

for (let y = 0; y < cleanData.length; y++) {
    const line = cleanData[y].split('');

    for (let x = 0; x < line.length; x++) {
        if (line[x].match(/\W/)) {
            let partNumbers = []

            if (line[x] !== '.') {
                //up
                if (y > 0) {
                    partNumbers = partNumbers.concat(scanLine(cleanData[y - 1], x));
                }
                //down
                if (y < cleanData.length) {
                    partNumbers = partNumbers.concat(scanLine(cleanData[y + 1], x)); //left
                }
                //current
                partNumbers = partNumbers.concat(scanLine(cleanData[y], x));
            }

            parts = parts.concat(partNumbers);

            if (line[x] === '*') {
                if (partNumbers.length == 2) {
                    gearRatios.push(parseInt(partNumbers[0]) * parseInt(partNumbers[1]));
                }
            }
        }
    }
}

console.log(`Part 1: ${parts.reduce((acc, curr) => acc + parseInt(curr), 0)}`)
console.log(`Part 2: ${gearRatios.reduce((acc, curr) => acc + parseInt(curr), 0)}`)