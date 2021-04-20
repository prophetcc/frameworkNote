const bluebird = require('bluebird');

const fs = require('fs');
const path = require('path');

const read = bluebird.promisify(fs.readFile);

read(__dirname + '/address.txt', 'utf8').then(function (value) {
    console.log(value);
})

bluebird.promisifyAll(fs);

fs.readFileAsync(__dirname + '/address.txt', 'utf8').then(function (value) {
    console.log(value);
})