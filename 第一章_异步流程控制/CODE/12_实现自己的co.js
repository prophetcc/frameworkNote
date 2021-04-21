const fs = require('fs');
const bluebird = require('bluebird');
const { resolve } = require('bluebird');

const read = bluebird.promisify(fs.readFile);

function* gen() {
    const address = yield read(__dirname + '/name.txt', 'utf8');
    const age = yield read(__dirname + address, 'utf8');
    const result = yield read(__dirname + age, 'utf8')
    // return result;
}

function co(it) {
    return new Promise((resolve, reject) => {
        function next(data) {
            const { value, done } = it.next(data)
            if (!done) {
                value.then(function (data) {
                    next(data);
                }, reject)
            } else {
                resolve(data)
            }
        }
        next();
    })
}

co(gen()).then(data => {
    console.log(data);
})