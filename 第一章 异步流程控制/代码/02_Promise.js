// let p1 = new Promise(function (resolve, reject) {
//     console.log(111);
// });

// console.log(222);

// expecting result: 111 222
// 因为Promise中的executor函数是同步执行的

// let p2 = new Promise(function (resolve, reject) {
//     // resolve('有钱');
//     reject('没钱');
// });

// p2.then(function (value) {
//     console.log('success', value);
// }, function (reason) {
//     console.log('fail', reason);
// })


const fs = require('fs');
// const school = [];
// fs.readFile('./name.txt', 'utf8', function (err, res) {
//     school.push(res);
//     fs.readFile('./address.txt', 'utf8', function (err, res) {
//         school.push(res);
//         fs.readFile('./age.txt', 'utf8', function (err, res) {
//             school.push(res);
//             console.log(school);
//         })
//     })
// })

function read(url, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, encoding, function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
}

// read('./name.txt', 'utf8').then(function (value) {
//     return read(value, 'utf8');
// }).then(function (value) {
//     return read(value + 1, 'utf8');
// }).then(function (value) {
//     console.log(value);
// }).catch(function (err) {
//     console.log('catch', err);
// }).then(function (value) {
//     console.log('then', value);
//     return Promise.reject('失败了');
// }).then(null, function (err) {
//     console.log(err);
//     throw new Error('错误了');
// }).then(null, function (err) {
//     console.log('throw', err);
// })

Promise.all([read('./name.txt', 'utf8'), read('./address.txt', 'utf8'), read('./age.txt', 'utf8')]).then(function (res) {
    console.log(res);
})