## 发布订阅模式

- 先订阅 再发布
- 需要把订阅的内容保存到订阅里，发布时让数组中的函数依次执行

```js
const fs = require("fs");

const school = {};

const Dep = {
  arr: [],
  on(fn) {
    this.arr.push(fn);
  },
  emit() {
    if (Object.keys(school).length === 3) {
      this.arr.forEach(function (item) {
        item();
      });
    }
  },
};

Dep.on(function () {
  console.log(school);
});

Dep.on(function () {
  console.log("读取结束了");
});

fs.readFile("./address.txt", "utf8", function (err, res) {
  school.address = res;
  Dep.emit();
});

fs.readFile("./age.txt", "utf8", function (err, res) {
  school.age = res;
  Dep.emit();
});

fs.readFile("./address.txt", "utf8", function (err, res) {
  school.name = res;
  Dep.emit();
});
```

- 上面的代码，如果直接在三个 readFile 后输出 school 只能得到一个空的对象，因为 readFile 的回调函数是异步执行的
- 会先执行 console.log(school)，再执行异步函数
- 因此可以使用订阅发布来实现
- 观察者模式是基于订阅发布的
- 订阅发布这种模式可以使用 promise 代替

## Promise

- Promise 可以解决 1.回调地狱 2.上述多个异步请求在同一时间合并结果 的问题
- Promise 的例子:

```js
let p = new Promise(function (resolve, reject) {
  console.log(111);
});

console.log(222);
// expecting result: 111 222
// 因为Promise中的executor函数是同步执行的
```

- new Promise 时要传递一个 executor 执行器（同步执行的）
- executor 中有两个参数，resolve 代表成功，reject 代表失败
- 每个 Promise 的实例上都有一个 then 方法，then 方法中有两个函数 (成功函数, 失败函数)
- Promise 中有三个状态，为 pending 态，resolved 态，rejected 态
- pending 态可以转换为 resolved 态或 rejected 态

### 原本的回调方式实现异步函数合并结果

```js
const fs = require("fs");
const school = [];
fs.readFile("./name.txt", "utf8", function (err, res) {
  school.push(res);
  fs.readFile("./address.txt", "utf8", function (err, res) {
    school.push(res);
    fs.readFile("./age.txt", "utf8", function (err, res) {
      school.push(res);
      console.log(school); // expecting result: [ '学军', '杭州', '10' ]
    });
  });
});
```

- 这种方式大量嵌套回调函数，不太优雅

### Promise 的链式调用方法

```js
const fs = require("fs");

function read(url, encoding) {
  return new Promise(function (resolve, reject) {
    fs.readFile(url, encoding, function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

read("./name.txt", "utf8")
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    console.log(value);
  })
  .catch(function (err) {
    console.log("catch", err);
  });
```

- 每次调用 then 方法后，会返回一个新的 Promise
- Promise 链式调用，解决了回调嵌套问题

### Promise 中的 catch

- 上述代码中如果中间有一环产生了错误，如下

```js
read("./name.txt", "utf8")
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    return read(value + 1, "utf8"); // 在这里制造一个错误
  })
  .then(function (value) {
    console.log(value);
  }).then().then().then(). // 值的穿透
  .catch(function (err) {
    console.log("catch", err);
  });
```

- 错误信息会一直往下传，称为值的穿透
- 错误被 catch 接收

### Promise 中 then 的返回值问题

```js
read("./name.txt", "utf8")
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    return read(value + 1, "utf8");
  })
  .then(function (value) {
    console.log(value);
  })
  .catch(function (err) {
    console.log("catch", err); // 返回的值是普通值
  })
  .then(
    function (value) {
      console.log("then", value); // expecting result: then undefined
    },
    function () {}
  );
```

- 如果 then 返回的是一个 Promise，则会把 Promise 的结果传给下一个 then 的参数
- 如果 then 返回的是一个普通值，则会把值传给下一个 then 的成功的结果
- 如果想要返回值走的是下一个 then 的失败方法，则 return Promise.reject();

```js
read("./name.txt", "utf8")
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    return read(value + 1, "utf8");
  })
  .then(function (value) {
    console.log(value);
  })
  .catch(function (err) {
    console.log("catch", err);
  })
  .then(function (value) {
    console.log("then", value);
    return Promise.reject("失败了"); // 这里返回的是Promise的失败
    // 相当于下面代码
    // return new Promise((resolve,reject) => reject('失败了'));
  })
  .then(null, function (err) {
    console.log(err); // 被下一个then的失败方法接收
  });
```

### throw

```js
read("./name.txt", "utf8")
  .then(function (value) {
    return read(value, "utf8");
  })
  .then(function (value) {
    return read(value + 1, "utf8");
  })
  .then(function (value) {
    console.log(value);
  })
  .catch(function (err) {
    console.log("catch", err);
  })
  .then(function (value) {
    console.log("then", value);
    throw new Error("错误了");
  })
  .then(null, function (err) {
    console.log("throw", err); // expecting result: throw Error: 错误了
  });
```

### Promise.all

// 多个异步并发执行，需要在同一时刻内获取最终结果

```js
Promise.all([1, 2, 3, 4]).then(function (res) {
  console.log(res); // expecting result: throw Error: [1, 2, 3, 4]
});
```

- all 方法会返回一个新的 Promise，新的 Promise 可以跟一个 then
- all 中不仅仅可以放数字，还能放 Promise，上面的 read 函数的返回值就是 Promise，可以把 read 放入

```js
Promise.all([
  read("./name.txt", "utf8"),
  read("./address.txt", "utf8"),
  read("./age.txt", "utf8"),
]).then(function (res) {
  console.log(res); // expecting result: [ '学军', '杭州', '10' ]
});
```

- all 中的所有 read 是并发执行的
- 能够保证结果的顺序和调用时一样

### 手写 Promise

```js
function Promise(executor) {
  const self = this;
  self.value = undefined;
  self.reason = undefined;
  // 设置一个状态值，互斥执行resolve和reject
  self.status = "pending";
  // 设置两个数组，分别保存成功和失败时的回调函数
  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.status === "pending") {
      self.value = value;
      self.status = "resolved";
      self.onResolvedCallbacks.forEach(function (fn) {
        fn();
      });
    }
  }

  function reject(reason) {
    if (self.status === "pending") {
      self.reason = reason;
      self.status = "rejected";
      self.onRejectedCallbacks.forEach(function (fn) {
        fn();
      });
    }
  }
  // executor是立即执行的

  try {
    executor(resolve, reject);
  } catch (err) {
    //当执行器执行发生异常时，用catch接收错误
    reject(err);
  }
}

function resolvePromise(x, promise, resolve, reject) {
  if (x === promise) {
    // 不能自己等待自己完成
    return reject(new TypeError("循环引用"));
  }
  // 如果x是个函数或者是个对象，x就有可能会是个promise
  // null也会被识别成object，所以要单独判断
  let called;
  if (x !== null && (typeof x === "function" || typeof x === "object")) {
    try {
      // 这里try可能因为用了别人的promise，别人的then是通过getter定义的，取x.then可能报错
      let then = x.then;
      // 不排除有人故意写{then: 123}的情况
      if (typeof then === "function") {
        // 这里一定要用call执行
        // 因为如果直接then()执行，then函数中的this会指向window
        // 这个逻辑可能是别人的promise，可能即调用成功也调用失败
        then.call(
          x,
          function (y) {
            if (called) {
              return;
            }
            called = true;
            // y可能还是一个promise
            // 递归到直到y不是promise为止
            resolvePromise(y, promise, resolve, reject);
          },
          function (r) {
            if (called) {
              return;
            }
            called = true;
            reject(r);
          }
        );
      } else {
        // {then: 123}
        if (called) {
          return;
        }
        called = true;
        resolve(x);
      }
    } catch (e) {
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
  onFulfilled =
    typeof onFulfilled === "function"
      ? onFulfilled
      : function (data) {
          return data;
        };

  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function (err) {
          throw err;
        };

  const that = this;
  const promise2 = new Promise(function (resolve, reject) {
    if (that.status === "resolved") {
      // then必须是异步执行的
      setTimeout(function () {
        // 可能then中函数执行发生错误
        try {
          // 我们需要把then中成功或是失败的结果获取到
          // 看一看是不是Promise，如果是Promise就让Promise执行，取到这个Promise最终的执行结果
          let x = onFulfilled(that.value);
          // console.log(x);
          resolvePromise(x, promise2, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    } else if (that.status === "rejected") {
      setTimeout(function () {
        try {
          let x = onRejected(that.reason);
          resolvePromise(x, promise2, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    } else if (that.status === "pending") {
      that.onResolvedCallbacks.push(function () {
        setTimeout(function () {
          try {
            let x = onFulfilled(that.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            let x = onRejected(that.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
  });

  return promise2;
};

// 用于检测是否符合规范
Promise.defer = Promise.deferred = function () {
  let deferred = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

module.exports = Promise;
```

### Promise 其它方法

- catch 用于接收错误
- finally 不论上面是接收还是错误，都会执行
- finally 后面还能接 then,会把上一个 then 传递来的值传给下一个 then

```js
p.then(function (value) {
  throw new Error("错误");
})
  .catch(function (err) {
    console.log(err);
  })
  .finally(function () {
    console.log("finally");
  })
  .then(
    function (value) {
      console.log(value);
    },
    function (reason) {
      console.log(reason);
    }
  );
```

- all 会按数组顺序将结果传给下一个 then
- all 全部成功才算成功
- 有任意一个失败都算失败，执行下一个 then 的错误方法

```js
Promise.all([
  read("./address.txt", "utf8"),
  read("./age.txt", "utf8"),
  read("./name.txt", "utf8"),
]).then(
  function (data) {
    console.log(data);
  },
  function (err) {
    console.log(err);
  }
);
```

## 实现 Promise 方法

### Promise.resolve

```js
Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
    resolve(value);
  });
};
```

### Promise.reject

```js
Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};
```

### Promise.prototype.catch

```js
Promise.prototype.catch = function (errFn) {
  return this.then(null, errFn);
};
```

- catch 实际上就是特殊的 then 方法

### Promise.prototype.finally

```js
Promise.prototype.finally = function (callback) {
  return this.then(
    function (value) {
      // callback可能里面还有Promise，因此要用resolve处理
      return Promise.resolve(callback()).then(function () {
        return value;
      });
    },
    function (reason) {
      return Promise.resolve(callback()).then(function () {
        throw reason;
      });
    }
  );
};
```

- finally 就是两边都执行
- callback 可能里面还有 Promise，因此要用 resolve 处理

### Promise.all

```js
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
      }, reject);
    }
  });
};
```

### Promise.race

```js
Promise.race = function (promises) {
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
```

- race 只要有一个成功就成功，只要有一个失败就失败

## bluebird

- 我们可以使用别人封装的 Promise 方法

```js
const bluebird = require("bluebird");

const fs = require("fs");
const path = require("path");

const read = bluebird.promisify(fs.readFile);

read(__dirname + "/address.txt", "utf8").then(function (value) {
  console.log(value); // expecting result: age.txt
});

bluebird.promisifyAll(fs);

fs.readFileAsync(__dirname + "/address.txt", "utf8").then(function (value) {
  console.log(value); // expecting result: age.txt
});
```

## 自己实现 bluebird

```js
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
```
