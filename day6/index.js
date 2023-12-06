const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
// const data = `
// Time:      7  15   30
// Distance:  9  40  200
// `;
const cleanData = data.split("\n").filter((v) => v !== '');

const raceTime = cleanData[0].match(/\d{1,}/g).map(v => parseInt(v));
const raceDistance = cleanData[1].match(/\d{1,}/g).map(v => parseInt(v));

const results = [];

function calculateDistances(raceTime, raceDistance) {
    const distances = [];
    let i = 0;

    for (const time of raceTime) {
        let attempts = 0;
    
        const distanceResult = {
            race: time,
            raceDistance: raceDistance[i],
            distances: [],
        };
    
        while (attempts < time) {
            let speed = 0;
            let startTime = 0;
            let hold = attempts;
            let distance = 0;
    
            while (startTime < time) {
                const result = {
                    attempt: attempts, 
                    time: startTime,
                    hold: hold,
                };
    
                if (hold > 0) {
                    speed++;
                    hold--;
                } else {
                    distance += speed;
                }
                
                result.distance = distance;
                result.speed = speed;
    
                results.push(result);
    
                startTime++;
            }
    
            distanceResult.distances.push(distance);
            
            attempts++;
        }
    
        distances.push(distanceResult);
        i++;
    }

    return distances;
}

function calculateWinningRaces(time, target) {
    console.log(time, target)
    let attempts = 0;
    let winning = 0;

    while (attempts < time) {
        let speed = 0;
        let startTime = 0;
        let hold = attempts;
        let distance = 0;

        while (startTime < time) {
            const result = {
                attempt: attempts, 
                time: startTime,
                hold: hold,
            };

            if (hold > 0) {
                speed++;
                hold--;
            } else {
                distance += speed;
            }

            startTime++;
        }

        if (distance >= target) {
            winning++;
        }
        
        attempts++;
    }

    return winning;
}

function calculateMargin(distances) {
    let margin = 0;

    for (const raceDistance of distances) {
        const winning = raceDistance.distances.filter(v => v > raceDistance.raceDistance);
        console.log(winning.length)
        margin = margin === 0 ? winning.length : margin * winning.length;
    }

    return margin;
}

const distances = calculateDistances(raceTime, raceDistance);

console.log(`Part 1: ${calculateMargin(distances)}`);

const part2 = calculateWinningRaces(parseInt(raceTime.reduce((acc, curr) => acc + String(curr), '')), parseInt(raceDistance.reduce((acc, curr) => acc + String(curr), '')))

console.log(`Part 2: ${part2}`)
