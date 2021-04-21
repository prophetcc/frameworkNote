// let likeArray = {
//     0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function* () {
//         let index = 0;
//         while (index !== this.length) {
//             yield this[index++];
//         }
//     }
// };

// const arr = [...likeArray];

// console.log(arr);

// function* gen() {
//     yield 1;
//     yield 2;
//     yield 3;
// }

// const r = gen();
// let i = r.next();
// console.log(i);
// i = r.next();
// console.log(i);
// i = r.next();
// console.log(i);


// function* fib(max) {
//     var a = 0, b = 1, n = 0;
//     while (n < max) {
//         yield a;
//         [a, b] = [b, a + b];
//         n++;
//     }
// }

// const f = fib(5);
// let i = f.next();
// console.log(i);
// i = f.next();
// console.log(i);
// i = f.next();
// console.log(i);
// i = f.next();
// console.log(i);


function* gen() {
    const a = yield 1;
    console.log(a);
    const b = yield 2;
    console.log(b);
    const c = yield 3;
    console.log(c);
}

const r = gen();
let i = r.next();
console.log(i);
i = r.next();
console.log(i);
i = r.next();
console.log(i);