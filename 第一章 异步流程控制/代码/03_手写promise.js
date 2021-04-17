function Promise(executor) {
    const self = this;
    self.value = undefined;
    self.reason = undefined;
    // 设置一个状态值，互斥执行resolve和reject
    self.status = 'pending';
    // 设置两个数组，分别保存成功和失败时的回调函数
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';
            self.onResolvedCallbacks.forEach(function (fn) {
                fn();
            })
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(function (fn) {
                fn();
            })
        }
    }
    // executor是立即执行的

    try {
        executor(resolve, reject);
    }
    catch (err) {
        //当执行器执行发生异常时，用catch接收错误
        reject(err);
    }
}

function resolvePromise(x, promise, resolve, reject) {
    if (x === promise) { // 不能自己等待自己完成
        return reject(new TypeError('循环引用'));
    }
    // 如果x是个函数或者是个对象，x就有可能会是个promise
    // null也会被识别成object，所以要单独判断
    if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
        try {
            let then = x.then;
            // 不排除有人故意写{then: 123}的情况
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    resolve(y);
                }, function (r) {
                    reject(r);
                })
            } else {    // {then: 123}
                resolve(x);
            }
        }
        catch (e) {
            reject(e);
        }
    } else {
        resolve(x);
    }
}

// then返回的一定是一个新的Promise
Promise.prototype.then = function (onFulfilled, onRejected) {
    const that = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (that.status === 'resolved') {
            // 我们需要把then中成功或是失败的结果获取到
            // 看一看是不是Promise，如果是Promise就让Promise执行，取到这个Promise最终的执行结果
            let x = onFulfilled(that.value);
            // console.log(x);
            resolvePromise(x, promise2, resolve, reject);
        } else if (that.status === 'rejected') {
            let x = onRejected(that.reason);
            resolvePromise(x, promise2, resolve, reject);
        } else if (that.status === 'pending') {
            that.onResolvedCallbacks.push(function () {
                let x = onFulfilled(that.value);
                resolvePromise(x, promise2, resolve, reject);
            })
            that.onRejectedCallbacks.push(function () {
                let x = onRejected(that.reason);
                resolvePromise(x, promise2, resolve, reject);
            })
        }
    })


    return promise2;
}

module.exports = Promise;

