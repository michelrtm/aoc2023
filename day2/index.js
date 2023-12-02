const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split("\n").filter(v => v != '')

let ids = [], pows = [];

const arrangement = {
    r: 12,
    g: 13,
    b: 14,
};

for (let i = 0; i < cleanData.length; i++) {
    const id = cleanData[i].match(/\d{1,3}/)[0];
    const draws = cleanData[i].split(": ")[1].split(/\W\s/g);

    let possible = true;

    const min= {
        r:0,g:0,b:0
    }

    for (let j = 0; j < draws.length; j++) {
        const value = parseInt(draws[j].match(/\d{1,3}/)[0]);

        if (draws[j].match(/red$/)) {
            if(parseInt(value) > arrangement.r) possible = false;
            if (parseInt(value) > min.r) min.r = value
        }
        if (draws[j].match(/green$/) ) {
            if(parseInt(value) > arrangement.g) possible = false;
            if (parseInt(value) > min.g) min.g = value
        }
        if (draws[j].match(/blue$/) ) {
            if(parseInt(value) > arrangement.b) possible = false;
            if (parseInt(value) > min.b) min.b = value
        }        
    }

    if (possible) ids.push(id);
    pows.push(min.r * min.g * min.b);
}

console.log(`Part 1: ${ids.reduce((acc, curr) => { return acc + parseInt(curr); }, 0)}`);
console.log(`Part 2: ${pows.reduce((acc, curr) => { return acc + curr; }, 0)}`);