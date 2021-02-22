#!/usr/bin/env node

// Usage: ./new.js

const fs = require('fs');
const path = require('path');

const now = new Date();
let monday = now;

while (monday.getDay() !== 1) {
    monday.setTime(monday.getTime() - 24*60*60);
}

let sunday = new Date(monday.getTime() + (24*60*60*6) * 1000);

const filepath = `${monday.getFullYear()}`;
const month = monday.getMonth() + 1;
const day = monday.getDate();
const filename = `${pad(month)}${pad(day)}.md`;
const dateOptions = ['en-us', { month: 'long', day: 'numeric' }]
const sundayDateOptions = sunday.getFullYear() !== monday.getFullYear() ? ['en-us', { month: 'long', day: 'numeric', year: 'numeric'}]: dateOptions;
const data = `# ${monday.toLocaleDateString(...dateOptions)} - ${sunday.toLocaleDateString(...sundayDateOptions)}\n\n[« ]()\n\n`;

fs.writeFile(path.join(filepath, filename), data, { encoding: 'utf8', mode: 0664, flag: 'wx' }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    updateIndex(filename, filepath, monday).then(() => {
        process.exit(0);
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });

});

/**
 * Updates the index file.
 * @param {string} filename created filename
 * @param {string} filepath folder
 * @param {Date} monday Monday
 */
function updateIndex(filename, filepath, monday) {
    return new Promise((resolve, reject) => {
        const readme = path.join(filepath, 'README.md');
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
        const newData = `* [${monday.toLocaleDateString('en-US', options)}](${filename})`;
        fs.readFile(readme, 'utf8', (err, data) => {
            if (err) { return reject(err) }

            const writeData = [];
            let foundStartOfList = false;
            data.split('\n').forEach((line) => {
                if (!foundStartOfList && /^\* /.test(line)) {
                    foundStartOfList = true;
                    writeData.push(newData);
                    writeData.push(line);
                    return;
                }

                writeData.push(line);
            });

            fs.writeFile(readme, writeData.join('\n'), { encoding: 'utf8' }, (err) => {
                if (err) { reject(err) }
                resolve();
            });
        });
    });
}

function pad(number) {
    if (number < 10) {
        return `0${number}`;
    }
    return `${number}`;
}
