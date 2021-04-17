const Promise = require('./03_手写promise');

const p = new Promise(function (resolve, reject) {
    // resolve(1000);
    // reject();
    setTimeout(function () {
        // reject();
        resolve(1000);
    }, 1000)
    // throw new Error('错误了')
})


// p.then(function (data) {
//     // console.log('data1', data);
//     return data + 1000;
// }).then(function (data) {
//     console.log(data);
// })

// const p1 = p.then(function () {
//     return p1;
// })
// p1.then(function () { }, function (reason) {
//     console.log(reason);
// })
