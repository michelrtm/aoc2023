const fs = require('fs');
const https = require('https');

const args = process.argv.slice(2);

if (!args[1]) {
  throw new Error('Argument 1 is missing, add the day as the second arg.');
}

if (!args[0]) {
  throw new Error('Argument 0 is missing, add the AOC Cookie value as the first arg.');
}

const directory = `./day${args[1]}`;

(async () => {

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    https.get(`https://adventofcode.com/2023/day/${args[1]}/input`, 
      {
         headers: {
          cookie: `cookie: ${args[0]}`,
         },
      }, 
      res => {

        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', (chunk) => { rawData += chunk; });

        res.on('end', () => {
          try {
            fs.writeFileSync(`${directory}/data.txt`, rawData);
            if (!fs.existsSync(`${directory}/index.js`)) {
              fs.writeFileSync(`${directory}/index.js`, `const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
const cleanData = data.split("\n").filter((v) => v !== '');
`);
            }
          } catch (e) {
            console.error(e.message);
          }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
})();