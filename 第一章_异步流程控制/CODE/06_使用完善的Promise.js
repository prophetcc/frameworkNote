const Promise = require("./05_完善Promise");
const bluebird = require('bluebird');

const fs = require('fs');
const path = require('path');

// const p = new Promise(function (resolve, reject) {
//     // resolve(1000);
//     reject(100);
// })

// p.then(function (value) {
//     throw new Error('错误');
// }, function (reason) {
//     return 111;
// }).finally(function () {
//     console.log(111);
// }).then(function (value) {
//     console.log('val', value);
// }, function (reason) {
//     console.log(reason);
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

// function read(url, encoding) {
//     return new Promise(function (resolve, reject) {
//         fs.readFile(path.join(__dirname, url), encoding, function (err, res) {
//             if (err) reject(err);
//             resolve(res);
//         })
//     })
// }

// Promise.all = function (promises) {
//     return new Promise(function (resolve, reject) {
//         let arr = [];
//         let currentIndex = 0;
//         function processData(index, data) {
//             arr[index] = data;
//             currentIndex++;
//             if (currentIndex === promises.length) {
//                 resolve(arr);
//             }
//         }
//         for (let i = 0; i < promises.length; i++) {
//             promises[i].then(function (value) {
//                 processData(i, value);
//             }, reject)
//         }
//     })
// }

// Promise.allSettled([read('./address.txt', 'utf8'), read('./age.txt', 'utf8'), read('./name.txt', 'utf8')])
//     .then(function (data) {
//         console.log(data);
//     }, function (err) {
//         console.log(err);
//     })

// Promise.race([read('./address.txt', 'utf8'), read('./age.txt', 'utf8'), read('./name.txt', 'utf8')])
//     .then(function (data) {
//         console.log(data);
//     }, function (err) {
//         console.log(err);
//     })

// Promise.all([1, 2, 3])
//     .then(function (data) {
//         console.log(data);
//     }, function (err) {
//         console.log(err);
//     })