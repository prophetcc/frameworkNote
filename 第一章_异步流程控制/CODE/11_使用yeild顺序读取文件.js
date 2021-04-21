const fs = require('fs');
const bluebird = require('bluebird');

const read = bluebird.promisify(fs.readFile);

function* gen() {
    const address = yield read(__dirname + '/name.txt', 'utf8');
    const age = yield read(__dirname + address, 'utf8');
    const result = yield read(__dirname + age, 'utf8')
    return result;
}

// const it = gen();
// let { value, done } = it.next();
// value.then(function (data) {
//     let { value, done } = it.next(data);
//     value.then(function (data) {
//         let { value, done } = it.next(data);
//         value.then(function (data) {
//             console.log(data);  // expecting result: 10
//         })
//     })
// })

// co可以代替上面代码
const co = require('co');

co(gen()).then(data => {
    console.log(data);
})