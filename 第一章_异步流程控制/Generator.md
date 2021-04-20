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
