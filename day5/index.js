const fs = require('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
// const data = `
// seeds: 79 14 55 13

// seed-to-soil map:
// 50 98 2
// 52 50 48

// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15

// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4

// water-to-light map:
// 88 18 7
// 18 25 70

// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13

// temperature-to-humidity map:
// 0 69 1
// 1 0 69

// humidity-to-location map:
// 60 56 37
// 56 93 4
// `;

const cleanData = data.split("\n\n").filter((v) => v !== '').map((v) => v.replace("\n", ''));

function getMap(data = [], type) {
    const map = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].match((new RegExp(`^${type}`)))) {
            const definitions = data[i].split(':')[1].split('\n').filter(v => v !== '');
            for (let definition of definitions) {
                let [destRangeStart, sourceRangeStart, length] = definition.match(/\d{1,}/g);
                map.push({
                    name: type,
                    destRangeStart: parseInt(destRangeStart),
                    sourceRangeStart: parseInt(sourceRangeStart),
                    length: parseInt(length)
                });
            }
        }
    }

    return map;
}

const seedToSoil = getMap(cleanData, "seed-to-soil");
const soilToFertilizer = getMap(cleanData, "soil-to-fertilizer")

const fertilizerToWater = getMap(cleanData, "fertilizer-to-water");
const waterToLight = getMap(cleanData, "water-to-light");
const lightToTemperature = getMap(cleanData, "light-to-temperature");
const temperatureToHumidity = getMap(cleanData, "temperature-to-humidity");
const humidityToLocation = getMap(cleanData, "humidity-to-location");

const seeds = cleanData[0].split(':')[1].match(/\d{1,}/g);

const orderedMaps = [
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation
];

function findInMap(needle, maps) {
    let found;

    for (const map of maps) {
        if (needle >= map.sourceRangeStart && needle < map.sourceRangeStart + map.length) {
            found = (needle - map.sourceRangeStart) + map.destRangeStart;
        }
    }

    return found;
}

function iterateMaps(values = [], maps = []) {
    const iteration = {
        map: maps[0].name,
        source: values,
        values: [],
        results: [],
    }

    const copy = [...values];

    let value = copy.shift();

    while (value) {
        let current = parseInt(value);

        const result = {
            original: value,
            found: parseInt(value)
        }

        let found = findInMap(current, maps);

        if (found) {
            result.found = found;
        }

        result.map = maps[0].name;

        iteration.values.push(result.found);
        iteration.results.push(result);
        value = copy.shift();
    }

    return iteration;
}

let current = seeds;

for (const maps of orderedMaps) {
    let iteration = iterateMaps(current, maps);

    current = iteration.values;
}

console.log(`Part 1: ${Math.min(...current)}`);

let p2 = Infinity;

let i = 0;
while (i < seeds.length) {
    let start = parseInt(seeds[i]);
    while (start < parseInt(seeds[i]) + parseInt(seeds[i + 1])) {
        let current = start;
        for (const maps of orderedMaps) {

            const result = {
                original: current,
                found: parseInt(current)
            }

            let found = findInMap(current, maps);

            if (found) {
                result.found = found;
            }

            result.map = maps[0].name;
            current = result.found;
        }

        start++;
        p2 = Math.min(p2, current)
    }

    i += 2;
}

console.log(`Part 2: ${p2}`);