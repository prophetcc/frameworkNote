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
