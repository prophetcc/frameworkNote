const bluebird = {
    promisify = function (fn) {
        return function (...args) {
            return new Promise(function (resolve, reject) {
                fn(...args, function (err, res) {
                    if (err) reject(err);
                    resolve(res);
                })
            })
        }
    },
    promisifyAll = function (obj) {
        for (let key in obj) {
            obj[key + 'Async'] = this.promisify(obj[key]);
        }
    }
}