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
    let called;
    if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
        try {   // 这里try可能因为用了别人的promise，别人的then是通过getter定义的，取x.then可能报错
            let then = x.then;
            // 不排除有人故意写{then: 123}的情况
            if (typeof then === 'function') {
                // 这里一定要用call执行
                // 因为如果直接then()执行，then函数中的this会指向window
                // 这个逻辑可能是别人的promise，可能即调用成功也调用失败
                then.call(x, function (y) {
                    if (called) {
                        return;
                    }
                    called = true;
                    // y可能还是一个promise
                    // 递归到直到y不是promise为止
                    resolvePromise(y, promise, resolve, reject);
                }, function (r) {
                    if (called) {
                        return;
                    }
                    called = true;
                    reject(r);
                })
            } else {    // {then: 123}
                if (called) {
                    return;
                }
                called = true;
                resolve(x);
            }
        }
        catch (e) {
            if (called) {
                return;
            }
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

// then返回的一定是一个新的Promise
Promise.prototype.then = function (onFulfilled, onRejected) {
    // 实现值的穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (data) {
        return data;
    }

    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
        throw err;
    }

    const that = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (that.status === 'resolved') {
            // then必须是异步执行的
            setTimeout(function () {
                // 可能then中函数执行发生错误
                try {
                    // 我们需要把then中成功或是失败的结果获取到
                    // 看一看是不是Promise，如果是Promise就让Promise执行，取到这个Promise最终的执行结果
                    let x = onFulfilled(that.value);
                    // console.log(x);
                    resolvePromise(x, promise2, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            }, 0);
        } else if (that.status === 'rejected') {
            setTimeout(function () {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(x, promise2, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }

            }, 0);
        } else if (that.status === 'pending') {
            that.onResolvedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(that.value);
                        resolvePromise(x, promise2, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            })
            that.onRejectedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onRejected(that.reason);
                        resolvePromise(x, promise2, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0)
            })
        }
    })

    return promise2;
}

Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value);
    })
}

Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    })
}

// catch就是特殊的then方法
Promise.prototype.catch = function (errFn) {
    return this.then(null, errFn);
}

// finally就是两边都执行
Promise.prototype.finally = function (callback) {
    return this.then(function (value) {
        // callback可能里面还有Promise，因此要用resolve处理
        return Promise.resolve(callback()).then(function () {
            return value;
        })
    }, function (reason) {
        return Promise.resolve(callback()).then(function () {
            throw reason;
        })
    });
}

Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        let arr = [];
        let currentIndex = 0;
        function processData(index, data) {
            arr[index] = data;
            currentIndex++;
            if (currentIndex === promises.length) {
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (value) {
                processData(i, value);
            }, reject)
        }
    })
}

Promise.race = function() {
    
}

Promise.defer = Promise.deferred = function () {
    let deferred = {}

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return deferred
}

module.exports = Promise;