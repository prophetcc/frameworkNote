## 4/22 学习了 async-await

### 实现小球顺序运动，一个小球运动结束后另一个小球开始运动

- 最基础的方法

```js
<body>
    <div id="box">
        <div class="ball ball1"></div>
        <div class="ball ball2"></div>
        <div class="ball ball3"></div>
    </div>

    <script>
        const $ = document.querySelector.bind(document);

        function move(ele, target, callback) {
            let left = 0;
            const timer = setInterval(function () {
                if (left >= target) {
                    clearInterval(timer);
                    return callback();
                }
                left++;
                ele.style.left = left + 'px';
            }, 6)
        }

        move($('.ball1'), 500, function () {
            move($('.ball2'), 500, function () {
                move($('.ball3'), 500, function () {
                    alert('hello');
                })
            })
        })
    </script>
</body>
```

- 上述代码回调嵌套过多，不利于维护

### Promise 写法

```js
const $ = document.querySelector.bind(document);

function move(ele, target) {
  return new Promise(function (resolve, reject) {
    let left = 0;
    const timer = setInterval(function () {
      if (left >= target) {
        clearInterval(timer);
        return resolve();
      }
      left++;
      ele.style.left = left + "px";
    }, 6);
  });
}

// move($('.ball1'), 500).then(() => {
//     move($('.ball2'), 500).then(() => {
//         move($('.ball3'), 500).then(() => {
//             alert('hello')
//         })
//     })
// })

move($(".ball1"), 500)
  .then(() => {
    return move($(".ball2"), 500);
  })
  .then(() => {
    return move($(".ball3"), 500);
  })
  .then(() => {
    return alert("hello");
  });
```

- 使用 Promise 的目的是为了解决回调的问题，但是还是会有回调产生

### async-await(终极异步解决方案)

- async-await 特点：
- 1.解决 callback 回调问题 减少回调次数
- 2.解决异步不能 try catch，不能捕获异常的问题
- 3.让代码执行的更像同步执行
- await 要搭配 async 来使用

```js
const $ = document.querySelector.bind(document);

function move(ele, target) {
  return new Promise(function (resolve, reject) {
    let left = 0;
    const timer = setInterval(function () {
      if (left >= target) {
        clearInterval(timer);
        return resolve();
      }
      left++;
      ele.style.left = left + "px";
    }, 6);
  });
}

async function gen() {
  await move($(".ball1"), 500);
  await move($(".ball2"), 500);
  await move($(".ball3"), 500);
}

gen();
```

- 上面为实现效果的 async 加 await 方法
- await 后面能跟任何东西，包括 Promise

```js
async function gen() {
  const a = await move($(".ball1"), 500);
  const b = await 1;
  const c = await move($(".ball3"), 500);
  return b;
}

const res = gen();
console.log(res); // expecting result: Promise {<pending>}
```

- 上面的代码中 b 不能获取到 1，因为代码是异步执行的
- 使用下面的写法就能获取到 b 的值

```js
async function gen() {
  await move($(".ball1"), 500);
  await move($(".ball2"), 500);
  const b = await 1;
  await move($(".ball3"), 500);
  return b;
}

gen().then((data) => {
  console.log(data);
});
```

- data 就是整个 gen 函数的 Promise 执行完返回的结果

```js
async function gen() {
  await move($(".ball1"), 500);
  throw 100; // 抛出错误
  await move($(".ball2"), 500);
  const b = await 1;
  await move($(".ball3"), 500);
  return b;
}

gen()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log("err", err)); // 能用catch方法接收
```

- 抛出的错误能用 catch 接收
- 并且在函数内能像同步代码一样使用 try catch，如下：

```js
async function gen() {
  try {
    await move($(".ball1"), 500);
    throw 100;
    await move($(".ball2"), 500);
    const b = await 1;
    await move($(".ball3"), 500);
    return b;
  } catch (e) {
    console.log("catch e", e);
  }
}

gen().then((data) => {
  console.log("data", data);
});
// expecting result:
// catch e 100
// data undefined
```
