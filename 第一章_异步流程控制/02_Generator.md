## generator 生成器

- 虽然已经被 async + await 取代
- 但是 dva + react redux-saga 是使用这个实现的
- generator 可以配合 promise 使用，也可以不配合

### 迭代器

- 生成器是用来生成迭代器的
- 什么是迭代器？

```js
let likeArray = { 0: 1, 1: 2, 2: 3, length: 3 };

const arr = [...likeArray];

console.log(arr); // TypeError: object is not iterable
```

- 上述代码会报错，因为 likeArray 里面没有迭代器

```js
let likeArray = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]() {
    let index = 0;
    let that = this;
    return {
      next() {
        return { done: index === that.length, value: that[index++] };
      },
    };
  },
};

const arr = [...likeArray]; // expecting result: [1, 2, 3]

console.log(arr);
```

- 迭代器就是有一个 next 方法的对象
- 每次调用 next 都会返回一个对象，对象里有 done 和 value 两个值
- done（boolean）如果迭代器可以产生序列中的下一个值，则为 false
- value 迭代器返回的任何 JavaScript 值，done 为 true 时可省略
- for of 必须拥有迭代器的元素才能使用
- 默认用...likeArray 会让迭代器执行

### 生成器函数

- \*表示一个生成器函数，可以配合 yeild 使用

```js
let likeArray = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: function* () {
    let index = 0;
    yield this[index++];
    yield this[index++];
  },
};

const arr = [...likeArray];

console.log(arr); // expecting result: [1, 2]
```

- 可以通过 yeild 简写上面代码

```js
let likeArray = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: function* () {
    let index = 0;
    while (index !== this.length) {
      yield this[index++];
    }
  },
};

const arr = [...likeArray];

console.log(arr);
```

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const r = gen(); // r得到一个迭代器对象
let i = r.next();
console.log(i); // expecting result: { value: 1, done: false }
i = r.next();
console.log(i); // expecting result: { value: 2, done: false }
i = r.next();
console.log(i); // expecting result: { value: 3, done: false }
```

- 下面代码执行后结果为
  undefined
  undefined
- 因为第一次 next()后，yield 1 执行完就结束了，没有把值给 a，也没有执行输出 a 的语句
- 第二次 next()后才会输出 a，a 的值因为没有赋值所以是 undifined
- 第二次 next()执行完 yield 2 就停止

```js
function* gen() {
  const a = yield 1;
  console.log(a);
  const b = yield 2;
  console.log(b);
  const c = yield 3;
  console.log(c);
}

const r = gen();
r.next();
r.next();
r.next();
```

- 上面代码的执行顺序大致如下图所示：

  ![avatar](/images/01.png)

- 下面代码的执行结果为：
  aaa
  bbb
- 当在 next 中传递参数时
- 第一次 next 传递的参数是无效的
- 第二次 next 传递的参数会返回给第一次 yeild 前面的 a

```js
function* gen() {
  const a = yield 1;
  console.log(a);
  const b = yield 2;
  console.log(b);
  const c = yield 3;
  console.log(c);
}

const r = gen();
r.next("无效"); // 这一次传递的参数是无效的
r.next("aaa");
r.next("bbb");
```
