#!/usr/bin/env node

// Usage: ./new.js

const fs = require('fs');
const path = require('path');

const now = new Date();
let monday = now;

while (monday.getDay() !== 1) {
    monday.setTime(monday.getTime() - 24*60*60);
}

let sunday = new Date(monday.getTime() + 24*60*60*6);

const filepath = `${monday.getFullYear()}`;
const month = monday.getMonth() + 1;
const day = monday.getDate();
const filename = `${pad(month)}${pad(day)}.md`;
const dateOptions = ['en-us', { month: 'long', day: 'numeric' }]
const data = `# ${monday.toLocaleDateString(...dateOptions)} - ${sunday.toLocaleDateString(...dateOptions)}\n\n`;

fs.writeFile(path.join(filepath, filename), data, { encoding: 'utf8', mode: 0664, flag: 'wx' }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    process.exit(0);
});

function pad(number) {
    if (number < 10) {
        return `0${number}`;
    }
    return `${number}`;
}
