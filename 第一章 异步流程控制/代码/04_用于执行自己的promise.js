const Promise1 = require('./03_手写promise');

const p = new Promise1(function (resolve, reject) {
    resolve(1000);
    // reject();
    // setTimeout(function () {
    //     // reject();
    //     resolve(1000);
    // }, 1000)
    // throw new Error('错误了')
})


// p.then(function (data) {
//     // console.log('data1', data);
//     throw new Error();
// }).then(function (data) {
//     console.log(data);
// }, function (err) {
//     console.log('err', err);
// })

// const p1 = p.then(function () {
//     return p1;
// })
// p1.then(function () { }, function (reason) {
//     console.log(reason);
// })

// p.then(function (value) {
//     return new Promise1(function (resolve, reject) {
//         resolve(new Promise1(function (resolve, reject) {
//             resolve(1000);
//         }))
//     })
// }).then(function (value) {
//     console.log(value);
// })

// p.then(function (value) {
//     return new Promise1(function (resolve, reject) {
//         reject(1000);
//     })
// }).then(function (value) {
//     console.log(value);
// }, function (err) {
//     console.log('err', err);
// })

p.then().then().then().then(function(value) {
    console.log(value);
})