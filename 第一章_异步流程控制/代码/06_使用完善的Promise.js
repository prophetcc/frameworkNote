// const Promise = require('./05_完善Promise')

// const Promise = require("./05_完善Promise");

const fs = require('fs');
const path = require('path');

const p = new Promise(function (resolve, reject) {
    resolve(1000);
})

// p.then(function (value) {
//     throw new Error('错误');
// }).catch(function (err) {
//     console.log(err);
// }).finally(function () {
//     console.log(arguments);
// })

// p.then(function (value) {
//     throw new Error('错误');
// }).finally(function () {
//     console.log(arguments);
// }).then(function (value) {
//     console.log('success', value);
// }, function (reason) {
//     console.log('err', reason);
// })

function read(url, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, url), encoding, function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
}

Promise.all([read('./address.txt', 'utf8'), read('./age.txt', 'utf8'), read('./name.txt', 'utf8')])
    .then(function (data) {
        console.log(data);
    }, function (err) {
        console.log(err);
    })