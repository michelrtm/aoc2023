const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
const cleanData = data.split("\n").filter((v) => v !== '');

let points = 0, winningCards = [];

for (let i = 0; i < cleanData.length; i++) {
    const numbers = cleanData[i].replace(/^Card\s{1,3}\d{1,3}:\s/, '').split(' | ');
    const winning = numbers[0].match(/\d{1,2}/g);
    const playing = numbers[1].match(/\d{1,2}/g);

    const common = winning.filter(v => playing.indexOf(v) > -1);

    let cardPoints = 0;

    if (common.length > 0) {
        cardPoints += common.reduce((acc, curr) => acc === 0 ? acc + 1 : acc * 2, 0);
    }

    winningCards.push({id: i, won: common.length})

    points += cardPoints;
}

let finalCards = Array(cleanData.length).fill(1);

for (let j = 0; j < winningCards.length; j++) {
    if (winningCards[j].won > 0) {
        for (let k = 0; k < winningCards[j].won; k++) {
            for (let l = 0; l < finalCards[j]; l++) {
                if (finalCards[j + 1 + k]) {
                    finalCards[j + 1 + k] = finalCards[j + 1 + k] + 1;
                }
            }
        }
    }
}

console.log(`Part 1: ${points}`)
console.log(`Part 2: ${finalCards.reduce((acc, curr) => acc + curr, 0)}`)